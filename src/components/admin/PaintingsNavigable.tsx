"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaintingsNavigableProps {
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  totalPaintings: number;
  from: number;
  to: number;
  viewMode: string;
}

/**
 * Envuelve listado + paginación. Al cambiar ?page= / ?view= muestra spinner
 * de inmediato (useTransition), porque loading.tsx no corre en soft nav
 * de searchParams.
 */
export function PaintingsNavigable({
  children,
  currentPage,
  totalPages,
  totalPaintings,
  from,
  to,
  viewMode,
}: PaintingsNavigableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (page: number, view: string) => {
    startTransition(() => {
      router.push(`/admin/paintings?page=${page}&view=${view}`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative min-h-[200px]">
        {isPending && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-[1px]"
            role="status"
            aria-live="polite"
            aria-label="Cargando página"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando…</p>
            </div>
          </div>
        )}

        <div
          className={cn(
            "transition-opacity duration-150",
            isPending && "pointer-events-none opacity-40"
          )}
        >
          {children}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {from + 1} - {Math.min(to + 1, totalPaintings)} de{" "}
            {totalPaintings} pinturas
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || isPending}
              onClick={() => navigate(currentPage - 1, viewMode)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors",
                currentPage <= 1 || isPending
                  ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
              Anterior
            </button>

            <span className="px-3 text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => navigate(currentPage + 1, viewMode)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors",
                currentPage >= totalPages || isPending
                  ? "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Siguiente
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PaintingsViewToggle({
  currentPage,
  viewMode,
}: {
  currentPage: number;
  viewMode: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (view: string) => {
    startTransition(() => {
      router.push(`/admin/paintings?page=${currentPage}&view=${view}`);
    });
  };

  return (
    <div className="relative flex items-center rounded-lg border border-border bg-background p-1">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate("table")}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors",
          viewMode === "table"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Vista tabla"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => navigate("grid")}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors",
          viewMode === "grid"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Vista grilla"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}
