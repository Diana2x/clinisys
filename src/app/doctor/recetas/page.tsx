"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase/config";
import RecetaForm from "../../../components/RecetaForm";

type Medicamento = {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
};

type RecetaRow = {
  id: string;
  folio?: string;
  pacienteNombre?: string;
  medicoNombre?: string;
  diagnostico?: string;
  fecha?: number;
  creadoEn?: number;
};

function genFolio() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RX-${ymd}-${rand}`;
}

export default function RecetasPage() {
  const router = useRouter();
  const params = useSearchParams();

  // vista actual: "nueva" (form) o "lista" (tabla)
  const [view, setView] = useState<"nueva" | "lista">(
    (params.get("view") as "nueva" | "lista") || "nueva"
  );

  // -------- LISTA --------
  const [rows, setRows] = useState<RecetaRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function cargarLista() {
    setLoading(true);
    try {
      // Simple: todas las recetas ordenadas por fecha desc.
      const qRef = query(collection(db, "recetas"), orderBy("fecha", "desc"));
      const snap = await getDocs(qRef);
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as RecetaRow[];
      setRows(data);
    } catch (e) {
      console.error("Error cargando recetas:", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (view === "lista") cargarLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // -------- GUARDAR --------
  const savingRef = useRef(false);

  async function handleSubmit(payload: {
    pacienteId: string;
    pacienteNombre?: string;
    medicoId: string;
    medicoNombre?: string;
    diagnostico?: string;
    indicaciones?: string;
    medicamentos: Medicamento[];
  }) {
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      if (!payload.pacienteId || !payload.medicoId)
        throw new Error("Selecciona paciente y médico.");
      if (!payload.medicamentos?.length) throw new Error("Agrega al menos un medicamento.");

      const folio = genFolio();
      const now = Date.now();

      // Guarda en Firestore y toma el id real:
      const docRef = await addDoc(collection(db, "recetas"), {
        ...payload,
        folio,
        fecha: now,
        creadoEn: now,
      });

      router.push(`/doctor/recetas/${encodeURIComponent(docRef.id)}`);
    } catch (e: any) {
      console.error(e);
      alert(`No se pudo guardar: ${e?.message ?? "Error"}`);
      savingRef.current = false;
    }
  }

  // Cambiar vista actual y reflejar en URL (sin recargar)
  const goLista = () => {
    const qs = new URLSearchParams(params.toString());
    qs.set("view", "lista");
    router.replace(`/doctor/recetas?${qs.toString()}`);
    setView("lista");
  };

  const goNueva = () => {
    const qs = new URLSearchParams(params.toString());
    qs.set("view", "nueva");
    router.replace(`/doctor/recetas?${qs.toString()}`);
    setView("nueva");
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Recetas médicas</h1>

      {/* VISTA: NUEVA (tu formulario con botones de abajo) */}
      {view === "nueva" && (
        <RecetaForm
          onSubmit={handleSubmit}
          // este callback se dispara desde el botón "Ver recetas" del formulario
          onVerRecetas={goLista}
          initial={{}}
        />
      )}

      {/* VISTA: LISTA (intermedia) */}
      {view === "lista" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Historial de recetas</h2>
            <button
              onClick={goNueva}
              className="rounded-md px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              + Nueva
            </button>
          </div>

          <div className="rounded-xl border overflow-x-auto bg-white">
            {loading ? (
              <div className="p-4">Cargando…</div>
            ) : (
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-blue-600 text-white uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Folio</th>
                    <th className="px-4 py-2 text-left">Paciente</th>
                    <th className="px-4 py-2 text-left">Médico</th>
                    <th className="px-4 py-2 text-left">Diagnóstico</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500">
                        No hay recetas registradas.
                      </td>
                    </tr>
                  )}

                  {rows.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono">{r.folio || "—"}</td>
                      <td className="px-4 py-2">{r.pacienteNombre || "—"}</td>
                      <td className="px-4 py-2">{r.medicoNombre || "—"}</td>
                      <td className="px-4 py-2">{r.diagnostico || "—"}</td>
                      <td className="px-4 py-2">
                        {new Date(r.fecha ?? r.creadoEn ?? Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Link
                          href={`/doctor/recetas/${r.id}`}
                          className="inline-block px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Ver / Imprimir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
