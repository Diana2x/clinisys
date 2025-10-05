import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Obtener cookies o cabeceras (localStorage no está disponible en el server)
  const cookieUser = req.cookies.get("usuario");

  if (!cookieUser) {
    // Si no hay sesión, redirigir al login
    if (req.nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const user = JSON.parse(cookieUser.value);
  const path = req.nextUrl.pathname;

  // Reglas de acceso
  if (path.startsWith("/paciente") && user.role !== "paciente") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (path.startsWith("/doctor") && user.role !== "doctor") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (path.startsWith("/asistente") && user.role !== "asistente") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Rutas a proteger
export const config = {
  matcher: ["/paciente/:path*", "/doctor/:path*", "/asistente/:path*"],
};
