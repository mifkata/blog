import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { isPublished } from "@/helpers/posts";
import { readingMinutes } from "@/helpers/reading";
import {
  pageCards,
  postCard,
  postCardId,
  type CardContent,
} from "@/helpers/socialCard";
import { renderCard } from "@/helpers/socialCardImage";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", isPublished);
  const pages = pageCards(new Date(), posts.length);
  return [
    ...posts.map((post) => ({
      params: { card: postCardId(post.id) },
      props: {
        content: postCard({
          title: post.data.title,
          pubDate: post.data.pubDate,
          tags: post.data.tags,
          minutes: readingMinutes(post.body ?? ""),
        }),
      },
    })),
    ...Object.entries(pages).map(([card, content]) => ({
      params: { card },
      props: { content },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ content: CardContent }> = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props.content)), {
    headers: { "Content-Type": "image/png" },
  });
