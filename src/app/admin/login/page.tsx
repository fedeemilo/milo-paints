"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palette, Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Palette className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Milo Paints
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Panel de Administración
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Link a home */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/galeria" className="hover:text-foreground">
            ← Volver a la galería
          </a>
        </p>
      </div>
    </div>
  );
}
