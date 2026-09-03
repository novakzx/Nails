"use server";

import { createClient } from "@/lib/supabase/server";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking.schema";
import { getFreeSlotsForDate, timeToMinutes, minutesToTime } from "@/lib/availability";
import { sendAdminNewBookingEmail, sendClientBookingReceivedEmail } from "@/lib/email/resend";
import { notifyAdmins } from "@/lib/push/send";
import { buildWhatsappLink } from "@/lib/constants";
import { isSupabaseConfigured, DEMO_SERVICES } from "@/lib/demo-data";

export interface CreateBookingResult {
  success: boolean;
  error?: string;
  whatsappLink?: string;
  bookingId?: string;
  /** true quando a marcação foi só simulada (Supabase ainda não configurado). */
  demo?: boolean;
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

  // Modo de demonstração: sem Supabase configurado, simula uma marcação
  // bem-sucedida (sem gravar nada) para o site nunca parecer "partido"
  // numa apresentação. Assim que o Supabase for ligado a sério, este
  // bloco deixa de ser usado e passa tudo a gravar dados reais.
  if (!isSupabaseConfigured()) {
    const service = DEMO_SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return { success: false, error: "O serviço escolhido já não está disponível." };
    }

    const freeSlots = await getFreeSlotsForDate(data, serviceId);
    if (!freeSlots.includes(horaInicio)) {
      return { success: false, error: "Este horário deixou de estar disponível. Por favor escolhe outro." };
    }

    const horaFim = minutesToTime(timeToMinutes(horaInicio) + service.duracao_minutos);
    const whatsappMessage = `Olá! Acabei de marcar "${service.nome}" para o dia ${data} às ${horaInicio}. Fico a aguardar confirmação. (${nomeCliente})`;

    return {
      success: true,
      demo: true,
      whatsappLink: buildWhatsappLink(whatsappMessage),
      bookingId: crypto.randomUUID(),
      resumo: { servicoNome: service.nome, data, horaInicio, horaFim },
    };
  }

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

  // Geramos o id no servidor (em vez de pedir de volta com .select() após o
  // insert): "anon" não tem policy de SELECT em bookings — sem essa
  // policy, um INSERT ... RETURNING não devolveria a linha — por isso
  // fornecemos já o id, que a coluna aceita em vez do seu default.
  const bookingId = crypto.randomUUID();

  const { error: insertError } = await supabase.from("bookings").insert({
    id: bookingId,
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

  // Falhas de email/push não devem impedir a confirmação da marcação em si.
  await Promise.allSettled([
    sendClientBookingReceivedEmail(emailData),
    sendAdminNewBookingEmail(emailData),
    notifyAdmins({
      title: "Nova marcação pendente",
      body: `${nomeCliente} — ${service.nome} em ${data} às ${horaInicio}`,
      url: "/admin/marcacoes",
    }),
  ]);

  const whatsappMessage = `Olá! Acabei de marcar "${service.nome}" para o dia ${data} às ${horaInicio}. Fico a aguardar confirmação. (${nomeCliente})`;

  return {
    success: true,
    whatsappLink: buildWhatsappLink(whatsappMessage),
    bookingId,
    resumo: { servicoNome: service.nome, data, horaInicio, horaFim },
  };
}

/** Guarda a subscrição push da cliente, associada à marcação que acabou de criar. */
export async function subscribeClientPush(bookingId: string, subscription: PushSubscriptionJSON) {
  if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return { error: "Subscrição inválida." };
  }

  if (!isSupabaseConfigured()) {
    return { success: true }; // modo de demonstração — nada para gravar
  }

  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").insert({
    tipo: "cliente",
    booking_id: bookingId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });

  if (error) {
    console.error("[subscribeClientPush]", error);
    return { error: "Não foi possível ativar as notificações." };
  }
  return { success: true };
}
