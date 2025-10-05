export type Role = "paciente" | "asistente" | "doctor";

export interface User {
  id: string;
  email: string;
  password: string; // solo para demo, en producción usar hashing
  role: Role;
}

