"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Trash2, Edit, Plus } from "lucide-react";


interface Consulta {
  id?: string;
  motivo?: string;
  diagnostico?: string;
  descripcion?: string;
  tratamiento?: string;
  fecha?: Date | any;
}

interface AntecedentesClinicos {
  padecimientos?: string;
  alergias?: string;
  otros?: string;
}

interface HistorialFormProps {
  pacienteId: string;
  tipo: "antecedentesClinicos" | "seguimiento";
}

export default function HistorialForm({ pacienteId, tipo }: HistorialFormProps) {
  const [localData, setLocalData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "pacientes", pacienteId, tipo));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocalData(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pacienteId, tipo]);

  const handleSave = async (item: any) => {
    if (item.id) {
      const docRef = doc(db, "pacientes", pacienteId, tipo, item.id);
      const { id, ...payload } = item;
      await updateDoc(docRef, payload);
      setLocalData((prev) =>
        prev.map((x) => (x.id === item.id ? item : x))
      );
    } else {
      const colRef = collection(db, "pacientes", pacienteId, tipo);
      const { id, ...payload } = item;
      const docRef = await addDoc(colRef, payload);
      setLocalData((prev) => [...prev, { ...item, id: docRef.id }]);
    }
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    const docRef = doc(db, "pacientes", pacienteId, tipo, id);
    await deleteDoc(docRef);
    setLocalData((prev) => prev.filter((x) => x.id !== id));
  };

  const formatForInputDate = (v: any) => {
    if (!v) return "";
    const d = v instanceof Date ? v : v.toDate ? v.toDate() : new Date(v);
    return d.toISOString().split("T")[0];
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
      {/* Lista */}
      {localData.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b py-2"
        >
          <div>
            {tipo === "antecedentesClinicos" ? (
              <p className="text-gray-700">
                Padecimientos: {item.padecimientos || "-"}
                <br />
                Alergias: {item.alergias || "-"}
                <br />
                Otros: {item.otros || "-"}
              </p>
            ) : (
              <p className="text-gray-700">
                Motivo: {item.motivo || "-"} <br />
                Diagnóstico: {item.diagnostico || "-"} <br />
                Descripción: {item.descripcion || "-"} <br />
                Tratamiento: {item.tratamiento || "-"} <br />
                Fecha: {formatForInputDate(item.fecha)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingItem(item)}
              className="text-blue-600"
            >
              <Edit />
            </button>
            <button
              onClick={() => handleDelete(item.id!)}
              className="text-red-600"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      ))}

      {/* Botón agregar */}
      <button
        onClick={() =>
          setEditingItem(
            tipo === "antecedentesClinicos"
              ? { padecimientos: "", alergias: "", otros: "" }
              : { motivo: "", diagnostico: "", descripcion: "", tratamiento: "", fecha: new Date() }
          )
        }
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
      >
        <Plus /> Agregar {tipo === "antecedentesClinicos" ? "Antecedente" : ""}
      </button>

      {/* Formulario */}
      {editingItem && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(editingItem);
          }}
          className="mt-4 space-y-2 border-t pt-4"
        >
          {tipo === "antecedentesClinicos" ? (
            <>
              <input
                type="text"
                placeholder="Padecimientos"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.padecimientos}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, padecimientos: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Alergias"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.alergias}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, alergias: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Otros"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.otros}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, otros: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Motivo"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.motivo}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, motivo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Diagnóstico"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.diagnostico}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, diagnostico: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Descripción"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.descripcion}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, descripcion: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tratamiento"
                className="w-full border px-3 py-2 rounded"
                value={editingItem.tratamiento}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, tratamiento: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={formatForInputDate(editingItem.fecha)}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, fecha: new Date(e.target.value) })
                }
              />
            </>
          )}

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
