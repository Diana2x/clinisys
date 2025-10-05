"use client";

import React, { useEffect, useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import DoctorCard, { Doctor } from "../../../components/DoctorCard";

export default function CitaPacientePage() {
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = collection(db, "medicos");
        const snap = await getDocs(q);

        const docs: Doctor[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            nombre: data.nombre || "Sin nombre",
            especialidad: data.especialidad || "General",
            cedula: data.cedula || "",
            email: data.email || "",
            telefono: data.telefono || "",
            bio: data.bio || "",
            services: Array.isArray(data.services) ? data.services : [],
            initials: data.initials || "",
            stats: data.stats || {},
            sedes: Array.isArray(data.sedes)
              ? data.sedes
              : typeof data.sedes === "string"
              ? data.sedes.split(",").map((s) => s.trim())
              : [],
          };
        });

        setMedicos(docs);
      } catch (err) {
        console.error("Error cargando médicos:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const espOptions = Array.from(new Set(medicos.map((m) => m.especialidad))).filter(Boolean);
  const visibles = medicos.filter(
    (m) => !filtroEspecialidad || m.especialidad === filtroEspecialidad
  );

  return (
    <RoleGuard role="paciente">
      <main className="p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-700">Agendar una Cita</h1>
          <div>
            <select
              value={filtroEspecialidad}
              onChange={(e) => setFiltroEspecialidad(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Todas las especialidades</option>
              {espOptions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </header>

        {loading ? (
          <p>Cargando médicos disponibles...</p>
        ) : visibles.length === 0 ? (
          <p>No se encontraron médicos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibles.map((m) => (
              <DoctorCard key={m.id} doctor={m} />
            ))}
          </div>
        )}
      </main>
    </RoleGuard>
  );
}
