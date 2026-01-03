import { getCollection } from "astro:content";
import seriesData from "@/data/series.json";

export async function getSeriesWithPosts(slug: string) {
  const series = seriesData.find((s) => s.slug === slug);
  if (!series) {
    throw new Error(`Series "${slug}" not found`);
  }

  const blogPosts = await getCollection("blog");

  const items = blogPosts
    .reduce((acc, p) => {
      const index = series.items.indexOf(p.id); // persist order
      if (index !== -1) {
        const url = `/blog/${p.id}/`;

        acc[index] = {
          ...p,
          url,
          title: (p.data?.title || url).replace(series.trim || "", ""),
        };
      }

      return acc;
    }, [])
    .filter(Boolean);

  return {
    ...series,
    items,
  };
}
