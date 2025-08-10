import { defineCollection, z, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";

const contentsSchema = (_context: SchemaContext) =>
  z.object({
    title: z.string(),
    pubDate: z.coerce.date().transform((date) => date.toISOString()),
    updatedDate: z.coerce
      .date()
      .transform((date) => date.toISOString())
      .optional(),
  });

const articles = defineCollection({
  loader: glob({ base: "./src/contents/articles", pattern: "**/*.{md,mdx}" }),
  schema: contentsSchema,
});

export const collections = { articles };
