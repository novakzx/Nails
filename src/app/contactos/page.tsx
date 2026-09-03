import type { Metadata } from "next";
import { Phone, Mail, Camera, MapPin, Clock } from "lucide-react";
import MapaEmbed from "@/components/site/mapa-embed";
import { BUSINESS, buildWhatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contactos",
  description:
    "Contacta o estúdio Nails Von em Almada: morada, telefone, WhatsApp, Instagram e horário de funcionamento.",
};

export default function ContactosPage() {
  return (
    <div className="container-site py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="heading-display text-4xl sm:text-5xl">Contactos</h1>
        <p className="mt-4 text-charcoal-500">Estamos à tua espera em Almada, distrito de Setúbal.</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card flex items-start gap-4 p-5">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-charcoal-900">Morada</h2>
              <p className="mt-1 text-sm text-charcoal-500">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.postalCode} {BUSINESS.address.locality}, {BUSINESS.address.region}
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4 p-5">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-charcoal-900">Telefone / WhatsApp</h2>
              <p className="mt-1 text-sm text-charcoal-500">
                <a href={`tel:${BUSINESS.phoneWhatsapp}`} className="hover:text-rose-500">
                  {BUSINESS.phoneDisplay}
                </a>
              </p>
              <a
                href={buildWhatsappLink("Olá! Gostava de saber mais sobre os vossos serviços.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                Enviar mensagem no WhatsApp →
              </a>
            </div>
          </div>

          <div className="card flex items-start gap-4 p-5">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-charcoal-900">Email</h2>
              <p className="mt-1 text-sm text-charcoal-500">
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-rose-500">
                  {BUSINESS.email}
                </a>
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4 p-5">
            <Camera className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-charcoal-900">Instagram</h2>
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-charcoal-500 hover:text-rose-500"
              >
                {BUSINESS.instagramHandle}
              </a>
            </div>
          </div>

          <div className="card flex items-start gap-4 p-5">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-charcoal-900">Horário</h2>
              <ul className="mt-1 space-y-1 text-sm text-charcoal-500">
                {BUSINESS.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-6">
                    <span>{h.label}</span>
                    <span>{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <MapaEmbed />
      </div>
    </div>
  );
}
