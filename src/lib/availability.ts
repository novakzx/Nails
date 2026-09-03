import { createClient } from "@/lib/supabase/server";

const SLOT_STEP_MINUTES = 15; // granularidade da grelha de horários mostrados
const MIN_LEAD_MINUTES = 60; // não permitir marcar para dentro de <1h

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface Interval {
  start: number; // minutos desde as 00:00
  end: number;
}

interface ComputeFreeSlotsParams {
  windows: Interval[]; // janelas de funcionamento (availability_rules) do dia
  fullDayBlocked: boolean; // bloqueio do dia inteiro
  blockedIntervals: Interval[]; // bloqueios parciais do dia
  bookedIntervals: Interval[]; // marcações já existentes (pendente/confirmada) do dia
  durationMinutes: number; // duração do serviço pedido
  bufferMinutes: number; // intervalo mínimo obrigatório entre marcações
  nowMinutes: number | null; // minutos desde as 00:00 de "agora", só quando a data é hoje
}

/**
 * Função pura de cálculo de slots livres — não depende da base de dados,
 * o que a torna fácil de testar isoladamente.
 */
export function computeFreeSlots({
  windows,
  fullDayBlocked,
  blockedIntervals,
  bookedIntervals,
  durationMinutes,
  bufferMinutes,
  nowMinutes,
}: ComputeFreeSlotsParams): string[] {
  if (fullDayBlocked) return [];

  const occupied: Interval[] = [
    ...blockedIntervals,
    // Aplica o buffer de cada lado de uma marcação existente
    ...bookedIntervals.map((b) => ({
      start: b.start - bufferMinutes,
      end: b.end + bufferMinutes,
    })),
  ];

  const slots: string[] = [];

  for (const window of windows) {
    for (
      let start = window.start;
      start + durationMinutes <= window.end;
      start += SLOT_STEP_MINUTES
    ) {
      const end = start + durationMinutes;

      if (nowMinutes !== null && start < nowMinutes + MIN_LEAD_MINUTES) continue;

      const overlaps = occupied.some((o) => start < o.end && end > o.start);
      if (!overlaps) slots.push(minutesToTime(start));
    }
  }

  return slots;
}

/** Vai buscar tudo o que é preciso ao Supabase e calcula os slots livres para uma data e um serviço. */
export async function getFreeSlotsForDate(dateStr: string, serviceId: string) {
  const supabase = await createClient();
  const date = new Date(`${dateStr}T00:00:00`);
  const diaDaSemana = date.getDay();

  const [{ data: service }, { data: rules }, { data: blocked }, { data: bookings }, { data: settings }] =
    await Promise.all([
      supabase.from("services").select("duracao_minutos").eq("id", serviceId).single(),
      supabase
        .from("availability_rules")
        .select("hora_inicio, hora_fim")
        .eq("dia_da_semana", diaDaSemana)
        .eq("ativo", true),
      supabase.from("blocked_slots").select("hora_inicio, hora_fim").eq("data", dateStr),
      // Usa a função security-definer get_booked_intervals em vez de ler a
      // tabela bookings diretamente: RLS impede "anon" de fazer SELECT em
      // bookings (protege dados pessoais de clientes), mas esta função
      // devolve apenas os intervalos de tempo ocupados, sem dados pessoais.
      supabase.rpc("get_booked_intervals", { p_data: dateStr }),
      supabase.from("app_settings").select("buffer_minutos").limit(1).single(),
    ]);

  if (!service) return [];

  const windows: Interval[] = (rules ?? []).map((r) => ({
    start: timeToMinutes(r.hora_inicio.slice(0, 5)),
    end: timeToMinutes(r.hora_fim.slice(0, 5)),
  }));

  const fullDayBlocked = (blocked ?? []).some((b) => b.hora_inicio === null);
  const blockedIntervals: Interval[] = (blocked ?? [])
    .filter((b) => b.hora_inicio !== null && b.hora_fim !== null)
    .map((b) => ({
      start: timeToMinutes(b.hora_inicio!.slice(0, 5)),
      end: timeToMinutes(b.hora_fim!.slice(0, 5)),
    }));

  const bookedIntervals: Interval[] = (bookings ?? []).map((b) => ({
    start: timeToMinutes(b.hora_inicio.slice(0, 5)),
    end: timeToMinutes(b.hora_fim.slice(0, 5)),
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = date.getTime() === today.getTime();
  const now = new Date();
  const nowMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : null;

  return computeFreeSlots({
    windows,
    fullDayBlocked,
    blockedIntervals,
    bookedIntervals,
    durationMinutes: service.duracao_minutos,
    bufferMinutes: settings?.buffer_minutos ?? 15,
    nowMinutes,
  });
}
