"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config"; 
import MedicalModule from "../../../../components/MedicalModule";
import { Doctor } from "../../../../components/DoctorCard";

export default function MedicoPage() {
  const { id } = useParams(); 
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, "medicos", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          
          setDoctor({
            id: snap.id,
            nombre: data.nombre || "Sin nombre",
            especialidad: data.especialidad || "General",
            cedula: data.cedula || "",
            telefono: data.telefono || "",
            email: data.email || "",
            sedes: Array.isArray(data.sedes)
              ? data.sedes
              : typeof data.sedes === "string"
              ? [data.sedes]
              : [],
            stats: data.stats || {},
            services: data.services || [],
            initials: undefined, 
          });
        } else {
          console.warn("No se encontró el doctor con id:", id);
        }
      } catch (err) {
        console.error("Error al cargar el doctor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p className="p-4">Cargando datos del médico...</p>;
  if (!doctor) return <p className="p-4">No se encontró el médico.</p>;

  // 🔹 Pasamos el role explícitamente
  return <MedicalModule doctor={doctor} role="asistente" />;
}
