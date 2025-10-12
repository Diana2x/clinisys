"use client";

import React, { useState, useEffect } from "react";
import RoleGuard from "../../../components/RoleGuard";
import PacienteCard from "@/components/PacienteCard";
import { Paciente } from "@/types/paciente";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "../../../firebase/auth";
import PacienteForm from "@/components/PacienteForm";
import { Plus } from 'lucide-react';

export default function PacientesDoctorPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // Query all patients
        const q = query(collection(db, 'pacientes'));
        
        const querySnapshot = await getDocs(q);
        const pacientesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Paciente[];
        
        setPacientes(pacientesData);
      } catch (error) {
        console.error("Error fetching pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [user?.uid]);

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPaciente(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPaciente(null);
  };

  const handleSaveSuccess = () => {
    setShowForm(false);
    setEditingPaciente(null);
    // Refresh the patients list
    fetchPacientes();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      try {
        await deleteDoc(doc(db, 'pacientes', id));
        setPacientes(pacientes.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Error al eliminar el paciente");
      }
    }
  };

  const fetchPacientes = async () => {
    try {
      const q = query(collection(db, 'pacientes'));
      const querySnapshot = await getDocs(q);
      const pacientesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Paciente[];
      setPacientes(pacientesData);
    } catch (error) {
      console.error("Error fetching pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(paciente => 
    `${paciente.nombre} ${paciente.apellidos} ${paciente.dni}`.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <RoleGuard role="doctor">
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Cargando pacientes...</h1>
        </main>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard role="doctor">
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 w-full">
        <div className="w-full">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-sky-700 to-sky-600 rounded-2xl p-6 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Gestión de Pacientes</h1>
              <p className="text-blue-100">Administra los registros médicos de tus pacientes</p>
            </div>
          </div>
          
          {/* Search and Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar pacientes por nombre, apellido o DNI..."
                  className="block w-full pl-12 pr-10 py-3 border-0 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <button
                onClick={handleAddNew}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                <span className="font-semibold">Nuevo Paciente</span>
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8">
              <PacienteForm
                paciente={editingPaciente || undefined}
                onClose={handleCloseForm}
                onSaveSuccess={handleSaveSuccess}
              />
            </div>
          )}

          {/* Patients Grid */}
       
<div className="mb-8 w-full">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    {filteredPacientes.length} {filteredPacientes.length === 1 ? 'paciente' : 'pacientes'} encontrados
  </h2>

  {filteredPacientes.length === 0 ? (
    <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100 w-full">
      <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {searchTerm ? 'No se encontraron coincidencias' : 'No hay pacientes registrados'}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {searchTerm 
          ? "Intenta con otros términos de búsqueda o "
          : "Comienza agregando un nuevo paciente para gestionar sus registros médicos. "
        }
        {!searchTerm && (
          <button
            onClick={handleAddNew}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
          >
            Agregar paciente
          </button>
        )}
      </p>
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPacientes.map((paciente) => (
        <PacienteCard
          key={paciente.id}
          paciente={paciente}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="bg-white rounded-lg shadow-sm p-4" // <- estilo moderno para la tarjeta
        />
      ))}
    </div>
  )}
</div>

        </div>
      </main>
    </RoleGuard>
  );
}