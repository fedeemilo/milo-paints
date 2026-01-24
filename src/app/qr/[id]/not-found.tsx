import Link from "next/link";
import { SearchX } from "lucide-react";
import { PublicHeader, PublicFooter } from "@/components/gallery";

export default function PaintingNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          {/* Icono */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>

          {/* Mensaje */}
          <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Obra no encontrada
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            La pintura que buscás no existe o fue removida de la galería.
          </p>

          {/* CTA */}
          <Link
            href="/galeria"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir a la galería
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
