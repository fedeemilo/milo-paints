import { cloudinary, CLOUDINARY_FOLDERS } from "./config";

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Sube una imagen a Cloudinary
 * @param file - Buffer o base64 de la imagen
 * @param filename - Nombre del archivo (sin extensión)
 */
export async function uploadPaintingImage(
  file: Buffer | string,
  filename: string
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/jpeg;base64,${file.toString("base64")}`,
    {
      folder: CLOUDINARY_FOLDERS.PAINTINGS,
      public_id: filename,
      overwrite: true,
      transformation: [
        { quality: "auto", fetch_format: "auto" },
      ],
    }
  );

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Sube un código QR a Cloudinary
 */
export async function uploadQRCode(
  qrBuffer: Buffer,
  paintingId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(
    `data:image/png;base64,${qrBuffer.toString("base64")}`,
    {
      folder: CLOUDINARY_FOLDERS.QR_CODES,
      public_id: `qr-${paintingId}`,
      overwrite: true,
    }
  );

  return result.secure_url;
}

/**
 * Public ID del QR en Cloudinary para una pintura.
 * Debe coincidir con uploadQRCode (folder + public_id).
 */
export function getQRPublicId(paintingId: string): string {
  return `${CLOUDINARY_FOLDERS.QR_CODES}/qr-${paintingId}`;
}

/**
 * Elimina una imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Elimina el QR asociado a una pintura (si existe).
 */
export async function deleteQRCode(paintingId: string): Promise<void> {
  await deleteImage(getQRPublicId(paintingId));
}

/**
 * Genera URL de thumbnail optimizado
 */
export function getThumbnailUrl(publicId: string, width = 400): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width, crop: "scale" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
}

/**
 * Genera URL de imagen optimizada para galería
 */
export function getOptimizedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
  });
}
