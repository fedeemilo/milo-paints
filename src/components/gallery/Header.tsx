import Link from "next/link";
import { Palette } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-wide">
            Milo Paints
          </span>
        </Link>

        {/* Navegación simple */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Galería
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
