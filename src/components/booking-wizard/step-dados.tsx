import type { UseFormReturn } from "react-hook-form";
import type { BookingFormValues } from "@/lib/validations/booking.schema";

interface Props {
  form: UseFormReturn<BookingFormValues>;
}

export default function StepDados({ form }: Props) {
  const { register, formState } = form;
  const errors = formState.errors;

  return (
    <fieldset>
      <legend className="heading-display text-2xl">Os teus dados</legend>
      <p className="mt-1 text-sm text-charcoal-500">Para confirmarmos a tua marcação.</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="nomeCliente" className="label-field">
            Nome completo
          </label>
          <input
            id="nomeCliente"
            type="text"
            autoComplete="name"
            className="input-field"
            aria-invalid={!!errors.nomeCliente}
            aria-describedby={errors.nomeCliente ? "nomeCliente-error" : undefined}
            {...register("nomeCliente")}
          />
          {errors.nomeCliente && (
            <p id="nomeCliente-error" className="error-text" role="alert">
              {errors.nomeCliente.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telefoneCliente" className="label-field">
            Telemóvel
          </label>
          <input
            id="telefoneCliente"
            type="tel"
            autoComplete="tel"
            placeholder="912 345 678"
            className="input-field"
            aria-invalid={!!errors.telefoneCliente}
            aria-describedby={errors.telefoneCliente ? "telefoneCliente-error" : undefined}
            {...register("telefoneCliente")}
          />
          {errors.telefoneCliente && (
            <p id="telefoneCliente-error" className="error-text" role="alert">
              {errors.telefoneCliente.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="emailCliente" className="label-field">
            Email
          </label>
          <input
            id="emailCliente"
            type="email"
            autoComplete="email"
            className="input-field"
            aria-invalid={!!errors.emailCliente}
            aria-describedby={errors.emailCliente ? "emailCliente-error" : undefined}
            {...register("emailCliente")}
          />
          {errors.emailCliente && (
            <p id="emailCliente-error" className="error-text" role="alert">
              {errors.emailCliente.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notas" className="label-field">
            Notas (opcional)
          </label>
          <textarea
            id="notas"
            rows={3}
            placeholder="Alguma preferência ou informação relevante?"
            className="input-field resize-none"
            {...register("notas")}
          />
          {errors.notas && (
            <p className="error-text" role="alert">
              {errors.notas.message}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
