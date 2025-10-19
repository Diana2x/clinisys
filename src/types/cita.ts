// src/types/cita.ts
export type EstadoCita = 'pendiente' | 'confirmada' | 'atendida' | 'cancelada';

export interface Cita {
  id?: string;
  pacienteId: string;
  pacienteNombre: string; // denormalizado para listar rápido
  doctorId: string;
  doctorNombre: string;   // denormalizado
  fecha: Date;            // en Firestore se guardará como Timestamp
  motivo?: string;
  notas?: string;
  estado: EstadoCita;
  creadaEn?: Date;
  actualizadaEn?: Date;
}
