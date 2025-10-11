'use client';

import { useState, useEffect } from 'react';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Paciente } from '@/types/paciente';
import { X, Save } from 'lucide-react';

interface PacienteFormProps {
  paciente?: Paciente | null;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export default function PacienteForm({ paciente, onClose, onSaveSuccess }: PacienteFormProps) {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
  const genderOptions = ['masculino', 'femenino', 'otro', 'prefiero no decirlo'] as const;

  const [formData, setFormData] = useState<Omit<Paciente, 'id' | 'fechaAlta'>>({
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    sexo: 'masculino',
    tipoSangre: '',
    padecimientos: '',
    fechaNacimiento: Timestamp.fromDate(new Date(1980, 0, 1)),
    obraSocial: '',
    numeroAfiliado: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'fechaNacimiento' && type === 'date') {
      // Validar que la fecha sea válida
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({
          ...prev,
          [name]: Timestamp.fromDate(date)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (paciente) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, fechaAlta, ...pacienteData } = paciente;
      setFormData(pacienteData as Omit<Paciente, 'id' | 'fechaAlta'>);
    }
  }, [paciente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const pacienteData = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento instanceof Timestamp 
          ? formData.fechaNacimiento 
          : Timestamp.fromDate(new Date(formData.fechaNacimiento)),
        fechaAlta: paciente?.fechaAlta || Timestamp.now(),
      };

      if (paciente) {
        // Update existing patient
        await setDoc(doc(db, 'pacientes', paciente.id), pacienteData);
      } else {
        // Create new patient
        await setDoc(doc(collection(db, 'pacientes')), pacienteData);
      }
      
      onClose();
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error al guardar el paciente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {paciente ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI *
              </label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej: 12345678"
                pattern="\d{8,10}"
                title="Por favor ingrese un DNI válido (8-10 dígitos)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento ? 
                  formData.fechaNacimiento.toDate().toISOString().split('T')[0] : 
                  ''}
                onChange={handleChange}
                onBlur={(e) => {
                  // Validar la fecha al perder el foco
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setFormData(prev => ({
                      ...prev,
                      fechaNacimiento: Timestamp.fromDate(date)
                    }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Sangre
              </label>
              <select
                name="tipoSangre"
                value={formData.tipoSangre}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Seleccionar tipo de sangre</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-md bg-white"
                required
              >
                {genderOptions.map(gender => (
                  <option key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Obra Social
              </label>
              <input
                type="text"
                name="obraSocial"
                value={formData.obraSocial || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° de Afiliado
              </label>
              <input
                type="text"
                name="numeroAfiliado"
                value={formData.numeroAfiliado || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
