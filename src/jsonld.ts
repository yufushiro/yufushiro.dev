import type { AstroGlobal } from "astro";
import type { CollectionEntry } from "astro:content";
import type { Person } from "schema-dts";

type Author = CollectionEntry<"authors">;

export function generateJsonLdPerson(
  Astro: AstroGlobal,
  author: Author,
): Person {
  return {
    "@type": "Person",
    name: author.data.name,
    alternateName: [author.id],
    url: new URL(`/authors/${author.id}`, Astro.site).toString(),
  };
}
