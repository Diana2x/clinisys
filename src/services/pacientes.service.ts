import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export interface Paciente {
  id: string;
  nombre: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  sexo?: string;
  tipoSangre?: string;
  padecimientos?: string;
  numeroAfiliado?: string;
  obraSocial?: string;
  fechaNacimiento?: Date;
  fechaAlta?: Date;
}

export async function listarPacientes(): Promise<Paciente[]> {
  const q = query(collection(db, "pacientes"), orderBy("nombre"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Paciente[];
}

export async function crearPaciente(data: Omit<Paciente, "id"|"fechaAlta">) {
  const payload: any = {
    ...data,
    fechaAlta: serverTimestamp(),
  };
  if (data.fechaNacimiento instanceof Date) {
    payload.fechaNacimiento = Timestamp.fromDate(data.fechaNacimiento);
  }
  const ref = await addDoc(collection(db, "pacientes"), payload);
  return ref.id;
}
