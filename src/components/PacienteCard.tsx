import { Paciente } from "@/types/paciente";
import { Trash2, Edit, Droplets, HeartPulse } from 'lucide-react';

interface PacienteCardProps {
  paciente: Paciente;
  onEdit: (paciente: Paciente) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatShortDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export default function PacienteCard({ paciente, onEdit, onDelete }: PacienteCardProps) {
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const birthDate = paciente.fechaNacimiento?.toDate();
  const registerDate = paciente.fechaAlta?.toDate();

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {paciente.nombre} {paciente.apellidos}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {birthDate ? `${calculateAge(birthDate)} años` : 'Edad no especificada'}
                  </span>
                  <span className="ml-2 text-gray-500 text-sm">
                    {paciente.sexo === 'masculino' ? 'Hombre' : paciente.sexo === 'femenino' ? 'Mujer' : 'Otro'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Droplets size={14} className="mr-1.5" />
                  {paciente.tipoSangre || 'Sin grupo'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
  <div className="flex items-start">
    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    <span className="text-gray-600">{paciente.email || 'Sin correo'}</span>
  </div>

  <div className="flex items-start">
    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
    <span className="text-gray-600">{paciente.telefono || 'Sin teléfono'}</span>
  </div>

  {birthDate && (
    <div className="flex items-start">
      <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v.01M16 7v.01M12 11v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-gray-600">Fecha de Nacimiento: {formatDate(birthDate)}</span>
    </div>
  )}

  {registerDate && (
    <div className="flex items-start">
      <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-gray-600">Alta: {formatDate(registerDate)}</span>
    </div>
  )}
</div>

            {paciente.padecimientos && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-start">
                  <HeartPulse size={18} className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Padecimientos</p>
                    <p className="text-sm text-gray-600">
                      {paciente.padecimientos.length > 100 
                        ? `${paciente.padecimientos.substring(0, 100)}...` 
                        : paciente.padecimientos}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Última actualización: {formatDate(new Date())}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(paciente)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            aria-label="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(paciente.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            aria-label="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
