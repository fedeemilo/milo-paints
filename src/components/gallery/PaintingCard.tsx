"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Painting } from "@/types/database.types";
import { formatPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface PaintingCardProps {
  painting: Painting;
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/qr/${painting.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Contenedor de imagen con aspect ratio */}
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          {/* Placeholder mientras carga */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 transition-opacity duration-500",
              isLoaded ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Imagen */}
          <Image
            src={painting.thumbnail_url || painting.image_url}
            alt={painting.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-contain p-2 transition-all duration-500",
              isLoaded ? "opacity-100" : "opacity-0",
              isHovered ? "scale-105" : "scale-100"
            )}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Overlay sutil en hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Categoría badge */}
          {painting.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {painting.category}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {painting.name}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {formatPrice(painting.price)}
            </span>

            {painting.year && (
              <span className="text-xs text-muted-foreground">
                {painting.year}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
