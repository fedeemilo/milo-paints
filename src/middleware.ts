import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "milo-admin-session";

// Rutas públicas dentro de admin
const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  const isAuthenticated = !!session?.value;

  // Rutas públicas de admin (login) - si ya está auth, redirigir a admin
  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Página principal "/" - requiere auth
  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/galeria", request.url));
    }
    return NextResponse.next();
  }

  // Rutas /admin/* - requieren auth
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
