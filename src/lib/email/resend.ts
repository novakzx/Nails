import "server-only";
import { Resend } from "resend";
import { BUSINESS } from "@/lib/constants";
import type { BookingStatus } from "@/types/database";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null; // permite correr em dev sem chave configurada
  return new Resend(apiKey);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "Nails Von <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? BUSINESS.email;

interface BookingEmailData {
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: string;
  servicoNome: string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:MM
  notas?: string;
}

function formatDataPt(data: string) {
  const d = new Date(`${data}T00:00:00`);
  return d.toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

/** Email enviado à cliente confirmando que o pedido de marcação foi recebido. */
export async function sendClientBookingReceivedEmail(booking: BookingEmailData) {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY não configurada — email não enviado (dev).");
    return;
  }

  await client.emails.send({
    from: FROM,
    to: booking.emailCliente,
    subject: `Pedido de marcação recebido — ${BUSINESS.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#2A211D;">
        <h1 style="color:#A6573F; font-size: 20px;">Recebemos o teu pedido de marcação 💅</h1>
        <p>Olá ${escapeHtml(booking.nomeCliente)},</p>
        <p>O teu pedido de marcação na <strong>${BUSINESS.name}</strong> foi recebido com sucesso e está <strong>pendente de confirmação</strong>.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0; color:#6B5D56;">Serviço</td><td style="padding:6px 0; text-align:right;"><strong>${escapeHtml(booking.servicoNome)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Data</td><td style="padding:6px 0; text-align:right;"><strong>${formatDataPt(booking.data)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Hora</td><td style="padding:6px 0; text-align:right;"><strong>${booking.horaInicio}</strong></td></tr>
        </table>
        <p>Vais receber um novo email assim que a marcação for confirmada pela Von. Se precisares de alterar algo, contacta-nos pelo WhatsApp ${BUSINESS.phoneDisplay}.</p>
        <p style="margin-top: 24px; color:#6B5D56; font-size: 13px;">${BUSINESS.name} · ${BUSINESS.address.locality}, ${BUSINESS.address.region}</p>
      </div>
    `,
  });
}

/** Email enviado à Von avisando de um novo pedido de marcação. */
export async function sendAdminNewBookingEmail(booking: BookingEmailData) {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY não configurada — email não enviado (dev).");
    return;
  }

  await client.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Nova marcação pendente — ${escapeHtml(booking.nomeCliente)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#2A211D;">
        <h1 style="color:#A6573F; font-size: 20px;">Nova marcação pendente</h1>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0; color:#6B5D56;">Cliente</td><td style="padding:6px 0; text-align:right;"><strong>${escapeHtml(booking.nomeCliente)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Telefone</td><td style="padding:6px 0; text-align:right;">${escapeHtml(booking.telefoneCliente)}</td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Email</td><td style="padding:6px 0; text-align:right;">${escapeHtml(booking.emailCliente)}</td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Serviço</td><td style="padding:6px 0; text-align:right;"><strong>${escapeHtml(booking.servicoNome)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Data</td><td style="padding:6px 0; text-align:right;"><strong>${formatDataPt(booking.data)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Hora</td><td style="padding:6px 0; text-align:right;"><strong>${booking.horaInicio}</strong></td></tr>
          ${booking.notas ? `<tr><td style="padding:6px 0; color:#6B5D56;">Notas</td><td style="padding:6px 0; text-align:right;">${escapeHtml(booking.notas)}</td></tr>` : ""}
        </table>
        <p>Acede ao painel admin para aceitar ou recusar esta marcação.</p>
      </div>
    `,
  });
}

/** Email enviado à cliente quando o estado da marcação muda (confirmada/cancelada/concluída). */
export async function sendClientStatusUpdateEmail(
  booking: BookingEmailData,
  estado: BookingStatus
) {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY não configurada — email não enviado (dev).");
    return;
  }

  const mensagens: Record<BookingStatus, { assunto: string; texto: string }> = {
    pendente: { assunto: "Marcação pendente", texto: "A tua marcação está pendente de confirmação." },
    confirmada: {
      assunto: "Marcação confirmada ✅",
      texto: "A tua marcação foi confirmada! Contamos contigo.",
    },
    cancelada: {
      assunto: "Marcação cancelada",
      texto: "A tua marcação foi cancelada. Se foi engano ou queres remarcar, contacta-nos.",
    },
    concluida: {
      assunto: "Obrigada pela tua visita 💅",
      texto: "Esperamos que tenhas adorado o resultado! Até à próxima.",
    },
  };

  const { assunto, texto } = mensagens[estado];

  await client.emails.send({
    from: FROM,
    to: booking.emailCliente,
    subject: `${assunto} — ${BUSINESS.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#2A211D;">
        <h1 style="color:#A6573F; font-size: 20px;">${assunto}</h1>
        <p>Olá ${escapeHtml(booking.nomeCliente)},</p>
        <p>${texto}</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0; color:#6B5D56;">Serviço</td><td style="padding:6px 0; text-align:right;"><strong>${escapeHtml(booking.servicoNome)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Data</td><td style="padding:6px 0; text-align:right;"><strong>${formatDataPt(booking.data)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6B5D56;">Hora</td><td style="padding:6px 0; text-align:right;"><strong>${booking.horaInicio}</strong></td></tr>
        </table>
        <p style="margin-top: 24px; color:#6B5D56; font-size: 13px;">${BUSINESS.name} · ${BUSINESS.address.locality}, ${BUSINESS.address.region}</p>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
