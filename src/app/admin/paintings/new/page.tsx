import { PaintingForm } from "@/components/admin";

export default function NewPaintingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Nueva Pintura
        </h1>
        <p className="mt-1 text-muted-foreground">
          Completá los datos para agregar una nueva obra a tu galería.
        </p>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl">
        <PaintingForm />
      </div>
    </div>
  );
}
