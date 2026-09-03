import Link from "next/link";
import { CheckCircle2, MessageCircle, Info } from "lucide-react";
import { subscribeClientPush, type CreateBookingResult } from "@/app/marcar/actions";
import { formatDataLonga } from "@/lib/format";
import PushSubscribeButton from "@/components/push/push-subscribe-button";

export default function Confirmacao({ resultado }: { resultado: CreateBookingResult }) {
  const { resumo, whatsappLink, bookingId, demo } = resultado;

  return (
    <div className="mx-auto max-w-lg py-8 text-center animate-fade-in">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-9 w-9 text-green-600" aria-hidden="true" />
      </div>
      <h1 className="heading-display mt-6 text-3xl">Marcação recebida!</h1>
      <p className="mt-3 text-charcoal-500">
        O teu pedido está <strong>pendente de confirmação</strong>. Enviámos um email com os
        detalhes — vais receber outro assim que a marcação for confirmada.
      </p>

      {demo && (
        <p className="mx-auto mt-4 flex max-w-sm items-start gap-2 rounded-lg bg-sand-200 p-3 text-left text-xs text-charcoal-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Versão de demonstração — esta marcação de exemplo não foi gravada. Liga o Supabase para
          passar a receber marcações reais.
        </p>
      )}

      {resumo && (
        <dl className="card mt-6 divide-y divide-sand-300 p-5 text-left">
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="text-charcoal-500">Serviço</dt>
            <dd className="font-medium text-charcoal-900">{resumo.servicoNome}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="text-charcoal-500">Data</dt>
            <dd className="font-medium text-charcoal-900">{formatDataLonga(resumo.data)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="text-charcoal-500">Hora</dt>
            <dd className="font-medium text-charcoal-900">{resumo.horaInicio}</dd>
          </div>
        </dl>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Confirmar também por WhatsApp
          </a>
        )}
        <Link href="/" className="btn-secondary w-full sm:w-auto">
          Voltar ao início
        </Link>
      </div>

      {bookingId && (
        <div className="mt-6">
          <PushSubscribeButton
            label="Avisa-me quando for confirmada"
            activeLabel="Vais receber uma notificação"
            onSubscribe={(subscription) => subscribeClientPush(bookingId, subscription)}
          />
        </div>
      )}
    </div>
  );
}
