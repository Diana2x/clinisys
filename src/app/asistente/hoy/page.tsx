"use client";
import RoleGuard from "../../../components/RoleGuard";
import DashboardAsistente from "../../../components/dashboard/DashboardAsistente";

export default function HoyAsistentePage() {
  return (
    <RoleGuard role="asistente">
      <main className="p-6">
        <DashboardAsistente />
      </main>
    </RoleGuard>
  );
}
