"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Indicador inline dentro de un Link (useLinkStatus). */
export function NavPendingIndicator({
  className,
}: {
  className?: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <Loader2
      className={cn(
        "h-3.5 w-3.5 flex-shrink-0 animate-spin transition-opacity duration-150",
        // Delay visual: evita flash en navegaciones muy rápidas
        pending ? "opacity-100 [animation-delay:100ms]" : "opacity-0",
        className
      )}
      aria-hidden={!pending}
    />
  );
}
