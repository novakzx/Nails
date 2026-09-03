"use client";

import { useTransition } from "react";
import { Check, X, CheckCheck } from "lucide-react";
import { updateBookingStatus } from "@/app/admin/actions";
import type { BookingStatus } from "@/types/database";

export default function BookingActions({
  bookingId,
  estadoAtual,
}: {
  bookingId: string;
  estadoAtual: BookingStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handle(estado: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, estado);
    });
  }

  return (
    <div className="flex justify-end gap-1.5">
      {estadoAtual === "pendente" && (
        <>
          <button
            type="button"
            title="Confirmar"
            disabled={isPending}
            onClick={() => handle("confirmada")}
            className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Confirmar marcação</span>
          </button>
          <button
            type="button"
            title="Recusar"
            disabled={isPending}
            onClick={() => handle("cancelada")}
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Recusar marcação</span>
          </button>
        </>
      )}
      {estadoAtual === "confirmada" && (
        <>
          <button
            type="button"
            title="Marcar como concluída"
            disabled={isPending}
            onClick={() => handle("concluida")}
            className="rounded-lg p-1.5 text-charcoal-700 hover:bg-sand-200 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="sr-only">Marcar como concluída</span>
          </button>
          <button
            type="button"
            title="Cancelar"
            disabled={isPending}
            onClick={() => handle("cancelada")}
            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancelar marcação</span>
          </button>
        </>
      )}
    </div>
  );
}
