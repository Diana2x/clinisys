"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Cita = {
  id: number;
  paciente: string;
  proNombre: string;
  especialidadTxt: string;
  fecha: string;
  hora: string;
  sede: string;
  telefono: string;
};

export default function ListadoCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    try {
      setCitas(JSON.parse(localStorage.getItem("citas") || "[]"));
    } catch {
      setCitas([]);
    }
  }, []);

  return (
    <section className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-brand-700">Citas</h1>
        <Link
          href="/citas/formulario"
          className="rounded-lg bg-brand-700 text-white px-3 py-2"
        >
          Nueva cita
        </Link>
      </div>

      {citas.length === 0 ? (
        <p className="text-slate-500">No hay citas registradas.</p>
      ) : (
        <div className="grid gap-3">
          {citas.slice().reverse().map((c) => (
            <article key={c.id} className="border border-slate-200 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{c.paciente} — {c.proNombre}</div>
                <div className="text-slate-400 text-xs">#{c.id}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {c.especialidadTxt} • {c.fecha} {c.hora} • {c.sede} • {c.telefono}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
