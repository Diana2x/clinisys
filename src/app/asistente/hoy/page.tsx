"use client";

import React from "react";
import RoleGuard from "../../../components/RoleGuard";

export default function HoyAsistentePage() {
  return (
    <RoleGuard role="asistente">
      <main style={{ padding: "20px" }}>
        <h1>Página de Hoy del Asistente</h1>
                
      </main>
    </RoleGuard>
  );
}