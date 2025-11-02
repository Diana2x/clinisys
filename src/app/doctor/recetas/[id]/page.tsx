'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RecetaSheet from '../../../../components/RecetaSheet';
import { db } from '../../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

type Medicamento = { nombre: string; dosis: string; frecuencia: string; duracion: string };

type Receta = {
  id?: string;
  folio: string;
  medicoId: string;
  pacienteId: string;
  diagnostico?: string;
  indicaciones?: string;
  medicamentos?: Medicamento[];
  creadoEn: number;
  fecha?: number;
};

export default function RecetaDetailPage() {
  const { id } = useParams<{ id: string }>();                              // ⬅️ toma id directo
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;                                                        // ⬅️ guard clause
    (async () => {
      try {
        const recetaRef = doc(db, 'recetas', id);
        const recetaSnap = await getDoc(recetaRef);
        if (!recetaSnap.exists()) {
          setError('Receta no encontrada');
          setLoading(false);
          return;
        }
        const receta = { id: recetaSnap.id, ...recetaSnap.data() } as Receta;

        // ---- Médico
        let medicoNombre = '—';
        let medicoEspecialidad = '';
        let medicoCedula = '';
        try {
          const medRef = doc(db, 'medicos', receta.medicoId);
          const medSnap = await getDoc(medRef);
          if (medSnap.exists()) {
            const m = medSnap.data() as any;
            medicoNombre = m.nombre ?? medicoNombre;
            medicoEspecialidad = m.especialidad ?? '';
            medicoCedula = m.cedula ?? m.cedulaProfesional ?? '';
          }
        } catch {}

        // ---- Paciente
        let pacienteNombre = '—';
        let pacienteEdad: string | number | undefined = undefined;
        try {
          const pacRef = doc(db, 'pacientes', receta.pacienteId);
          const pacSnap = await getDoc(pacRef);
          if (pacSnap.exists()) {
            const p = pacSnap.data() as any;
            pacienteNombre = [p.nombre, p.apellidos ?? [p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ')]
              .filter(Boolean).join(' ').trim() || pacienteNombre;

            if (p.edad != null) {
              pacienteEdad = p.edad;
            } else if (p.fechaNacimiento) {
              const d: Date = p.fechaNacimiento?.toDate ? p.fechaNacimiento.toDate() : new Date(p.fechaNacimiento);
              if (!isNaN(d.getTime())) {
                const today = new Date();
                let edad = today.getFullYear() - d.getFullYear();
                const mth = today.getMonth() - d.getMonth();
                if (mth < 0 || (mth === 0 && today.getDate() < d.getDate())) edad--;
                pacienteEdad = edad;
              }
            }
          }
        } catch {}

        setData({
          folio: receta.folio,
          fecha: receta.fecha ?? receta.creadoEn,
          medicoNombre,
          medicoEspecialidad,
          medicoCedula,
          pacienteNombre,
          pacienteEdad,
          diagnostico: receta.diagnostico ?? '',
          indicaciones: receta.indicaciones ?? '',
          medicamentos: receta.medicamentos ?? [],
          clinica: {
            telefono: '(55) 1234-5678',
            direccion: 'Calle Cualquiera 123, Ciudad',
            web: 'sitioincreible.com',
            email: 'hola@sitioincreible.com',
          },
        });
        setLoading(false);
      } catch (e: any) {
        setError(e?.message ?? 'Error cargando receta');
        setLoading(false);
      }
    })();
  }, [id]);                                                                  // ⬅️ depende del id

  if (loading) return <main className="p-6">Cargando...</main>;
  if (error) return <main className="p-6 text-red-500">{error}</main>;
  if (!data) return null;

  return (
    <main className="p-6 space-y-4">
      <div className="no-print flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="rounded-lg px-3 py-2 bg-slate-100 hover:bg-slate-200"
        >
          ← Volver
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-lg px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Imprimir / Guardar PDF
        </button>
      </div>
      <RecetaSheet data={data} />
    </main>
  );
}
