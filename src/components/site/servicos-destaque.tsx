import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getActiveServices } from "@/lib/services";
import { formatPreco } from "@/lib/format";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export default async function ServicosDestaque() {
  const services = await getActiveServices(6);

  return (
    <section className="bg-sand-100 py-16 sm:py-24">
      <div className="container-site">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">02 · Serviços</span>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">Serviços em destaque</h2>
            <p className="mt-3 max-w-md text-charcoal-500">Preços a partir de. Consulta todos os serviços e detalhes.</p>
          </div>
          <Link
            href="/servicos"
            className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 sm:inline-flex"
          >
            Ver todos os serviços
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        {services.length > 0 ? (
          <RevealGroup className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <RevealItem
                key={service.id}
                className={`group relative flex flex-col overflow-hidden rounded-xl2 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft_lg ${
                  i === 0 ? "bg-rose-500 text-white sm:col-span-2 lg:col-span-1" : "bg-white"
                }`}
              >
                <h3 className={`font-serif text-xl font-semibold ${i === 0 ? "text-white" : "text-charcoal-900"}`}>
                  {service.nome}
                </h3>
                {service.descricao && (
                  <p className={`mt-2 line-clamp-2 flex-1 text-sm ${i === 0 ? "text-rose-50" : "text-charcoal-500"}`}>
                    {service.descricao}
                  </p>
                )}
                <div
                  className={`mt-4 flex items-center justify-between border-t pt-4 ${
                    i === 0 ? "border-white/25" : "border-sand-300"
                  }`}
                >
                  <span className={`text-sm ${i === 0 ? "text-rose-50" : "text-charcoal-500"}`}>
                    {service.duracao_minutos} min
                  </span>
                  <span className={`font-serif text-lg font-semibold ${i === 0 ? "text-white" : "text-rose-500"}`}>
                    desde {formatPreco(service.preco)}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-12 text-center text-charcoal-500">
            Os serviços estão a ser atualizados — volta a consultar em breve.
          </p>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link href="/servicos" className="btn-secondary">
            Ver todos os serviços
          </Link>
        </div>
      </div>
    </section>
  );
}
