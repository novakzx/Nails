"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, X, Sparkles } from "lucide-react";

const STORAGE_KEY = "nails-von-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // seguro ignorar
    }

    if (isStandalone()) return;
    setDismissed(false);

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS Safari não dispara beforeinstallprompt — mostramos instruções manuais.
    const iosTimer = setTimeout(() => {
      if (isIos() && !isStandalone()) setShowIosHint(true);
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(iosTimer);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // seguro ignorar
    }
    setDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  const visible = !dismissed && (deferredPrompt || showIosHint);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-xs"
        >
          <div className="card relative flex items-start gap-3 border-sand-300 bg-white p-4 shadow-soft_lg">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Fechar"
              className="absolute right-2 top-2 rounded-full p-1 text-charcoal-300 hover:bg-sand-100 hover:text-charcoal-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100">
              <Sparkles className="h-4.5 w-4.5 text-rose-500" aria-hidden="true" />
            </div>

            <div className="pr-4">
              <p className="text-sm font-semibold text-charcoal-900">Instala a Nails Von</p>
              {deferredPrompt ? (
                <>
                  <p className="mt-1 text-xs text-charcoal-500">
                    Adiciona ao ecrã inicial para marcares mais rápido.
                  </p>
                  <button type="button" onClick={install} className="btn-primary mt-3 !px-3 !py-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Instalar
                  </button>
                </>
              ) : (
                <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-charcoal-500">
                  Toca em <Share className="h-3.5 w-3.5 inline" aria-hidden="true" /> e depois em
                  &ldquo;Adicionar ao ecrã principal&rdquo;.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
