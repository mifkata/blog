/** Months the activity rail on /tags/ covers, ending with the current one */
export const ACTIVITY_MONTHS = 12;

/** Newest post titles listed under each tag on /tags/ */
export const LATEST_PER_TAG = 2;

export interface TagInfo {
  title?: string;
  description?: string;
}

export interface TaggedPost {
  id: string;
  title: string;
  date: Date;
  tags: string[];
}

export interface ActivityMonth {
  /** "2026-10" */
  key: string;
  /** "O", the month's first letter */
  initial: string;
  /** "October 2026" */
  label: string;
}

export interface TagSummary<T extends TaggedPost> {
  slug: string;
  title: string;
  description?: string;
  count: number;
  /** The newest post's date */
  updated: Date;
  latest: T[];
  /** Posts per month, one entry per activity month, oldest first */
  activity: number[];
}

const monthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const newestFirst = <T extends { date: Date }>(posts: T[]): T[] =>
  [...posts].sort((a, b) => b.date.valueOf() - a.date.valueOf());

/** Post dates are calendar days, so months are read in UTC. */
export function activityMonths(
  now: Date,
  months = ACTIVITY_MONTHS,
): ActivityMonth[] {
  return Array.from({ length: months }, (_, i) => {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1 - i), 1),
    );
    const label = date.toLocaleDateString("en-us", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    return { key: monthKey(date), initial: label.charAt(0), label };
  });
}

export function summarizeTags<T extends TaggedPost>(
  posts: T[],
  info: Record<string, TagInfo>,
  now: Date,
  { months = ACTIVITY_MONTHS, latest = LATEST_PER_TAG } = {},
): TagSummary<T>[] {
  const window = activityMonths(now, months).map((m) => m.key);
  const bySlug = new Map<string, T[]>();
  for (const post of newestFirst(posts)) {
    for (const tag of post.tags) {
      bySlug.set(tag, [...(bySlug.get(tag) ?? []), post]);
    }
  }

  return [...bySlug.entries()]
    .map(([slug, tagged]) => ({
      slug,
      title: info[slug]?.title ?? slug,
      description: info[slug]?.description,
      count: tagged.length,
      updated: tagged[0].date,
      latest: tagged.slice(0, latest),
      activity: window.map(
        (key) => tagged.filter((post) => monthKey(post.date) === key).length,
      ),
    }))
    .sort(compareTags("recent"));
}

export const TAG_SORTS = ["recent", "posts", "az"] as const;
export type TagSort = (typeof TAG_SORTS)[number];

export const isTagSort = (value: unknown): value is TagSort =>
  TAG_SORTS.some((sort) => sort === value);

export interface TagRow {
  slug: string;
  title: string;
  count: number;
  updated: Date | number;
}

export function compareTags(sort: TagSort) {
  return (a: TagRow, b: TagRow): number => {
    const newer = b.updated.valueOf() - a.updated.valueOf();
    const more = b.count - a.count;
    const bySlug = a.slug.localeCompare(b.slug);
    if (sort === "posts") return more || newer || bySlug;
    if (sort === "az") return a.title.localeCompare(b.title) || bySlug;
    return newer || more || bySlug;
  };
}

/** A /tags/ row's sort keys, read from its `data-*` attributes */
export function tagRowFromData(
  data: Record<string, string | undefined>,
): TagRow | null {
  const count = Number(data.count);
  const updated = Date.parse(data.updated ?? "");
  if (!data.slug || !data.title || !Number.isInteger(count)) return null;
  if (Number.isNaN(updated)) return null;
  return { slug: data.slug, title: data.title, count, updated };
}

/** The activity rail's accessible name */
export function activityLabel(
  activity: number[],
  months: ActivityMonth[],
): string {
  const range = `${months[0].label} to ${months[months.length - 1].label}`;
  const active = months
    .map((month, i) => (activity[i] ? `${month.label}: ${activity[i]}` : ""))
    .filter(Boolean);
  return `Posts per month, ${range}: ${active.length ? active.join(", ") : "none"}`;
}

/** Tags sharing posts with `tag`, most shared first */
export function relatedTags(
  posts: TaggedPost[],
  tag: string,
): { slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts.filter((p) => p.tags.includes(tag))) {
    for (const other of post.tags.filter((t) => t !== tag)) {
      counts.set(other, (counts.get(other) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/** A tag cloud size from 1 (fewest posts) to 4 (most) */
export function cloudWeight(count: number, max: number): 1 | 2 | 3 | 4 {
  const weight = Math.ceil((count / Math.max(max, 1)) * 4);
  return Math.min(Math.max(weight, 1), 4) as 1 | 2 | 3 | 4;
}

export function postsByYear<T extends { date: Date }>(
  posts: T[],
): { year: number; posts: T[] }[] {
  const years: { year: number; posts: T[] }[] = [];
  for (const post of newestFirst(posts)) {
    const year = post.date.getUTCFullYear();
    const group = years.at(-1);
    if (group?.year === year) group.posts.push(post);
    else years.push({ year, posts: [post] });
  }
  return years;
}
