"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FEATURE_IMAGE } from "@/lib/site-images";
import { Magnetic } from "@/components/motion/magnetic";

/** Secção full-bleed com imagem em parallax subtil ao fazer scroll — dá profundidade à página. */
export default function FeatureEditorial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-charcoal-900 py-24 sm:py-32">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src={FEATURE_IMAGE.src}
          alt={FEATURE_IMAGE.alt}
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-50"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-charcoal-900/30" />

      <div className="container-site relative text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
          A tua nova rotina de beleza
        </span>
        <h2 className="heading-display mx-auto mt-5 max-w-2xl text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          Detalhe, técnica e arte em cada unha
        </h2>
        <p className="mx-auto mt-6 max-w-md text-rose-50/80">
          Da manicure clássica à nail art mais elaborada — feita para durar, feita para te fazer
          sentir bem.
        </p>
        <Magnetic>
          <Link
            href="/servicos"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-charcoal-900 shadow-soft_lg transition-transform hover:scale-105"
          >
            Explorar serviços
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
