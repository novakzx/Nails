"use server";

import { createClient } from "@/lib/supabase/server";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking.schema";
import { getFreeSlotsForDate, timeToMinutes, minutesToTime } from "@/lib/availability";
import { sendAdminNewBookingEmail, sendClientBookingReceivedEmail } from "@/lib/email/resend";
import { buildWhatsappLink } from "@/lib/constants";

export interface CreateBookingResult {
  success: boolean;
  error?: string;
  whatsappLink?: string;
  resumo?: {
    servicoNome: string;
    data: string;
    horaInicio: string;
    horaFim: string;
  };
}

/**
 * Server Action que cria uma marcação. Revalida a disponibilidade no
 * servidor (nunca confia apenas na validação do cliente) e conta ainda com
 * a exclusion constraint da base de dados como última linha de defesa
 * contra corridas/concorrência (duas pessoas a submeter ao mesmo tempo).
 */
export async function createBooking(input: BookingFormValues): Promise<CreateBookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos. Verifica o formulário e tenta novamente." };
  }

  const { serviceId, data, horaInicio, nomeCliente, telefoneCliente, emailCliente, notas } = parsed.data;

  const supabase = await createClient();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, nome, duracao_minutos")
    .eq("id", serviceId)
    .eq("ativo", true)
    .single();

  if (serviceError || !service) {
    return { success: false, error: "O serviço escolhido já não está disponível." };
  }

  // Revalida no servidor que o slot escolhido continua livre — a validação
  // do cliente é só para feedback imediato, nunca é fonte de verdade.
  const freeSlots = await getFreeSlotsForDate(data, serviceId);
  if (!freeSlots.includes(horaInicio)) {
    return {
      success: false,
      error: "Este horário deixou de estar disponível. Por favor escolhe outro.",
    };
  }

  const horaFim = minutesToTime(timeToMinutes(horaInicio) + service.duracao_minutos);

  const { error: insertError } = await supabase.from("bookings").insert({
    service_id: serviceId,
    nome_cliente: nomeCliente,
    telefone_cliente: telefoneCliente,
    email_cliente: emailCliente,
    data,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
    notas: notas || null,
    estado: "pendente",
  });

  if (insertError) {
    // 23P01 = exclusion_violation — outra marcação ocupou o slot entretanto.
    if (insertError.code === "23P01") {
      return {
        success: false,
        error: "Alguém acabou de reservar este horário. Por favor escolhe outro.",
      };
    }
    console.error("[createBooking] erro ao inserir marcação:", insertError);
    return { success: false, error: "Não foi possível concluir a marcação. Tenta novamente." };
  }

  const emailData = {
    nomeCliente,
    emailCliente,
    telefoneCliente,
    servicoNome: service.nome,
    data,
    horaInicio,
    notas: notas || undefined,
  };

  // Falhas de email não devem impedir a confirmação da marcação em si.
  await Promise.allSettled([
    sendClientBookingReceivedEmail(emailData),
    sendAdminNewBookingEmail(emailData),
  ]);

  const whatsappMessage = `Olá! Acabei de marcar "${service.nome}" para o dia ${data} às ${horaInicio}. Fico a aguardar confirmação. (${nomeCliente})`;

  return {
    success: true,
    whatsappLink: buildWhatsappLink(whatsappMessage),
    resumo: { servicoNome: service.nome, data, horaInicio, horaFim },
  };
}
