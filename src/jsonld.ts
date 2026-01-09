import type { AstroGlobal } from "astro";
import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import type { Person } from "schema-dts";

type Author = CollectionEntry<"authors">;

export async function generateJsonLdPerson(
  Astro: AstroGlobal,
  author: Author,
): Promise<Person> {
  const profileImage = await getImage({src: author.data.image});

  return {
    "@type": "Person",
    name: author.data.name,
    image: profileImage.src,
    alternateName: [author.id],
    url: new URL(`/authors/${author.id}`, Astro.site).toString(),
  };
}
