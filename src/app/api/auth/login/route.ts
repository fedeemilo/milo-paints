import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth/session";
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
  getLoginRateLimitKey,
  recordFailedLogin,
} from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const rateKey = getLoginRateLimitKey(request);
    const rate = checkLoginRateLimit(rateKey);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Demasiados intentos. Probá de nuevo más tarde.",
        },
        {
          status: 429,
          headers: rate.retryAfterSec
            ? { "Retry-After": String(rate.retryAfterSec) }
            : undefined,
        }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Contraseña requerida" },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      recordFailedLogin(rateKey);
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    clearLoginRateLimit(rateKey);
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
