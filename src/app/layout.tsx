"use client"; // Obligatorio porque usamos hooks en SessionProvider


import "./globals.css"; // tu CSS global
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* SessionProvider envuelve toda la app para que useSession() funcione en cualquier layout */}
      
          {children}
       
      </body>
    </html>
  );
}
