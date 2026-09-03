"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contactos", label: "Contactos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-sand-300/70 bg-sand-100/90 backdrop-blur-md">
      <nav className="container-site flex h-16 items-center justify-between" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-1.5 font-serif text-xl font-semibold text-charcoal-900">
          <Sparkles className="h-5 w-5 text-rose-500" aria-hidden="true" />
          Nails Von
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-rose-500 ${
                  pathname === link.href ? "text-rose-500" : "text-charcoal-700"
                }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/marcar" className="btn-primary hidden md:inline-flex">
          Marcar Horário
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-charcoal-900 md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-sand-300 bg-sand-100 md:hidden">
          <ul className="container-site flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    pathname === link.href ? "bg-rose-50 text-rose-500" : "text-charcoal-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/marcar" onClick={() => setOpen(false)} className="btn-primary w-full">
                Marcar Horário
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
