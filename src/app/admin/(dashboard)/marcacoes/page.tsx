import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDataCurta } from "@/lib/format";
import { getServiceNamesMap } from "@/lib/services-map";
import StatusBadge from "@/components/admin/status-badge";
import BookingActions from "@/components/admin/booking-actions";
import type { BookingStatus } from "@/types/database";

const FILTROS: { value: BookingStatus | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pendente", label: "Pendentes" },
  { value: "confirmada", label: "Confirmadas" },
  { value: "concluida", label: "Concluídas" },
  { value: "cancelada", label: "Canceladas" },
];

export default async function MarcacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const filtroAtivo = (estado as BookingStatus | undefined) ?? "todas";

  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("data", { ascending: false })
    .order("hora_inicio", { ascending: false })
    .limit(200);

  if (filtroAtivo !== "todas") {
    query = query.eq("estado", filtroAtivo);
  }

  const { data: bookings } = await query;
  const serviceNames = await getServiceNamesMap(supabase, (bookings ?? []).map((b) => b.service_id));

  return (
    <div>
      <h1 className="heading-display text-3xl">Marcações</h1>
      <p className="mt-1 text-charcoal-500">Gere pedidos pendentes e o histórico de marcações.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "todas" ? "/admin/marcacoes" : `/admin/marcacoes?estado=${f.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filtroAtivo === f.value ? "bg-rose-500 text-white" : "bg-white text-charcoal-700 hover:bg-rose-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl2 border border-sand-300 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-sand-300 bg-sand-100 text-xs uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {(bookings ?? []).map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-charcoal-900">{formatDataCurta(b.data)}</td>
                <td className="px-4 py-3">{b.hora_inicio.slice(0, 5)}</td>
                <td className="px-4 py-3">{b.nome_cliente}</td>
                <td className="px-4 py-3 text-charcoal-500">
                  <div>{b.telefone_cliente}</div>
                  <div className="text-xs">{b.email_cliente}</div>
                </td>
                <td className="px-4 py-3 text-charcoal-500">{serviceNames.get(b.service_id) ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge estado={b.estado} />
                </td>
                <td className="px-4 py-3 text-right">
                  <BookingActions bookingId={b.id} estadoAtual={b.estado} />
                </td>
              </tr>
            ))}

            {(!bookings || bookings.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal-500">
                  Sem marcações para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
