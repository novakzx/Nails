import { createClient } from "@/lib/supabase/server";
import AvailabilityDayRow from "@/components/admin/availability-day-row";
import BlockedSlotForm from "@/components/admin/blocked-slot-form";
import BufferForm from "@/components/admin/buffer-form";
import type { AvailabilityRule } from "@/types/database";

const DIAS = [
  { dia: 1, label: "Segunda" },
  { dia: 2, label: "Terça" },
  { dia: 3, label: "Quarta" },
  { dia: 4, label: "Quinta" },
  { dia: 5, label: "Sexta" },
  { dia: 6, label: "Sábado" },
  { dia: 0, label: "Domingo" },
];

export default async function DisponibilidadePage() {
  const supabase = await createClient();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [{ data: rules }, { data: blockedSlots }, { data: settings }] = await Promise.all([
    supabase.from("availability_rules").select("*").order("dia_da_semana", { ascending: true }),
    supabase.from("blocked_slots").select("*").gte("data", todayStr).order("data", { ascending: true }),
    supabase.from("app_settings").select("*").limit(1).single(),
  ]);

  const rulesByDia = new Map<number, AvailabilityRule>();
  (rules ?? []).forEach((r) => {
    if (!rulesByDia.has(r.dia_da_semana)) rulesByDia.set(r.dia_da_semana, r);
  });

  return (
    <div>
      <h1 className="heading-display text-3xl">Disponibilidade</h1>
      <p className="mt-1 text-charcoal-500">
        Define o horário de funcionamento semanal, bloqueia dias/horas específicas e ajusta o intervalo
        entre marcações.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-charcoal-900">Horário semanal</h2>
      <div className="card mt-3 p-5">
        {DIAS.map(({ dia, label }) => (
          <AvailabilityDayRow key={dia} dia={dia} label={label} rule={rulesByDia.get(dia) ?? null} />
        ))}
      </div>

      <h2 className="mt-8 font-serif text-xl font-semibold text-charcoal-900">Intervalo entre marcações</h2>
      <div className="mt-3">
        {settings ? (
          <BufferForm id={settings.id} bufferMinutos={settings.buffer_minutos} />
        ) : (
          <p className="text-charcoal-500">Configuração não encontrada — corre o seed inicial.</p>
        )}
      </div>

      <h2 className="mt-8 font-serif text-xl font-semibold text-charcoal-900">
        Bloqueios (férias, folgas, feriados)
      </h2>
      <div className="mt-3">
        <BlockedSlotForm blockedSlots={blockedSlots ?? []} />
      </div>
    </div>
  );
}
