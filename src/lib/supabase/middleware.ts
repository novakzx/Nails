import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Atualiza a sessão Supabase em cada pedido e protege as rotas /admin
 * (exceto /admin/login) exigindo autenticação.
 *
 * Falha SEMPRE fechado: se a configuração do Supabase estiver em falta ou
 * inválida (ex.: env vars vazias na Vercel) ou o pedido de sessão rebentar
 * por qualquer razão, tratamos como "não autenticado" e redirecionamos
 * para o login, em vez de deixar o erro propagar e derrubar o middleware
 * (o que a Vercel reporta como MIDDLEWARE_INVOCATION_FAILED / 500).
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname.startsWith("/admin/login");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[middleware] NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY em falta — a negar acesso ao admin."
    );
    if (isLoginRoute) return NextResponse.next({ request });
    return redirectToLogin(request);
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isLoginRoute && !user) {
      return redirectToLogin(request);
    }

    if (isLoginRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[middleware] Erro ao verificar sessão Supabase:", error);
    if (isLoginRoute) return NextResponse.next({ request });
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("redirectTo", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}
