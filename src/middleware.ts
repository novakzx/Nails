import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Só o /admin precisa de autenticação — restringir o matcher a essa árvore
// (em vez de quase todas as rotas) limita o "raio de explosão": um erro
// aqui dentro deixa de conseguir derrubar o site público inteiro.
export const config = {
  matcher: ["/admin/:path*"],
};
