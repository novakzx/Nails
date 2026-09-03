import { MapPin, Sparkles, HeartHandshake } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const POINTS = [
  {
    icon: Sparkles,
    title: "Cuidado ao detalhe",
    text: "Cada trabalho é feito com atenção ao pormenor, materiais de qualidade e higiene rigorosa.",
  },
  {
    icon: HeartHandshake,
    title: "Atendimento próximo",
    text: "Um espaço pensado para te sentires bem, com um atendimento personalizado a cada visita.",
  },
  {
    icon: MapPin,
    title: "Fácil de encontrar",
    text: "Estúdio localizado em Almada, distrito de Setúbal, com bom acesso e estacionamento próximo.",
  },
];

export default function Intro() {
  return (
    <section className="container-site py-14 sm:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="heading-display text-3xl sm:text-4xl">O estúdio Nails Von</h2>
        <p className="mt-4 text-charcoal-500">
          Um espaço dedicado à nail design em Almada, onde a técnica encontra o detalhe artístico.
          Trabalhamos manicure, pedicure e nail art à medida de cada cliente, num ambiente calmo e
          acolhedor.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-3 sm:gap-6">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <RevealItem key={title} className="card p-6 text-center transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-soft_lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Icon className="h-6 w-6 text-rose-500" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal-900">{title}</h3>
            <p className="mt-2 text-sm text-charcoal-500">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
