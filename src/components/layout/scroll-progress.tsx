"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";

/** Barra fina no topo que acompanha o progresso de scroll da página. */
export default function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.2 });

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-rose-500"
    />
  );
}
