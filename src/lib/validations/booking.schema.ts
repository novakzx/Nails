import { z } from "zod";

/** Validado no cliente (React Hook Form) e novamente no servidor (Server Action). */
export const bookingSchema = z.object({
  serviceId: z.string().uuid({ message: "Escolhe um serviço válido." }),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")
    .refine((val) => {
      const chosen = new Date(`${val}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return chosen >= today;
    }, "Escolhe uma data igual ou posterior a hoje."),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida."),
  nomeCliente: z
    .string()
    .trim()
    .min(2, "Indica o teu nome completo.")
    .max(100, "Nome demasiado longo."),
  telefoneCliente: z
    .string()
    .trim()
    .regex(/^(\+351)?\s?9\d{8}$/, "Indica um número de telemóvel português válido."),
  emailCliente: z.string().trim().email("Indica um email válido."),
  notas: z.string().trim().max(500, "Máximo de 500 caracteres.").optional().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
