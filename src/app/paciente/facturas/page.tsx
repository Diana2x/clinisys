"use client";

import React from "react";
import RoleGuard from "../../../components/RoleGuard";

export default function FacturasPacientePage() {
  return (
    <RoleGuard role="paciente">
      <main style={{ padding: "20px" }}>
        <h1>Página de Factura del Paciente</h1>
                
      </main>
    </RoleGuard>
  );
}