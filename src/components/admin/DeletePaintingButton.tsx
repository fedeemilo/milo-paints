"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeletePaintingButtonProps {
  paintingId: string;
  paintingName: string;
}

export function DeletePaintingButton({
  paintingId,
  paintingName,
}: DeletePaintingButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/paintings/${paintingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al eliminar la pintura");
      }
    } catch {
      alert("Error al eliminar la pintura");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded bg-destructive px-2 py-1 text-xs font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Sí"
          )}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded bg-muted px-2 py-1 text-xs font-medium hover:bg-muted/80"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      title={`Eliminar ${paintingName}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
