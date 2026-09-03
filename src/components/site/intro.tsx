import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const POINTS = [
  {
    n: "01",
    title: "Cuidado ao detalhe",
    text: "Cada trabalho é feito com atenção ao pormenor, materiais de qualidade e higiene rigorosa.",
  },
  {
    n: "02",
    title: "Atendimento próximo",
    text: "Um espaço pensado para te sentires bem, com um atendimento personalizado a cada visita.",
  },
  {
    n: "03",
    title: "Fácil de encontrar",
    text: "Estúdio localizado em Almada, distrito de Setúbal, com bom acesso e estacionamento próximo.",
  },
];

export default function Intro() {
  return (
    <section className="container-site py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">01 · Estúdio</span>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">
            Onde a técnica encontra o detalhe artístico
          </h2>
          <p className="mt-5 max-w-md text-charcoal-500">
            Um espaço dedicado à nail design em Almada. Trabalhamos manicure, pedicure e nail art à
            medida de cada cliente, num ambiente calmo e acolhedor — pensado para que cada visita
            seja também um momento só teu.
          </p>
        </Reveal>

        <RevealGroup className="flex flex-col divide-y divide-sand-300 border-t border-sand-300 lg:border-t-0">
          {POINTS.map(({ n, title, text }) => (
            <RevealItem key={n} className="group flex gap-5 py-6 first:pt-0 lg:first:pt-6">
              <span className="font-serif text-3xl text-rose-300 transition-colors duration-300 group-hover:text-rose-500">
                {n}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">{title}</h3>
                <p className="mt-1.5 text-sm text-charcoal-500">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
