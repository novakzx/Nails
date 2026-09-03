import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/validations/booking.schema";
import type { ServiceOption } from "./step-servico";
import { formatDataLonga, formatPreco } from "@/lib/format";

interface Props {
  form: UseFormReturn<BookingFormValues>;
  services: ServiceOption[];
}

export default function StepConfirmar({ form, services }: Props) {
  const values = form.getValues();
  const service = services.find((s) => s.id === values.serviceId);

  const rows = [
    { label: "Serviço", value: service?.nome ?? "—" },
    { label: "Data", value: values.data ? formatDataLonga(values.data) : "—" },
    { label: "Hora", value: values.horaInicio || "—" },
    { label: "Nome", value: values.nomeCliente },
    { label: "Telemóvel", value: values.telefoneCliente },
    { label: "Email", value: values.emailCliente },
  ];

  return (
    <div>
      <h2 className="heading-display text-2xl">Confirma a tua marcação</h2>
      <p className="mt-1 text-sm text-charcoal-500">Revê os dados antes de submeter.</p>

      <dl className="card mt-6 divide-y divide-sand-300 p-5">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
            <dt className="text-charcoal-500">{row.label}</dt>
            <dd className="text-right font-medium text-charcoal-900">{row.value}</dd>
          </div>
        ))}
        {values.notas && (
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="text-charcoal-500">Notas</dt>
            <dd className="text-right font-medium text-charcoal-900">{values.notas}</dd>
          </div>
        )}
        {service && (
          <div className="flex justify-between gap-4 py-2.5 text-sm">
            <dt className="text-charcoal-500">Preço estimado</dt>
            <dd className="text-right font-semibold text-rose-500">{formatPreco(service.preco)}</dd>
          </div>
        )}
      </dl>

      <p className="mt-4 text-xs text-charcoal-500">
        Ao confirmar, a marcação fica com o estado <strong>pendente</strong> até ser confirmada pela
        Von. Vais receber um email de confirmação.
      </p>
    </div>
  );
}
