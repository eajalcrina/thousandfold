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
    { name: "Eddie Ajalcriña", url: "https://eddieajalcrina.com" },
    { name: "Lorenzo Ortiz", url: "https://www.linkedin.com/in/lorenzoortiz/" },
  ],
  creator: "ThousandFold",
  publisher: "ThousandFold",
  metadataBase: new URL("https://www.thousandfold.la"),
  openGraph: {
    title: "ThousandFold — Branding Regenerativo para América Latina",
    description:
      "Framework Regen Brands, diagnóstico gratuito y el primer playbook táctico de branding regenerativo diseñado para el contexto latinoamericano.",
    url: "https://www.thousandfold.la",
    siteName: "ThousandFold",
    locale: "es_419",
    type: "website",
    images: [{ url: "/og-thousandfold.jpg", width: 1200, height: 630, alt: "Río amazónico al atardecer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThousandFold — Branding Regenerativo para ALC",
    description:
      "Construye marcas que regeneren la biodiversidad, comunidades y cultura de América Latina.",
    images: ["/og-thousandfold.jpg"],
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
  alternates: { canonical: "https://www.thousandfold.la" },
};

// Organización y fundadores. Eddie lleva el @id de eddieajalcrina.com, el mismo que usan
// las webs de Redesign Lab, Bio Business School, Circular Club y Fondo de Impacto.
const ORG_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.thousandfold.la/#organization",
      name: "ThousandFold",
      url: "https://www.thousandfold.la",
      logo: "https://www.thousandfold.la/icon-512.png",
      description: "Estudio de marcas regenerativas para América Latina.",
      areaServed: { "@type": "Place", name: "América Latina" },
      parentOrganization: { "@type": "Organization", "@id": "https://redesignlab.org/#organization", name: "Redesign Lab", url: "https://redesignlab.org" },
      founder: [
        {
          "@type": "Person",
          "@id": "https://eddieajalcrina.com/#person",
          name: "Eddie Ajalcriña",
          url: "https://eddieajalcrina.com",
          image: "https://eddieajalcrina.com/eddie-ajalcrina.jpg",
          jobTitle: "Cofundador de ThousandFold",
          sameAs: ["https://eddieajalcrina.com", "https://www.linkedin.com/in/eddieajalcrina/", "https://eddieajalcrina.substack.com/", "https://biobusinessschool.org/autores/eddie-ajalcrina"],
        },
        { "@type": "Person", name: "Lorenzo Ortiz", sameAs: ["https://www.linkedin.com/in/lorenzoortiz/"] },
      ],
      sameAs: ["https://www.linkedin.com/company/thousandfold-latam"],
    },
    { "@type": "WebSite", "@id": "https://www.thousandfold.la/#website", url: "https://www.thousandfold.la", name: "ThousandFold", inLanguage: "es", publisher: { "@id": "https://www.thousandfold.la/#organization" } },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD).replace(/</g, "\\u003c") }} />
        <CursorProvider />
        {children}
      </body>
    </html>
  );
}
