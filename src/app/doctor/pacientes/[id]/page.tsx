"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import RoleGuard from "@/components/RoleGuard";
import HistorialForm from "@/components/HistorialForm";
import { Paciente } from "@/types/paciente";

type Tab = "historiaMedica" | "historialConsultas" | "recetas";

export default function PacienteDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("historiaMedica");

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "pacientes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPaciente({ id: docSnap.id, ...docSnap.data() } as Paciente);
        } else {
          console.error("Paciente no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el paciente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [id]);

  if (loading) {
    return (
      <RoleGuard role="doctor">
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <h1 className="text-2xl font-bold">Cargando información del paciente...</h1>
        </main>
      </RoleGuard>
    );
  }

  if (!paciente) {
    return (
      <RoleGuard role="doctor">
        <main className="p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <h1 className="text-2xl font-bold text-red-600">Paciente no encontrado</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </main>
      </RoleGuard>
    );
  }

  const birthDate = paciente.fechaNacimiento?.toDate?.();
  const registerDate = paciente.fechaAlta?.toDate?.();

  return (
    <RoleGuard role="doctor">
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 w-full">
        {/* Contenedor principal que ocupa todo el ancho */}
        <div className="w-full max-w-full mx-auto">
          
          {/* Botón Volver */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            Volver
          </button>

          {/* Información del paciente */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {paciente.nombre} {paciente.apellidos}
              </h1>
              {paciente.dni && <p className="text-gray-500 mt-1">DNI: {paciente.dni}</p>}
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Tipo de sangre: {paciente.tipoSangre || "Sin grupo"}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                Sexo: {paciente.sexo || "Otro"}
              </span>
            </div>
          </header>

          <section className="space-y-4 text-gray-700 mb-6">
            {paciente.email && <p>Email: {paciente.email}</p>}
            {paciente.telefono && <p>Teléfono: {paciente.telefono}</p>}
            {birthDate && <p>Fecha de nacimiento: {birthDate.toLocaleDateString()}</p>}
            {registerDate && <p>Fecha de alta: {registerDate.toLocaleDateString()}</p>}
          </section>

          {/* Menú horizontal - pestañas */}
          <nav className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 font-medium rounded-lg ${activeTab === "historiaMedica" ? "bg-sky-700 text-white" : "bg-sky-200 text-sky-900 hover:bg-sky-300"} transition-colors`}
              onClick={() => setActiveTab("historiaMedica")}
            >
              Historia Médica
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-lg ${activeTab === "historialConsultas" ? "bg-sky-700 text-white" : "bg-sky-200 text-sky-900 hover:bg-sky-300"} transition-colors`}
              onClick={() => setActiveTab("historialConsultas")}
            >
              Historial de Consultas
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-lg ${activeTab === "recetas" ? "bg-sky-700 text-white" : "bg-sky-200 text-sky-900 hover:bg-sky-300"} transition-colors`}
              onClick={() => setActiveTab("recetas")}
            >
              Recetas
            </button>
          </nav>

          {/* Contenido de la pestaña */}
          <div className="mt-4 w-full">
            {activeTab === "historiaMedica" && (
              <HistorialForm pacienteId={paciente.id!} tipo="antecedentesClinicos" />
            )}

            {activeTab === "historialConsultas" && (
              <HistorialForm pacienteId={paciente.id!} tipo="seguimiento" />
            )}

            {activeTab === "recetas" && (
              <div className="p-4 border rounded-lg text-gray-600">
                Aquí puedes crear tus recetas.
              </div>
            )}
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
