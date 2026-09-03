import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, DEMO_SERVICES } from "@/lib/demo-data";
import type { Service } from "@/types/database";

/**
 * Vai buscar os serviços ativos, nunca lançando exceção.
 *
 * Sem Supabase configurado, devolve os serviços de demonstração (ver
 * lib/demo-data.ts) em vez de uma lista vazia — assim o site nunca fica
 * "vazio" ao ser apresentado antes de a base de dados estar ligada.
 */
export async function getActiveServices(limit?: number): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return limit ? DEMO_SERVICES.slice(0, limit) : DEMO_SERVICES;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("services").select("*").eq("ativo", true).order("preco", { ascending: true });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error("[getActiveServices] erro Supabase:", error.message);
      return [];
    }
    return data ?? [];
  } catch (error) {
    // O Next.js usa uma exceção especial (digest "DYNAMIC_SERVER_USAGE")
    // para marcar internamente uma rota como dinâmica quando deteta o uso
    // de cookies() durante uma tentativa de pré-renderização estática —
    // não é um erro real e TEM de continuar a propagar, senão a deteção
    // de rotas dinâmicas do Next deixa de funcionar corretamente.
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }

    console.error("[getActiveServices] Supabase indisponível:", error);
    return [];
  }
}
