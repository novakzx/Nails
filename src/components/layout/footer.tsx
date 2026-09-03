"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS, buildWhatsappLink } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-sand-300 bg-sand-100">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-semibold text-charcoal-900">Nails Von</p>
          <p className="mt-2 text-sm text-charcoal-500">
            Nail design em Almada, distrito de Setúbal. Manicure, pedicure e nail art com cuidado e detalhe.
          </p>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-charcoal-700 hover:text-rose-500"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            {BUSINESS.instagramHandle}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal-900">Morada</h3>
          <p className="mt-3 flex items-start gap-2 text-sm text-charcoal-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
            <span>
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.postalCode} {BUSINESS.address.locality}, {BUSINESS.address.region}
            </span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal-900">Contactos</h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-charcoal-500">
            <Phone className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
            <a href={`tel:${BUSINESS.phoneWhatsapp}`} className="hover:text-rose-500">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
          <a
            href={buildWhatsappLink("Olá! Gostava de saber mais sobre os vossos serviços.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
          >
            Falar no WhatsApp →
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal-900">Horário</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-charcoal-500">
            {BUSINESS.hours.map((h) => (
              <li key={h.label} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                  {h.label}
                </span>
                <span>{h.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-300">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-charcoal-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Nails Von. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/marcar" className="hover:text-rose-500">
              Marcar Horário
            </Link>
            <Link href="/admin" className="hover:text-rose-500">
              Área reservada
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
