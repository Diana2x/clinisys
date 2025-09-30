// src/app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CliniSys",
  description: "Sistema de citas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/* Layout: sidebar a la izquierda + columna derecha */}
        <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
          <Sidebar />

          {/* Columna derecha: contenido + footer al fondo */}
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1280px] lg:max-w-[1400px] mx-auto w-full">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
