import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/placeholder-images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand-100">
      <div className="container-site grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-in text-center lg:text-left">
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
            Almada · Setúbal
          </span>
          <h1 className="heading-display mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Unhas perfeitas, <span className="text-rose-500">sem complicações</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-charcoal-500 sm:text-lg lg:mx-0">
            Manicure, pedicure e nail art personalizada no estúdio Nails Von. Marca o teu horário
            online em menos de um minuto — sem WhatsApp, sem espera.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/marcar" className="btn-primary w-full sm:w-auto">
              Marcar Horário
            </Link>
            <Link href="/servicos" className="btn-secondary w-full sm:w-auto">
              Ver Serviços
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-soft_lg lg:max-w-none">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
