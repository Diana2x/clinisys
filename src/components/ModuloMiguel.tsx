// src/components/ModuloMiguel.tsx
import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  History,
  Mail,
  Phone,
  Clock,
  MapPin,
  Hospital,
} from "lucide-react";

/* ---------- UI helpers ---------- */
function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={[
        "bg-white border border-slate-200 rounded-[14px]",
        "shadow-[0_10px_30px_rgba(20,60,120,.08)] overflow-hidden",
        className,
      ].join(" ")}
    >
      {title && (
        <div className="px-4 md:px-5 py-3 border-b border-slate-200 text-slate-600 font-semibold">
          {title}
        </div>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-[13px] bg-brand-50 border border-slate-200 mr-2 mt-2">
      {children}
    </span>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
      <div className="text-xl font-extrabold">{n}</div>
      <div className="text-[12px] text-slate-500">{l}</div>
    </div>
  );
}

/* ---------- Agenda helpers ---------- */
type State = "free" | "busy";

function SlotPill({ state, label }: { state: State; label: string }) {
  const base =
    "inline-flex h-9 w-full items-center justify-center rounded-lg border text-sm";
  const styles =
    state === "free"
      ? "bg-white border-slate-200 ring-1 ring-green-400/30"
      : "bg-[#fff0f0] border-[#ffd2d2] text-[#b42318]";
  return <div className={`${base} ${styles}`}>{label}</div>;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

// agenda[hora][díaIndex] = [slot1, slot2]
const agenda: Record<string, Record<number, [State, State]>> = {
  "09:00": {
    0: ["busy", "free"],
    1: ["free", "busy"],
    2: ["free", "free"],
    3: ["busy", "free"],
    4: ["free", "free"],
  },
  "10:30": {
    0: ["free", "busy"],
    1: ["busy", "free"],
    2: ["busy", "free"],
    3: ["free", "free"],
    4: ["free", "free"],
  },
  "12:00": {
    0: ["free", "free"],
    1: ["busy", "busy"],
    2: ["free", "busy"],
    3: ["free", "free"],
    4: ["free", "free"],
  },
};

/* ---------- Page component ---------- */
export default function ModuloMiguel() {
  return (
    <section className="space-y-5">
      {/* Acciones arriba */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-700 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a profesionales
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/citas/nueva"
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-semibold shadow-[0_2px_0_rgba(0,0,0,.06)]"
          >
            <PlusCircle className="h-4 w-4" />
            Crear cita
          </Link>
          <Link
            href="#historial"
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
          >
            <History className="h-4 w-4" />
            Ver historial
          </Link>
          <a
            href="mailto:Miguel.Garibay@clinsys.com"
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
          >
            <Mail className="h-4 w-4" />
            Contactar
          </a>
        </div>
      </div>

      {/* Título + subtítulo */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-700">
          Dr. Miguel Garay
        </h1>
        <p className="text-slate-500">Médico General • Cédula 123456</p>
      </div>

      {/* Grid principal */}
      <div className="grid gap-5 xl:grid-cols-[360px_1fr] items-start">
        {/* Columna izquierda: ficha */}
        <Card>
          {/* Hero */}
          <div className="flex gap-4 items-center border-b border-slate-200 -m-5 mb-5 p-5 bg-gradient-to-tr from-brand-50/60 to-white">
            <div className="w-[84px] h-[84px] rounded-full grid place-items-center text-white text-4xl font-bold bg-gradient-to-br from-sky-400 to-brand-700 ring-4 ring-brand-50">
              M
            </div>
            <div>
              <div className="text-xl font-semibold">Miguel Garay</div>
              <div className="text-slate-500 text-sm">Med. general</div>
              <div className="mt-2">
                <Chip>
                  <MapPin className="h-3.5 w-3.5 text-brand-600" />
                  Clínica A
                </Chip>
                <Chip>
                  <MapPin className="h-3.5 w-3.5 text-brand-600" />
                  Clínica B
                </Chip>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="grid gap-2">
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-brand-600 mt-0.5" />
              <div>(33) 5555 1234 ext. 204</div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-brand-600 mt-0.5" />
              <div>Miguel.Garibay@clinsys.com</div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-brand-600 mt-0.5" />
              <div>Lun–Vie 9:00–14:00 / 16:00–18:00</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat n="27" l="Citas esta semana" />
            <Stat n="8" l="Pacientes nuevos" />
            <Stat n="10:30" l="Próxima cita" />
          </div>

          {/* Servicios */}
          <div className="mt-4">
            <div className="text-slate-500 font-semibold mb-2">Servicios</div>
            <ul className="list-disc pl-5 leading-7">
              <li>Medicina General</li>
              <li>Diagnósticos</li>
              <li>Tratamiento Paliativo</li>
            </ul>
          </div>
        </Card>

        {/* Columna derecha: Agenda */}
        <Card title="Agenda semanal (demo)">
          <div className="px-1">
            {/* ÚNICO grid para encabezado y filas */}
            <div className="grid grid-cols-[100px_repeat(5,minmax(0,1fr))] gap-x-3 gap-y-3">
              {/* Header */}
              <div /> {/* hueco para la columna de horas */}
              {days.map((d) => (
                <div key={d} className="text-slate-600 font-semibold text-center">
                  {d}
                </div>
              ))}

              {/* Filas por hora */}
              {Object.keys(agenda).map((time) => (
                <React.Fragment key={time}>
                  <div className="text-slate-600 font-semibold">{time}</div>
                  {days.map((_, dayIndex) => {
                    const [s1, s2] = agenda[time][dayIndex];
                    return (
                      <div
                        key={`${time}-${dayIndex}`}
                        className="grid grid-cols-2 gap-2"
                      >
                        <SlotPill
                          state={s1}
                          label={s1 === "free" ? "Disponible" : "Reservado"}
                        />
                        <SlotPill
                          state={s2}
                          label={s2 === "free" ? "Disponible" : "Reservado"}
                        />
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Leyenda */}
            <div className="flex items-center gap-4 text-slate-500 text-xs mt-4">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block bg-white border border-slate-200 rounded-md px-2 py-1" />
                Slot
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-[4px] ring-1 ring-green-400/30 bg-white border border-slate-200" />
                Disponible
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-[4px] bg-[#fff0f0] border border-[#ffd2d2]" />
                Reservado
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* sello / branding opcional */}
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Hospital className="h-4 w-4 text-brand-600" />
        Módulo Médico — Miguel Garay
      </div>
    </section>
  );
}
