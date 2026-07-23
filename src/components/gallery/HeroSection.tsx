interface HeroSectionProps {
  totalPaintings: number;
  isPublic?: boolean;
}

export function HeroSection({
  totalPaintings,
  isPublic = false,
}: HeroSectionProps) {
  return (
    <section className="border-b border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12 text-center sm:py-16 md:py-20">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {isPublic ? "Galería de Arte" : "Mi Galería"}
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
          {isPublic
            ? "Colección de pinturas originales."
            : "Tu espacio para gestionar todas las obras."}
        </p>

        {totalPaintings > 0 && (
          <p className="mt-6 text-sm text-muted-foreground sm:mt-8">
            <span className="font-serif text-lg font-medium text-primary sm:text-xl">
              {totalPaintings}
            </span>
            <span className="ml-2">
              {totalPaintings === 1 ? "obra disponible" : "obras disponibles"}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
