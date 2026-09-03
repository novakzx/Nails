"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import ServicoForm from "./servico-form";

export default function NovoServico() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Novo serviço
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="mb-3 flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        Cancelar
      </button>
      <ServicoForm onDone={() => setOpen(false)} />
    </div>
  );
}
