/**
 * Fotos de unhas/manicure usadas nas várias secções do site.
 *
 * São fotos reais gratuitas do Unsplash (licença Unsplash — uso comercial
 * livre, sem necessidade de atribuição), servidas diretamente do CDN da
 * Unsplash via next/image (ver remotePatterns em next.config.mjs).
 *
 * >>> SUBSTITUIR PELA VON, QUANDO POSSÍVEL <<<
 * Estas são fotos de stock de terceiros, não trabalhos reais do estúdio.
 * Assim que a Von tiver fotos próprias dos seus trabalhos, deve
 * substituir estes URLs por imagens carregadas em /public/images ou num
 * storage (ex.: Supabase Storage), mantendo a mesma estrutura.
 */

function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;
}

export const HERO_IMAGE = {
  src: unsplash("1690749072212-373daf1d58ca", 1200),
  alt: "Mãos com manicure delicada em tom nude e pormenor floral pintado à mão",
};

export const ABOUT_IMAGE = {
  src: unsplash("1786056554886-703cd6e3f55c", 900),
  alt: "Mão a segurar ferramentas de manicure profissionais",
};

/** Imagem grande, estilo editorial, usada na secção de destaque (parallax). */
export const FEATURE_IMAGE = {
  src: unsplash("1587393794661-ef05657e10b9", 1400),
  alt: "Manicure em tom verde-escuro fosco, ambiente aconchegante",
};

/** Imagem de fundo moody usada atrás da citação em destaque dos testemunhos. */
export const SPOTLIGHT_IMAGE = {
  src: unsplash("1604654894611-6973b376cbde", 1000),
  alt: "Nail art escura com efeito tartaruga, estilo editorial",
};

type GallerySpan = "normal" | "tall" | "wide";

export const GALLERY_IMAGES: { src: string; alt: string; span: GallerySpan }[] = [
  {
    src: unsplash("1645566372784-7d017ad7643b", 700),
    alt: "Unhas em gel vermelho brilhante, estilo editorial",
    span: "tall",
  },
  {
    src: unsplash("1604654894610-df63bc536371", 700),
    alt: "Nail art em preto e efeito tartaruga",
    span: "normal",
  },
  {
    src: unsplash("1610992015762-45dca7fa3a85", 700),
    alt: "Manicure minimalista em tom nude",
    span: "normal",
  },
  {
    src: unsplash("1607779097040-26e80aa78e66", 900),
    alt: "Nail art em lilás, branco e glitter",
    span: "wide",
  },
  {
    src: unsplash("1571290274554-6a2eaa771e5f", 700),
    alt: "Manicure delicada em tom rosa suave",
    span: "normal",
  },
  {
    src: unsplash("1619607146034-5a05296c8f9a", 700),
    alt: "Nail art vermelha com desenho personalizado",
    span: "tall",
  },
  {
    src: unsplash("1696341995063-b60c66e85838", 900),
    alt: "Unhas postiças dispostas junto a flores secas",
    span: "wide",
  },
  {
    src: unsplash("1585525975637-f32a3d2c2209", 700),
    alt: "Pedicure com verniz vermelho",
    span: "normal",
  },
  {
    src: unsplash("1727199433231-346fd8101839", 700),
    alt: "Manicure em tons rosa sobre fundo pêssego",
    span: "normal",
  },
];
