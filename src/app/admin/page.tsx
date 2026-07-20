import Link from "next/link";
import { Images, Plus, TrendingUp } from "lucide-react";
import {
  countPaintings,
  getRecentPaintings,
} from "@/lib/mongodb/paintings";

export default async function AdminDashboardPage() {
  const [totalPaintings, recentPaintings] = await Promise.all([
    countPaintings(),
    getRecentPaintings(5),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Inicio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Bienvenido al panel de administración de tu galería.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-full bg-primary/10 p-2 sm:p-3">
              <Images className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">Total de Pinturas</p>
              <p className="text-xl font-bold text-foreground sm:text-2xl">
                {totalPaintings}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-full bg-green-500/10 p-2 sm:p-3">
              <TrendingUp className="h-5 w-5 text-green-500 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground sm:text-sm">Estado</p>
              <p className="text-xl font-bold text-foreground sm:text-2xl">Activo</p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/paintings/new"
          className="flex items-center gap-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 transition-colors hover:bg-primary/10 sm:gap-4 sm:p-6"
        >
          <div className="rounded-full bg-primary/10 p-2 sm:p-3">
            <Plus className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground sm:text-base">Nueva Pintura</p>
            <p className="text-xs text-muted-foreground sm:text-sm">Agregar obra</p>
          </div>
        </Link>
      </div>

      {/* Pinturas recientes */}
      <div>
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
            Pinturas Recientes
          </h2>
          <Link
            href="/admin/paintings"
            className="text-xs text-primary hover:underline sm:text-sm"
          >
            Ver todas →
          </Link>
        </div>

        {recentPaintings.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {recentPaintings.map((painting) => (
              <Link
                key={painting.id}
                href={`/admin/paintings/${painting.id}`}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={painting.image_url}
                    alt={painting.name}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                    {painting.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-8 text-center sm:py-12">
            <Images className="mx-auto h-10 w-10 text-muted-foreground/50 sm:h-12 sm:w-12" />
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
              No hay pinturas todavía
            </p>
            <Link
              href="/admin/paintings/new"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 sm:mt-4 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar primera pintura
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
