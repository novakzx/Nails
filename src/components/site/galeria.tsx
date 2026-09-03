import Image from "next/image";
import { GALLERY_IMAGES } from "@/lib/site-images";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const SPAN_CLASSES: Record<string, string> = {
  normal: "",
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
};

export default function Galeria() {
  return (
    <section className="bg-sand-100 py-16 sm:py-24">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">04 · Portfólio</span>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">Galeria de trabalhos</h2>
          <p className="mt-4 text-charcoal-500">Uma amostra dos nossos trabalhos de nail art.</p>
        </Reveal>

        <RevealGroup className="mt-10 grid auto-rows-[140px] grid-cols-2 gap-2.5 sm:mt-14 sm:auto-rows-[180px] sm:grid-cols-4 sm:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <RevealItem
              key={img.src}
              className={`group relative overflow-hidden rounded-xl2 shadow-soft ${SPAN_CLASSES[img.span]}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
