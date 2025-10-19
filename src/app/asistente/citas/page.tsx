"use client";
import { useCallback, useEffect, useState } from "react";
import { listarCitas, eliminarCita } from "@/services/citas.service";
import Link from "next/link";
import FlashToast from "@/components/FlashToast";
import { Pencil, Trash2 } from "lucide-react";
import type { Cita } from "@/types/cita";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

type ToastState = { show: boolean; msg: string };

export default function CitasListaPage() {
  // ❌ useState<any>  ->  ✅ tipado explícito
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [estado, setEstado] = useState<string>("");
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [nextCursor, setNextCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, msg: "" });

  // ✅ useCallback con deps; así no te advierte el hook
  const cargar = useCallback(
    async (reset: boolean = false) => {
      setLoading(true);
      const res = await listarCitas({
        estado: estado || undefined,
        pageSize: 10,
        cursor: reset ? null : cursor,
      });
      setCitas((prev) => (reset ? res.items : [...prev, ...res.items]));
      setNextCursor(res.nextCursor);
      setLoading(false);
    },
    [estado, cursor] // <- dependencias reales
  );

  // Montaje inicial
  useEffect(() => {
    cargar(true);
  }, [cargar]);

  // Cuando cambia el estado del filtro
  useEffect(() => {
    // al cambiar el filtro reinicia paginación
    setCursor(null);
    cargar(true);
  }, [estado, cargar]);

  async function handleEliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar la cita de ${nombre}?`)) return;
    await eliminarCita(id);
    setCitas((prev) => prev.filter((x) => x.id !== id));
    setToast({ show: true, msg: `Cita de “${nombre}” eliminada 🗑️` });
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Citas registradas</h1>
      </div>

      {/* Filtro por estado */}
      <div className="flex gap-2 items-center">
        <select
          className="border rounded-xl px-3 py-2 text-sm"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="atendida">Atendida</option>
          <option value="cancelada">Cancelada</option>
        </select>
        {loading && <span className="text-xs text-gray-400 ml-2">Cargando…</span>}
      </div>

      {/* Tabla */}
      <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left p-3 font-medium">Fecha</th>
              <th className="text-left p-3 font-medium">Paciente</th>
              <th className="text-left p-3 font-medium">Doctor</th>
              <th className="text-left p-3 font-medium">Estado</th>
              <th className="text-right p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-700">{new Date(c.fecha).toLocaleString()}</td>
                <td className="p-3 font-medium text-gray-900">{c.pacienteNombre}</td>
                <td className="p-3 text-gray-700">{c.doctorNombre}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        c.estado === "confirmada"
                          ? "bg-emerald-100 text-emerald-700"
                          : c.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.estado === "atendida"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <Link
                    href={`/asistente/citas/${c.id}/editar`}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition"
                  >
                    <Pencil size={14} /> Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(c.id!, c.pacienteNombre)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && citas.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  Sin resultados. Usa “Crear cita” desde el sidebar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center">
        {nextCursor && (
          <button
            className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
            onClick={() => {
              setCursor(nextCursor);
              cargar();
            }}
          >
            Cargar más
          </button>
        )}
      </div>

      {/* Toast */}
      <FlashToast
        show={toast.show}
        message={toast.msg}
        onClose={() => setToast({ show: false, msg: "" })}
      />
    </div>
  );
}
