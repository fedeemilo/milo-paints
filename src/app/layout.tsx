import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";
// import { PWAInstallBanner } from "@/components/PWAInstallBanner"; // Descomentar para mostrar banner de instalación

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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MiloPaints",
  },
  openGraph: {
    title: "Milo Paints | Galería de Arte",
    description: "Galería de pinturas y obras de arte",
    type: "website",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <head>
        <meta name="theme-color" content="#3e3434" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MiloPaints" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} overflow-x-hidden font-sans antialiased`}
      >
        <PWARegister />
        {/* <PWAInstallBanner /> */} {/* Descomentar para mostrar banner de instalación */}
        {children}
      </body>
    </html>
  );
}
