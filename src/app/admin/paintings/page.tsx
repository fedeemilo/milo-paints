import Link from "next/link";
import { formatPrice } from "@/lib/helpers";
import { Plus, Pencil, QrCode, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { DeletePaintingButton, SoldToggleButton } from "@/components/admin";
import { listPaintingsPaginated } from "@/lib/mongodb/paintings";

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string; view?: string }>;
}

export default async function AdminPaintingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const viewMode = params.view || "table"; // 'table' o 'grid'

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const { paintings, total: totalPaintings } = await listPaintingsPaginated(
    from,
    ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(totalPaintings / ITEMS_PER_PAGE);
  const to = from + ITEMS_PER_PAGE - 1;

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
        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <Link
              href={`/admin/paintings?page=${currentPage}&view=table`}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista tabla"
            >
              <List className="h-4 w-4" />
            </Link>
            <Link
              href={`/admin/paintings?page=${currentPage}&view=grid`}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista grilla"
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
          </div>
          <Link
            href="/admin/paintings/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nueva Pintura
          </Link>
        </div>
      </div>

      {/* Contenido según modo de vista */}
      {paintings.length > 0 ? (
        <>
          {viewMode === "table" ? (
            // Vista Tabla
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
                            className="h-full w-full cursor-pointer object-contain"
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
            // Vista Grilla
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paintings.map((painting) => (
                <article
                  key={painting.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                >
                  {/* Imagen */}
                  <Link
                    href={`/qr/${painting.id}`}
                    className="block aspect-square overflow-hidden bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={painting.thumbnail_url || painting.image_url}
                      alt={painting.name}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Metadata */}
                  <div className="space-y-3 p-4">
                    {/* Nombre y Precio */}
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1">
                        {painting.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-primary">
                        {formatPrice(painting.price)}
                      </p>
                    </div>

                    {/* Categoría */}
                    {painting.category && (
                      <p className="text-xs text-muted-foreground">
                        {painting.category}
                      </p>
                    )}

                    {/* Estado vendido */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Estado:
                      </span>
                      <SoldToggleButton
                        paintingId={painting.id}
                        isSold={painting.sold ?? false}
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-2 border-t border-border pt-3">
                      <Link
                        href={`/admin/paintings/${painting.id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                      <Link
                        href={`/admin/paintings/${painting.id}/qr`}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Ver QR"
                      >
                        <QrCode className="h-4 w-4" />
                      </Link>
                      <DeletePaintingButton
                        paintingId={painting.id}
                        paintingName={painting.name}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {from + 1} - {Math.min(to + 1, totalPaintings)} de {totalPaintings} pinturas
              </p>

              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/paintings?page=${currentPage - 1}&view=${viewMode}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                )}

                <span className="px-3 text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/admin/paintings?page=${currentPage + 1}&view=${viewMode}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground opacity-50"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
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
