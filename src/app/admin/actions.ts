"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendClientStatusUpdateEmail } from "@/lib/email/resend";
import type { BookingStatus } from "@/types/database";
import {
  serviceSchema,
  availabilityRuleSchema,
  blockedSlotSchema,
} from "@/lib/validations/service.schema";

export interface FormActionState {
  error?: string;
  success?: boolean;
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------
export async function loginAction(
  _prevState: FormActionState | undefined,
  formData: FormData
): Promise<FormActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preenche email e palavra-passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou palavra-passe incorretos." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Marcações
// ---------------------------------------------------------------------------
export async function updateBookingStatus(bookingId: string, estado: BookingStatus) {
  const supabase = await createClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { error: "Marcação não encontrada." };
  }

  const { error } = await supabase.from("bookings").update({ estado }).eq("id", bookingId);
  if (error) {
    return { error: "Não foi possível atualizar o estado da marcação." };
  }

  const { data: service } = await supabase
    .from("services")
    .select("nome")
    .eq("id", booking.service_id)
    .single();

  await sendClientStatusUpdateEmail(
    {
      nomeCliente: booking.nome_cliente,
      emailCliente: booking.email_cliente,
      telefoneCliente: booking.telefone_cliente,
      servicoNome: service?.nome ?? "Serviço",
      data: booking.data,
      horaInicio: booking.hora_inicio.slice(0, 5),
    },
    estado
  );

  revalidatePath("/admin");
  revalidatePath("/admin/marcacoes");
  revalidatePath("/admin/calendario");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------
export async function upsertService(
  _prevState: FormActionState | undefined,
  formData: FormData
): Promise<FormActionState> {
  const id = formData.get("id")?.toString() || undefined;

  const parsed = serviceSchema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    duracaoMinutos: formData.get("duracaoMinutos"),
    preco: formData.get("preco"),
    ativo: formData.get("ativo") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const payload = {
    nome: parsed.data.nome,
    descricao: parsed.data.descricao || null,
    duracao_minutos: parsed.data.duracaoMinutos,
    preco: parsed.data.preco,
    ativo: parsed.data.ativo,
  };

  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);

  if (error) {
    return { error: "Não foi possível guardar o serviço." };
  }

  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
  if (error) return { error: "Não foi possível eliminar (pode ter marcações associadas)." };
  return { success: true };
}

export async function toggleServiceAtivo(id: string, ativo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update({ ativo }).eq("id", id);
  revalidatePath("/admin/servicos");
  revalidatePath("/servicos");
  revalidatePath("/");
  if (error) return { error: "Não foi possível atualizar o serviço." };
  return { success: true };
}

// ---------------------------------------------------------------------------
// Disponibilidade — regras semanais
// ---------------------------------------------------------------------------
export async function upsertAvailabilityRule(
  _prevState: FormActionState | undefined,
  formData: FormData
): Promise<FormActionState> {
  const id = formData.get("id")?.toString() || undefined;

  const parsed = availabilityRuleSchema.safeParse({
    diaDaSemana: formData.get("diaDaSemana"),
    horaInicio: formData.get("horaInicio"),
    horaFim: formData.get("horaFim"),
    ativo: formData.get("ativo") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  if (parsed.data.horaFim <= parsed.data.horaInicio) {
    return { error: "A hora de fim deve ser depois da hora de início." };
  }

  const supabase = await createClient();
  const payload = {
    dia_da_semana: parsed.data.diaDaSemana,
    hora_inicio: parsed.data.horaInicio,
    hora_fim: parsed.data.horaFim,
    ativo: parsed.data.ativo,
  };

  const { error } = id
    ? await supabase.from("availability_rules").update(payload).eq("id", id)
    : await supabase.from("availability_rules").insert(payload);

  if (error) return { error: "Não foi possível guardar a regra de disponibilidade." };

  revalidatePath("/admin/disponibilidade");
  return { success: true };
}

export async function deleteAvailabilityRule(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("availability_rules").delete().eq("id", id);
  revalidatePath("/admin/disponibilidade");
  if (error) return { error: "Não foi possível remover a regra." };
  return { success: true };
}

// ---------------------------------------------------------------------------
// Disponibilidade — bloqueios pontuais
// ---------------------------------------------------------------------------
export async function createBlockedSlot(
  _prevState: FormActionState | undefined,
  formData: FormData
): Promise<FormActionState> {
  const parsed = blockedSlotSchema.safeParse({
    data: formData.get("data"),
    horaInicio: formData.get("horaInicio"),
    horaFim: formData.get("horaFim"),
    motivo: formData.get("motivo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const horaInicio = parsed.data.horaInicio || null;
  const horaFim = parsed.data.horaFim || null;
  if ((horaInicio && !horaFim) || (!horaInicio && horaFim)) {
    return { error: "Indica hora de início e de fim, ou deixa ambas em branco para bloquear o dia todo." };
  }
  if (horaInicio && horaFim && horaFim <= horaInicio) {
    return { error: "A hora de fim deve ser depois da hora de início." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("blocked_slots").insert({
    data: parsed.data.data,
    hora_inicio: horaInicio,
    hora_fim: horaFim,
    motivo: parsed.data.motivo || null,
  });

  if (error) return { error: "Não foi possível criar o bloqueio." };

  revalidatePath("/admin/disponibilidade");
  return { success: true };
}

export async function deleteBlockedSlot(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
  revalidatePath("/admin/disponibilidade");
  if (error) return { error: "Não foi possível remover o bloqueio." };
  return { success: true };
}

// ---------------------------------------------------------------------------
// Definições gerais
// ---------------------------------------------------------------------------
export async function updateBufferMinutos(id: string, bufferMinutos: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update({ buffer_minutos: bufferMinutos })
    .eq("id", id);
  revalidatePath("/admin/disponibilidade");
  if (error) return { error: "Não foi possível atualizar o intervalo entre marcações." };
  return { success: true };
}
