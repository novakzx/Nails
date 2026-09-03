import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase com a service role key — ignora RLS por completo.
 * NUNCA importar este ficheiro num Client Component. Reservado para
 * operações administrativas pontuais (ex.: scripts de manutenção).
 * Não é usado no fluxo normal do site: admin e cliente público
 * funcionam com o cliente "server.ts" respeitando as políticas de RLS.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está definida.");
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
