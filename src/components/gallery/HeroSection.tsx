interface HeroSectionProps {
  totalPaintings: number;
  isPublic?: boolean;
}

export function HeroSection({ totalPaintings, isPublic = false }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12 md:py-16 lg:py-24">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        {/* Título principal */}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          {isPublic ? "Galería de Arte" : "Mi Galería"}
        </h1>

        {/* Subtítulo */}
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:mt-4 sm:text-lg md:max-w-2xl md:text-xl">
          {isPublic
            ? "Descubrí esta colección de pinturas originales."
            : "Bienvenido a tu espacio, Milo. Desde acá podés gestionar todas tus obras."}
        </p>

        {/* Contador de obras */}
        {totalPaintings > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm sm:mt-8 sm:px-4 sm:py-2">
            <span className="font-semibold text-primary">{totalPaintings}</span>
            <span className="text-muted-foreground">
              {totalPaintings === 1 ? "obra disponible" : "obras disponibles"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
