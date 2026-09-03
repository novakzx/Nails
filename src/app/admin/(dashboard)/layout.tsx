import Link from "next/link";
import { LayoutDashboard, CalendarDays, Scissors, Clock, CalendarRange, LogOut, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "../actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/marcacoes", label: "Marcações", icon: CalendarDays },
  { href: "/admin/servicos", label: "Serviços", icon: Scissors },
  { href: "/admin/disponibilidade", label: "Disponibilidade", icon: Clock },
  { href: "/admin/calendario", label: "Calendário", icon: CalendarRange },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-sand-100 lg:flex">
      <aside className="border-b border-sand-300 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-5 py-5">
          <Sparkles className="h-5 w-5 text-rose-500" aria-hidden="true" />
          <span className="font-serif text-lg font-semibold text-charcoal-900">Nails Von</span>
        </div>

        <nav aria-label="Navegação admin" className="px-3 pb-3 lg:pb-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href} className="shrink-0 lg:w-full">
                <Link
                  href={href}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-700 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden border-t border-sand-300 p-4 lg:block">
          <p className="truncate text-xs text-charcoal-500">{user?.email}</p>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-2 flex items-center gap-2 text-sm font-medium text-charcoal-700 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Terminar sessão
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
