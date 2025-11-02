"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Medicamento } from "../types/receta";
import { db } from "../firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";

type Paciente = {
  id: string;
  nombre: string;
  apellidos?: string;
  fechaNacimiento?: Timestamp | string | number | Date;
  dni?: string;
  edad?: number;
};

type Medico = {
  id: string;
  nombre: string;
  especialidad?: string;
  cedula?: string;
};

type Props = {
  onSubmit: (payload: {
    pacienteId: string;
    pacienteNombre?: string;
    medicoId: string;
    medicoNombre?: string;
    diagnostico?: string;
    indicaciones?: string;
    medicamentos: Medicamento[];
  }) => Promise<void> | void;
  initial?: Partial<{
    pacienteId: string;
    pacienteNombre: string;
    medicoId: string;
    medicoNombre: string;
    diagnostico: string;
    indicaciones: string;
    medicamentos: Medicamento[];
  }>;
  onVerRecetas?: () => void; // <- opcional
};

// ----- Helpers / estilos -----
const INPUT =
  "w-full rounded-lg px-3 py-2 bg-white border border-slate-300 text-slate-800 " +
  "placeholder-slate-400 shadow-sm focus:bg-white focus:border-emerald-500 " +
  "focus:ring-2 focus:ring-emerald-400 transition-all duration-200";

function nombreCompleto(p: Partial<Paciente>) {
  return [p.nombre, p.apellidos].filter(Boolean).join(" ").trim();
}

function calcEdad(fecha: Timestamp | string | number | Date | undefined): number | "" {
  if (!fecha) return "";
  let d: Date;
  if (fecha instanceof Timestamp) d = fecha.toDate();
  else if (fecha instanceof Date) d = fecha;
  else if (typeof fecha === "number") d = new Date(fecha);
  else d = new Date(fecha);
  if (isNaN(d.getTime())) return "";
  const hoy = new Date();
  let edad = hoy.getFullYear() - d.getFullYear();
  const m = hoy.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < d.getDate())) edad--;
  return edad;
}

export default function RecetaForm({ onSubmit, initial, onVerRecetas }: Props) {
  // --- Estado principal ---
  const [pacienteId, setPacienteId] = useState(initial?.pacienteId ?? "");
  const [pacienteNombre, setPacienteNombre] = useState(initial?.pacienteNombre ?? "");
  const [pacienteEdad, setPacienteEdad] = useState<number | string>("");

  const [medicoId, setMedicoId] = useState(initial?.medicoId ?? "");
  const [medicoNombre, setMedicoNombre] = useState(initial?.medicoNombre ?? "");
  const [medicoEsp, setMedicoEsp] = useState<string>("");

  const [diagnostico, setDiagnostico] = useState(initial?.diagnostico ?? "");
  const [indicaciones, setIndicaciones] = useState(initial?.indicaciones ?? "");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(
    initial?.medicamentos ?? [{ nombre: "", dosis: "", frecuencia: "", duracion: "" }]
  );
  const [loading, setLoading] = useState(false);

  // --- Catálogos Firestore ---
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  // Labels visibles en el input (autocomplete)
  const [pacienteLabel, setPacienteLabel] = useState(initial?.pacienteNombre ?? "");
  const [medicoLabel, setMedicoLabel] = useState(initial?.medicoNombre ?? "");

  // Fecha “hoy”
  const hoyStr = useMemo(() => new Date().toLocaleDateString(), []);

  // Cargar catálogos
  useEffect(() => {
    (async () => {
      try {
        const ps = await getDocs(collection(db, "pacientes"));
        setPacientes(
          ps.docs.map((d) => {
            const x = d.data() as any;
            return {
              id: d.id,
              nombre: x.nombre ?? "",
              apellidos:
                x.apellidos ?? [x.apellidoPaterno, x.apellidoMaterno].filter(Boolean).join(" "),
              fechaNacimiento: x.fechaNacimiento ?? x.fechaNac ?? x.fnac,
              dni: x.dni,
              edad: x.edad,
            } as Paciente;
          })
        );
      } catch {}
      try {
        const ms = await getDocs(collection(db, "medicos"));
        setMedicos(
          ms.docs.map((d) => {
            const x = d.data() as any;
            return {
              id: d.id,
              nombre: x.nombre ?? "",
              especialidad: x.especialidad ?? "",
              cedula: x.cedula ?? x.cedulaProfesional ?? "",
            } as Medico;
          })
        );
      } catch {}
    })();
  }, []);

  // Opciones para datalist (lo que se muestra)
  const displayPacientes = useMemo(
    () =>
      pacientes.map((p) => ({
        id: p.id,
        label: nombreCompleto(p), // solo nombre y apellidos
        raw: p,
      })),
    [pacientes]
  );

  const displayMedicos = useMemo(
    () =>
      medicos.map((m) => ({
        id: m.id,
        label: m.nombre, // solo nombre
        raw: m,
      })),
    [medicos]
  );

  // Selección de paciente → set id/nombre completo/edad
  useEffect(() => {
    if (!pacienteLabel && !pacienteId) return;
    const match =
      displayPacientes.find((x) => x.label === pacienteLabel) ||
      displayPacientes.find((x) => x.raw.id === pacienteId) ||
      displayPacientes.find(
        (x) => nombreCompleto(x.raw).toLowerCase() === pacienteLabel.toLowerCase()
      );
    if (match) {
      const p = match.raw;
      setPacienteId(p.id);
      setPacienteNombre(nombreCompleto(p));
      const edad = p.edad ?? calcEdad(p.fechaNacimiento);
      if (edad !== "") setPacienteEdad(edad);
    }
  }, [pacienteLabel, pacienteId, displayPacientes]);

  // Selección de médico → set id/nombre/especialidad
  useEffect(() => {
    if (!medicoLabel && !medicoId) return;
    const match =
      displayMedicos.find((x) => x.label === medicoLabel) ||
      displayMedicos.find((x) => x.raw.id === medicoId) ||
      displayMedicos.find((x) => x.raw.nombre.toLowerCase() === medicoLabel.toLowerCase());
    if (match) {
      const m = match.raw;
      setMedicoId(m.id);
      setMedicoNombre(m.nombre);
      setMedicoEsp(m.especialidad || "");
    }
  }, [medicoLabel, medicoId, displayMedicos]);

  // Helpers medicamentos
  const addMed = () =>
    setMedicamentos((arr) => [...arr, { nombre: "", dosis: "", frecuencia: "", duracion: "" }]);
  const removeMed = (i: number) =>
    setMedicamentos((arr) => arr.filter((_, idx) => idx !== i));
  const updateMed = (i: number, key: keyof Medicamento, val: string) =>
    setMedicamentos((arr) => arr.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));

  const medsLimpios = useMemo(
    () => medicamentos.filter((m) => (m.nombre + m.dosis + m.frecuencia + m.duracion).trim().length > 0),
    [medicamentos]
  );

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (medsLimpios.length === 0) {
      alert("⚠️ Agrega al menos un medicamento");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        pacienteId,
        pacienteNombre,
        medicoId,
        medicoNombre,
        diagnostico,
        indicaciones,
        medicamentos: medsLimpios,
      });

      // reset
      setPacienteId("");
      setPacienteNombre("");
      setMedicoId("");
      setMedicoNombre("");
      setDiagnostico("");
      setIndicaciones("");
      setMedicamentos([{ nombre: "", dosis: "", frecuencia: "", duracion: "" }]);
      setPacienteEdad("");
      setMedicoEsp("");
      setPacienteLabel("");
      setMedicoLabel("");

      alert("✅ Receta guardada correctamente");
    } catch (err) {
      console.error("Error al guardar receta:", err);
      alert("❌ Hubo un problema al guardar la receta.");
    } finally {
      setLoading(false);
    }
  };

  // Ver recetas (lista intermedia)
  const handleVerRecetas = () => {
    if (onVerRecetas) {
      onVerRecetas();
    } else {
      // fallback si el padre no pasa la prop
      const url = `/doctor/recetas?medicoId=${encodeURIComponent(
        medicoId || ""
      )}&pacienteId=${encodeURIComponent(pacienteId || "")}`;
      window.location.assign(url);
    }
  };

  // ----- UI estilo “receta” -----
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
    >
      {/* Header azul */}
      <header className="px-8 py-6 bg-[#0d6efd] text-white flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {medicoNombre || "Nombre del Médico"}
          </h1>
          <p className="text-sm opacity-90">{medicoEsp || "Especialidad"}</p>
        </div>
        <div className="text-right text-sm">
          <p>Fecha: <span className="font-semibold">{hoyStr}</span></p>
        </div>
      </header>

      <div className="h-[2px] bg-[#0d6efd]" />

      <section className="px-8 py-6 space-y-6">
        {/* Paciente / Edad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[90px]">Paciente:</label>
            <div className="flex-1">
              <input
                list="lista-pacientes"
                className={INPUT}
                placeholder="Buscar por nombre…"
                value={pacienteLabel}
                onChange={(e) => setPacienteLabel(e.target.value)}
              />
              <datalist id="lista-pacientes">
                {displayPacientes.map((p) => (
                  <option key={p.id} value={p.label} />
                ))}
              </datalist>
            </div>
          </div>

        <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[70px]">Edad:</label>
            <input
              className={`${INPUT} max-w-[160px]`}
              placeholder="Edad"
              value={pacienteEdad}
              onChange={(e) => setPacienteEdad(e.target.value)}
              readOnly={pacienteEdad !== ""} // bloquea si viene calculada
            />
          </div>
        </div>

        {/* Diagnóstico / Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[105px]">Diagnóstico:</label>
            <input
              className={INPUT}
              placeholder="Ej. Gripe, Faringoamigdalitis..."
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[70px]">Fecha:</label>
            <input className={`${INPUT} max-w-[200px]`} value={hoyStr} readOnly />
          </div>
        </div>

        {/* Médico / Especialidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[90px]">Médico:</label>
            <div className="flex-1">
              <input
                list="lista-medicos"
                className={INPUT}
                placeholder="Buscar por nombre…"
                value={medicoLabel}
                onChange={(e) => setMedicoLabel(e.target.value)}
                required
              />
              <datalist id="lista-medicos">
                {displayMedicos.map((m) => (
                  <option key={m.id} value={m.label} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-slate-700 min-w-[110px]">Especialidad:</label>
            <input
              className={INPUT}
              value={medicoEsp}
              onChange={(e) => setMedicoEsp(e.target.value)}
            />
          </div>
        </div>

        {/* Rx */}
        <div className="pt-2">
          <div className="text-[#0d6efd] font-bold text-2xl mb-3">Rx</div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 space-y-3">
            <div className="hidden md:grid md:grid-cols-12 text-sm text-slate-500 px-1">
              <span className="col-span-4">Nombre</span>
              <span className="col-span-2">Dosis</span>
              <span className="col-span-3">Frecuencia</span>
              <span className="col-span-2">Duración</span>
              <span className="col-span-1 text-center">—</span>
            </div>

            {medicamentos.map((m, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                <input
                  placeholder="Paracetamol"
                  className={`${INPUT} md:col-span-4`}
                  value={m.nombre}
                  onChange={(e) => updateMed(i, "nombre", e.target.value)}
                  required
                />
                <input
                  placeholder="500 mg"
                  className={`${INPUT} md:col-span-2`}
                  value={m.dosis}
                  onChange={(e) => updateMed(i, "dosis", e.target.value)}
                  required
                />
                <input
                  placeholder="cada 8 horas"
                  className={`${INPUT} md:col-span-3`}
                  value={m.frecuencia}
                  onChange={(e) => updateMed(i, "frecuencia", e.target.value)}
                  required
                />
                <div className="flex gap-2 md:col-span-3">
                  <input
                    placeholder="5 días"
                    className={`${INPUT} flex-1`}
                    value={m.duracion}
                    onChange={(e) => updateMed(i, "duracion", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label="Eliminar medicamento"
                    onClick={() => removeMed(i)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    –
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMed}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              + Añadir medicamento
            </button>
          </div>
        </div>

        {/* CTA: Guardar + Ver recetas */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <span>💾</span> {loading ? "Guardando..." : "Guardar receta"}
          </button>

          <button
            type="button"
            onClick={handleVerRecetas}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <span>📄</span> Ver recetas
          </button>
        </div>

        {/* Indicaciones */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Indicaciones</label>
          <textarea
            className={INPUT}
            rows={3}
            placeholder="Tomar con agua, reposo, etc."
            value={indicaciones}
            onChange={(e) => setIndicaciones(e.target.value)}
          />
        </div>
      </section>

      {/* Footer (opcional) */}
      <footer className="px-8 py-5 bg-[#0d6efd] text-white grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <p>(55) 1234-5678</p>
        <p>Direccion Guadalajara Jalisco 123, Ciudad Guadalajara</p>
        <p className="truncate">clinsys.com.mx · medicos@clinsys.com</p>
      </footer>
    </form>
  );
}
