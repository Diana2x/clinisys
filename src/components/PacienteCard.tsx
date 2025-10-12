"use client";

import React from "react";
import Link from "next/link";
import { Droplets, HeartPulse, Pencil, Trash2 } from "lucide-react";
import { Paciente } from "@/types/paciente";

interface PacienteCardProps {
  paciente: Paciente;
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

export default function PacienteCard({
  paciente,
  onEdit,
  onDelete,
}: PacienteCardProps) {
  const birthDate = paciente.fechaNacimiento?.toDate?.();
  const registerDate = paciente.fechaAlta?.toDate?.();

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleCardClick = () => {
    window.location.href = `/doctor/pacientes/${paciente.id}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-5">
        {/* Encabezado con nombre y botones */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {paciente.nombre} {paciente.apellidos}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {birthDate && <span>{calculateAge(birthDate)} años</span>}
              {paciente.sexo && <span>• {paciente.sexo}</span>}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 👈 evita que se active el clic de la tarjeta
                onEdit(paciente);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-blue-600 transition"
              title="Editar"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 👈 evita redirección
                onDelete(paciente.id);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-red-600 transition"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          {paciente.email && <p>{paciente.email}</p>}
          {paciente.telefono && <p>{paciente.telefono}</p>}
          {birthDate && <p>Nacimiento: {formatDate(birthDate)}</p>}
          {registerDate && <p>Alta: {formatDate(registerDate)}</p>}
        </div>

        {/* Tipo de sangre */}
        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Droplets size={14} className="mr-1.5" />
            {paciente.tipoSangre || "Sin grupo"}
          </span>
        </div>

        {/* Padecimientos */}
        {paciente.padecimientos && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-start">
              <HeartPulse
                size={18}
                className="text-red-400 mr-2 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Padecimientos
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {paciente.padecimientos}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
