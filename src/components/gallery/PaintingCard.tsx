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

  return (
    <Link href={`/qr/${painting.id}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-card ring-1 ring-border/60 transition-colors duration-300 group-hover:ring-primary/30">
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          <div
            className={cn(
              "absolute inset-0 bg-muted transition-opacity duration-500",
              isLoaded ? "opacity-0" : "opacity-100"
            )}
          />

          <Image
            src={painting.thumbnail_url || painting.image_url}
            alt={painting.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.03]",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
          />

          {painting.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur-sm">
              {painting.category}
            </span>
          )}

          {painting.sold && (
            <div className="absolute right-0 top-0 h-28 w-28 overflow-hidden">
              <div className="absolute right-[-38px] top-[18px] w-[160px] rotate-45 bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 py-2 text-center shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                <span className="block text-[11px] font-black uppercase tracking-[0.15em] text-white drop-shadow-md">
                  Vendido
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 px-4 py-3.5">
          <h3 className="font-serif text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {painting.name}
          </h3>

          <div className="mt-1.5 flex min-h-5 items-baseline justify-between gap-2">
            {painting.sold ? (
              <span className="text-sm font-medium text-amber-800/80">
                Vendido
              </span>
            ) : (
              <span className="font-serif text-base font-medium text-primary">
                {formatPrice(painting.price)}
              </span>
            )}

            {painting.year ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {painting.year}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
