"use client";
import { useState } from "react";
import { crearPaciente } from "@/services/pacientes.service";

export default function NuevoPacienteModal({
  open, onClose, onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (p: { id: string; nombre: string }) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apellidos: "", dni: "", email: "", telefono: "",
    direccion: "", sexo: "", tipoSangre: "", padecimientos: "",
    numeroAfiliado: "", obraSocial: "", fechaNacimiento: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) { alert("El nombre es obligatorio."); return; }
    setSaving(true);
    const id = await crearPaciente({
      nombre: form.nombre.trim(),
      apellidos: form.apellidos || undefined,
      dni: form.dni || undefined,
      email: form.email || undefined,
      telefono: form.telefono || undefined,
      direccion: form.direccion || undefined,
      sexo: form.sexo || undefined,
      tipoSangre: form.tipoSangre || undefined,
      padecimientos: form.padecimientos || undefined,
      numeroAfiliado: form.numeroAfiliado || undefined,
      obraSocial: form.obraSocial || undefined,
      fechaNacimiento: form.fechaNacimiento ? new Date(form.fechaNacimiento) : undefined,
    });
    setSaving(false);
    onCreated({ id, nombre: form.nombre.trim() });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-3">Nuevo paciente</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Nombre *"
            value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Apellidos"
            value={form.apellidos} onChange={e=>setForm({...form, apellidos: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="DNI"
            value={form.dni} onChange={e=>setForm({...form, dni: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Email"
            value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Teléfono"
            value={form.telefono} onChange={e=>setForm({...form, telefono: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Dirección"
            value={form.direccion} onChange={e=>setForm({...form, direccion: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Sexo"
            value={form.sexo} onChange={e=>setForm({...form, sexo: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Tipo de sangre"
            value={form.tipoSangre} onChange={e=>setForm({...form, tipoSangre: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2 md:col-span-2" placeholder="Padecimientos"
            value={form.padecimientos} onChange={e=>setForm({...form, padecimientos: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Núm. afiliado"
            value={form.numeroAfiliado} onChange={e=>setForm({...form, numeroAfiliado: e.target.value})}/>
          <input className="border rounded-xl px-3 py-2" placeholder="Obra social"
            value={form.obraSocial} onChange={e=>setForm({...form, obraSocial: e.target.value})}/>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Fecha de nacimiento</label>
            <input type="date" className="border rounded-xl px-3 py-2"
              value={form.fechaNacimiento}
              onChange={e=>setForm({...form, fechaNacimiento: e.target.value})}/>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="px-4 py-2 border rounded-xl" onClick={onClose}>Cancelar</button>
            <button disabled={saving} className="px-4 py-2 border rounded-xl">
              {saving ? "Guardando…" : "Guardar paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
