import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/database";

/**
 * Vai buscar os serviços ativos, nunca lançando exceção.
 *
 * Usado por páginas públicas (homepage, /servicos, /marcar) que devem
 * continuar a renderizar mesmo que o Supabase esteja em baixo ou mal
 * configurado (ex.: env vars em falta na Vercel) — nesse caso a
 * construção do próprio cliente Supabase lança uma exceção síncrona
 * *antes* de qualquer query, o que sem este try/catch arrastava a página
 * inteira para o error.tsx.
 */
export async function getActiveServices(limit?: number): Promise<Service[]> {
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
    console.error("[getActiveServices] Supabase indisponível:", error);
    return [];
  }
}
