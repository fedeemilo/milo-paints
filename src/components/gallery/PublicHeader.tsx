import Link from "next/link";
import { Palette } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        {/* Logo centrado - solo lectura, sin navegación a admin */}
        <Link href="/galeria" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Palette className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-wide">
            Milo Paints
          </span>
        </Link>
      </div>
    </header>
  );
}
