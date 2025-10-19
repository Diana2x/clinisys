// src/services/citas.service.ts
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  limit, orderBy, query, serverTimestamp, startAfter,
  Timestamp, updateDoc, where
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Cita } from "@/types/cita";

const COL = "citas";

/* -------------------- utils -------------------- */
function mapDocToCita(d: any): Cita {
  const x: any = d;
  return {
    id: x.id,
    ...x,
    fecha: x.fecha?.toDate?.() ?? new Date(),
    creadaEn: x.creadaEn?.toDate?.(),
    actualizadaEn: x.actualizadaEn?.toDate?.(),
  } as Cita;
}

/** Rango de *hoy* usando la zona local del navegador/servidor */
export function rangoDeHoy() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/* -------------------- CRUD -------------------- */
export async function crearCita(data: Cita) {
  const payload = {
    ...data,
    fecha: Timestamp.fromDate(data.fecha),
    creadaEn: serverTimestamp(),
    actualizadaEn: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return ref.id;
}

export async function obtenerCita(id: string): Promise<Cita | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return mapDocToCita({ id: snap.id, ...snap.data() });
}

export async function actualizarCita(id: string, patch: Partial<Cita>) {
  const payload: any = { ...patch, actualizadaEn: serverTimestamp() };
  if (patch.fecha instanceof Date) payload.fecha = Timestamp.fromDate(patch.fecha);
  await updateDoc(doc(db, COL, id), payload);
}

export async function eliminarCita(id: string) {
  await deleteDoc(doc(db, COL, id));
}

/* -------------------- Listado genérico con filtros/paginación -------------------- */
export async function listarCitas(opts?: {
  estado?: string;
  doctorId?: string;
  pacienteId?: string;
  /** incluye desde/hasta en el campo fecha */
  desde?: Date;
  hasta?: Date;
  pageSize?: number;
  /** último DocumentSnapshot para paginar */
  cursor?: any;
}) {
  const base = collection(db, COL);
  const conds: any[] = [];

  // filtros simples
  if (opts?.estado) conds.push(where("estado", "==", opts.estado));
  if (opts?.doctorId) conds.push(where("doctorId", "==", opts.doctorId));
  if (opts?.pacienteId) conds.push(where("pacienteId", "==", opts.pacienteId));

  // rango por fecha (mismo campo que orderBy → no requiere índice compuesto)
  if (opts?.desde) conds.push(where("fecha", ">=", Timestamp.fromDate(opts.desde)));
  if (opts?.hasta) conds.push(where("fecha", "<", Timestamp.fromDate(opts.hasta)));

  let q;

  if (conds.length === 0) {
    // sin filtros → solo orderBy(fecha)
    q = query(base, orderBy("fecha", "desc"), limit(opts?.pageSize ?? 10));
  } else {
    // con filtros → orderBy(fecha) + conds
    // Nota: si algún cond no es sobre "fecha", Firestore podría pedir un índice compuesto.
    q = query(base, ...conds, orderBy("fecha", "desc"), limit(opts?.pageSize ?? 10));
  }

  if (opts?.cursor) {
    q = query(q, startAfter(opts.cursor));
  }

  const snap = await getDocs(q);
  const items = snap.docs.map(d => mapDocToCita({ id: d.id, ...d.data() }));
  return { items, nextCursor: snap.docs.at(-1) ?? null };
}

/* -------------------- Helpers para el dashboard (HOY) -------------------- */

/** Lista las citas de HOY (ordenadas por hora asc), límite por defecto 6 */
export async function listarCitasDeHoy(max: number = 6) {
  const { start, end } = rangoDeHoy();
  const q = query(
    collection(db, COL),
    where("fecha", ">=", Timestamp.fromDate(start)),
    where("fecha", "<", Timestamp.fromDate(end)),
    orderBy("fecha", "asc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => mapDocToCita({ id: d.id, ...d.data() }));
}

/**
 * Cuenta las citas de HOY por estado (pendiente/confirmada/atendida/cancelada)
 * Estrategia: traer citas de hoy y agrupar en cliente → NO requiere índice compuesto.
 */
export async function contarCitasHoyPorEstado() {
  const { start, end } = rangoDeHoy();
  const q = query(
    collection(db, COL),
    where("fecha", ">=", Timestamp.fromDate(start)),
    where("fecha", "<", Timestamp.fromDate(end))
  );
  const snap = await getDocs(q);

  const out = { pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0 };
  snap.forEach(doc => {
    const e = (doc.data() as any).estado as keyof typeof out;
    if (e && out[e] !== undefined) out[e] += 1;
  });

  return out;
}
