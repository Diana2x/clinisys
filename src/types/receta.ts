export interface Medicamento {
  nombre: string;
  dosis: string;         // ej: "500 mg"
  frecuencia: string;    // ej: "cada 8 horas"
  duracion: string;      // ej: "5 días"
}

export interface Receta {
  id?: string;
  folio: string;                 // ej: "RX-20251102-AB12"
  medicoId: string;
  medicoNombre?: string;
  pacienteId: string;
  pacienteNombre?: string;
  diagnostico?: string;
  indicaciones?: string;
  medicamentos: Medicamento[];
  creadoEn: number;              // Date.now()
  actualizadoEn?: number;
  fecha?: number;                // timestamp de emisión (opcional)
}
