"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "nails-von-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      // localStorage indisponível (modo privado, etc.) — não mostrar o banner.
    }
  }, []);

  function respond(choice: "aceitar" | "recusar") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // seguro ignorar
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          role="dialog"
          aria-label="Consentimento de cookies"
          className="fixed inset-x-0 bottom-0 z-50 p-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:p-0"
        >
          <div className="card flex flex-col gap-3 border-sand-300 bg-white p-4 shadow-soft_lg sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100">
                <Cookie className="h-4.5 w-4.5 text-rose-500" aria-hidden="true" />
              </div>
              <p className="text-sm text-charcoal-700">
                Usamos apenas cookies essenciais ao funcionamento do site (sem publicidade nem
                rastreio de terceiros).
              </p>
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col">
              <button type="button" onClick={() => respond("aceitar")} className="btn-primary !px-4 !py-2 text-xs">
                Aceitar
              </button>
              <button
                type="button"
                onClick={() => respond("recusar")}
                className="btn-secondary !px-4 !py-2 text-xs"
              >
                Recusar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
