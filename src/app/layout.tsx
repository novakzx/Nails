import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";

// Tipografia: Playfair Display (serifada, elegante) para títulos
// e Inter (sans-serif limpa) para o corpo de texto.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nailsvon.pt";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nails Von — Nail Design em Almada",
    template: "%s | Nails Von",
  },
  description:
    "Estúdio de nail design em Almada, distrito de Setúbal. Manicure, pedicure e nail art. Marque o seu horário online em menos de 1 minuto.",
  keywords: [
    "nail design Almada",
    "manicure Almada",
    "pedicure Almada",
    "nail art Setúbal",
    "verniz semipermanente Almada",
    "marcação online manicure",
  ],
  authors: [{ name: "Nails Von" }],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: siteUrl,
    siteName: "Nails Von",
    title: "Nails Von — Nail Design em Almada",
    description:
      "Estúdio de nail design em Almada. Manicure, pedicure e nail art. Marque já o seu horário online.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nails Von" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nails Von — Nail Design em Almada",
    description:
      "Estúdio de nail design em Almada. Manicure, pedicure e nail art. Marque já o seu horário online.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {/* Schema.org LocalBusiness/NailSalon para SEO local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NailSalon",
              name: "Nails Von",
              image: `${siteUrl}/og-image.jpg`,
              url: siteUrl,
              telephone: "+351900000000",
              priceRange: "€€",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Rua Example, 123",
                addressLocality: "Almada",
                addressRegion: "Setúbal",
                postalCode: "2800-000",
                addressCountry: "PT",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 38.6795,
                longitude: -9.1637,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "10:00",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "15:00",
                },
              ],
              sameAs: ["https://www.instagram.com/nailsvon"],
            }),
          }}
        />
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-rose-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo principal
        </a>
        <Navbar />
        <main id="conteudo-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
