import "server-only";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

let configured = false;

function ensureConfigured() {
  if (configured) return true;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:geral@nailsvon.pt";

  if (!publicKey || !privateKey) {
    console.warn("[push] VAPID_PRIVATE_KEY/NEXT_PUBLIC_VAPID_PUBLIC_KEY não configuradas — push desativado.");
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

interface SubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function sendToSubscription(sub: SubscriptionKeys, payload: PushPayload) {
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload)
    );
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) {
      // Subscrição expirada/inválida — limpar da base de dados.
      const supabase = await createClient();
      await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
    } else {
      console.error("[push] falha ao enviar notificação:", error);
    }
  }
}

/** Notifica a Von (todas as subscrições admin) — usado quando entra uma nova marcação. */
export async function notifyAdmins(payload: PushPayload) {
  if (!ensureConfigured()) return;

  const supabase = await createClient();
  const { data: subs } = await supabase.rpc("get_admin_push_subscriptions");
  if (!subs || subs.length === 0) return;

  await Promise.allSettled(subs.map((sub) => sendToSubscription(sub, payload)));
}

/** Notifica a cliente de uma marcação específica — usado quando o estado muda. */
export async function notifyBookingClient(bookingId: string, payload: PushPayload) {
  if (!ensureConfigured()) return;

  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("booking_id", bookingId)
    .eq("tipo", "cliente");

  if (!subs || subs.length === 0) return;

  await Promise.allSettled(subs.map((sub) => sendToSubscription(sub, payload)));
}
