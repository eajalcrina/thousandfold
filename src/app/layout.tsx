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
  title: "ThousandFold — Impact Branding Regenerativo para América Latina",
  description:
    "Iniciativa colectiva de branding regenerativo. Framework, diagnóstico gratuito y el primer playbook de marcas regenerativas para ALC.",
  openGraph: {
    title: "ThousandFold — Impact Branding Regenerativo",
    description:
      "Framework, diagnóstico gratuito y el primer playbook de marcas regenerativas para América Latina.",
    url: "https://thousandfold.la",
    siteName: "ThousandFold",
    locale: "es_419",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://thousandfold.la" },
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
