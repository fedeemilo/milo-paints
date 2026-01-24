"use client";

import QRCode from "react-qr-code";
import { Download } from "lucide-react";

interface QRCodeDisplayProps {
  url: string;
  paintingName: string;
}

export function QRCodeDisplay({ url, paintingName }: QRCodeDisplayProps) {
  const downloadQR = (format: "png" | "svg") => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const filename = `qr-${paintingName.toLowerCase().replace(/\s+/g, "-")}`;

    if (format === "svg") {
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename}.svg`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } else {
      // Convertir SVG a PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = 1024;
        canvas.height = 1024;
        
        // Fondo blanco
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${filename}.png`;
        link.click();
      };

      img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="flex justify-center rounded-lg bg-white p-6">
        <QRCode
          id="qr-code-svg"
          value={url}
          size={256}
          level="H"
          bgColor="#ffffff"
          fgColor="#1a1a1a"
        />
      </div>

      {/* Botones de descarga */}
      <div className="flex gap-3">
        <button
          onClick={() => downloadQR("png")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Descargar PNG
        </button>
        <button
          onClick={() => downloadQR("svg")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          Descargar SVG
        </button>
      </div>
    </div>
  );
}
