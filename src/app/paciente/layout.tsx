"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function PacienteLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "paciente") {
        router.push("/");
        return;
      }

      setValidated(true);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!validated) return null;

  return (
    <div className="flex">
      <Navbar role="paciente" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
