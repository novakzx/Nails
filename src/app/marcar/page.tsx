import type { Metadata } from "next";
import { getActiveServices } from "@/lib/services";
import BookingWizard from "@/components/booking-wizard/booking-wizard";

export const metadata: Metadata = {
  title: "Marcar Horário",
  description: "Marca o teu horário online no estúdio Nails Von em Almada. Rápido, simples e sem WhatsApp.",
};

export default async function MarcarPage({
  searchParams,
}: {
  searchParams: Promise<{ servico?: string }>;
}) {
  const { servico } = await searchParams;
  const services = await getActiveServices();

  return (
    <div className="container-site max-w-2xl py-10 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="heading-display text-3xl sm:text-4xl">Marcar Horário</h1>
        <p className="mt-2 text-charcoal-500">Em 4 passos rápidos, sem sair do site.</p>
      </div>

      {services.length > 0 ? (
        <BookingWizard services={services} initialServiceId={servico} />
      ) : (
        <p className="text-center text-charcoal-500">
          De momento não há serviços disponíveis para marcação. Por favor volta a tentar mais tarde.
        </p>
      )}
    </div>
  );
}
