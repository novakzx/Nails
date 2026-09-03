/**
 * Dados do negócio usados em vários pontos do site (rodapé, página de
 * contactos, JSON-LD, links de WhatsApp). Centralizados aqui para serem
 * fáceis de editar. A Von deve substituir pelos dados reais do estúdio.
 */
export const BUSINESS = {
  name: "Nails Von",
  phoneDisplay: "+351 900 000 000",
  // Número em formato internacional sem espaços/símbolos, para o link wa.me
  phoneWhatsapp: "351900000000",
  email: "geral@nailsvon.pt",
  instagram: "https://www.instagram.com/nailsvon",
  instagramHandle: "@nailsvon",
  address: {
    street: "Rua Example, 123",
    locality: "Almada",
    region: "Setúbal",
    postalCode: "2800-000",
    country: "Portugal",
  },
  // Coordenadas aproximadas de Almada — ajustar para a morada real
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12455.0!2d-9.1637!3d38.6795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQwJzQ2LjIiTiA5wrA5JzQ5LjMiVw!5e0!3m2!1spt-PT!2spt!4v0",
  hours: [
    { label: "Segunda a Sexta", value: "10:00 – 19:00" },
    { label: "Sábado", value: "10:00 – 15:00" },
    { label: "Domingo", value: "Encerrado" },
  ],
} as const;

/** Gera o link wa.me com mensagem pré-preenchida para uma marcação. */
export function buildWhatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.phoneWhatsapp}?text=${encoded}`;
}
