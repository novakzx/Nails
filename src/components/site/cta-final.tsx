import Link from "next/link";

export default function CtaFinal() {
  return (
    <section className="container-site py-16 sm:py-20">
      <div className="overflow-hidden rounded-xl2 bg-rose-500 px-6 py-14 text-center shadow-soft_lg sm:px-12">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
          Pronta para umas unhas novas?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-rose-50">
          Marca o teu horário online agora — leva menos de um minuto.
        </p>
        <Link
          href="/marcar"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-rose-600 shadow-soft transition-transform hover:scale-105"
        >
          Marcar Horário
        </Link>
      </div>
    </section>
  );
}
