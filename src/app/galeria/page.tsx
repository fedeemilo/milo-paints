import { Metadata } from "next";
import {
  PublicHeader,
  PublicFooter,
  HeroSection,
  GalleryGrid,
} from "@/components/gallery";
import { listPaintings } from "@/lib/mongodb/paintings";
import type { Painting } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Galería | Milo Paints",
  description:
    "Explorá la colección completa de pinturas originales de Milo. Acuarelas, óleos y más.",
};

export const revalidate = 60;

export default async function PublicGalleryPage() {
  let paintingsList: Painting[] = [];

  try {
    paintingsList = await listPaintings();
  } catch (error) {
    console.error("Error fetching paintings:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection
          totalPaintings={paintingsList.filter((p) => !p.sold).length}
          isPublic
        />

        <section className="container mx-auto px-4 py-10 sm:py-12 md:py-16">
          <GalleryGrid paintings={paintingsList} isPublic />
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
