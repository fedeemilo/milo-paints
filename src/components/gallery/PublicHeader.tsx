import Link from "next/link";
import { Palette, LayoutDashboard } from "lucide-react";
import { isAuthenticated } from "@/lib/auth/session";

export async function PublicHeader() {
  const isAdmin = await isAuthenticated();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo centrado o a la izquierda si hay botón admin */}
        <Link
          href="/galeria"
          className={`flex items-center gap-2 transition-opacity hover:opacity-80 ${
            isAdmin ? "" : "mx-auto"
          }`}
        >
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-wide">
            Milo Paints
          </span>
        </Link>

        {/* Botón de Admin - solo visible si está logueado */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            title="Ir al Dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}
      </div>
    </header>
  );
}
