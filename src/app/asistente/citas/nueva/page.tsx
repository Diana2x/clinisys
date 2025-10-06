"use client";

import React, { useEffect, useMemo, useState } from "react";
import RoleGuard from "../../../../components/RoleGuard";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { useSearchParams } from "next/navigation";

type Doctor = { id: string; nombre: string; especialidad: string; sedes?: string[] | string };

export default function NuevaCitaPage() {
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; msg: string }>({
    type: "",
    msg: "",
  });

  const searchParams = useSearchParams();
  const pre = searchParams.get("doctorId") || "";

  const initialForm = (doctorId = pre) => ({
    doctorId,
    sede: "",
    pacienteNombre: "",
    pacienteTelefono: "",
    pacienteEmail: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  const [form, setForm] = useState(initialForm());

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "medicos"));
      const docs: Doctor[] = snap.docs.map((d) => {
        const data: any = d.data();
        const sedes =
          Array.isArray(data.sedes)
            ? data.sedes
            : typeof data.sedes === "string"
            ? data.sedes.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
        return { id: d.id, nombre: data.nombre || "Sin nombre", especialidad: data.especialidad || "General", sedes };
      });
      setMedicos(docs);
    })();
  }, []);

  const medico = useMemo(() => medicos.find((m) => m.id === form.doctorId), [medicos, form.doctorId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // validación mínima
    if (!form.doctorId || !form.pacienteNombre || !form.fecha || !form.hora) {
      setStatus({ type: "error", msg: "Faltan campos obligatorios (médico, paciente, fecha y hora)." });
      return;
    }

    setSaving(true);
    setStatus({ type: "", msg: "" });
    try {
      const fechaISO = new Date(`${form.fecha}T${form.hora}:00`);
      await addDoc(collection(db, "citas"), {
        doctorId: form.doctorId,
        doctorNombre: medico?.nombre ?? null,
        sede: form.sede || null,
        pacienteNombre: form.pacienteNombre,
        pacienteTelefono: form.pacienteTelefono || null,
        pacienteEmail: form.pacienteEmail || null,
        motivo: form.motivo || null,
        fecha: fechaISO,               // Firestore lo guarda como Timestamp
        estado: "pendiente",
        createdAt: serverTimestamp(),
      });

      // baner
      setStatus({ type: "success", msg: "Cita creada" });

      setForm((f) => initialForm(f.doctorId));

      // auto-ocultar el mensaje a los 3s
      setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "No se pudo crear la cita. Intenta de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleGuard role="asistente">
      <main className="p-6 space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold">Crear cita</h1>

        {/* Banner de estado */}
        {status.type && (
          <div
            role="alert"
            className={[
              "rounded-lg border px-4 py-3 text-sm",
              status.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-rose-300 bg-rose-50 text-rose-800",
            ].join(" ")}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span>Médico*</span>
            <select
              className="border rounded p-2 w-full"
              value={form.doctorId}
              onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value, sede: "" }))}
              disabled={saving}
            >
              <option value="">Selecciona…</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} — {m.especialidad}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span>Sede</span>
            <select
              className="border rounded p-2 w-full"
              value={form.sede}
              onChange={(e) => setForm((f) => ({ ...f, sede: e.target.value }))}
              disabled={!medico || saving}
            >
              <option value="">{medico ? "Selecciona…" : "-- Selecciona un médico primero --"}</option>
              {(medico?.sedes as string[] | undefined)?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span>Paciente*</span>
            <input
              className="border rounded p-2 w-full"
              value={form.pacienteNombre}
              onChange={(e) => setForm((f) => ({ ...f, pacienteNombre: e.target.value }))}
              disabled={saving}
            />
          </label>

          <label className="space-y-1">
            <span>Teléfono</span>
            <input
              className="border rounded p-2 w-full"
              value={form.pacienteTelefono}
              onChange={(e) => setForm((f) => ({ ...f, pacienteTelefono: e.target.value }))}
              disabled={saving}
            />
          </label>

          <label className="space-y-1">
            <span>Email</span>
            <input
              className="border rounded p-2 w-full"
              value={form.pacienteEmail}
              onChange={(e) => setForm((f) => ({ ...f, pacienteEmail: e.target.value }))}
              disabled={saving}
            />
          </label>

          <label className="space-y-1">
            <span>Fecha*</span>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={form.fecha}
              onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
              disabled={saving}
            />
          </label>

          <label className="space-y-1">
            <span>Hora*</span>
            <input
              type="time"
              className="border rounded p-2 w-full"
              value={form.hora}
              onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
              disabled={saving}
            />
          </label>

          <label className="md:col-span-2 space-y-1">
            <span>Motivo</span>
            <textarea
              rows={3}
              className="border rounded p-2 w-full"
              value={form.motivo}
              onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
              disabled={saving}
            />
          </label>

          <div className="md:col-span-2">
            <button
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Crear cita"}
            </button>
          </div>
        </form>
      </main>
    </RoleGuard>
  );
}
