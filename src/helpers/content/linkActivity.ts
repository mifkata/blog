import { normalizeUrl, type PostLink } from "./postLinks";

/** Hacker News stories need this many points to show up next to a post. */
export const MIN_POINTS = 20;

/** Milliseconds a build waits for GitHub or Hacker News before going without. */
const TIMEOUT_MS = 5000;

export interface Story {
  id: string;
  title: string;
  url: string;
  points: number;
  comments: number;
  date: Date;
}

export interface StoryHit {
  objectID: string;
  title?: string | null;
  url?: string | null;
  points?: number | null;
  num_comments?: number | null;
  created_at: string;
}

function sameUrl(a: string, b: string): boolean {
  try {
    return normalizeUrl(a) === normalizeUrl(b);
  } catch {
    return false;
  }
}

/**
 * Stories about exactly this URL, with enough points. Hacker News's URL search
 * also matches other pages that merely contain the text.
 */
export function matchingStories(
  hits: StoryHit[],
  url: string,
  minPoints = MIN_POINTS,
): Story[] {
  return hits
    .filter(
      (hit) =>
        hit.title &&
        hit.url &&
        (hit.points ?? 0) >= minPoints &&
        sameUrl(hit.url, url),
    )
    .map((hit) => ({
      id: hit.objectID,
      title: hit.title!,
      url: hit.url!,
      points: hit.points!,
      comments: hit.num_comments ?? 0,
      date: new Date(hit.created_at),
    }));
}

/** The best-known stories first, each once. */
export function topStories(stories: Story[], limit: number): Story[] {
  const unique = new Map(stories.map((story) => [story.id, story]));
  return [...unique.values()]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}

// One request per URL for the whole build, however many posts share it
const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as Promise<T>;
}

async function getJson(
  url: string,
  headers: Record<string, string> = {},
): Promise<unknown> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

export function githubStars(repo: string): Promise<number | undefined> {
  return cached(`stars:${repo}`, async () => {
    // Without a token, GitHub allows 60 requests an hour per IP
    const token = import.meta.env.GITHUB_TOKEN;
    try {
      const data = (await getJson(`https://api.github.com/repos/${repo}`, {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      })) as { stargazers_count?: number };
      return data.stargazers_count;
    } catch {
      return undefined;
    }
  });
}

export function hackerNewsStories(url: string): Promise<Story[]> {
  return cached(`hn:${url}`, async () => {
    const query = encodeURIComponent(normalizeUrl(url));
    try {
      const data = (await getJson(
        `https://hn.algolia.com/api/v1/search?query=${query}&restrictSearchableAttributes=url&tags=story&hitsPerPage=20`,
      )) as { hits: StoryHit[] };
      return matchingStories(data.hits, url);
    } catch {
      return [];
    }
  });
}

export async function withStars(
  links: PostLink[],
): Promise<(PostLink & { stars?: number })[]> {
  return Promise.all(
    links.map(async (link) =>
      link.repo ? { ...link, stars: await githubStars(link.repo) } : link,
    ),
  );
}

export async function discussions(
  links: PostLink[],
  limit = 3,
): Promise<Story[]> {
  const stories = await Promise.all(
    links.map((link) => hackerNewsStories(link.url)),
  );
  return topStories(stories.flat(), limit);
}
