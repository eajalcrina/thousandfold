import type { MetadataRoute } from "next";

const BASE = "https://www.thousandfold.la";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/diagnostico"].map((ruta) => ({ url: BASE + ruta, lastModified: new Date("2026-10-24") }));
}
