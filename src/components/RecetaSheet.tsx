'use client';

import React from 'react';

type Medicamento = {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
};

type Props = {
  data: {
    folio: string;
    fecha?: number;
    medicoNombre?: string;
    medicoEspecialidad?: string;
    medicoCedula?: string;
    pacienteNombre?: string;
    pacienteEdad?: string | number;
    diagnostico?: string;
    indicaciones?: string;
    medicamentos: Medicamento[];
    clinica?: {
      telefono?: string;
      direccion?: string;
      web?: string;
      email?: string;
    };
  };
};

export default function RecetaSheet({ data }: Props) {
  const d = new Date(data.fecha ?? Date.now());
  const fecha = d.toLocaleDateString();

  return (
    <div className="w-full flex justify-center print:bg-white">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A5 portrait; margin: 12mm; }
          body { background: white !important; }
        }
      `}</style>

      <article className="bg-white text-slate-800 w-[900px] max-w-[900px] shadow-xl print:shadow-none border border-slate-200 rounded-xl overflow-hidden">
        {/* Header azul */}
        <header className="px-8 py-6 bg-[#0d6efd] text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2v20m0-16c-2.5 0-4.5 2-4.5 4.5S9.5 15 12 15s4.5-2 4.5-4.5S14.5 6 12 6zm-6 1h4M6 11h3m9-4h-4m1 4h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{data.medicoNombre ?? 'Dr. ———'}</h1>
              <p className="text-sm opacity-90">
                {data.medicoEspecialidad ?? 'Especialidad'}
                {data.medicoCedula ? ` • Cédula: ${data.medicoCedula}` : ''}
              </p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>Folio: <span className="font-semibold">{data.folio}</span></p>
            <p>Fecha: <span className="font-semibold">{fecha}</span></p>
          </div>
        </header>

        {/* Datos del paciente */}
        <section className="px-8 py-5 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px]">
          <p><span className="font-semibold">Paciente:</span> {data.pacienteNombre ?? '———'}</p>
          <p><span className="font-semibold">Edad:</span> {data.pacienteEdad ?? '———'}</p>
          <p className="md:col-span-2"><span className="font-semibold">Diagnóstico:</span> {data.diagnostico ?? '———'}</p>
        </section>

        {/* Cuerpo Rx */}
        <section className="px-8 py-6 min-h-[380px]">
          <div className="text-[#0d6efd] font-bold text-2xl mb-3">Rx</div>
          <ul className="space-y-4">
            {data.medicamentos?.map((m, i) => (
              <li key={i} className="leading-relaxed">
                <span className="font-semibold">{m.nombre}</span>{' '}
                <span>— {m.dosis}</span>{' '}
                <span>• {m.frecuencia}</span>{' '}
                <span>• {m.duracion}</span>
              </li>
            ))}
          </ul>

          {data.indicaciones && (
            <div className="mt-6">
              <p className="font-semibold">Indicaciones:</p>
              <p className="whitespace-pre-wrap">{data.indicaciones}</p>
            </div>
          )}
        </section>

        {/* Footer de contacto */}
        <footer className="mt-8 px-6 py-4 bg-blue-700 text-white text-sm flex flex-col md:flex-row justify-between rounded-b-2xl">
  <p>(33) 1234-5678</p>
  <p>Av. Chapultepec 221, Guadalajara, Jal.</p>
  <p>clinsys.com.mx · contacto@clinsys.com.mx</p>
</footer>

      </article>
    </div>
  );
}
