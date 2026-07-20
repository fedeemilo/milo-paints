export const SESSION_COOKIE_NAME = "milo-admin-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 60; // 60 días
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "Falta SESSION_SECRET (o ADMIN_PASSWORD como fallback) para firmar sesiones"
    );
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(signature);
}

async function verifySignature(
  payload: string,
  signatureB64: string,
  secret: string
): Promise<boolean> {
  const key = await importHmacKey(secret);
  const signature = fromBase64Url(signatureB64);
  return crypto.subtle.verify(
    "HMAC",
    key,
    signature.buffer.slice(
      signature.byteOffset,
      signature.byteOffset + signature.byteLength
    ) as ArrayBuffer,
    new TextEncoder().encode(payload)
  );
}

/** Token firmado: base64url(payload).firma — payload = "admin:<expiresAtMs>" */
export async function createSessionToken(now = Date.now()): Promise<string> {
  const expiresAt = now + SESSION_MAX_AGE_MS;
  const payload = `admin:${expiresAt}`;
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const signature = await signPayload(payload, getSessionSecret());
  return `${payloadB64}.${signature}`;
}

/** Valida firma + expiración. Seguro para Edge (middleware) y Node (API). */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return false;

  try {
    const payload = new TextDecoder().decode(fromBase64Url(payloadB64));
    const match = /^admin:(\d+)$/.exec(payload);
    if (!match) return false;

    const expiresAt = Number(match[1]);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return false;
    }

    return verifySignature(payload, signature, getSessionSecret());
  } catch {
    return false;
  }
}
