import QRCode from "qrcode";

export interface QRGenerateOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

const DEFAULT_OPTIONS: QRGenerateOptions = {
  width: 300,
  margin: 2,
  color: {
    dark: "#1a1a1a",
    light: "#ffffff",
  },
};

/**
 * Genera un código QR como buffer PNG
 */
export async function generateQRBuffer(
  url: string,
  options: QRGenerateOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const buffer = await QRCode.toBuffer(url, {
    width: opts.width,
    margin: opts.margin,
    color: opts.color,
    type: "png",
  });

  return buffer;
}

/**
 * Genera un código QR como Data URL (para preview)
 */
export async function generateQRDataURL(
  url: string,
  options: QRGenerateOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const dataUrl = await QRCode.toDataURL(url, {
    width: opts.width,
    margin: opts.margin,
    color: opts.color,
  });

  return dataUrl;
}

/**
 * Genera un código QR como SVG string
 */
export async function generateQRSVG(
  url: string,
  options: QRGenerateOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const svg = await QRCode.toString(url, {
    type: "svg",
    width: opts.width,
    margin: opts.margin,
    color: opts.color,
  });

  return svg;
}

/**
 * Genera la URL pública de una pintura para el QR
 */
export function getPaintingQRUrl(paintingId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/qr/${paintingId}`;
}
