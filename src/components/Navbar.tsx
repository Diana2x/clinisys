"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Home,
  CalendarDays,
  Users2,
  Wallet,
  Grid3X3,
  FileText,
  Receipt,
  Building2,
  //Settings,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  role: "paciente" | "asistente" | "doctor";
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function normalizePath(p: string | null | undefined) {
  if (!p) return "/";
  // elimina trailing slash excepto si es la raíz
  return p.replace(/\/+$/g, "") || "/";
}

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const pathNorm = normalizePath(pathname);
  const hrefNorm = normalizePath(href);

  // activo si path === href o si path es subruta de href (/asistente/citas/n)
  const active = pathNorm === hrefNorm || pathNorm.startsWith(hrefNorm + "/");

  // DEBUG: ver en consola lo que recibe cada item
  useEffect(() => {
   
    console.log("[NavItem]", { pathname, pathNorm, href, hrefNorm, active });
  }, [pathname, href, pathNorm, hrefNorm, active]);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150",
        "text-white/90 hover:bg-white/10 hover:text-white",
        active ? "bg-white/15 text-white shadow-sm" : "",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("usuario");
    localStorage.removeItem("usuario");
    router.push("/");
  };

  let items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] =
    [];

  switch (role) {
    case "paciente":
      items = [
        { href: "/paciente/citas", label: "Citas", icon: CalendarDays },
        { href: "/paciente/recetas", label: "Recetas", icon: FileText },
        { href: "/paciente/facturas", label: "Facturas", icon: Receipt },
      ];
      break;
    case "asistente":
      items = [
        { href: "/asistente/hoy", label: "Hoy", icon: Home },
        { href: "/asistente/citas", label: "Citas", icon: CalendarDays },
      ];
      break;
    case "doctor":
      items = [
        { href: "/doctor/hoy", label: "Hoy", icon: Home },
        { href: "/doctor/calendario", label: "Calendario", icon: CalendarDays },
        { href: "/doctor/citas", label: "Citas", icon: CalendarDays },
        { href: "/doctor/pacientes", label: "Pacientes", icon: Users2 },
        { href: "/doctor/contabilidad", label: "Contabilidad", icon: Wallet },
        { href: "/doctor/otros", label: "Otros", icon: Grid3X3 },
      ];
      break;
  }

  return (
    <aside
      className={[
        "hidden md:flex md:sticky top-0 h-screen w-[240px]",
        "bg-gradient-to-b from-sky-700 to-sky-600",
        "shadow-[inset_-2px_0_0_rgba(255,255,255,.180)]",
        "text-white flex-col gap-4 p-4",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 px-2 mt-1 mb-2">
        <Building2 className="h-6 w-6" />
        <div className="text-lg font-extrabold tracking-wide">
          {role === "paciente" ? "Paciente" : role === "asistente" ? "Asistente" : "Doctor"}
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      <div className="flex-1" />

      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg w-full"
      >
        <LogOut className="h-4 w-4" />
        <span className="text-sm">Cerrar sesión</span>
      </button>
    </aside>
  );
};

export default Navbar;

