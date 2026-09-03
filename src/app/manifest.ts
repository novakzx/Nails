import type { MetadataRoute } from "next";

// Gera /manifest.webmanifest — permite "Adicionar ao ecrã inicial" (PWA).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nails Von — Nail Design em Almada",
    short_name: "Nails Von",
    description: "Marca o teu horário de manicure, pedicure e nail art em Almada, em menos de um minuto.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F4",
    theme_color: "#A6573F",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "Marcar Horário",
        short_name: "Marcar",
        url: "/marcar",
        description: "Marcar um novo horário",
      },
    ],
  };
}
