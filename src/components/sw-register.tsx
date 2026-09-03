"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/push/subscribe";

/** Regista o service worker assim que a app carrega (necessário para push e PWA). */
export default function SwRegister() {
  useEffect(() => {
    registerServiceWorker().catch(() => {
      // Sem suporte (browser antigo, contexto não seguro, etc.) — seguro ignorar.
    });
  }, []);

  return null;
}
