"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking.schema";
import { createBooking, type CreateBookingResult } from "@/app/marcar/actions";
import Progress from "./progress";
import StepServico, { type ServiceOption } from "./step-servico";
import StepDataHora from "./step-data-hora";
import StepDados from "./step-dados";
import StepConfirmar from "./step-confirmar";
import Confirmacao from "./confirmacao";

const STEP_FIELDS: Record<number, (keyof BookingFormValues)[]> = {
  1: ["serviceId"],
  2: ["data", "horaInicio"],
  3: ["nomeCliente", "telefoneCliente", "emailCliente"],
  4: [],
};

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

export default function BookingWizard({
  services,
  initialServiceId,
}: {
  services: ServiceOption[];
  initialServiceId?: string;
}) {
  const [[step, direction], setStepState] = useState<[number, number]>([1, 1]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateBookingResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      serviceId: initialServiceId ?? "",
      data: "",
      horaInicio: "",
      nomeCliente: "",
      telefoneCliente: "",
      emailCliente: "",
      notas: "",
    },
  });

  function goToStep(next: number) {
    setStepState(([current]) => [next, next > current ? 1 : -1]);
  }

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 || (await form.trigger(fields));
    if (valid) goToStep(Math.min(step + 1, TOTAL_STEPS));
  }

  function goBack() {
    setSubmitError(null);
    goToStep(Math.max(step - 1, 1));
  }

  function onSubmit(values: BookingFormValues) {
    setSubmitError(null);
    startTransition(async () => {
      const res = await createBooking(values);
      if (!res.success) {
        setSubmitError(res.error ?? "Não foi possível concluir a marcação. Tenta novamente.");
        return;
      }
      setResult(res);
    });
  }

  if (result?.success) {
    return <Confirmacao resultado={result} />;
  }

  return (
    <div>
      <Progress current={step} />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="relative overflow-hidden">
          {/* Sem mode="wait": o passo seguinte monta de imediato em vez de
              esperar pela animação de saída do anterior terminar — evita
              que o wizard fique preso caso essa transição nunca complete
              (ex.: separador em segundo plano a meio da transição). */}
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <StepServico form={form} services={services} />}
              {step === 2 && <StepDataHora form={form} />}
              {step === 3 && <StepDados form={form} />}
              {step === 4 && <StepConfirmar form={form} services={services} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {submitError}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button type="button" onClick={goBack} className="btn-secondary" disabled={isPending}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Voltar
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <button type="button" onClick={goNext} className="btn-primary">
              Seguinte
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Confirmar Marcação
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
