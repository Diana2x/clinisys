import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";

export interface Medico { id: string; nombre: string; especialidad?: string; }

export async function listarMedicos(): Promise<Medico[]> {
  const q = query(collection(db, "medicos"), orderBy("nombre"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Medico[];
}
