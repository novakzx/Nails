import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/validations/booking.schema";
import { formatPreco } from "@/lib/format";

export interface ServiceOption {
  id: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number;
}

interface Props {
  form: UseFormReturn<BookingFormValues>;
  services: ServiceOption[];
}

export default function StepServico({ form, services }: Props) {
  const selected = form.watch("serviceId");

  return (
    <fieldset>
      <legend className="heading-display text-2xl">Escolhe o serviço</legend>
      <p className="mt-1 text-sm text-charcoal-500">Podes ver os detalhes de duração e preço de cada serviço.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selected === service.id;
          return (
            <label
              key={service.id}
              className={`card relative flex cursor-pointer flex-col p-5 transition-all ${
                isSelected ? "border-rose-500 ring-2 ring-rose-200" : "hover:border-rose-300"
              }`}
            >
              <input
                type="radio"
                value={service.id}
                className="sr-only"
                {...form.register("serviceId")}
              />
              <span className="font-serif text-lg font-semibold text-charcoal-900">{service.nome}</span>
              {service.descricao && (
                <span className="mt-1 text-sm text-charcoal-500">{service.descricao}</span>
              )}
              <span className="mt-3 flex items-center justify-between text-sm">
                <span className="text-charcoal-500">{service.duracao_minutos} min</span>
                <span className="font-semibold text-rose-500">{formatPreco(service.preco)}</span>
              </span>
            </label>
          );
        })}
      </div>

      {form.formState.errors.serviceId && (
        <p className="error-text" role="alert">
          {form.formState.errors.serviceId.message}
        </p>
      )}
    </fieldset>
  );
}
