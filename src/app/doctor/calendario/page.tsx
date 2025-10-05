"use client";

import React from "react";
import RoleGuard from "../../../components/RoleGuard";

type State = "free" | "busy";

function SlotPill({ state, label }: { state: State; label: string }) {
  const base = "inline-flex h-12 w-full items-center justify-center rounded-lg border text-sm font-medium truncate text-[14px]";
  const styles =
    state === "free"
      ? "bg-white border-slate-300 ring-2 ring-green-400/40"
      : "bg-[#fff0f0] border-[#ffd2d2] text-[#b42318]";
  return <div className={`${base} ${styles}`}>{label}</div>;
}

/* Días y demo agenda (reemplazar por tu data real) */
const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

const demoAgenda = {
  "09:00": { 0: ["busy", "free"] as const, 1: ["free", "busy"] as const, 2: ["free", "free"] as const, 3: ["busy", "free"] as const, 4: ["free", "free"] as const },
  "10:30": { 0: ["free", "busy"] as const, 1: ["busy", "free"] as const, 2: ["busy", "free"] as const, 3: ["free", "free"] as const, 4: ["free", "free"] as const },
  "12:00": { 0: ["free", "free"] as const, 1: ["busy", "busy"] as const, 2: ["free", "busy"] as const, 3: ["free", "free"] as const, 4: ["free", "free"] as const },
};

export default function CalendarioDoctorPage() {
  return (
    <RoleGuard role="doctor">
      <main className="px-8 py-6 min-h-screen">
        <h1 className="text-3xl font-bold text-brand-700">
          Calendario Semanal
        </h1>

        {/* Agenda */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] gap-x-4 gap-y-4">
            <div />
            {days.map((d) => (
              <div key={d} className="text-slate-700 font-semibold text-center text-lg truncate">
                {d}
              </div>
            ))}

            {(Object.keys(demoAgenda) as Array<keyof typeof demoAgenda>).map((time) => (
              <React.Fragment key={time}>
                <div className="text-slate-700 font-semibold text-lg">{time}</div>
                {days.map((_, dayIndex) => {
                  const daySlots = Object.fromEntries(
                    Object.entries(demoAgenda[time]).map(([k, v]) => [Number(k), [...v]])
                  ) as Record<number, [State, State]>;
                  const slotPair: [State, State] = daySlots[dayIndex];

                  return (
                    <div key={`${time}-${dayIndex}`} className="grid grid-cols-2 gap-2">
                      <SlotPill state={slotPair[0]} label={slotPair[0] === "free" ? "Disponible" : "Reservado"} />
                      <SlotPill state={slotPair[1]} label={slotPair[1] === "free" ? "Disponible" : "Reservado"} />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-6 text-slate-600 text-sm mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md ring-1 ring-green-400/40 bg-white border border-slate-300" />
              Disponible
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#fff0f0] border border-[#ffd2d2]" />
              Reservado
            </div>
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
