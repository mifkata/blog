import { getCollection, type CollectionEntry } from "astro:content";
import { isPublished } from "./posts";
import { firstParagraph, readingMinutes } from "./reading";
import seriesData from "@/data/series.json";

export interface SeriesPart {
  url: string;
  title: string;
  synopsis?: string;
  heroImage?: ImageMetadata;
  updatedDate: Date;
  readingMinutes: number;
}

type SeriesEntry = CollectionEntry<"blog"> & { url: string; title: string };

export async function getSeriesWithPosts(slug: string) {
  const series = seriesData.find((s) => s.slug === slug);
  if (!series) {
    throw new Error(`Series "${slug}" not found`);
  }

  const blogPosts = await getCollection("blog", isPublished);

  const items = blogPosts
    .reduce<SeriesEntry[]>((acc, p) => {
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

export async function getFeaturedSeries(slug: string) {
  const { title, description, items } = await getSeriesWithPosts(slug);
  const parts: SeriesPart[] = items.map((item) => ({
    url: item.url,
    title: item.title,
    synopsis: firstParagraph(item.data.synopsis ?? item.data.description),
    heroImage: item.data.heroImage,
    updatedDate: item.data.updatedDate ?? item.data.pubDate,
    readingMinutes: readingMinutes(item.body ?? ""),
  }));
  return { title, description, parts };
}
