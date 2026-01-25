import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Fuente elegante para títulos (estilo artístico)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Fuente limpia para cuerpo
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Milo Paints | Galería de Arte",
  description:
    "Galería de pinturas y obras de arte. Acuarelas, óleos y más.",
  keywords: ["arte", "pinturas", "galería", "acuarelas", "óleos"],
  authors: [{ name: "Milo" }],
  openGraph: {
    title: "Milo Paints | Galería de Arte",
    description: "Galería de pinturas y obras de arte",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body
        className={`${playfair.variable} ${inter.variable} overflow-x-hidden font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
