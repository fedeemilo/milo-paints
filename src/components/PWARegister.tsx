"use client";

import { useEffect } from "react";

/**
 * Componente para registrar el Service Worker de la PWA
 * Se ejecuta solo en el cliente y en producción
 */
export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registrado con éxito:",
            registration.scope
          );
        })
        .catch((error) => {
          console.log("Error al registrar Service Worker:", error);
        });
    }
  }, []);

  return null;
}
