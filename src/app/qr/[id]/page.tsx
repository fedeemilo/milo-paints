import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAuthenticated } from "@/lib/auth/session";
import { formatPrice, formatDimensions } from "@/lib/helpers";
import { PublicHeader, PublicFooter } from "@/components/gallery";
import { ArrowLeft, Calendar, Ruler, Tag } from "lucide-react";
import type { Painting } from "@/types/database.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper para obtener pintura
async function getPainting(id: string): Promise<Painting | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("paintings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const painting = await getPainting(id);

  if (!painting) {
    return {
      title: "Pintura no encontrada | Milo Paints",
    };
  }

  const description = painting.description || `Obra de arte: ${painting.name}`;

  return {
    title: `${painting.name} | Milo Paints`,
    description,
    openGraph: {
      title: painting.name,
      description,
      images: [{ url: painting.image_url }],
    },
  };
}

export default async function PaintingQRPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPainting(id);

  if (!painting) {
    notFound();
  }

  const dimensions = formatDimensions(painting.width, painting.height, painting.depth);
  const isAdmin = await isAuthenticated();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        {/* Contenedor principal */}
        <article className="container mx-auto px-4 py-8 md:py-12">
          {/* Botón de navegación condicional */}
          <div className="mb-6">
            {isAdmin ? (
              <Link
                href="/admin/paintings"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
            ) : (
              <Link
                href="/galeria"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Ver más obras
              </Link>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            {/* Imagen */}
            <div className="relative overflow-hidden rounded-lg bg-muted shadow-lg">
              <Image
                src={painting.image_url}
                alt={painting.name}
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
              {/* Banner diagonal de vendido mejorado */}
              {painting.sold && (
                <div className="absolute right-0 top-0 h-36 w-36 overflow-hidden">
                  <div className="absolute right-[-55px] top-[25px] w-[220px] rotate-45 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-center shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
                    <span className="block text-sm font-black uppercase tracking-[0.2em] text-white drop-shadow-lg">
                      Vendido
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Información */}
            <div className="flex flex-col justify-center">
              {/* Badge: Categoría */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {painting.category && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Tag className="h-3 w-3" />
                    {painting.category}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {painting.name}
              </h1>

              {/* Precio - solo si no está vendida */}
              {!painting.sold && (
                <p className="mt-4 text-2xl font-semibold text-primary md:text-3xl">
                  {formatPrice(painting.price)}
                </p>
              )}

              {/* Detalles */}
              <div className="mt-6 space-y-3">
                {dimensions && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Ruler className="h-5 w-5 shrink-0" />
                    <span>{dimensions}</span>
                  </div>
                )}

                {painting.year && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 shrink-0" />
                    <span>Año {painting.year}</span>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {painting.description && (
                <div className="mt-8">
                  <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
                    Sobre esta obra
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
                    {painting.description}
                  </p>
                </div>
              )}

              {/* Separador decorativo */}
              <div className="my-8 h-px bg-linear-to-r from-transparent via-border to-transparent" />

              {/* CTA - Ver más obras */}
              <div className="space-y-4">
                {painting.sold ? (
                  <p className="text-sm text-muted-foreground">
                    Esta obra ya fue vendida. ¡Explorá otras obras disponibles!
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    ¿Te interesa esta obra o querés ver más?
                  </p>
                )}
                <Link
                  href="/galeria"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explorar la galería completa
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
