import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "milo-admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Verifica si la contraseña es correcta
 */
export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

/**
 * Crea una sesión de admin
 */
export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  
  // Token simple (en producción usar JWT o similar)
  const sessionToken = Buffer.from(`admin:${Date.now()}`).toString("base64");
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Elimina la sesión de admin
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifica si hay una sesión activa
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session?.value;
}
