import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ABOUT_IMAGE } from "@/lib/placeholder-images";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conhece a Von e a história do estúdio Nails Von, em Almada. Experiência, cuidado e paixão por nail design.",
};

export default function SobrePage() {
  return (
    <div className="container-site py-14 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl2 shadow-soft_lg lg:mx-0">
          <Image
            src={ABOUT_IMAGE.src}
            alt={ABOUT_IMAGE.alt}
            fill
            sizes="(min-width: 1024px) 35vw, 80vw"
            className="object-cover"
          />
        </div>

        <div>
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
            Sobre
          </span>
          <h1 className="heading-display mt-5 text-4xl sm:text-5xl">Olá, sou a Von</h1>
          <div className="mt-5 space-y-4 text-charcoal-500">
            {/* Texto placeholder — substituir pela história real da Von */}
            <p>
              Apaixonada por nail design há vários anos, criei o estúdio Nails Von com um objetivo
              simples: fazer com que cada cliente saia com as unhas impecáveis e se sinta especial
              durante todo o processo.
            </p>
            <p>
              Ao longo do meu percurso especializei-me em manicure e pedicure, alongamento em gel e
              nail art personalizada, mantendo-me sempre atualizada com as últimas técnicas e
              tendências através de formação contínua.
            </p>
            <p>
              Certificações e formações (placeholder): Curso de Manicure e Pedicure Avançado,
              Especialização em Alongamento em Gel, Curso de Nail Art e Design.
            </p>
            <p>
              O estúdio está localizado em Almada, distrito de Setúbal, num espaço pensado para o
              teu conforto — higiene, qualidade dos materiais e atenção ao detalhe em cada
              marcação.
            </p>
          </div>
          <Link href="/marcar" className="btn-primary mt-8">
            Marcar Horário
          </Link>
        </div>
      </div>
    </div>
  );
}
