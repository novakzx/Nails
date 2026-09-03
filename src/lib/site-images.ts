/**
 * Fotos de unhas/manicure usadas na Hero, Galeria e Sobre.
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
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const HERO_IMAGE = {
  src: unsplash("1690749072212-373daf1d58ca", 1200),
  alt: "Mãos com manicure delicada em tom nude e pormenor floral pintado à mão",
};

export const ABOUT_IMAGE = {
  src: unsplash("1786056554886-703cd6e3f55c", 900),
  alt: "Mão a segurar ferramentas de manicure profissionais",
};

export const GALLERY_IMAGES = [
  {
    src: unsplash("1645566372784-7d017ad7643b", 700),
    alt: "Unhas em gel vermelho brilhante, estilo editorial",
  },
  {
    src: unsplash("1604654894610-df63bc536371", 700),
    alt: "Nail art em preto e efeito tartaruga",
  },
  {
    src: unsplash("1610992015762-45dca7fa3a85", 700),
    alt: "Manicure minimalista em tom nude",
  },
  {
    src: unsplash("1607779097040-26e80aa78e66", 700),
    alt: "Nail art em lilás, branco e glitter",
  },
  {
    src: unsplash("1571290274554-6a2eaa771e5f", 700),
    alt: "Manicure delicada em tom rosa suave",
  },
  {
    src: unsplash("1619607146034-5a05296c8f9a", 700),
    alt: "Nail art vermelha com desenho personalizado",
  },
  {
    src: unsplash("1585525975637-f32a3d2c2209", 700),
    alt: "Pedicure com verniz vermelho",
  },
  {
    src: unsplash("1727199433231-346fd8101839", 700),
    alt: "Manicure em tons rosa sobre fundo pêssego",
  },
];
