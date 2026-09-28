import type { CollectionEntry } from "astro:content";

// Drafts are visible in dev, excluded from production builds.
export const isPublished = ({ data }: CollectionEntry<"blog">) =>
  import.meta.env.DEV || !data.draft;
