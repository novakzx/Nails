import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPreco } from "@/lib/format";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Manicure gel, pedicure spa, nail art, alongamento, verniz semipermanente e remoção. Consulta preços e duração no estúdio Nails Von em Almada.",
};

export default async function ServicosPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, nome, descricao, duracao_minutos, preco")
    .eq("ativo", true)
    .order("preco", { ascending: true });

  return (
    <div className="container-site py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="heading-display text-4xl sm:text-5xl">Os nossos serviços</h1>
        <p className="mt-4 text-charcoal-500">
          Preços e durações estimadas. Escolhe o serviço e marca o teu horário em poucos passos.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {(services ?? []).map((service) => (
          <div key={service.id} className="card flex flex-col p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-xl font-semibold text-charcoal-900">{service.nome}</h2>
              <span className="whitespace-nowrap font-serif text-lg font-semibold text-rose-500">
                {formatPreco(service.preco)}
              </span>
            </div>
            {service.descricao && <p className="mt-2 text-sm text-charcoal-500">{service.descricao}</p>}
            <div className="mt-4 flex items-center justify-between border-t border-sand-300 pt-4">
              <span className="flex items-center gap-1.5 text-sm text-charcoal-500">
                <Clock className="h-4 w-4 text-rose-500" aria-hidden="true" />
                {service.duracao_minutos} min
              </span>
              <Link
                href={`/marcar?servico=${service.id}`}
                className="text-sm font-semibold text-rose-500 hover:text-rose-600"
              >
                Marcar →
              </Link>
            </div>
          </div>
        ))}

        {(!services || services.length === 0) && (
          <p className="col-span-full text-center text-charcoal-500">
            Ainda não há serviços disponíveis. Volta a tentar em breve.
          </p>
        )}
      </div>

      <div className="mt-14 text-center">
        <Link href="/marcar" className="btn-primary">
          Marcar Horário
        </Link>
      </div>
    </div>
  );
}
