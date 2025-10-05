"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AsistenteLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"asistente" | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (!storedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "asistente") {
        router.replace("/");
        return;
      }

      setUserRole("asistente");
    } catch {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="flex">
      {userRole && <Navbar role={userRole} />}
      <main className="flex-1">
        {userRole ? (
          children
        ) : (
          <p className="p-4 text-center text-slate-500">
            Cargando datos del asistente...
          </p>
        )}
      </main>
    </div>
  );
}
