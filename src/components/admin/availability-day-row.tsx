"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";
import { upsertAvailabilityRule, deleteAvailabilityRule, type FormActionState } from "@/app/admin/actions";
import type { AvailabilityRule } from "@/types/database";

const initialState: FormActionState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-secondary !px-4 !py-2 text-xs" disabled={pending}>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
      Guardar
    </button>
  );
}

export default function AvailabilityDayRow({
  dia,
  label,
  rule,
}: {
  dia: number;
  label: string;
  rule: AvailabilityRule | null;
}) {
  const [state, formAction] = useFormState(upsertAvailabilityRule, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3 border-b border-sand-200 py-3 last:border-0">
      {rule && <input type="hidden" name="id" value={rule.id} />}
      <input type="hidden" name="diaDaSemana" value={dia} />

      <span className="w-28 shrink-0 text-sm font-medium text-charcoal-900">{label}</span>

      <label className="flex items-center gap-1.5 text-xs text-charcoal-500">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={rule?.ativo ?? true}
          className="h-4 w-4 rounded border-sand-300 text-rose-500 focus:ring-rose-300"
        />
        Aberto
      </label>

      <input
        type="time"
        name="horaInicio"
        defaultValue={rule?.hora_inicio.slice(0, 5) ?? "10:00"}
        className="input-field w-28 py-1.5 text-sm"
        aria-label={`Hora de início ${label}`}
      />
      <span className="text-charcoal-500">–</span>
      <input
        type="time"
        name="horaFim"
        defaultValue={rule?.hora_fim.slice(0, 5) ?? "19:00"}
        className="input-field w-28 py-1.5 text-sm"
        aria-label={`Hora de fim ${label}`}
      />

      <SaveButton />

      {rule && (
        <button
          type="button"
          title="Remover"
          onClick={() => deleteAvailabilityRule(rule.id)}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remover horário de {label}</span>
        </button>
      )}

      {state?.error && (
        <p role="alert" className="error-text w-full">
          {state.error}
        </p>
      )}
    </form>
  );
}
