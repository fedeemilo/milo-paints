import { MongoClient, Db, Collection } from "mongodb";
import type { PaintingDocument } from "@/types/database.types";

const dbName = process.env.MONGODB_DB_NAME || "milo-paints";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  // En desarrollo, reutilizar vía global (hot-reload de Next.js)
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  // En producción, singleton a nivel de módulo
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export async function getPaintingsCollection(): Promise<
  Collection<PaintingDocument>
> {
  const db = await getDb();
  const collection = db.collection<PaintingDocument>("paintings");
  await ensurePaintingsIndexes(collection);
  return collection;
}

let indexesReady: Promise<void> | undefined;

/** Índices: id único (UUID público) + created_at para listados ordenados. */
async function ensurePaintingsIndexes(
  collection: Collection<PaintingDocument>
): Promise<void> {
  if (!indexesReady) {
    indexesReady = (async () => {
      await collection.createIndexes([
        { key: { id: 1 }, unique: true, name: "paintings_id_unique" },
        { key: { created_at: -1 }, name: "paintings_created_at_desc" },
      ]);
    })().catch((error) => {
      // Permitir reintento en el próximo request si falló
      indexesReady = undefined;
      throw error;
    });
  }
  await indexesReady;
}
