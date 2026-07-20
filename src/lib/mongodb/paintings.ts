import { randomUUID } from "crypto";
import type {
  Painting,
  PaintingDocument,
  PaintingInsert,
  PaintingUpdate,
} from "@/types/database.types";
import { getPaintingsCollection } from "./client";

function toIso(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** Normaliza un documento Mongo al tipo Painting de la app. */
export function serializePainting(doc: PaintingDocument): Painting {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description ?? null,
    price: doc.price ?? null,
    width: doc.width ?? null,
    height: doc.height ?? null,
    depth: doc.depth ?? null,
    year: doc.year ?? null,
    category: doc.category ?? null,
    image_url: doc.image_url,
    cloudinary_public_id: doc.cloudinary_public_id,
    thumbnail_url: doc.thumbnail_url ?? null,
    qr_code_url: doc.qr_code_url ?? null,
    sold: doc.sold ?? false,
    sold_at: toIso(doc.sold_at ?? null),
    created_at: toIso(doc.created_at) ?? new Date().toISOString(),
    updated_at: toIso(doc.updated_at) ?? new Date().toISOString(),
  };
}

export async function listPaintings(): Promise<Painting[]> {
  const collection = await getPaintingsCollection();
  const docs = await collection
    .find({})
    .sort({ created_at: -1 })
    .toArray();
  return docs.map(serializePainting);
}

export async function listPaintingsPaginated(
  skip: number,
  limit: number
): Promise<{ paintings: Painting[]; total: number }> {
  const collection = await getPaintingsCollection();
  const [docs, total] = await Promise.all([
    collection
      .find({})
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments({}),
  ]);
  return {
    paintings: docs.map(serializePainting),
    total,
  };
}

export async function countPaintings(): Promise<number> {
  const collection = await getPaintingsCollection();
  return collection.countDocuments({});
}

export async function getRecentPaintings(
  limit: number
): Promise<Pick<Painting, "id" | "name" | "image_url" | "created_at">[]> {
  const collection = await getPaintingsCollection();
  const docs = await collection
    .find({})
    .project({ id: 1, name: 1, image_url: 1, created_at: 1 })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    image_url: doc.image_url,
    created_at: toIso(doc.created_at) ?? new Date().toISOString(),
  }));
}

export async function getPaintingById(id: string): Promise<Painting | null> {
  const collection = await getPaintingsCollection();
  const doc = await collection.findOne({ id });
  if (!doc) return null;
  return serializePainting(doc);
}

export async function createPainting(
  data: PaintingInsert
): Promise<Painting> {
  const collection = await getPaintingsCollection();
  const now = new Date();
  const id = data.id ?? randomUUID();

  const doc: PaintingDocument = {
    id,
    name: data.name,
    description: data.description ?? null,
    price: data.price ?? null,
    width: data.width ?? null,
    height: data.height ?? null,
    depth: data.depth ?? null,
    year: data.year ?? null,
    category: data.category ?? null,
    image_url: data.image_url,
    cloudinary_public_id: data.cloudinary_public_id,
    thumbnail_url: data.thumbnail_url ?? null,
    qr_code_url: data.qr_code_url ?? null,
    sold: data.sold ?? false,
    sold_at: data.sold_at ?? null,
    created_at: data.created_at instanceof Date
      ? data.created_at
      : data.created_at
        ? new Date(data.created_at)
        : now,
    updated_at: data.updated_at instanceof Date
      ? data.updated_at
      : data.updated_at
        ? new Date(data.updated_at)
        : now,
  };

  await collection.insertOne(doc);
  return serializePainting(doc);
}

export async function updatePainting(
  id: string,
  data: PaintingUpdate
): Promise<Painting | null> {
  const collection = await getPaintingsCollection();
  const now = new Date();

  const $set: Record<string, unknown> = {
    ...data,
    updated_at: data.updated_at
      ? data.updated_at instanceof Date
        ? data.updated_at
        : new Date(data.updated_at)
      : now,
  };

  // Normalizar sold_at si viene como string ISO
  if ("sold_at" in data) {
    if (data.sold_at == null) {
      $set.sold_at = null;
    } else if (typeof data.sold_at === "string") {
      $set.sold_at = new Date(data.sold_at);
    }
  }

  const result = await collection.findOneAndUpdate(
    { id },
    { $set },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializePainting(result);
}

export async function deletePainting(id: string): Promise<boolean> {
  const collection = await getPaintingsCollection();
  const result = await collection.deleteOne({ id });
  return result.deletedCount === 1;
}

export async function togglePaintingSold(
  id: string
): Promise<{ sold: boolean; sold_at: string | null } | null> {
  const collection = await getPaintingsCollection();
  const current = await collection.findOne(
    { id },
    { projection: { sold: 1 } }
  );

  if (!current) return null;

  const newSold = !current.sold;
  const soldAt = newSold ? new Date() : null;

  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        sold: newSold,
        sold_at: soldAt,
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return {
    sold: result.sold,
    sold_at: toIso(result.sold_at ?? null),
  };
}
