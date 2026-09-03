import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nailsvon.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/servicos", "/marcar", "/sobre", "/contactos"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/marcar" ? 0.9 : 0.7,
  }));
}
