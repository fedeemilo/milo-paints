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
  return db.collection<PaintingDocument>("paintings");
}
