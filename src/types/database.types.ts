/**
 * Documento tal como vive en MongoDB.
 * `_id` es ObjectId (auto); `id` es el UUID público usado en URLs/QR.
 */
export interface PaintingDocument {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  year?: number | null;
  category?: string | null;
  image_url: string;
  cloudinary_public_id: string;
  thumbnail_url?: string | null;
  qr_code_url?: string | null;
  sold: boolean;
  sold_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Forma serializada para la app (fechas como ISO string). */
export interface Painting {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  year: number | null;
  category: string | null;
  image_url: string;
  cloudinary_public_id: string;
  thumbnail_url: string | null;
  qr_code_url: string | null;
  sold: boolean;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PaintingInsert = {
  id?: string;
  name: string;
  description?: string | null;
  price?: number | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  year?: number | null;
  category?: string | null;
  image_url: string;
  cloudinary_public_id: string;
  thumbnail_url?: string | null;
  qr_code_url?: string | null;
  sold?: boolean;
  sold_at?: Date | string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
};

export type PaintingUpdate = Partial<
  Omit<PaintingInsert, "id">
> & {
  updated_at?: Date | string;
};
