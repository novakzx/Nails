import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export default function CtaFinal() {
  return (
    <section className="container-site py-14 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl2 bg-rose-500 px-6 py-14 text-center shadow-soft_lg sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative font-serif text-3xl font-semibold text-white sm:text-4xl">
            Pronta para umas unhas novas?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-rose-50">
            Marca o teu horário online agora — leva menos de um minuto.
          </p>
          <Link
            href="/marcar"
            className="relative mt-7 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-rose-600 shadow-soft transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Marcar Horário
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
