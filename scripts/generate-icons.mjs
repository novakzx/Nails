// Script único, usado só para (re)gerar os ícones a partir de
// src/app/icon.svg (a fonte). Não faz parte do runtime da aplicação.
//
// Saídas:
//   src/app/favicon.ico, src/app/apple-icon.png — convenção do App Router
//   public/icon-192.png, public/icon-512.png    — usados pelo manifest PWA
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const svgPath = fileURLToPath(new URL("../src/app/icon.svg", import.meta.url));

async function renderPng(size, { background } = {}) {
  let img = sharp(svgPath).resize(size, size);
  if (background) {
    img = img.flatten({ background });
  }
  return img.png().toBuffer();
}

async function main() {
  const icon192 = await renderPng(192);
  await writeFile(new URL("../public/icon-192.png", import.meta.url), icon192);

  const icon512 = await renderPng(512);
  await writeFile(new URL("../public/icon-512.png", import.meta.url), icon512);

  // Apple touch icon PRECISA de fundo sólido (transparência vira preto no iOS)
  const apple = await renderPng(180, { background: "#A6573F" });
  await writeFile(new URL("../src/app/apple-icon.png", import.meta.url), apple);

  // favicon.ico a partir de PNGs 16/32
  const png16 = await renderPng(16);
  const png32 = await renderPng(32);
  const icoBuffer = await pngToIco([png16, png32]);
  await writeFile(new URL("../src/app/favicon.ico", import.meta.url), icoBuffer);

  console.log("Ícones gerados: public/icon-192.png, public/icon-512.png, src/app/apple-icon.png, src/app/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
