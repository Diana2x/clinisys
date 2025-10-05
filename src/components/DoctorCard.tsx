"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { MapPin, Mail, Phone } from "lucide-react";

export type Doctor = {
  id: string;
  nombre: string;
  especialidad: string;
  cedula?: string;
  email?: string;
  telefono?: string;
  sedes?: string[] | string;
  bio?: string;
  services?: string[];
  initials?: string;
  stats?: {
    citasSemana?: number;
    pacientesNuevos?: number;
    proximaCita?: string;
  };
};

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [role, setRole] = useState<"paciente" | "asistente" | "doctor" | null>(null);

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) {
      try {
        const usuario = JSON.parse(usuarioCookie);
        if (["paciente", "asistente", "doctor"].includes(usuario.role)) {
          setRole(usuario.role);
        } else {
          setRole("paciente");
        }
      } catch {
        setRole("paciente");
      }
    } else {
      setRole("paciente");
    }
  }, []);

  const initials =
    doctor.initials ||
    (doctor.nombre
      ? doctor.nombre
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "--");

  const sedesArray: string[] = Array.isArray(doctor.sedes)
    ? doctor.sedes
    : typeof doctor.sedes === "string"
    ? doctor.sedes.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!role) return null;

  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow p-4 hover:shadow-md transition">
      <Link href={`/${role}/citas/${doctor.id}`} className="block">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-brand-700 grid place-items-center text-white font-bold text-xl">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-lg">{doctor.nombre}</div>
            <div className="text-sm text-slate-500">{doctor.especialidad}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {sedesArray.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border text-slate-600"
                >
                  <MapPin className="h-3 w-3" /> {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-3 text-sm text-slate-600 flex gap-4 items-center">
        {doctor.email && (
          <a className="inline-flex items-center gap-1" href={`mailto:${doctor.email}`}>
            <Mail className="h-4 w-4" /> <span>{doctor.email}</span>
          </a>
        )}
        {doctor.telefono && (
          <span className="inline-flex items-center gap-1">
            <Phone className="h-4 w-4" /> <span>{doctor.telefono}</span>
          </span>
        )}
      </div>
    </article>
  );
}
