import { db } from "../firebase/config";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import type { Receta } from "../types/receta";

const COL = "recetas";

function genFolio() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RX-${y}${m}${day}-${rand}`;
}

export async function crearReceta(data: Omit<Receta, "id" | "folio" | "creadoEn" | "actualizadoEn">) {
  const payload: Receta = {
    ...data,
    folio: genFolio(),
    creadoEn: Date.now(),
    actualizadoEn: Date.now(),
    fecha: Date.now(),
  };
  const col = collection(db, COL);
  const ref = await addDoc(col, payload);
  return { id: ref.id, ...payload };
}

export async function listarRecetasPorMedico(medicoId: string) {
  const col = collection(db, COL);
  const q = query(col, where("medicoId", "==", medicoId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Receta) }));
}

export async function listarRecetasPorPaciente(pacienteId: string) {
  const col = collection(db, COL);
  const q = query(col, where("pacienteId", "==", pacienteId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Receta) }));
}

export async function obtenerReceta(id: string) {
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Receta) };
}

export async function actualizarReceta(id: string, patch: Partial<Receta>) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { ...patch, actualizadoEn: Date.now() });
}
