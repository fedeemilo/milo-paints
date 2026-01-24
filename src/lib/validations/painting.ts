import { z } from "zod";

// Schema para crear una nueva pintura
export const createPaintingSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  description: z
    .string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional()
    .nullable(),
  price: z
    .number()
    .positive("El precio debe ser positivo")
    .optional()
    .nullable(),
  width: z
    .number()
    .positive("El ancho debe ser positivo")
    .optional()
    .nullable(),
  height: z
    .number()
    .positive("El alto debe ser positivo")
    .optional()
    .nullable(),
  depth: z
    .number()
    .positive("La profundidad debe ser positiva")
    .optional()
    .nullable(),
  year: z
    .number()
    .int("El año debe ser un número entero")
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear(), "El año no puede ser futuro")
    .optional()
    .nullable(),
  category: z
    .string()
    .max(100, "La categoría no puede exceder 100 caracteres")
    .optional()
    .nullable(),
});

// Schema para actualizar una pintura
export const updatePaintingSchema = createPaintingSchema.partial();

// Schema para el formulario (incluye imagen)
export const paintingFormSchema = createPaintingSchema.extend({
  image: z.any().optional(), // Manejamos la imagen por separado
});

// Tipos derivados de los schemas
export type CreatePaintingInput = z.infer<typeof createPaintingSchema>;
export type UpdatePaintingInput = z.infer<typeof updatePaintingSchema>;
export type PaintingFormInput = z.infer<typeof paintingFormSchema>;
