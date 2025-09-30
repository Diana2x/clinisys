// src/components/Footer.tsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12">
      <div className="mx-auto w-full max-w-[1280px] lg:max-w-[1400px]">
        <div
          className={[
            "relative overflow-hidden",
            // fondo y borde
            "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90",
            "border border-slate-200/80 rounded-[14px]",
            // sombra un poquito más marcada
            "shadow-[0_12px_34px_rgba(20,60,120,.10)]",
            // paddings
            "px-4 md:px-6 py-3.5",
            // layout
            "flex items-center justify-between text-sm text-slate-600",
          ].join(" ")}
        >
          {/* franja superior con degradado brand */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1
                       bg-gradient-to-r from-brand-700 via-brand-600 to-sky-400 opacity-90"
          />

          <span className="font-semibold text-brand-700 tracking-tight">CliniSys</span>
          <span className="text-slate-500">Versión beta • {year}</span>
        </div>
      </div>
    </footer>
  );
}
