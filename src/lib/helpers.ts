/**
 * Funciones helpers para la aplicación
 */

/**
 * Formatea un precio en formato de moneda
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Consultar";
  
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatea las dimensiones de una pintura
 */
export function formatDimensions(
  width: number | null | undefined,
  height: number | null | undefined,
  depth?: number | null | undefined
): string {
  if (!width && !height) return "";
  
  const parts = [];
  if (width) parts.push(`${width}`);
  if (height) parts.push(`${height}`);
  if (depth) parts.push(`${depth}`);
  
  return parts.join(" × ") + " cm";
}

/**
 * Convierte un nombre de archivo a un nombre legible
 * Ej: "acuarela_el_muelle" -> "El Muelle"
 */
export function fileNameToTitle(filename: string): string {
  // Remover extensión si existe
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Remover prefijos comunes
  const withoutPrefix = nameWithoutExt
    .replace(/^acuarela_/, "")
    .replace(/^bodegon_/, "Bodegón ")
    .replace(/^paisaje_/, "Paisaje ");
  
  // Convertir snake_case a Title Case
  return withoutPrefix
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}

/**
 * Extrae la categoría del nombre del archivo
 */
export function extractCategory(filename: string): string {
  const lower = filename.toLowerCase();
  
  if (lower.includes("acuarela")) return "Acuarela";
  if (lower.includes("bodegon") || lower.includes("bodegón")) return "Bodegón";
  if (lower.includes("paisaje")) return "Paisaje";
  if (lower.includes("cuadro")) return "Óleo";
  
  return "Otro";
}

/**
 * Genera un slug a partir de un texto
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Espera un tiempo determinado (útil para scripts)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
