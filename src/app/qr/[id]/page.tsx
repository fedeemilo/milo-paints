import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth/session";
import { formatPrice, formatDimensions } from "@/lib/helpers";
import { PublicHeader, PublicFooter } from "@/components/gallery";
import { ArrowLeft, Calendar, Ruler, Tag, Mail, ArrowRight } from "lucide-react";
import { getPaintingById } from "@/lib/mongodb/paintings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const painting = await getPaintingById(id);

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
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  const dimensions = formatDimensions(
    painting.width,
    painting.height,
    painting.depth
  );
  const isAdmin = await isAuthenticated();
  const mailtoHref = `mailto:guillemilo@gmail.com?subject=${encodeURIComponent(`Consulta sobre: ${painting.name}`)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="mb-8">
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

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Obra */}
            <div className="relative overflow-hidden rounded-xl bg-muted/40 ring-1 ring-border/60">
              <Image
                src={painting.image_url}
                alt={painting.name}
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full object-contain"
              />
              {painting.sold && (
                <div className="absolute right-0 top-0 h-36 w-36 overflow-hidden">
                  <div className="absolute right-[-55px] top-[25px] w-[220px] rotate-45 bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 py-3 text-center shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
                    <span className="block text-sm font-black uppercase tracking-[0.2em] text-white drop-shadow-lg">
                      Vendido
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Ficha */}
            <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {painting.category && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary">
                    <Tag className="h-3 w-3" />
                    {painting.category}
                  </span>
                )}
                {painting.sold && (
                  <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Vendido
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                {painting.name}
              </h1>

              {!painting.sold && (
                <p className="mt-5 font-serif text-3xl font-medium tracking-tight text-primary md:text-4xl">
                  {formatPrice(painting.price)}
                </p>
              )}

              {(dimensions || painting.year) && (
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-border/70 py-4 text-sm text-muted-foreground">
                  {dimensions && (
                    <div className="flex items-center gap-2.5">
                      <Ruler className="h-4 w-4 shrink-0 text-primary/70" />
                      <div>
                        <dt className="sr-only">Dimensiones</dt>
                        <dd>{dimensions}</dd>
                      </div>
                    </div>
                  )}
                  {painting.year && (
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                      <div>
                        <dt className="sr-only">Año</dt>
                        <dd>Año {painting.year}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              )}

              {painting.description && (
                <div className="mt-8">
                  <h2 className="mb-2 font-serif text-lg font-semibold text-foreground">
                    Sobre esta obra
                  </h2>
                  <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground md:text-base">
                    {painting.description}
                  </p>
                </div>
              )}

              {/* Acciones: un primario + un secundario */}
              <div className="mt-10 space-y-4">
                {!painting.sold ? (
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-5 sm:p-6">
                    <h2 className="font-serif text-lg font-semibold text-foreground">
                      ¿Te interesa esta obra?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Consultá disponibilidad, pago o envío escribiendo al
                      artista.
                    </p>
                    <a
                      href={mailtoHref}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                    >
                      <Mail className="h-4 w-4" />
                      Consultar por email
                    </a>
                    <p className="mt-3 text-xs text-muted-foreground">
                      guillemilo@gmail.com
                    </p>
                  </div>
                ) : (
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-muted-foreground">
                    Esta obra ya fue vendida. Explorá otras disponibles en la
                    galería.
                  </p>
                )}

                <Link
                  href="/galeria"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
                >
                  Ver la galería completa
                  <ArrowRight className="h-4 w-4" />
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
