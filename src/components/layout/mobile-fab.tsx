"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";

/** Botão flutuante de marcação, só em ecrãs pequenos — reforça a sensação de "app". */
export default function MobileFab() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/marcar") return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
      className="fixed bottom-4 right-4 z-30 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href="/marcar"
        className="flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3.5 text-sm font-semibold text-white shadow-soft_lg transition-transform active:scale-95"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Marcar
      </Link>
    </motion.div>
  );
}
