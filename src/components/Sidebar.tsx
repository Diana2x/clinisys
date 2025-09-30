"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Home,
  CalendarDays,
  Users2,
  Wallet,
  Grid3X3,
  Settings,
} from "lucide-react";

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center gap-3 px-4 py-2 rounded-lg transition",
        "text-white/90 hover:bg-white/10 hover:text-white",
        active ? "bg-white/15 text-white" : "",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside
      className={[
        "hidden md:flex md:sticky top-0 h-screen w-[240px]",
        "bg-gradient-to-b from-brand-700 to-brand-600",
        "shadow-[inset_-2px_0_0_rgba(255,255,255,.180)]",
        "text-white",
        "flex-col gap-4 p-4",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-2 mt-1 mb-2">
        <Building2 className="h-6 w-6" />
        <div className="text-lg font-extrabold tracking-wide">Clínica</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <NavItem href="/hoy"                   label="Hoy"          icon={Home} />
        <NavItem href="/calendario"            label="Calendario"   icon={CalendarDays} />
        <NavItem href="/citas/informacioncita" label="Citas"        icon={CalendarDays} />
        <NavItem href="/pacientes"             label="Pacientes"    icon={Users2} />
        <NavItem href="/contable"              label="Contabilidad" icon={Wallet} />
        <NavItem href="/otros"                 label="Otros"        icon={Grid3X3} />
      </nav>

      <div className="flex-1" />

      {/* Footer/ajustes */}
      <Link
        href="/config"
        className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
      >
        <Settings className="h-4 w-4" />
        <span className="text-sm">Configuración</span>
      </Link>
    </aside>
  );
}
