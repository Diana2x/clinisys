"use client";

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
import { Doctor } from "./DoctorCard";

/** Card, Chip, Stat, SlotPill helpers */
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
        "bg-white border border-slate-200 rounded-[14px] shadow-[0_10px_30px_rgba(20,60,120,.08)] overflow-hidden",
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

/* SlotPill helper */
type State = "free" | "busy";
function SlotPill({ state, label }: { state: State; label: string }) {
  const base =
    "inline-flex h-9 w-full items-center justify-center rounded-lg border text-sm truncate text-[10px]";
  const styles =
    state === "free"
      ? "bg-white border-slate-200 ring-1 ring-green-400/30"
      : "bg-[#fff0f0] border-[#ffd2d2] text-[#b42318]";
  return <div className={`${base} ${styles}`}>{label}</div>;
}

/* Days y demo agenda */
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

const demoAgenda = {
  "09:00": {
    0: ["busy", "free"] as const,
    1: ["free", "busy"] as const,
    2: ["free", "free"] as const,
    3: ["busy", "free"] as const,
    4: ["free", "free"] as const,
  },
  "10:30": {
    0: ["free", "busy"] as const,
    1: ["busy", "free"] as const,
    2: ["busy", "free"] as const,
    3: ["free", "free"] as const,
    4: ["free", "free"] as const,
  },
  "12:00": {
    0: ["free", "free"] as const,
    1: ["busy", "busy"] as const,
    2: ["free", "busy"] as const,
    3: ["free", "free"] as const,
    4: ["free", "free"] as const,
  },
};

/* Componente principal */
export default function MedicalModule({
  doctor,
  role,
}: {
  doctor: Doctor;
  role: "paciente" | "asistente" | "doctor";
}) {
  const initials =
    doctor.initials ||
    doctor.nombre
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const sedesArray: string[] = Array.isArray(doctor.sedes)
    ? doctor.sedes
    : typeof doctor.sedes === "string"
    ? doctor.sedes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <section className="space-y-5 px-4 md:px-8 lg:px-16 mt-8">
      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/${role}/citas`}
          className="inline-flex items-center gap-2 text-brand-700 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a médicos
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${role}/medicos/${doctor.id}#citas-nueva`}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-semibold"
          >
            <PlusCircle className="h-4 w-4" /> Crear cita
          </Link>
          <Link
            href={`#historial`}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
          >
            <History className="h-4 w-4" /> Ver historial
          </Link>
          <a
            href={`mailto:${doctor.email}`}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
          >
            <Mail className="h-4 w-4" /> Contactar
          </a>
        </div>
      </div>

      {/* Título */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-700">
          {doctor.nombre}
        </h1>
        <p className="text-slate-500">
          {doctor.especialidad} • {doctor.cedula || ""}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr] items-start">
        <Card>
          <div className="flex gap-4 items-center border-b border-slate-200 -m-5 mb-5 p-5 bg-gradient-to-tr from-brand-50/60 to-white">
            <div className="w-[84px] h-[84px] rounded-full grid place-items-center text-white text-4xl font-bold bg-gradient-to-br from-sky-400 to-brand-700 ring-4 ring-brand-50">
              {initials}
            </div>
            <div>
              <div className="text-xl font-semibold">{doctor.nombre}</div>
              <div className="text-slate-500 text-sm">{doctor.especialidad}</div>
              <div className="mt-2">
                {sedesArray.map((s) => (
                  <Chip key={s}>
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {doctor.telefono && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-brand-600 mt-0.5" />
                {doctor.telefono}
              </div>
            )}
            {doctor.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-brand-600 mt-0.5" />
                {doctor.email}
              </div>
            )}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-brand-600 mt-0.5" />
              Horarios disponibles (ver agenda)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat
              n={String(doctor.stats?.citasSemana ?? "-")}
              l="Citas esta semana"
            />
            <Stat
              n={String(doctor.stats?.pacientesNuevos ?? "-")}
              l="Pacientes nuevos"
            />
            <Stat
              n={
                doctor.stats?.proximaCita
                  ? new Date(doctor.stats.proximaCita).toLocaleString()
                  : "-"
              }
              l="Próxima cita"
            />
          </div>

          <div className="mt-4">
            <div className="text-slate-500 font-semibold mb-2">Servicios</div>
            <ul className="list-disc pl-5 leading-7">
              {doctor.services && doctor.services.length > 0
                ? doctor.services.map((s) => <li key={s}>{s}</li>)
                : <li>Información no disponible</li>}
            </ul>
          </div>
        </Card>

        <Card title="Agenda semanal (demo)">
          <div className="px-1 overflow-x-auto">
            <div className="grid grid-cols-[100px_repeat(5,minmax(0,1fr))] gap-x-2 gap-y-2">
              <div />
              {days.map((d) => (
                <div
                  key={d}
                  className="text-slate-600 font-semibold text-center text-xs truncate"
                >
                  {d}
                </div>
              ))}

              {(Object.keys(demoAgenda) as Array<keyof typeof demoAgenda>).map(
                (time) => (
                  <React.Fragment key={time}>
                    <div className="text-slate-600 font-semibold text-xs truncate">
                      {time}
                    </div>
                    {days.map((_, dayIndex) => {
                      const daySlots = Object.fromEntries(
                        Object.entries(demoAgenda[time]).map(([k, v]) => [
                          Number(k),
                          [...v],
                        ])
                      ) as Record<number, [State, State]>;
                      const slotPair: [State, State] = daySlots[dayIndex];

                      return (
                        <div key={`${time}-${dayIndex}`} className="grid grid-cols-2 gap-1">
                          <SlotPill
                            state={slotPair[0]}
                            label={slotPair[0] === "free" ? "Disponible" : "Reservado"}
                          />
                          <SlotPill
                            state={slotPair[1]}
                            label={slotPair[1] === "free" ? "Disponible" : "Reservado"}
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
                )
              )}
            </div>

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

      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Hospital className="h-4 w-4 text-brand-600" />
        Módulo Médico — {doctor.nombre}
      </div>
    </section>
  );
}
