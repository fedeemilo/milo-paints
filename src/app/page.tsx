import {
  Header,
  Footer,
  HeroSection,
  GalleryGrid,
} from "@/components/gallery";
import { listPaintings } from "@/lib/mongodb/paintings";
import type { Painting } from "@/types/database.types";

export const revalidate = 60;

export default async function HomePage() {
  let paintingsList: Painting[] = [];

  try {
    paintingsList = await listPaintings();
  } catch (error) {
    console.error("Error fetching paintings:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection
          totalPaintings={paintingsList.filter((p) => !p.sold).length}
        />

        <section className="container mx-auto px-4 py-10 sm:py-12 md:py-16">
          <GalleryGrid paintings={paintingsList} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
