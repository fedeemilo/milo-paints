import { Heart, Palette } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo y descripción */}
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-medium">Milo Paints</span>
          </div>

          {/* Copyright y firma */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Milo Paints. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              Hecho con <Heart className="h-3 w-3 fill-red-500 text-red-500" /> por{" "}
              <Link
                href="https://fedmilo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                fedmilo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
