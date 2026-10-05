/** A post as the home page lists it. */
export interface RecentPost {
  id: string;
  title: string;
  description?: string;
  date: Date;
  tags: string[];
  minutes: number;
}

export interface RecentRow extends RecentPost {
  url: string;
  /** Its part in the series featured above it, if it's one */
  part?: number;
  /** Its rarest tag across the blog, shown when it's not a series part */
  tag?: string;
}

export interface RecentGroup {
  label: string;
  rows: RecentRow[];
}

export interface RecentIndex {
  /** Years in the margin when the posts span several, months when they don't */
  by: "year" | "month";
  eyebrow: string;
  groups: RecentGroup[];
}

interface IndexOptions {
  /** How many posts carry each tag, across the blog */
  counts: Map<string, number>;
  /** URLs of the featured series' parts, in order */
  seriesUrls?: string[];
}

export function tagCounts(posts: { tags: string[] }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { tags } of posts)
    for (const tag of new Set(tags))
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return counts;
}

/**
 * The tag the fewest posts share. On a tie, the later one in the post's own
 * list, which tends to be the more specific.
 */
export function rarestTag(
  tags: string[],
  counts: Map<string, number>,
): string | undefined {
  let rarest: string | undefined;
  for (const tag of tags)
    if (rarest === undefined || (counts.get(tag) ?? 0) <= counts.get(rarest)!)
      rarest = tag;
  return rarest;
}

// Local time, like FormattedDate
const yearOf = (date: Date) => String(date.getFullYear());
const monthOf = (date: Date) =>
  date.toLocaleDateString("en-us", { month: "long" });

function eyebrow(posts: RecentPost[], by: RecentIndex["by"]): string {
  const oldest = posts.at(-1)?.date;
  if (!oldest) return "Writing";
  const count = `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;
  return by === "year"
    ? `Writing · ${count} since ${oldest.toLocaleDateString("en-us", { month: "short", year: "numeric" })}`
    : `Writing · ${count} in ${yearOf(oldest)}`;
}

/** Groups posts, newest first, by year or by month and marks series parts. */
export function recentIndex(
  posts: RecentPost[],
  { counts, seriesUrls = [] }: IndexOptions,
): RecentIndex {
  const by =
    new Set(posts.map((post) => yearOf(post.date))).size > 1 ? "year" : "month";
  const groups: RecentGroup[] = [];
  for (const post of posts) {
    const url = `/blog/${post.id}/`;
    const part = seriesUrls.indexOf(url) + 1;
    const row: RecentRow = part
      ? { ...post, url, part }
      : { ...post, url, tag: rarestTag(post.tags, counts) };
    const label = by === "year" ? yearOf(post.date) : monthOf(post.date);
    const last = groups.at(-1);
    if (last?.label === label) last.rows.push(row);
    else groups.push({ label, rows: [row] });
  }
  return { by, eyebrow: eyebrow(posts, by), groups };
}
