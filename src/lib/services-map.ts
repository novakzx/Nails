import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Devolve um mapa id → nome de serviço para um conjunto de service_id.
 *
 * Preferimos isto a usar a sintaxe de "embedded select" do Supabase
 * (`.select("*, service:services(nome)")`) porque o nosso tipo `Database`
 * é escrito à mão (sem metadados de foreign keys gerados), o que faz o
 * supabase-js falhar a inferência de tipos desse tipo de junção.
 */
export async function getServiceNamesMap(
  supabase: SupabaseClient<Database>,
  serviceIds: string[]
): Promise<Map<string, string>> {
  const uniqueIds = Array.from(new Set(serviceIds));
  if (uniqueIds.length === 0) return new Map();

  const { data } = await supabase.from("services").select("id, nome").in("id", uniqueIds);
  return new Map((data ?? []).map((s) => [s.id, s.nome]));
}
