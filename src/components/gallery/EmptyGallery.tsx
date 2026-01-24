import { Palette, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyGalleryProps {
  isPublic?: boolean;
}

export function EmptyGallery({ isPublic = false }: EmptyGalleryProps) {
  // Vista para visitantes (galería pública)
  if (isPublic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Palette className="h-12 w-12 text-primary" />
        </div>

        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Próximamente
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          La galería estará disponible muy pronto. Volvé a visitarnos para
          descubrir las obras.
        </p>
      </div>
    );
  }

  // Vista para Milo (admin)
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Icono decorativo */}
      <div className="mb-6 rounded-full bg-primary/10 p-6">
        <Palette className="h-12 w-12 text-primary" />
      </div>

      {/* Mensaje para Milo */}
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        ¡Bienvenido, Milo!
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Tu galería está lista. Empezá a cargar tus obras para que el mundo
        pueda admirarlas.
      </p>

      {/* CTA para agregar pintura */}
      <Link
        href="/admin/paintings/new"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Agregar tu primera pintura
      </Link>
    </div>
  );
}
