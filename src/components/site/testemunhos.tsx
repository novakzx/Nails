"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SPOTLIGHT_IMAGE } from "@/lib/site-images";
import { Reveal } from "@/components/motion/reveal";

// Dados de exemplo/placeholder — substituir por avaliações reais de clientes
// (ex.: importadas do Google Business Profile ou Instagram).
const TESTEMUNHOS = [
  {
    nome: "Carolina M.",
    texto:
      "Fiquei impressionada com o cuidado ao detalhe. O verniz semipermanente durou mesmo três semanas sem lascar!",
    rating: 5,
  },
  {
    nome: "Beatriz S.",
    texto: "Marcar horário online foi super rápido. Chegar e ser atendida à hora marcada faz toda a diferença.",
    rating: 5,
  },
  {
    nome: "Inês R.",
    texto: "A nail art ficou exatamente como pedi, com muito bom gosto e detalhe. Recomendo de olhos fechados.",
    rating: 5,
  },
];

export default function Testemunhos() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTEMUNHOS.length), 5500);
    return () => clearInterval(id);
  }, []);

  const current = TESTEMUNHOS[active];

  return (
    <section className="relative isolate overflow-hidden bg-charcoal-900 py-20 sm:py-28">
      <Image
        src={SPOTLIGHT_IMAGE.src}
        alt={SPOTLIGHT_IMAGE.alt}
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal-900 via-charcoal-900/85 to-charcoal-900" />

      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">03 · Clientes</span>
          <h2 className="heading-display mt-3 text-3xl text-white sm:text-4xl">O que dizem as clientes</h2>
        </Reveal>

        <div className="relative mx-auto mt-12 max-w-2xl text-center sm:mt-16">
          <Quote className="mx-auto h-9 w-9 text-rose-400/50" aria-hidden="true" />

          <AnimatePresence>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-serif text-2xl leading-snug text-white sm:text-3xl">
                “{current.texto}”
              </blockquote>
              <div className="mt-5 flex items-center justify-center gap-0.5">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-rose-400 text-rose-400" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-rose-200">{current.nome}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {TESTEMUNHOS.map((t, i) => (
              <button
                key={t.nome}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver testemunho de ${t.nome}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-rose-400" : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
