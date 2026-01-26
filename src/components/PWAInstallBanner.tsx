"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

/**
 * Interfaz para el evento beforeinstallprompt
 * Este evento es específico de PWA y no está en el estándar TypeScript
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Banner que invita al usuario a instalar la PWA
 * Solo se muestra si:
 * - La app no está instalada
 * - El usuario no ha rechazado el banner antes
 * - El navegador soporta instalación de PWA
 */
export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Verificar si el usuario ya rechazó el banner
    const dismissed = localStorage.getItem("pwa-banner-dismissed");
    if (dismissed === "true") return;

    // Verificar si ya está instalado
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (isStandalone) return;

    // Escuchar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt nativo de instalación
    deferredPrompt.prompt();

    // Esperar la decisión del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("Usuario aceptó instalar la PWA");
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-md">
      <div className="rounded-lg border border-amber-200 bg-linear-to-br from-amber-50 to-white p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Download className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-gray-900">
              Instalar MiloPaints
            </h3>
            <p className="mb-3 text-sm text-gray-600">
              Accede más rápido a la galería instalando nuestra app
            </p>

            <button
              onClick={handleInstall}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              Instalar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
