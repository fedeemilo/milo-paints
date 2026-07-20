import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";

/** Defense in depth: 401 si no hay sesión admin válida. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
