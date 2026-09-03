import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServiceNamesMap } from "@/lib/services-map";
import StatusBadge from "@/components/admin/status-badge";
import BookingActions from "@/components/admin/booking-actions";

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  const todayStr = toIsoDate(today);
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  const [{ data: todayBookings }, { count: pendentesCount }, { count: semanaCount }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .eq("data", todayStr)
      .order("hora_inicio", { ascending: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("estado", "pendente"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("data", todayStr)
      .lte("data", toIsoDate(in7Days)),
  ]);

  const serviceNames = await getServiceNamesMap(supabase, (todayBookings ?? []).map((b) => b.service_id));

  const stats = [
    { label: "Marcações hoje", value: todayBookings?.length ?? 0 },
    { label: "Pendentes de confirmação", value: pendentesCount ?? 0 },
    { label: "Próximos 7 dias", value: semanaCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="heading-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-charcoal-500">Resumo das marcações de hoje.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-charcoal-500">{s.label}</p>
            <p className="mt-1 font-serif text-3xl font-semibold text-rose-500">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-charcoal-900">Marcações de hoje</h2>
        <Link href="/admin/marcacoes" className="text-sm font-medium text-rose-500 hover:text-rose-600">
          Ver todas →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl2 border border-sand-300 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-sand-300 bg-sand-100 text-xs uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {(todayBookings ?? []).map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-charcoal-900">{b.hora_inicio.slice(0, 5)}</td>
                <td className="px-4 py-3">{b.nome_cliente}</td>
                <td className="px-4 py-3 text-charcoal-500">{serviceNames.get(b.service_id) ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge estado={b.estado} />
                </td>
                <td className="px-4 py-3 text-right">
                  <BookingActions bookingId={b.id} estadoAtual={b.estado} />
                </td>
              </tr>
            ))}

            {(!todayBookings || todayBookings.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal-500">
                  Sem marcações para hoje.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
