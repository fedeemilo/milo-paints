import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary para uso en el servidor
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Carpetas en Cloudinary
export const CLOUDINARY_FOLDERS = {
  PAINTINGS: "milo-paints/img-paints",
  QR_CODES: "milo-paints/qrs-paints",
} as const;
