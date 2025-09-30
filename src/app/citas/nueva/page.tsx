// src/app/citas/nueva/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Eraser, Printer, CalendarDays,
  Phone, Mail, MapPin
} from "lucide-react";

type Profesional = {
  id: string;
  nombre: string;
  esp: "fisioterapia" | "medicina" | "podologia" | "nutricion" | "psicologia" | "dentista" | "estetica";
};

const PROFESIONALES: Profesional[] = [
  { id: "miguel-garay",      nombre: "Dr. Miguel Garay",      esp: "medicina"   },
  { id: "aurora-garibai",    nombre: "Dra. Aurora Garibai",   esp: "dentista"   },
  { id: "felipe-garcia",     nombre: "Dr. Felipe García",     esp: "nutricion"  },
  { id: "isabel-macias",     nombre: "Dra. Isabel Macías",    esp: "psicologia" },
  { id: "manuel-rodriguez",  nombre: "Dr. Manuel Rodríguez",  esp: "podologia"  },
  { id: "rocio-martin",      nombre: "Dra. Rocío Martín",     esp: "estetica"   },
];

type Cita = {
  id: number;
  recepcionista: string;
  paciente: string;
  telefono: string;
  email?: string;
  sede: string;
  especialidad: string;
  especialidadTxt: string;
  pro: string;
  proNombre: string;
  fecha: string;
  hora: string;
  notas?: string;
};

const especialidades = [
  ["fisioterapia", "Fisioterapia y rehabilitación"],
  ["medicina",     "Medicina general"],
  ["podologia",    "Podología"],
  ["nutricion",    "Nutrición"],
  ["psicologia",   "Psicología"],
  ["dentista",     "Dentista"],
  ["estetica",     "Estética"],
] as const;

function Card({
  title,
  children,
  className = "",
}: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <article
      className={[
        "bg-white border border-slate-200 rounded-[14px]",
        "shadow-[0_10px_30px_rgba(20,60,120,.08)] overflow-hidden",
        className,
      ].join(" ")}
    >
      {title && (
        <div className="px-5 py-3 border-b border-slate-200 text-slate-600 font-semibold">
          {title}
        </div>
      )}
      <div className="p-5">{children}</div>
    </article>
  );
}

export default function NuevaCitaPage() {
  // form state
  const [paciente, setPaciente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [sede, setSede] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [profesional, setProfesional] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");

  const [alerta, setAlerta] = useState<{ ok: boolean; text: string } | null>(null);

  // horas 09:00–18:00
  const horas = useMemo(() => {
    const out: string[] = [];
    for (let h = 9; h <= 18; h++) {
      for (const m of [0, 30]) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        out.push(`${hh}:${mm}`);
      }
    }
    return out;
  }, []);

  // filtrado profesionales
  const prosFiltrados = useMemo(
    () => PROFESIONALES.filter(p => !especialidad || p.esp === especialidad),
    [especialidad]
  );

  // min fecha = hoy local
  const todayISO = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0);
    const tz = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tz * 60000);
    return local.toISOString().slice(0,10);
  }, []);

  // preselección por ?medico=slug
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pre = params.get("medico");
    if (pre) {
      const pro = PROFESIONALES.find(p => p.id === pre);
      if (pro) {
        setEspecialidad(pro.esp);
        setProfesional(pro.id);
      }
    }
  }, []);

  // storage helpers
  const getCitas = (): Cita[] => {
    try { return JSON.parse(localStorage.getItem("citas") || "[]"); }
    catch { return []; }
  };
  const setCitas = (arr: Cita[]) => localStorage.setItem("citas", JSON.stringify(arr));
  const nextId = () => {
    const n = Number(localStorage.getItem("citas_seq") || "1000") + 1;
    localStorage.setItem("citas_seq", String(n));
    return n;
  };

  // lista en UI
  const [citas, setCitasState] = useState<Cita[]>([]);
  useEffect(() => { setCitasState(getCitas()); }, []);

  const espTexto = (val: string) =>
    especialidades.find(([v]) => v === val)?.[1] || val;
  const proNombre = (id: string) =>
    PROFESIONALES.find(p => p.id === id)?.nombre || id;

  const conflicto = (doctorId: string, f: string, h: string) =>
    getCitas().some(c => c.pro === doctorId && c.fecha === f && c.hora === h);

  const limpiar = () => {
    setPaciente(""); setTelefono(""); setEmail("");
    setSede(""); setEspecialidad(""); setProfesional("");
    setFecha(""); setHora(""); setNotas("");
    setAlerta(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !telefono || !sede || !especialidad || !profesional || !fecha || !hora) {
      setAlerta({ ok:false, text:"Revisa los campos requeridos." });
      return;
    }
    if (conflicto(profesional, fecha, hora)) {
      setAlerta({ ok:false, text:"Conflicto: ese horario ya está reservado con ese profesional." });
      return;
    }
    const nueva: Cita = {
      id: nextId(),
      recepcionista: "Damaris López",
      paciente, telefono, email,
      sede,
      especialidad,
      especialidadTxt: espTexto(especialidad),
      pro: profesional,
      proNombre: proNombre(profesional),
      fecha, hora, notas,
    };
    const all = getCitas().concat(nueva);
    setCitas(all);
    setCitasState(all);
    setAlerta({ ok:true, text:`Cita #${nueva.id} creada para ${nueva.paciente} con ${nueva.proNombre} el ${nueva.fecha} ${nueva.hora}.` });
    limpiar();
  };

  return (
    <section className="space-y-5">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-700 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-700">
          Crear cita
        </h1>
        <p className="text-slate-500">Captura de cita nueva para pacientes (recepción)</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr] items-start">
        {/* Formulario */}
        <Card title="Datos y programación">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm">Paciente*</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={paciente} onChange={e=>setPaciente(e.target.value)}
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Teléfono*</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={telefono} onChange={e=>setTelefono(e.target.value)}
                  placeholder="Ej. 3312345678"
                />
                <div className="text-xs text-slate-500 mt-1">
                  Acepta dígitos, +, (), espacios y guiones
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm">Email</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="opcional@correo.com"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Sede*</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={sede} onChange={e=>setSede(e.target.value)}
                >
                  <option value="">Selecciona sede</option>
                  <option>Clínica A</option>
                  <option>Clínica B</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm">Especialidad*</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={especialidad}
                  onChange={e=>{ setEspecialidad(e.target.value); setProfesional(""); }}
                >
                  <option value="">Selecciona especialidad</option>
                  {especialidades.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-sm">Profesional*</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={profesional} onChange={e=>setProfesional(e.target.value)}
                >
                  <option value="">Selecciona profesional</option>
                  {prosFiltrados.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm">Fecha*</label>
                <input
                  type="date"
                  min={todayISO}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={fecha} onChange={e=>setFecha(e.target.value)}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Hora*</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={hora} onChange={e=>setHora(e.target.value)}
                >
                  <option value="">Selecciona hora</option>
                  {horas.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm">Notas</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                rows={3} value={notas} onChange={e=>setNotas(e.target.value)}
                placeholder="Motivo de consulta, observaciones, etc. (opcional)"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" /> Crear cita
              </button>
              <button
                type="button"
                onClick={limpiar}
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
              >
                <Eraser className="h-4 w-4" /> Limpiar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
              >
                <Printer className="h-4 w-4" /> Imprimir comprobante
              </button>
            </div>

            {alerta && (
              <div
                className={[
                  "mt-3 rounded-xl px-3 py-2 font-semibold border",
                  alerta.ok
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200",
                ].join(" ")}
              >
                {alerta.text}
              </div>
            )}
          </form>
        </Card>

        {/* Resumen + próximas citas */}
        <div className="grid gap-5">
          <Card title="Resumen">
            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              <div className="text-slate-500">Recepción:</div><div>Damaris López</div>
              <div className="text-slate-500">Paciente:</div><div>{paciente || "-"}</div>
              <div className="text-slate-500">Profesional:</div><div>{profesional ? proNombre(profesional) : "-"}</div>
              <div className="text-slate-500">Especialidad:</div><div>{especialidad ? espTexto(especialidad) : "-"}</div>
              <div className="text-slate-500">Fecha:</div><div>{fecha || "-"}</div>
              <div className="text-slate-500">Hora:</div><div>{hora || "-"}</div>
              <div className="text-slate-500">Sede:</div><div>{sede || "-"}</div>
              <div className="text-slate-500">Notas:</div><div>{notas || "-"}</div>
            </div>
          </Card>

          <Card title="Próximas citas (demo - local)">
            <div className="grid gap-3">
              {citas.length === 0 && (
                <div className="text-slate-500 text-sm">
                  Sin citas registradas (demo)
                </div>
              )}
              {citas.slice().reverse().map((c) => (
                <div key={c.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">
                      {c.paciente}{" "}
                      <span className="ml-2 inline-block rounded-full border border-slate-200 bg-brand-50 px-2 py-0.5 text-xs">
                        {c.especialidadTxt}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">#{c.id}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{c.proNombre}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.sede}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{c.fecha} {c.hora}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{c.telefono}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
