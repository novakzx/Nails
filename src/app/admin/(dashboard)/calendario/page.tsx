import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getServiceNamesMap } from "@/lib/services-map";

const DIAS_LABEL = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function mondayOf(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ inicio?: string }>;
}) {
  const { inicio } = await searchParams;
  const baseDate = inicio ? new Date(`${inicio}T00:00:00`) : new Date();
  const monday = mondayOf(baseDate);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const inicioIso = toIso(weekDates[0]);
  const fimIso = toIso(weekDates[6]);

  const prevWeek = new Date(monday);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(monday);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("estado", "confirmada")
    .gte("data", inicioIso)
    .lte("data", fimIso)
    .order("hora_inicio", { ascending: true });

  const serviceNames = await getServiceNamesMap(supabase, (bookings ?? []).map((b) => b.service_id));

  type BookingRow = NonNullable<typeof bookings>[number];
  const byDate = new Map<string, BookingRow[]>();
  (bookings ?? []).forEach((b) => {
    const list = byDate.get(b.data) ?? [];
    list.push(b);
    byDate.set(b.data, list);
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl">Calendário</h1>
          <p className="mt-1 text-charcoal-500">Marcações confirmadas, vista semanal.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/calendario?inicio=${toIso(prevWeek)}`}
            className="rounded-lg border border-sand-300 bg-white p-2 hover:bg-sand-100"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium text-charcoal-700">
            {inicioIso} – {fimIso}
          </span>
          <Link
            href={`/admin/calendario?inicio=${toIso(nextWeek)}`}
            className="rounded-lg border border-sand-300 bg-white p-2 hover:bg-sand-100"
            aria-label="Semana seguinte"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-7">
        {weekDates.map((date, i) => {
          const iso = toIso(date);
          const dayBookings = byDate.get(iso) ?? [];
          const isToday = iso === toIso(new Date());
          return (
            <div key={iso} className={`card p-3 ${isToday ? "ring-2 ring-rose-300" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                {DIAS_LABEL[i]}
              </p>
              <p className="mb-2 font-serif text-lg font-semibold text-charcoal-900">
                {date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
              </p>
              <div className="space-y-1.5">
                {dayBookings.map((b) => (
                  <div key={b.id} className="rounded-lg bg-rose-50 px-2 py-1.5 text-xs">
                    <p className="font-semibold text-rose-700">{b.hora_inicio.slice(0, 5)}</p>
                    <p className="text-charcoal-700">{b.nome_cliente}</p>
                    <p className="text-charcoal-500">{serviceNames.get(b.service_id) ?? "—"}</p>
                  </div>
                ))}
                {dayBookings.length === 0 && <p className="text-xs text-charcoal-300">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
