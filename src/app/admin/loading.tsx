import { Loader2 } from "lucide-react";

/**
 * Fallback inmediato al navegar entre rutas del admin.
 * Mantiene el sidebar (layout) y muestra spinner en el contenido
 * mientras el Server Component termina de fetch (Mongo).
 */
export default function AdminLoading() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Cargando…</p>
    </div>
  );
}
