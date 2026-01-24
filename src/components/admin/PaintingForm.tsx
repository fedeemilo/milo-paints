"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { createPaintingSchema, type CreatePaintingInput } from "@/lib/validations/painting";
import type { Painting } from "@/types/database.types";

interface PaintingFormProps {
  painting?: Painting;
}

export function PaintingForm({ painting }: PaintingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    painting?.image_url || null
  );
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePaintingInput>({
    resolver: zodResolver(createPaintingSchema),
    defaultValues: painting
      ? {
          name: painting.name,
          description: painting.description || "",
          price: painting.price || undefined,
          width: painting.width || undefined,
          height: painting.height || undefined,
          depth: painting.depth || undefined,
          year: painting.year || undefined,
          category: painting.category || "",
        }
      : undefined,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (!painting?.image_url) {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: CreatePaintingInput) => {
    setError("");
    setIsSubmitting(true);

    try {
      // Si es nueva pintura, necesita imagen
      if (!painting && !imageFile) {
        setError("La imagen es requerida");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url = painting
        ? `/api/paintings/${painting.id}`
        : "/api/paintings";
      const method = painting ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar");
      }

      await response.json();
      router.push("/admin/paintings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la pintura");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Imagen */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Imagen {!painting && <span className="text-destructive">*</span>}
        </label>
        
        {imagePreview ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="h-48 w-48 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">
              Subir imagen
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
        
        {imageFile && (
          <label className="mt-2 block">
            <span className="cursor-pointer text-sm text-primary hover:underline">
              Cambiar imagen
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
          Nombre <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Ej: Atardecer en el campo"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
          Descripción
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Contá la historia de esta obra..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Precio y Categoría */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium text-foreground">
            Precio (USD)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Ej: 500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
            Categoría
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Seleccionar...</option>
            <option value="Acuarela">Acuarela</option>
            <option value="Óleo">Óleo</option>
            <option value="Acrílico">Acrílico</option>
            <option value="Pastel">Pastel</option>
            <option value="Mixta">Técnica Mixta</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Dimensiones */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Dimensiones (cm)
        </label>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <input
              type="number"
              step="0.1"
              {...register("width", { valueAsNumber: true })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Ancho"
            />
          </div>
          <div>
            <input
              type="number"
              step="0.1"
              {...register("height", { valueAsNumber: true })}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Alto"
            />
          </div>
        </div>
      </div>

      {/* Año */}
      <div className="max-w-[200px]">
        <label htmlFor="year" className="mb-2 block text-sm font-medium text-foreground">
          Año de creación
        </label>
        <input
          id="year"
          type="number"
          {...register("year", { valueAsNumber: true })}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={`Ej: ${new Date().getFullYear()}`}
        />
        {errors.year && (
          <p className="mt-1 text-sm text-destructive">{errors.year.message}</p>
        )}
      </div>

      {/* Error general */}
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {painting ? "Guardar Cambios" : "Crear Pintura"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
