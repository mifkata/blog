import type { CollectionEntry } from "astro:content";

export const isPublished = ({ data }: CollectionEntry<"blog">) =>
  import.meta.env.DEV || !data.draft;
