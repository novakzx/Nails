"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { upsertService, type FormActionState } from "@/app/admin/actions";
import type { Service } from "@/types/database";

const initialState: FormActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {label}
    </button>
  );
}

export default function ServicoForm({
  service,
  onDone,
}: {
  service?: Service;
  onDone?: () => void;
}) {
  const [state, formAction] = useFormState(upsertService, initialState);

  return (
    <form
      action={(fd) => {
        formAction(fd);
        onDone?.();
      }}
      className="card grid gap-4 p-5 sm:grid-cols-2"
    >
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="sm:col-span-2">
        <label htmlFor="nome" className="label-field">
          Nome do serviço
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          defaultValue={service?.nome}
          className="input-field"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="descricao" className="label-field">
          Descrição
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={2}
          defaultValue={service?.descricao ?? ""}
          className="input-field resize-none"
        />
      </div>

      <div>
        <label htmlFor="duracaoMinutos" className="label-field">
          Duração (minutos)
        </label>
        <input
          id="duracaoMinutos"
          name="duracaoMinutos"
          type="number"
          min={5}
          step={5}
          required
          defaultValue={service?.duracao_minutos}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="preco" className="label-field">
          Preço (€)
        </label>
        <input
          id="preco"
          name="preco"
          type="number"
          min={0}
          step={0.5}
          required
          defaultValue={service?.preco}
          className="input-field"
        />
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          id="ativo"
          name="ativo"
          type="checkbox"
          defaultChecked={service?.ativo ?? true}
          className="h-4 w-4 rounded border-sand-300 text-rose-500 focus:ring-rose-300"
        />
        <label htmlFor="ativo" className="text-sm text-charcoal-700">
          Serviço ativo (visível no site)
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="error-text sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton label={service ? "Guardar alterações" : "Criar serviço"} />
      </div>
    </form>
  );
}
