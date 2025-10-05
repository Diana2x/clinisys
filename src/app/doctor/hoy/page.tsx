"use client";

import React from "react";
import RoleGuard from "../../../components/RoleGuard";

export default function HoyDoctorPage() {
  return (
    <RoleGuard role="doctor">
      <main style={{ padding: "20px" }}>
        <h1>Página de Hoy del Doctor</h1>
                
      </main>
    </RoleGuard>
  );
}