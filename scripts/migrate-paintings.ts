/**
 * Script de migración de pinturas desde backup JSON
 * 
 * Uso:
 *   npx tsx scripts/migrate-paintings.ts --dry      # Solo loguea, no ejecuta
 *   npx tsx scripts/migrate-paintings.ts            # Ejecuta la migración
 *   npx tsx scripts/migrate-paintings.ts --test     # Testea el parseo de paintingType
 * 
 * Requiere: npm install -D tsx dotenv
 */

// Cargar variables de entorno desde .env.local
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";

// ============ CONFIGURACIÓN ============

const BACKUP_FILE = path.join(__dirname, "../paintings_backup.json");
const DOWNLOAD_DIR = path.join(__dirname, "../temp-images");
const DRY_RUN = process.argv.includes("--dry");

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = "milo-paints/img-paints";
const QR_FOLDER = "milo-paints/qrs-paints";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============ TIPOS ============

interface BackupPainting {
  _id: string;
  src: string;
  title: string;
  paintingType: string;
  price: number;
  __v: number;
}

interface ParsedPaintingType {
  description: string;
  width: number | null;
  height: number | null;
  category: string;
}

// ============ HELPERS ============

/**
 * Parsea el paintingType para extraer descripción, dimensiones y categoría
 * 
 * Ejemplos:
 * - "Acuarela" -> { description: "Acuarela", width: null, height: null, category: "Acuarela" }
 * - "Óleo sobre lienzo 70x60" -> { description: "Óleo sobre lienzo", width: 70, height: 60, category: "Óleo" }
 * - "Óleo sobre lienzo (90cm x 70cm)" -> { description: "Óleo sobre lienzo", width: 90, height: 70, category: "Óleo" }
 * - "Acuarela sobre papel Canson 300gr (35cm x 25 cm)" -> { description: "Acuarela sobre papel Canson 300gr", width: 35, height: 25, category: "Acuarela" }
 */
function parsePaintingType(paintingType: string): ParsedPaintingType {
  let description = paintingType;
  let width: number | null = null;
  let height: number | null = null;

  // Determinar categoría basada en el inicio del texto
  let category = "Otro";
  const lowerType = paintingType.toLowerCase();
  if (lowerType.startsWith("óleo") || lowerType.startsWith("oleo")) {
    category = "Óleo";
  } else if (lowerType.startsWith("acuarela")) {
    category = "Acuarela";
  }

  // Patrón 1: Dimensiones en paréntesis (90cm x 70cm) o (1.20m x 1m)
  const parenMatch = paintingType.match(/\((\d+(?:\.\d+)?)\s*(cm|m)?\s*x\s*(\d+(?:\.\d+)?)\s*(cm|m)?\)/i);
  if (parenMatch) {
    let w = parseFloat(parenMatch[1]);
    let h = parseFloat(parenMatch[3]);
    const unit1 = parenMatch[2]?.toLowerCase();
    const unit2 = parenMatch[4]?.toLowerCase();
    
    // Convertir metros a cm
    if (unit1 === "m") w = w * 100;
    if (unit2 === "m") h = h * 100;
    
    width = w;
    height = h;
    // Remover las dimensiones de la descripción
    description = paintingType.replace(/\s*\(\d+(?:\.\d+)?\s*(?:cm|m)?\s*x\s*\d+(?:\.\d+)?\s*(?:cm|m)?\)/, "").trim();
    return { description, width, height, category };
  }

  // Patrón 2: Dimensiones al final sin paréntesis (50x1.20, 70x60)
  const endMatch = paintingType.match(/\s+(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*$/i);
  if (endMatch) {
    let w = parseFloat(endMatch[1]);
    let h = parseFloat(endMatch[2]);
    
    // Si uno es < 10 y el otro > 10, probablemente es metros
    // Ej: 50x1.20 significa 50cm x 120cm
    if (h < 10 && w > 10) {
      h = h * 100; // Convertir metros a cm
    }
    if (w < 10 && h > 10) {
      w = w * 100;
    }
    
    width = w;
    height = h;
    description = paintingType.replace(/\s+\d+(?:\.\d+)?\s*x\s*\d+(?:\.\d+)?\s*$/, "").trim();
    return { description, width, height, category };
  }

  return { description, width, height, category };
}

/**
 * Slugifica un string para usarlo como nombre de archivo
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Descarga una imagen desde URL
 */
async function downloadImage(url: string, filename: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }
  
  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Crear directorio si no existe
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }
  
  const filepath = path.join(DOWNLOAD_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  
  return filepath;
}

/**
 * Sube imagen a Cloudinary
 */
async function uploadToCloudinary(filepath: string, publicId: string): Promise<{ url: string; public_id: string }> {
  const result = await cloudinary.uploader.upload(filepath, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    transformation: [
      { quality: "auto:good" },
      { fetch_format: "auto" },
    ],
  });
  
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

/**
 * Genera URL de thumbnail de Cloudinary
 */
function getThumbnailUrl(publicId: string, width: number = 400): string {
  return cloudinary.url(publicId, {
    width,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });
}

/**
 * Sube QR a Cloudinary
 */
async function uploadQRCode(qrBuffer: Buffer, paintingId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: QR_FOLDER,
        public_id: `qr-${paintingId}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    uploadStream.end(qrBuffer);
  });
}

/**
 * Genera un buffer QR usando la librería qrcode
 */
async function generateQRBuffer(url: string): Promise<Buffer> {
  const QRCode = await import("qrcode");
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    type: "png",
    width: 512,
    margin: 2,
  });
}

// ============ MIGRACIÓN ============

async function migratePaintings() {
  console.log("\n" + "=".repeat(60));
  console.log(DRY_RUN ? "🔍 MODO DRY RUN - No se ejecutarán cambios" : "🚀 EJECUTANDO MIGRACIÓN");
  console.log("=".repeat(60) + "\n");

  // Leer archivo de backup
  const backupData: BackupPainting[] = JSON.parse(fs.readFileSync(BACKUP_FILE, "utf-8"));
  console.log(`📁 Encontradas ${backupData.length} pinturas en el backup\n`);

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (let i = 0; i < backupData.length; i++) {
    const painting = backupData[i];
    const num = `[${i + 1}/${backupData.length}]`;

    console.log(`${num} Procesando: "${painting.title}"`);
    
    // Parsear paintingType
    const parsed = parsePaintingType(painting.paintingType);
    
    console.log(`    📝 Original: "${painting.paintingType}"`);
    console.log(`    📋 Descripción: "${parsed.description}"`);
    console.log(`    📐 Dimensiones: ${parsed.width ?? "?"} x ${parsed.height ?? "?"} cm`);
    console.log(`    🏷️  Categoría: ${parsed.category}`);
    console.log(`    💰 Precio: $${painting.price}`);
    console.log(`    🖼️  URL origen: ${painting.src}`);

    if (DRY_RUN) {
      console.log(`    ✅ [DRY] Se procesaría correctamente\n`);
      results.success++;
      continue;
    }

    try {
      // 1. Descargar imagen
      const slug = slugify(painting.title);
      const extension = painting.src.split(".").pop() || "jpg";
      const filename = `${slug}-${Date.now()}.${extension}`;
      
      console.log(`    ⬇️  Descargando imagen...`);
      const localPath = await downloadImage(painting.src, filename);
      
      // 2. Subir a Cloudinary
      console.log(`    ☁️  Subiendo a Cloudinary...`);
      const cloudinaryResult = await uploadToCloudinary(localPath, slug + "-" + Date.now());
      const thumbnailUrl = getThumbnailUrl(cloudinaryResult.public_id);
      
      // 3. Crear registro en Supabase
      console.log(`    💾 Guardando en base de datos...`);
      const { data: newPainting, error } = await supabase
        .from("paintings")
        .insert({
          name: painting.title,
          description: parsed.description,
          price: painting.price,
          width: parsed.width,
          height: parsed.height,
          category: parsed.category,
          image_url: cloudinaryResult.url,
          cloudinary_public_id: cloudinaryResult.public_id,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Generar y subir QR
      console.log(`    📱 Generando código QR...`);
      const qrUrl = `${APP_URL}/qr/${newPainting.id}`;
      const qrBuffer = await generateQRBuffer(qrUrl);
      const qrCodeUrl = await uploadQRCode(qrBuffer, newPainting.id);
      
      // 5. Actualizar con URL del QR
      await supabase
        .from("paintings")
        .update({ qr_code_url: qrCodeUrl })
        .eq("id", newPainting.id);

      // 6. Limpiar archivo temporal
      fs.unlinkSync(localPath);

      console.log(`    ✅ Migrada exitosamente (ID: ${newPainting.id})\n`);
      results.success++;
      
      // Pequeña pausa para no saturar APIs
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log(`    ❌ Error: ${errorMsg}\n`);
      results.failed++;
      results.errors.push(`${painting.title}: ${errorMsg}`);
    }
  }

  // Resumen final
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESUMEN DE MIGRACIÓN");
  console.log("=".repeat(60));
  console.log(`✅ Exitosas: ${results.success}`);
  console.log(`❌ Fallidas: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log("\n🔴 Errores:");
    results.errors.forEach(e => console.log(`   - ${e}`));
  }

  if (DRY_RUN) {
    console.log("\n💡 Ejecutá sin --dry para aplicar los cambios");
  }

  // Limpiar directorio temporal si está vacío
  if (fs.existsSync(DOWNLOAD_DIR)) {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    if (files.length === 0) {
      fs.rmdirSync(DOWNLOAD_DIR);
    }
  }
}

// ============ TEST DE PARSEO ============

function testParsing() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST DE PARSEO DE paintingType");
  console.log("=".repeat(60) + "\n");

  // Leer archivo de backup
  const backupData: BackupPainting[] = JSON.parse(fs.readFileSync(BACKUP_FILE, "utf-8"));
  
  // Agrupar por tipo de parseo para análisis
  const results: { original: string; parsed: ParsedPaintingType }[] = [];
  
  for (const painting of backupData) {
    const parsed = parsePaintingType(painting.paintingType);
    results.push({ original: painting.paintingType, parsed });
  }

  // Mostrar resultados
  console.log("| Original | Descripción | Ancho | Alto | Categoría |");
  console.log("|----------|-------------|-------|------|-----------|");
  
  for (const { original, parsed } of results) {
    const w = parsed.width !== null ? `${parsed.width}` : "-";
    const h = parsed.height !== null ? `${parsed.height}` : "-";
    console.log(`| ${original.substring(0, 50).padEnd(50)} | ${parsed.description.substring(0, 30).padEnd(30)} | ${w.padStart(5)} | ${h.padStart(4)} | ${parsed.category.padEnd(9)} |`);
  }

  // Estadísticas
  const withDimensions = results.filter(r => r.parsed.width !== null).length;
  const withoutDimensions = results.length - withDimensions;
  
  console.log("\n📊 Estadísticas:");
  console.log(`   Total: ${results.length}`);
  console.log(`   Con dimensiones: ${withDimensions}`);
  console.log(`   Sin dimensiones: ${withoutDimensions}`);
  
  // Categorías
  const categories = results.reduce((acc, r) => {
    acc[r.parsed.category] = (acc[r.parsed.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n🏷️  Por categoría:");
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
}

// ============ EJECUTAR ============

const TEST_MODE = process.argv.includes("--test");

if (TEST_MODE) {
  testParsing();
  process.exit(0);
}

// Verificar variables de entorno
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0 && !DRY_RUN) {
  console.error("❌ Faltan variables de entorno:");
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error("\nAsegurate de tener el archivo .env.local configurado");
  process.exit(1);
}

migratePaintings().catch(console.error);
