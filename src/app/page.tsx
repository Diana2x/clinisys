"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const q = query(
        collection(db, "usuarios"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        localStorage.setItem(
          "usuario",
          JSON.stringify({ email: userData.email, role: userData.role })
        );

        Cookies.set(
          "usuario",
          JSON.stringify({ email: userData.email, role: userData.role }),
          { expires: 1 }
        );

        switch (userData.role) {
          case "paciente":
            router.push("/paciente");
            break;
          case "asistente":
            router.push("/asistente");
            break;
          case "doctor":
            router.push("/doctor");
            break;
          default:
            setError("Rol no reconocido");
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error("Error en Firestore:", err);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Login */}
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-sky-700 to-sky-600 shadow-md">
        <h1 className="text-white text-2xl font-extrabold">Clinisys</h1>

        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-1 rounded-md border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-1 rounded-md border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleLogin}
            className="bg-white text-sky-700 px-4 py-1 rounded-md font-semibold hover:bg-white/90 transition"
          >
            Ingresar
          </button>
        </div>
      </header>

     
      <main className="flex-1 bg-sky-50 flex flex-col items-center justify-center p-4">
        {error && (
          <div className="mb-4 text-red-500 font-medium">{error}</div>
        )}
        <p className="text-sky-800 text-xl font-semibold">
          Bienvenido a Clinisys
        </p>
      </main>
    </div>
  );
}
