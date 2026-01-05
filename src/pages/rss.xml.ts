import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export const GET: APIRoute = async (context) => {
  const authors = await getCollection("authors");
  const posts = await getCollection("articles");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map(
      (post): RSSFeedItem => ({
        title: post.data.title,
        author: authors.find((x) => x.id === post.data.author.id)?.data.name,
        pubDate: new Date(post.data.pubDate),
        link: `/articles/${post.id}`,
      }),
    ),
  });
};
