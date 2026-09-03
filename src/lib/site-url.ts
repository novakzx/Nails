const DEFAULT_SITE_URL = "https://nailsvon.pt";

/**
 * URL pública do site, com fallback seguro.
 *
 * Não usar `??` diretamente em `process.env.NEXT_PUBLIC_SITE_URL` — se a
 * variável ficar definida mas vazia (ex.: configurada em branco no painel
 * da Vercel), `??` não apanha esse caso (só trata `null`/`undefined`), e
 * `new URL("")` rebenta o build (aconteceu em produção). Aqui tratamos
 * também string vazia e qualquer valor que não seja um URL válido.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    console.warn(`NEXT_PUBLIC_SITE_URL inválido ("${raw}"), a usar valor por omissão.`);
    return DEFAULT_SITE_URL;
  }
}
