import seriesData from "@/data/series.json";

export interface SeriesPosition {
  title: string;
  part: number;
  total: number;
}

/**
 * A series shows once it has a second published part; until then, e.g. right
 * after its first article goes out, it's just a post.
 */
export function isShownSeries(parts: readonly unknown[]): boolean {
  return parts.length > 1;
}

export function seriesPosition(
  id: string,
  series: { title: string; items: string[] }[] = seriesData,
): SeriesPosition | undefined {
  for (const { title, items } of series) {
    const index = items.indexOf(id);
    if (index !== -1) return { title, part: index + 1, total: items.length };
  }
  return undefined;
}
