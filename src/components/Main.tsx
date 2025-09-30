import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Users, Stethoscope, Hospital, Footprints, Utensils, Brain, Mic, Sparkles, SmileIcon, Plus
} from "lucide-react";

type Profesional = {
  id: string;      // slug para la ruta
  nombre: string;  // nombre visible
  rol: string;     // especialidad
};

const profesionales: Profesional[] = [
  { id: "todos",            nombre: "Todos",                rol: "Todos los servicios" },
  { id: "miguel-garay",     nombre: "Dr. Miguel Garay",     rol: "Med. general" },
  { id: "aurora-garibai",   nombre: "Dra. Aurora Garibai",  rol: "Dentista" },
  { id: "felipe-garcia",    nombre: "Dr. Felipe García",    rol: "Nutrición" },
  { id: "isabel-macias",    nombre: "Dra. Isabel Macías",   rol: "Psicología" },
  { id: "manuel-rodriguez", nombre: "Dr. Manuel Rodríguez", rol: "Podología" },
  { id: "rocio-martin",     nombre: "Dra. Rocío Martín",    rol: "Estética" },
];

type Item = { label: string; Icon: LucideIcon };

const especialidades: Item[] = [
  { label: "Todos",                          Icon: Users },
  { label: "Fisioterapia y rehabilitación",  Icon: Stethoscope },
  { label: "Medicina general",               Icon: Hospital },
  { label: "Podología",                      Icon: Footprints },
  { label: "Nutrición",                      Icon: Utensils },
  { label: "Psicología",                     Icon: Brain },
  { label: "Logopedia",                      Icon: Mic },
  { label: "Dentista",                       Icon: SmileIcon },
  { label: "Estética",                       Icon: Sparkles },
];

export default function Main() {
  const card =
    "bg-white border border-slate-200 rounded-[14px] shadow-[0_10px_30px_rgba(20,60,120,.08)]";
  const header =
    "px-6 py-3 border-b border-slate-200 text-slate-600 font-semibold";

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-brand-700 to-brand-600 bg-clip-text text-transparent">
        Seleccione un profesional
      </h1>
      <p className="text-slate-500 mt-1 mb-10">
        Filtra por especialidad y elige a quién agendar.
      </p>

      <section className="grid gap-6 md:gap-8 xl:gap-10 2xl:gap-14 xl:grid-cols-[360px_1fr_320px]">
        {/* Especialidades */}
        <article className={card}>
          <header className={header}>Especialidades</header>

          <div className="p-5 md:p-6 space-y-2.5">
            {especialidades.map(({ label, Icon }, i) => (
              <button
                key={label}
                className={[
                  "w-full text-left px-3 py-2 rounded-lg transition text-slate-700 flex items-center gap-2",
                  i === 0
                    ? "bg-white border border-slate-200 shadow-[inset_0_0_0_1px_#e8f1fb]"
                    : "hover:bg-brand-50/60",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </article>

        {/* Profesionales */}
        <article className={card}>
          <header className={header}>Profesionales</header>

          <div className="p-5 md:p-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {profesionales.map((p) => (
              <Link
                key={p.id}
                href={p.id === "todos" ? "#" : `/medico/${p.id}`}
                className="bg-white border border-slate-200 rounded-[14px] p-5 text-center shadow-sm hover:shadow-md transition hover:-translate-y-[1px]"
              >
                {/* Avatar con doble aro y degradado */}
                <div className="relative w-20 h-20 mx-auto rounded-full grid place-items-center text-white text-3xl font-bold bg-gradient-to-br from-sky-400 to-brand-700 ring-4 ring-brand-50">
                  {p.nombre.charAt(0)}
                  <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_3px_rgba(255,255,255,.6)]" />
                </div>

                <div className="mt-3 font-semibold text-slate-800">{p.nombre}</div>
                <div className="text-sm text-slate-500">{p.rol}</div>
              </Link>
            ))}
          </div>
        </article>

        {/* Filtros */}
        <article className={card}>
          <header className={header}>Filtros de calendario</header>

          <div className="p-5 md:p-6 space-y-6">
            <section>
              <div className="text-slate-600 font-semibold mb-2">Vistas</div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-sm bg-brand-50 border border-slate-200">
                  Semanal
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-brand-50 border border-slate-200">
                  Mensual
                </span>
              </div>
            </section>

            <section>
              <div className="text-slate-600 font-semibold mb-2">Sedes</div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-sm bg-brand-50 border border-slate-200">
                  Clínica A
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-brand-50 border border-slate-200">
                  Clínica B
                </span>
              </div>
            </section>

            <Link
              href="/citas/nueva"
              className="inline-flex items-center justify-center w-full h-10 px-3 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-semibold shadow-[0_2px_0_rgba(0,0,0,.06)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear cita
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
