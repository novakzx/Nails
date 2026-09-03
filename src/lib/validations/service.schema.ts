import { z } from "zod";

export const serviceSchema = z.object({
  nome: z.string().trim().min(2, "Indica o nome do serviço.").max(100),
  descricao: z.string().trim().max(500).optional().or(z.literal("")),
  duracaoMinutos: z.coerce
    .number({ message: "Indica a duração em minutos." })
    .int()
    .min(5, "Duração mínima de 5 minutos.")
    .max(480, "Duração máxima de 8 horas."),
  preco: z.coerce
    .number({ message: "Indica o preço." })
    .min(0, "O preço não pode ser negativo.")
    .max(9999, "Preço demasiado elevado."),
  ativo: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const availabilityRuleSchema = z.object({
  diaDaSemana: z.coerce.number().int().min(0).max(6),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida."),
  horaFim: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida."),
  ativo: z.boolean().default(true),
});

export const blockedSlotSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().or(z.literal("")),
  horaFim: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().or(z.literal("")),
  motivo: z.string().trim().max(200).optional().or(z.literal("")),
});
