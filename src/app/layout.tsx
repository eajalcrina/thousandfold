import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CursorProvider from "@/components/ui/CursorProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "ThousandFold — Branding Regenerativo para América Latina",
    template: "%s | ThousandFold",
  },
  description:
    "Iniciativa colectiva para construir marcas regenerativas en América Latina. Framework Regen Brands, diagnóstico gratuito y el primer playbook táctico de branding regenerativo para ALC.",
  keywords: [
    "branding regenerativo",
    "marcas regenerativas",
    "América Latina",
    "regeneración",
    "impact branding",
    "Regen Brands",
    "ThousandFold",
    "branding sostenible",
    "marcas de impacto",
    "biodiversidad",
    "ALC",
    "Latinoamérica",
  ],
  authors: [
    { name: "Eddie Ajalcriña", url: "https://www.linkedin.com/in/eddieajalcrina/" },
    { name: "Lorenzo Ortiz", url: "https://www.linkedin.com/in/lorenzoortiz/" },
  ],
  creator: "ThousandFold",
  publisher: "ThousandFold",
  metadataBase: new URL("https://thousandfold.vercel.app"),
  openGraph: {
    title: "ThousandFold — Branding Regenerativo para América Latina",
    description:
      "Framework Regen Brands, diagnóstico gratuito y el primer playbook táctico de branding regenerativo diseñado para el contexto latinoamericano.",
    url: "https://thousandfold.vercel.app",
    siteName: "ThousandFold",
    locale: "es_419",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThousandFold — Branding Regenerativo para ALC",
    description:
      "Construye marcas que regeneren la biodiversidad, comunidades y cultura de América Latina.",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://thousandfold.vercel.app" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <CursorProvider />
        {children}
      </body>
    </html>
  );
}
