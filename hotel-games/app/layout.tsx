import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EL CHIVATAZO · Expedientes Secretos",
  description: "Juego interactivo de deducción social para fiestas y amigas. Hasta 7 jugadoras con códigos QR individuales, cronómetro, 10 casos y estética neón.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "El Chivatazo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080312",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#080312] text-[#f3f0fa] selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
