import type { Painting } from "@/types/database.types";
import { PaintingCard } from "./PaintingCard";
import { EmptyGallery } from "./EmptyGallery";

interface GalleryGridProps {
  paintings: Painting[];
  isPublic?: boolean;
}

export function GalleryGrid({ paintings, isPublic = false }: GalleryGridProps) {
  if (paintings.length === 0) {
    return <EmptyGallery isPublic={isPublic} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {paintings.map((painting) => (
        <PaintingCard key={painting.id} painting={painting} />
      ))}
    </div>
  );
}
