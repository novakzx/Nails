"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import type { BookingFormValues } from "@/lib/validations/booking.schema";

interface Props {
  form: UseFormReturn<BookingFormValues>;
}

function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function maxDateIso() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
}

export default function StepDataHora({ form }: Props) {
  const serviceId = form.watch("serviceId");
  const data = form.watch("data");
  const horaInicio = form.watch("horaInicio");

  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!data || !serviceId) {
      setSlots([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setFetchError(null);

    fetch(`/api/availability?data=${data}&servico=${serviceId}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Falha ao carregar horários.");
        const json = await res.json();
        setSlots(json.slots ?? []);
        // Se a hora previamente escolhida deixou de estar livre, limpa-a.
        if (horaInicio && !json.slots?.includes(horaInicio)) {
          form.setValue("horaInicio", "");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setFetchError("Não foi possível carregar os horários disponíveis. Tenta novamente.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, serviceId]);

  return (
    <fieldset>
      <legend className="heading-display text-2xl">Escolhe a data e a hora</legend>

      <div className="mt-6">
        <label htmlFor="data" className="label-field">
          Data
        </label>
        <input
          id="data"
          type="date"
          min={todayIso()}
          max={maxDateIso()}
          className="input-field max-w-xs"
          {...form.register("data")}
        />
        {form.formState.errors.data && (
          <p className="error-text" role="alert">
            {form.formState.errors.data.message}
          </p>
        )}
      </div>

      {data && (
        <div className="mt-6">
          <span className="label-field" id="horarios-label">
            Horários disponíveis
          </span>

          {loading && (
            <p className="flex items-center gap-2 text-sm text-charcoal-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              A carregar horários…
            </p>
          )}

          {fetchError && (
            <p className="error-text" role="alert">
              {fetchError}
            </p>
          )}

          {!loading && !fetchError && slots.length === 0 && (
            <p className="text-sm text-charcoal-500">
              Não há horários livres neste dia. Experimenta escolher outra data.
            </p>
          )}

          {!loading && slots.length > 0 && (
            <div
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              role="radiogroup"
              aria-labelledby="horarios-label"
            >
              {slots.map((slot) => {
                const isSelected = horaInicio === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => form.setValue("horaInicio", slot, { shouldValidate: true })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-sand-300 bg-white text-charcoal-700 hover:border-rose-300"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          {form.formState.errors.horaInicio && (
            <p className="error-text" role="alert">
              {form.formState.errors.horaInicio.message}
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}
