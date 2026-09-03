"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HERO_IMAGE } from "@/lib/site-images";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand-100">
      {/* Blobs decorativos subtis, sem interferir na leitura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-rose-100/60 blur-3xl"
      />

      <div className="container-site relative grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.span
            variants={item}
            className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600"
          >
            Almada · Setúbal
          </motion.span>
          <motion.h1 variants={item} className="heading-display mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Unhas perfeitas, <span className="text-rose-500">sem complicações</span>
          </motion.h1>
          <motion.p variants={item} className="mx-auto mt-5 max-w-md text-base text-charcoal-500 sm:text-lg lg:mx-0">
            Manicure, pedicure e nail art personalizada no estúdio Nails Von. Marca o teu horário
            online em menos de um minuto — sem WhatsApp, sem espera.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link href="/marcar" className="btn-primary w-full sm:w-auto">
              Marcar Horário
            </Link>
            <Link href="/servicos" className="btn-secondary w-full sm:w-auto">
              Ver Serviços
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-soft_lg lg:max-w-none"
        >
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
