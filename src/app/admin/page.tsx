import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Images, Plus, TrendingUp } from "lucide-react";

interface RecentPainting {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Obtener conteo de pinturas
  const { count: totalPaintings } = await supabase
    .from("paintings")
    .select("*", { count: "exact", head: true });

  // Obtener últimas 5 pinturas
  const { data } = await supabase
    .from("paintings")
    .select("id, name, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentPaintings = (data ?? []) as RecentPainting[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido al panel de administración de tu galería.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Images className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Pinturas</p>
              <p className="text-2xl font-bold text-foreground">
                {totalPaintings ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="text-2xl font-bold text-foreground">Activo</p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/paintings/new"
          className="flex items-center gap-4 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-6 transition-colors hover:bg-primary/10"
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Nueva Pintura</p>
            <p className="text-sm text-muted-foreground">Agregar obra</p>
          </div>
        </Link>
      </div>

      {/* Pinturas recientes */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Pinturas Recientes
          </h2>
          <Link
            href="/admin/paintings"
            className="text-sm text-primary hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {recentPaintings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {painting.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <Images className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No hay pinturas todavía
            </p>
            <Link
              href="/admin/paintings/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
