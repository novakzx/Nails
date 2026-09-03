import { createClient } from "@/lib/supabase/server";
import ServicosTable from "@/components/admin/servicos-table";
import NovoServico from "@/components/admin/novo-servico";

export default async function AdminServicosPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("criado_em", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl">Serviços</h1>
          <p className="mt-1 text-charcoal-500">Cria, edita e ativa/desativa os serviços do estúdio.</p>
        </div>
        <NovoServico />
      </div>

      <ServicosTable services={services ?? []} />
    </div>
  );
}
