"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteService, toggleServiceAtivo } from "@/app/admin/actions";
import { formatPreco } from "@/lib/format";
import type { Service } from "@/types/database";
import ServicoForm from "./servico-form";

export default function ServicosTable({ services }: { services: Service[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-5 space-y-3">
      {services.map((service) =>
        editingId === service.id ? (
          <ServicoForm key={service.id} service={service} onDone={() => setEditingId(null)} />
        ) : (
          <div key={service.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">{service.nome}</h3>
                {!service.ativo && (
                  <span className="rounded-full bg-sand-300 px-2 py-0.5 text-xs font-medium text-charcoal-700">
                    Inativo
                  </span>
                )}
              </div>
              {service.descricao && <p className="mt-1 text-sm text-charcoal-500">{service.descricao}</p>}
              <p className="mt-1 text-sm text-charcoal-500">
                {service.duracao_minutos} min · {formatPreco(service.preco)}
              </p>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                title={service.ativo ? "Desativar" : "Ativar"}
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await toggleServiceAtivo(service.id, !service.ativo);
                  })
                }
                className="rounded-lg p-2 text-charcoal-700 hover:bg-sand-200 disabled:opacity-50"
              >
                {service.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{service.ativo ? "Desativar" : "Ativar"} serviço</span>
              </button>
              <button
                type="button"
                title="Editar"
                onClick={() => setEditingId(service.id)}
                className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar serviço</span>
              </button>
              <button
                type="button"
                title="Eliminar"
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Eliminar o serviço "${service.nome}"? Esta ação não pode ser desfeita.`)) {
                    startTransition(async () => {
                      await deleteService(service.id);
                    });
                  }
                }}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar serviço</span>
              </button>
            </div>
          </div>
        )
      )}

      {services.length === 0 && (
        <p className="py-8 text-center text-charcoal-500">Ainda não há serviços criados.</p>
      )}
    </div>
  );
}
