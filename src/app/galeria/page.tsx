import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  PublicHeader,
  PublicFooter,
  HeroSection,
  GalleryGrid,
} from "@/components/gallery";

export const metadata: Metadata = {
  title: "Galería | Milo Paints",
  description:
    "Explorá la colección completa de pinturas originales de Milo. Acuarelas, óleos y más.",
};

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function PublicGalleryPage() {
  const supabase = await createClient();

  // Obtener todas las pinturas ordenadas por fecha de creación
  const { data: paintings, error } = await supabase
    .from("paintings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching paintings:", error);
  }

  const paintingsList = paintings ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section - versión pública */}
        <HeroSection totalPaintings={paintingsList.length} isPublic />

        {/* Galería - versión pública */}
        <section className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
          <GalleryGrid paintings={paintingsList} isPublic />
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
