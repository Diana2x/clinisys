"use client";

import { useEffect } from "react";

// Componente FlashToast
// Sirve para mostrar un mensaje temporal en pantalla (notificación o "toast")
// Ideal para avisos como: "Paciente agregado", "Datos guardados", etc.

export default function FlashToast({
  show,       // 🔹 Indica si el toast se muestra o no (true/false)
  message,    // 🔹 Texto del mensaje que aparecerá
  onClose,    // 🔹 Función que se ejecuta cuando el toast desaparece
  duration = 2500, // 🔹 Tiempo visible en milisegundos (2.5 segundos por defecto)
}: {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}) {

  //  useEffect: controla cuánto tiempo permanece visible el toast
  useEffect(() => {
    if (!show) return; // si no está visible, no hace nada
    const timer = setTimeout(onClose, duration); // después de "duration" ms, se cierra
    return () => clearTimeout(timer); // limpia el temporizador si el componente se desmonta
  }, [show, duration, onClose]);

  //  Render del componente
  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-all duration-500
        ${show
          ? "opacity-100 translate-y-0"    // visible: aparece con transición suave
          : "opacity-0 -translate-y-5 pointer-events-none" // oculto: se desvanece
        }`}
    >
      {/*  Caja visual del toast */}
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 shadow-md">
        {/*  Emoji de éxito (puedes cambiarlo por otro ícono si quieres) */}
        <span className="text-lg">✅</span>

        {/*  Texto del mensaje */}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
