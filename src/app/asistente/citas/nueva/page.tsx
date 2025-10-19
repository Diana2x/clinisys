"use client";
import { useEffect, useMemo, useState } from "react";
import { listarPacientes, Paciente } from "@/services/pacientes.service";
import { listarMedicos, Medico } from "@/services/medicos.service";
import { crearCita } from "@/services/citas.service";
import NuevoPacienteModal from "@/components/NuevoPacienteModal";
import FlashToast from "@/components/FlashToast";
import { useRouter } from "next/navigation";

export default function NuevaCitaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [showNuevoPaciente, setShowNuevoPaciente] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  // FORM
  const [form, setForm] = useState({
    pacienteId: "",
    pacienteNombre: "",
    doctorId: "",
    doctorNombre: "",
    fecha: "",
    motivo: "",
    notas: "",
    estado: "pendiente",
  });

  useEffect(() => {
    (async () => {
      const [ps, ms] = await Promise.all([listarPacientes(), listarMedicos()]);
      setPacientes(ps);
      setMedicos(ms);
    })();
  }, []);

  const canSave = useMemo(() => Boolean(form.pacienteId && form.doctorId && form.fecha), [
    form.pacienteId,
    form.doctorId,
    form.fecha,
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    await crearCita({
      pacienteId: form.pacienteId,
      pacienteNombre: form.pacienteNombre,
      doctorId: form.doctorId,
      doctorNombre: form.doctorNombre,
      fecha: new Date(form.fecha),
      motivo: form.motivo || undefined,
      notas: form.notas || undefined,
      estado: form.estado as any,
    });
    router.push("/asistente/citas");
  }

  function onPacienteCreado(p: { id: string; nombre: string }) {
    setPacientes(prev => [{ id: p.id, nombre: p.nombre } as any, ...prev]);
    setForm(f => ({ ...f, pacienteId: p.id, pacienteNombre: p.nombre }));
    setToast({ show: true, msg: `Paciente “${p.nombre}” agregado con éxito.` });
  }

  return (
    <>
      {/* CONTENEDOR TARJETA para asegurar contraste */}
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white text-gray-900 shadow-lg ring-1 ring-gray-200">
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-4">
            <h1 className="text-2xl font-semibold">Nueva cita</h1>

            {/* PACIENTE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <div className="flex gap-2">
                <select
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                  value={form.pacienteId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const p = pacientes.find(x => x.id === id);
                    setForm(f => ({ ...f, pacienteId: id, pacienteNombre: p?.nombre ?? "" }));
                  }}
                >
                  <option value="">Selecciona un paciente…</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}{(p as any).apellidos ? ` ${(p as any).apellidos}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setShowNuevoPaciente(true)}
                >
                  Nuevo
                </button>
              </div>
              {pacientes.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">No hay pacientes aún. Crea uno con el botón “Nuevo”.</p>
              )}
            </div>

            {/* DOCTOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                value={form.doctorId}
                onChange={(e) => {
                  const id = e.target.value;
                  const d = medicos.find(x => x.id === id);
                  setForm(f => ({ ...f, doctorId: id, doctorNombre: d?.nombre ?? "" }));
                }}
              >
                <option value="">Selecciona un doctor…</option>
                {medicos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}{d.especialidad ? ` — ${d.especialidad}` : ""}
                  </option>
                ))}
              </select>
              {medicos.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">No hay doctores en la base de datos.</p>
              )}
            </div>

            {/* FECHA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>

            {/* MOTIVO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                placeholder="Ej. Consulta general"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              />
            </div>

            {/* NOTAS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
              <textarea
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                placeholder="Observaciones…"
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
              />
            </div>

            {/* ESTADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="atendida">Atendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* ACCIONES */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => history.back()}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
              >
                Cancelar
              </button>
              <button
                disabled={saving || !canSave}
                className={`px-4 py-2 rounded-xl border ${
                  canSave
                    ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL NUEVO PACIENTE */}
      <NuevoPacienteModal
        open={showNuevoPaciente}
        onClose={() => setShowNuevoPaciente(false)}
        onCreated={onPacienteCreado}
      />

      {/* TOAST */}
      <FlashToast
        show={toast.show}
        message={toast.msg}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </>
  );
}
