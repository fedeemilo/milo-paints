import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/helpers";
import { Plus, Pencil, QrCode } from "lucide-react";
import { DeletePaintingButton, SoldToggleButton } from "@/components/admin";
import type { Painting } from "@/types/database.types";

export default async function AdminPaintingsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("paintings")
    .select("*")
    .order("created_at", { ascending: false });

  const paintings = (data ?? []) as Painting[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Pinturas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona todas las obras de tu galería.
          </p>
        </div>
        <Link
          href="/admin/paintings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Pintura
        </Link>
      </div>

      {/* Tabla de pinturas */}
      {paintings.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Precio
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paintings.map((painting) => (
                <tr key={painting.id} className="bg-card hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/qr/${painting.id}`}
                      className="block h-12 w-12 overflow-hidden rounded bg-muted transition-transform hover:scale-110"
                      title="Ver pintura"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={painting.thumbnail_url || painting.image_url}
                        alt={painting.name}
                        className="h-full w-full cursor-pointer object-cover"
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{painting.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {painting.category || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(painting.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <SoldToggleButton
                      paintingId={painting.id}
                      isSold={painting.sold ?? false}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/paintings/${painting.id}`}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/paintings/${painting.id}/qr`}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Ver QR"
                      >
                        <QrCode className="h-4 w-4" />
                      </Link>
                      <DeletePaintingButton
                        paintingId={painting.id}
                        paintingName={painting.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">No hay pinturas todavía</p>
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
  );
}
