"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  /** Segundos para uma volta completa — menor = mais rápido. */
  duration?: number;
  className?: string;
  reverse?: boolean;
}

/** Faixa de texto em loop infinito, estilo "editorial ticker". */
export function Marquee({ items, duration = 28, className, reverse = false }: MarqueeProps) {
  const track = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <motion.div
        className="flex w-max shrink-0 items-center"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {track.map((item, i) => (
          <span key={i} className="mx-4 flex items-center gap-4 whitespace-nowrap sm:mx-6">
            <span>{item}</span>
            <span className="text-rose-300">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
