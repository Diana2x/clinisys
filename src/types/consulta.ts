import { Timestamp } from "firebase/firestore";

export interface Consulta {
  id?: string;          // id de la consulta en Firestore
  motivo: string;       // motivo de la consulta
  diagnostico: string;  // diagnóstico o notas médicas
  fecha: Date | Timestamp; // fecha de la consulta
}
