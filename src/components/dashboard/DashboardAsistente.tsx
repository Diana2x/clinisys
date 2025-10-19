// src/components/dashboard/DashboardAsistente.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CalendarPlus, ClipboardList, UserPlus } from "lucide-react";
import { contarCitasHoyPorEstado, listarCitasDeHoy } from "@/services/citas.service";

type KPIs = { pendiente: number; confirmada: number; atendida: number; cancelada: number; };
type CitaItem = { id: string; pacienteNombre: string; doctorNombre?: string; estado: string; fecha: Date; };

export default function DashboardAsistente() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [kpi, setKpi]         = useState<KPIs>({ pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0 });
  const [hoy, setHoy]         = useState<CitaItem[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [stats, citas] = await Promise.all([
          contarCitasHoyPorEstado(),
          listarCitasDeHoy(8),
        ]);
        setKpi(stats as KPIs);
        setHoy(citas as CitaItem[]);
      } catch (e) {
        const msg = (e as Error)?.message ?? String(e);
        console.error("[ERROR] Dashboard:", msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Resumen de Hoy</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          Error al cargar: {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard color="yellow" icon={<CalendarPlus size={20} />} label="Pendientes"  value={kpi.pendiente} />
        <KpiCard color="emerald" icon={<CalendarCheck size={20} />} label="Confirmadas" value={kpi.confirmada} />
        <KpiCard color="blue" icon={<ClipboardList size={20} />} label="Atendidas"   value={kpi.atendida} />
        <KpiCard color="red" icon={<UserPlus size={20} />} label="Canceladas"  value={kpi.cancelada} />
      </div>

      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Citas de hoy</h2>
          <Link href="/asistente/citas" className="text-sm text-blue-600 hover:underline">Ver todas</Link>
        </div>

        {loading && <p className="text-sm text-gray-400 mt-2">Cargando…</p>}
        {!loading && !error && hoy.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">No hay citas programadas para hoy.</p>
        )}
        {!loading && hoy.length > 0 && (
          <ul className="mt-3 divide-y">
            {hoy.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {c.pacienteNombre} <span className="text-gray-500">·</span>{" "}
                    <span className="text-gray-700">{c.doctorNombre || "—"}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                    <EstadoChip estado={c.estado} />
                  </p>
                </div>
                <Link href={`/asistente/citas/${c.id}/editar`} className="text-sm px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Editar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/asistente/citas/nueva" className="flex flex-col items-center p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          <CalendarPlus size={24} />
          <span className="text-sm mt-2">Crear cita</span>
        </Link>
        <Link href="/asistente/citas" className="flex flex-col items-center p-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition">
          <ClipboardList size={24} />
          <span className="text-sm mt-2">Ver citas</span>
        </Link>
        <Link href="/asistente/pacientes" className="flex flex-col items-center p-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
          <UserPlus size={24} />
          <span className="text-sm mt-2">Pacientes</span>
        </Link>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }:{
  icon: React.ReactNode; label: string; value: number; color: "yellow"|"emerald"|"blue"|"red";
}) {
  const map = {
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
    emerald:{ bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
    blue:   { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    red:    { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
  }[color];
  return (
    <div className={`p-4 rounded-xl border ${map.bg} ${map.border} ${map.text}`}>
      <div className="mb-1">{icon}</div>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function EstadoChip({ estado }:{ estado: string }) {
  const cls =
    estado === "confirmada" ? "bg-emerald-100 text-emerald-700" :
    estado === "pendiente"  ? "bg-yellow-100 text-yellow-700"  :
    estado === "atendida"   ? "bg-blue-100 text-blue-700"      :
                              "bg-red-100 text-red-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{estado}</span>;
}
