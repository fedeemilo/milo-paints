import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { QRCodeDisplay } from "@/components/admin";
import type { Painting } from "@/types/database.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

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

export default async function PaintingQRPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPainting(id);

  if (!painting) {
    notFound();
  }

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${painting.id}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/paintings/${id}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a edición
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Código QR
        </h1>
        <p className="mt-1 text-muted-foreground">{painting.name}</p>
      </div>

      {/* Contenido */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preview de la pintura */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="aspect-square overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={painting.image_url}
              alt={painting.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="font-serif text-xl font-semibold">{painting.name}</h2>
            {painting.category && (
              <p className="text-sm text-muted-foreground">{painting.category}</p>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold">
            Código QR para esta obra
          </h2>
          
          <QRCodeDisplay url={qrUrl} paintingName={painting.name} />

          {/* URL del QR */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              URL de destino
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={qrUrl}
                className="flex-1 rounded-lg border border-input bg-muted px-3 py-2 text-sm"
              />
              <Link
                href={qrUrl}
                target="_blank"
                className="rounded-lg border border-border p-2 transition-colors hover:bg-muted"
                title="Abrir enlace"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium">Instrucciones</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Descargá el QR en PNG o SVG</li>
              <li>• Imprimilo junto a la obra</li>
              <li>• Los visitantes pueden escanearlo para ver más información</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
