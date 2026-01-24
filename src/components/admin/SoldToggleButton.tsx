"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShoppingCart } from "lucide-react";

interface SoldToggleButtonProps {
  paintingId: string;
  isSold: boolean;
}

export function SoldToggleButton({ paintingId, isSold }: SoldToggleButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/paintings/${paintingId}/sold`, {
        method: "PATCH",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al actualizar el estado");
      }
    } catch {
      alert("Error al actualizar el estado");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSold) {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200 disabled:opacity-50"
        title="Click para desmarcar como vendido"
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        VENDIDO
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-amber-100 hover:text-amber-700 disabled:opacity-50"
      title="Marcar como vendido"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </button>
  );
}
