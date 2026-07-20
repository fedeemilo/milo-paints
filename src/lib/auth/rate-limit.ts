/**
 * Rate limit en memoria para login admin.
 * En serverless (Vercel) es best-effort por instancia; alcanza para
 * frenar fuerza bruta casual en una app de un solo admin.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 10;

type Bucket = {
  count: number;
  resetAt: number;
};

const attemptsByKey = new Map<string, Bucket>();

function pruneExpired(now: number) {
  for (const [key, bucket] of attemptsByKey) {
    if (bucket.resetAt <= now) {
      attemptsByKey.delete(key);
    }
  }
}

export function getLoginRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  pruneExpired(now);

  const bucket = attemptsByKey.get(key);
  if (!bucket) {
    return { allowed: true };
  }

  if (bucket.resetAt <= now) {
    attemptsByKey.delete(key);
    return { allowed: true };
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { allowed: true };
}

export function recordFailedLogin(key: string): void {
  const now = Date.now();
  const existing = attemptsByKey.get(key);

  if (!existing || existing.resetAt <= now) {
    attemptsByKey.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
}

export function clearLoginRateLimit(key: string): void {
  attemptsByKey.delete(key);
}
