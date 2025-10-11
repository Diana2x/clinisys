'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, onSnapshot, query, where, or } from 'firebase/firestore';
import { db } from '@/firebase/config';
import PacienteCard from '@/components/PacienteCard';
import { Paciente } from '@/types/paciente';
import { Plus, Search } from 'lucide-react';
import PacienteForm from '@/components/PacienteForm';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  // Fetch patients from Firestore
  useEffect(() => {
    const q = collection(db, 'pacientes');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pacientesData: Paciente[] = [];
      querySnapshot.forEach((doc) => {
        pacientesData.push({ id: doc.id, ...doc.data() } as Paciente);
      });
      setPacientes(pacientesData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle search
  const filteredPacientes = pacientes.filter((paciente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      paciente.nombre.toLowerCase().includes(searchLower) ||
      paciente.apellidos.toLowerCase().includes(searchLower) ||
      paciente.dni.includes(searchTerm) ||
      paciente.email.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este paciente?')) {
      try {
        await deleteDoc(doc(db, 'pacientes', id));
      } catch (error) {
        console.error('Error deleting document: ', error);
        alert('Error al eliminar el paciente');
      }
    }
  };

  const handleEdit = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPaciente(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pacientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Nuevo Paciente
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPacientes.length > 0 ? (
          filteredPacientes.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda' : 'No hay pacientes registrados'}
          </div>
        )}
      </div>

      {showForm && (
        <PacienteForm
          paciente={selectedPaciente}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
