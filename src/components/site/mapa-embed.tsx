import { BUSINESS } from "@/lib/constants";

export default function MapaEmbed() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl2 border border-sand-300 shadow-soft">
      <iframe
        title={`Localização do estúdio ${BUSINESS.name} em Almada`}
        src={BUSINESS.mapEmbedSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
