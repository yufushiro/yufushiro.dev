import {
  defineCollection,
  reference,
  type SchemaContext,
  z,
} from "astro:content";
import { glob } from "astro/loaders";

const authorsSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    title: z.string(),
    image: image(),
    pubDate: z.coerce.date().transform((date) => date.toISOString()),
    updatedDate: z.coerce
      .date()
      .transform((date) => date.toISOString())
      .optional(),
  });

const authors = defineCollection({
  loader: glob({ base: "./src/contents/authors", pattern: "**/*.{md,mdx}" }),
  schema: authorsSchema,
});

const contentsSchema = (_context: SchemaContext) =>
  z.object({
    title: z.string(),
    author: reference("authors"),
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

export const collections = { articles, authors };
