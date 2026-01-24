import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Cliente con permisos de admin (service role)
// SOLO usar en el servidor, nunca exponer al cliente
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
