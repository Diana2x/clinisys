"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  role: "paciente" | "asistente" | "doctor";
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role, children }) => {
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
      if (user.role !== role) {
        router.push("/");
        return;
      }

      setValidated(true);
    } catch {
      router.push("/");
    }
  }, [router, role]);

  if (!validated) return null;

  return <div className="flex">{children}</div>;
};

export default RoleGuard;
