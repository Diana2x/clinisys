"use client";
import { useEffect, useMemo, useState } from "react";
import { actualizarCita, obtenerCita } from "@/services/citas.service";
import { listarMedicos, Medico } from "@/services/medicos.service";
import { useParams, useRouter } from "next/navigation";
import FlashToast from "@/components/FlashToast";

export default function EditarCitaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  // Toasts (éxito / error)
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const [toastErr, setToastErr] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  useEffect(() => {
    (async () => {
      try {
        // 📦 Cargar cita y lista de doctores
        const [c, ms] = await Promise.all([obtenerCita(id), listarMedicos()]);
        setMedicos(ms);

        if (!c) {
          setToastErr({ show: true, msg: "La cita no existe." });
          setTimeout(() => router.push("/asistente/citas"), 1200);
          return;
        }

        setForm({
          ...c,
          fecha: new Date(c.fecha).toISOString().slice(0, 16),
          doctorId: c.doctorId ?? "",
          doctorNombre: c.doctorNombre ?? "",
        });
      } catch (e: any) {
        setToastErr({ show: true, msg: e?.message ?? "Error al cargar la cita." });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  // Validación mínima
  const canSave = useMemo(() => {
    if (!form?.pacienteNombre || !form?.doctorId || !form?.fecha) return false;
    const d = new Date(form.fecha);
    return !Number.isNaN(d.getTime());
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) {
      setToastErr({ show: true, msg: "Completa paciente, doctor y fecha válida." });
      return;
    }

    const when = new Date(form.fecha);
    if (when.getTime() < Date.now() - 60_000) {
      setToastErr({ show: true, msg: "La fecha no puede ser en el pasado." });
      return;
    }

    try {
      setSaving(true);
      await actualizarCita(id, {
        ...form,
        fecha: new Date(form.fecha),
      });
      setToast({ show: true, msg: "Cambios guardados ✅" });
      setTimeout(() => router.push("/asistente/citas"), 900);
    } catch (e: any) {
      setToastErr({ show: true, msg: e?.message ?? "No se pudo guardar." });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) return <div className="p-6">Cargando…</div>;

  return (
    <>
      <form onSubmit={onSubmit} className="p-6 max-w-xl space-y-3">
        <h1 className="text-xl font-semibold">Editar cita</h1>

        {/* PACIENTE */}
        <label className="block text-sm text-gray-700">Paciente</label>
        <input
          className="w-full border rounded-xl px-3 py-2"
          value={form.pacienteNombre}
          onChange={(e) => setForm({ ...form, pacienteNombre: e.target.value })}
        />

        {/* DOCTOR */}
        <label className="block text-sm text-gray-700">Doctor</label>
        <select
          className="w-full border rounded-xl px-3 py-2"
          value={form.doctorId}
          onChange={(e) => {
            const id = e.target.value;
            const d = medicos.find((x) => x.id === id);
            setForm((f: any) => ({ ...f, doctorId: id, doctorNombre: d?.nombre ?? "" }));
          }}
        >
          <option value="">Selecciona un doctor…</option>
          {medicos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre} {d.especialidad ? `— ${d.especialidad}` : ""}
            </option>
          ))}
        </select>

        {/* FECHA */}
        <label className="block text-sm text-gray-700">Fecha y hora</label>
        <input
          type="datetime-local"
          className="w-full border rounded-xl px-3 py-2"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />

        {/* ESTADO */}
        <label className="block text-sm text-gray-700">Estado</label>
        <select
          className="w-full border rounded-xl px-3 py-2"
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="atendida">Atendida</option>
          <option value="cancelada">Cancelada</option>
        </select>

        {/* NOTAS */}
        <label className="block text-sm text-gray-700">Notas</label>
        <textarea
          className="w-full border rounded-xl px-3 py-2"
          value={form.notas ?? ""}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
        />

        <div className="flex gap-2 justify-end">
          <button type="button" className="px-4 py-2 border rounded-xl" onClick={() => history.back()}>
            Cancelar
          </button>
          <button
            disabled={saving || !canSave}
            className={`px-4 py-2 border rounded-xl ${
              canSave
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "opacity-60 cursor-not-allowed"
            }`}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>

      {/* TOASTS */}
      <FlashToast
        show={toast.show}
        message={toast.msg}
        onClose={() => setToast({ show: false, msg: "" })}
      />
      <FlashToast
        show={toastErr.show}
        message={toastErr.msg}
        onClose={() => setToastErr({ show: false, msg: "" })}
      />
    </>
  );
}
