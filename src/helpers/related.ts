import type { ImageMetadata } from "astro";

export interface RelatedInput {
  id: string;
  tags: string[];
  date: Date;
}

export type RelatedKind = "series" | "topic" | "latest";

export interface RelatedPick {
  id: string;
  kind: RelatedKind;
  reason: string;
}

export interface RankedPick extends RelatedPick {
  score: number;
}

/** What the related posts section shows for each pick. */
export interface RelatedItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  pubDate: Date;
  heroImage?: ImageMetadata;
  minutes?: number;
  kind: RelatedKind;
  reason: string;
}

/** Below this, shared tags are too common to make two posts related. */
export const MIN_SCORE = 0.5;

/** The parts right before and after a post in its series. */
const NEIGHBOUR_BONUS = 3;

/** A post's lead comes from its best few matches, never a weak one. */
const LEAD_POOL = 3;

/** Picks per post: the section shows four, the browser may swap in the rest. */
export const RELATED_CANDIDATES = 6;

/** A tag counts by how rare it is: one on every post counts for nothing. */
export function tagWeights(posts: RelatedInput[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { tags } of posts)
    for (const tag of new Set(tags))
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return new Map(
    [...counts].map(([tag, count]) => [tag, Math.log(posts.length / count)]),
  );
}

function seriesReason(distance: number): string {
  if (distance === -1) return "Previous in the series";
  if (distance === 1) return "Next in the series";
  return distance < 0 ? "Earlier in the series" : "Later in the series";
}

interface RankOptions {
  series?: string[][];
  tagLabel?: (tag: string) => string;
}

/**
 * The posts related to `current`, best first: the neighbouring parts of its
 * series, then posts sharing its rarer tags, newer first on a tie.
 */
export function rankRelated(
  current: RelatedInput,
  posts: RelatedInput[],
  { series = [], tagLabel = (tag) => tag }: RankOptions = {},
  weights = tagWeights(posts),
): RankedPick[] {
  const weight = (tag: string) => weights.get(tag) ?? 0;
  const parts = series.find((items) => items.includes(current.id)) ?? [];
  const here = parts.indexOf(current.id);
  return posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      const shared = post.tags
        .filter((tag) => current.tags.includes(tag))
        .sort((a, b) => weight(b) - weight(a));
      let score = shared.reduce((sum, tag) => sum + weight(tag), 0);
      const there = parts.indexOf(post.id);
      let kind: RelatedKind = "topic";
      let reason = shared.length ? `Also about ${tagLabel(shared[0])}` : "";
      if (there !== -1) {
        const distance = there - here;
        if (Math.abs(distance) === 1) score += NEIGHBOUR_BONUS;
        kind = "series";
        reason = seriesReason(distance);
      }
      return { id: post.id, kind, reason, score, date: post.date };
    })
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || b.date.getTime() - a.date.getTime())
    .map(({ id, kind, reason, score }) => ({ id, kind, reason, score }));
}

/**
 * Minimum-cost assignment of rows to columns of a square matrix (the
 * Hungarian algorithm). Returns the column each row gets.
 */
export function assignment(cost: number[][]): number[] {
  const n = cost.length;
  const u = new Array<number>(n + 1).fill(0);
  const v = new Array<number>(n + 1).fill(0);
  const match = new Array<number>(n + 1).fill(0);
  const way = new Array<number>(n + 1).fill(0);
  for (let row = 1; row <= n; row++) {
    match[0] = row;
    let col0 = 0;
    const minv = new Array<number>(n + 1).fill(Infinity);
    const used = new Array<boolean>(n + 1).fill(false);
    do {
      used[col0] = true;
      const row0 = match[col0];
      let delta = Infinity;
      let col1 = 0;
      for (let col = 1; col <= n; col++) {
        if (used[col]) continue;
        const reduced = cost[row0 - 1][col - 1] - u[row0] - v[col];
        if (reduced < minv[col]) {
          minv[col] = reduced;
          way[col] = col0;
        }
        if (minv[col] < delta) {
          delta = minv[col];
          col1 = col;
        }
      }
      for (let col = 0; col <= n; col++) {
        if (used[col]) {
          u[match[col]] += delta;
          v[col] -= delta;
        } else {
          minv[col] -= delta;
        }
      }
      col0 = col1;
    } while (match[col0] !== 0);
    do {
      const col1 = way[col0];
      match[col0] = match[col1];
      col0 = col1;
    } while (col0);
  }
  const result = new Array<number>(n).fill(-1);
  for (let col = 1; col <= n; col++)
    if (match[col]) result[match[col] - 1] = col - 1;
  return result;
}

/**
 * Chooses every post's lead at once, so that no post leads on more than one
 * other, keeping as much relevance overall as possible. Each lead comes from
 * the post's best few matches. A post the spread can't place takes, from its
 * matches, the one leading on the fewest others.
 */
export function spreadLeads(
  rankings: Map<string, RankedPick[]>,
  pool = LEAD_POOL,
): Map<string, string> {
  const ids = [...rankings.keys()];
  const n = ids.length;
  const index = new Map(ids.map((id, i) => [id, i]));
  // Posts × posts, plus a "no lead" column per post and padding rows, so no
  // post is forced to lead. A post can never lead on itself.
  const cost: number[][] = Array.from({ length: 2 * n }, (_, row) =>
    Array.from({ length: 2 * n }, (_, col) =>
      row < n && col === row ? 1e6 : 0,
    ),
  );
  ids.forEach((id, row) => {
    for (const pick of rankings.get(id)!.slice(0, pool))
      cost[row][index.get(pick.id)!] = -pick.score;
  });
  const columns = assignment(cost);

  const leads = new Map<string, string>();
  const leading = new Map<string, number>();
  const lead = (id: string, pick: string) => {
    leads.set(id, pick);
    leading.set(pick, (leading.get(pick) ?? 0) + 1);
  };
  const unplaced: string[] = [];
  ids.forEach((id, row) => {
    const assigned = columns[row] < n ? ids[columns[row]] : undefined;
    const inPool = rankings
      .get(id)!
      .slice(0, pool)
      .some((pick) => pick.id === assigned);
    if (assigned && inPool) lead(id, assigned);
    else if (rankings.get(id)!.length) unplaced.push(id);
  });
  for (const id of unplaced) {
    const [fewest] = [...rankings.get(id)!].sort(
      (a, b) => (leading.get(a.id) ?? 0) - (leading.get(b.id) ?? 0),
    );
    lead(id, fewest.id);
  }
  return leads;
}

/**
 * Every post's related posts: its spread lead, the rest of its matches, then
 * the newest remaining posts, labelled as such, up to `limit`.
 */
export function relatedForAll(
  posts: RelatedInput[],
  options: RankOptions & { limit?: number } = {},
): Map<string, RelatedPick[]> {
  const { limit = RELATED_CANDIDATES } = options;
  const weights = tagWeights(posts);
  const rankings = new Map(
    posts.map((post) => [post.id, rankRelated(post, posts, options, weights)]),
  );
  const leads = spreadLeads(rankings);
  const newest = [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());

  return new Map(
    posts.map((post) => {
      const ranked = rankings.get(post.id)!;
      const lead = ranked.find((pick) => pick.id === leads.get(post.id));
      const picks: RelatedPick[] = [
        ...(lead ? [lead] : []),
        ...ranked.filter((pick) => pick !== lead),
      ]
        .slice(0, limit)
        .map(({ id, kind, reason }) => ({ id, kind, reason }));
      const taken = new Set([post.id, ...picks.map((pick) => pick.id)]);
      for (const other of newest) {
        if (picks.length >= limit) break;
        if (taken.has(other.id)) continue;
        picks.push({
          id: other.id,
          kind: "latest",
          reason: "More from the blog",
        });
      }
      return [post.id, picks];
    }),
  );
}
