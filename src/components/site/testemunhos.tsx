import { Star } from "lucide-react";

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
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="heading-display text-3xl sm:text-4xl">O que dizem as clientes</h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {TESTEMUNHOS.map((t) => (
          <figure key={t.nome} className="card p-6">
            <div className="flex gap-0.5" aria-label={`${t.rating} de 5 estrelas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? "fill-rose-500 text-rose-500" : "text-sand-300"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote className="mt-4 text-sm text-charcoal-700">“{t.texto}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-charcoal-900">{t.nome}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
