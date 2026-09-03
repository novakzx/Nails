import Link from "next/link";
import { getActiveServices } from "@/lib/services";
import { formatPreco } from "@/lib/format";

export default async function ServicosDestaque() {
  const services = await getActiveServices(6);

  return (
    <section className="bg-sand-100 py-16 sm:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">Serviços em destaque</h2>
          <p className="mt-4 text-charcoal-500">Preços a partir de. Consulta todos os serviços e detalhes.</p>
        </div>

        {services.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="card flex flex-col p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">{service.nome}</h3>
                {service.descricao && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-charcoal-500">{service.descricao}</p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-sand-300 pt-4">
                  <span className="text-sm text-charcoal-500">{service.duracao_minutos} min</span>
                  <span className="font-serif text-lg font-semibold text-rose-500">
                    desde {formatPreco(service.preco)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-charcoal-500">
            Os serviços estão a ser atualizados — volta a consultar em breve.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link href="/servicos" className="btn-secondary">
            Ver todos os serviços
          </Link>
        </div>
      </div>
    </section>
  );
}
