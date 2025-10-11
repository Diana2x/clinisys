import { Timestamp } from 'firebase/firestore';

export interface Paciente {
  id: string;
  dni: string; // DNI will be used as a unique identifier
  nombre: string;
  apellidos: string;
  fechaNacimiento: Timestamp;
  fechaAlta: Timestamp;
  email: string;
  telefono: string;
  direccion: string;
  sexo: 'masculino' | 'femenino' | 'otro' | 'prefiero no decirlo';
  tipoSangre: string;
  padecimientos: string;
  // Optional fields that might be added later
  obraSocial?: string;
  numeroAfiliado?: string;
}
