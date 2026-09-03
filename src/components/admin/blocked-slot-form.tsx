"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Trash2, Plus } from "lucide-react";
import { createBlockedSlot, deleteBlockedSlot, type FormActionState } from "@/app/admin/actions";
import { formatDataLonga } from "@/lib/format";
import type { BlockedSlot } from "@/types/database";

const initialState: FormActionState = {};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" />}
      Adicionar bloqueio
    </button>
  );
}

export default function BlockedSlotForm({ blockedSlots }: { blockedSlots: BlockedSlot[] }) {
  const [state, formAction] = useFormState(createBlockedSlot, initialState);

  return (
    <div>
      <form action={formAction} className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="bs-data" className="label-field">
            Data
          </label>
          <input id="bs-data" name="data" type="date" required className="input-field" />
        </div>
        <div>
          <label htmlFor="bs-inicio" className="label-field">
            Hora início (opcional)
          </label>
          <input id="bs-inicio" name="horaInicio" type="time" className="input-field" />
        </div>
        <div>
          <label htmlFor="bs-fim" className="label-field">
            Hora fim (opcional)
          </label>
          <input id="bs-fim" name="horaFim" type="time" className="input-field" />
        </div>
        <div>
          <label htmlFor="bs-motivo" className="label-field">
            Motivo
          </label>
          <input id="bs-motivo" name="motivo" type="text" placeholder="Férias, folga…" className="input-field" />
        </div>

        {state?.error && (
          <p role="alert" className="error-text sm:col-span-2 lg:col-span-4">
            {state.error}
          </p>
        )}

        <p className="text-xs text-charcoal-500 sm:col-span-2 lg:col-span-4">
          Deixa as horas em branco para bloquear o dia inteiro.
        </p>

        <div className="sm:col-span-2 lg:col-span-4">
          <AddButton />
        </div>
      </form>

      <ul className="mt-4 space-y-2">
        {blockedSlots.map((b) => (
          <li key={b.id} className="card flex items-center justify-between gap-4 p-4">
            <div className="text-sm">
              <p className="font-medium text-charcoal-900">{formatDataLonga(b.data)}</p>
              <p className="text-charcoal-500">
                {b.hora_inicio ? `${b.hora_inicio.slice(0, 5)} – ${b.hora_fim?.slice(0, 5)}` : "Dia inteiro"}
                {b.motivo ? ` · ${b.motivo}` : ""}
              </p>
            </div>
            <button
              type="button"
              title="Remover bloqueio"
              onClick={() => deleteBlockedSlot(b.id)}
              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remover bloqueio</span>
            </button>
          </li>
        ))}

        {blockedSlots.length === 0 && (
          <p className="py-4 text-center text-sm text-charcoal-500">Sem bloqueios agendados.</p>
        )}
      </ul>
    </div>
  );
}
