"use client";

import { useEffect } from "react";

/**
 * Registra el Service Worker de la PWA (solo cliente + producción).
 */
export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencioso en prod: fallar el SW no debe romper la app
      });
    }
  }, []);

  return null;
}
