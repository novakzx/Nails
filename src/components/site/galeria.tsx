import Image from "next/image";
import { GALLERY_IMAGES } from "@/lib/placeholder-images";

export default function Galeria() {
  return (
    <section className="bg-sand-100 py-16 sm:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl sm:text-4xl">Galeria de trabalhos</h2>
          <p className="mt-4 text-charcoal-500">Uma amostra dos nossos trabalhos de nail art.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="group relative aspect-square overflow-hidden rounded-xl2 shadow-soft"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
