import { notFound } from "next/navigation";
import Link from "next/link";
import { PaintingForm } from "@/components/admin/PaintingForm";
import { ArrowLeft, QrCode } from "lucide-react";
import { getPaintingById } from "@/lib/mongodb/paintings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaintingPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/paintings"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a pinturas
          </Link>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Editar Pintura
          </h1>
          <p className="mt-1 text-muted-foreground">{painting.name}</p>
        </div>

        <Link
          href={`/admin/paintings/${id}/qr`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <QrCode className="h-4 w-4" />
          Ver QR
        </Link>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl">
        <PaintingForm painting={painting} />
      </div>
    </div>
  );
}
