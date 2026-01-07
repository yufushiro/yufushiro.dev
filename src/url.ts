import type { AstroGlobal } from "astro";

export function getCanonicalURL(Astro: AstroGlobal): URL {
  return new URL(Astro.url.pathname.replace(/\.html$/, ""), Astro.site);
}
