import Image from "next/image";
import { GALLERY_IMAGES } from "@/lib/site-images";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export default function Galeria() {
  return (
    <section className="bg-sand-100 py-14 sm:py-20">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">Galeria de trabalhos</h2>
          <p className="mt-4 text-charcoal-500">Uma amostra dos nossos trabalhos de nail art.</p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY_IMAGES.map((img, i) => (
            <RevealItem key={img.src} className="group relative aspect-square overflow-hidden rounded-xl2 shadow-soft">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-900/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
