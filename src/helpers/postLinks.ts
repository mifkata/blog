export type LinkKind =
  "github" | "github-profile" | "wikipedia" | "npm" | "web";

export interface PostLink {
  url: string;
  kind: LinkKind;
  label: string;
  /** `owner/repo`, for GitHub links */
  repo?: string;
  /** A repository of the blog's author */
  own?: true;
}

const OWN_OWNER = "mifkata";

/** The author's repositories show their stars only from this count up. */
export const MIN_OWN_STARS = 20;

// The blog and its own repository aren't "elsewhere"
const OWN = [/^mifkata\.com(\/|$)/, /^github\.com\/mifkata\/blog(\/|$)/];

/** Host without `www.`, path without a trailing slash, and the query. */
export function normalizeUrl(url: string): string {
  const { hostname, pathname, search } = new URL(url);
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return `${host}${pathname.replace(/\/+$/, "")}${search}`;
}

export function classifyLink(url: string): PostLink {
  const { hostname, pathname } = new URL(url);
  const host = hostname.toLowerCase().replace(/^www\./, "");
  const parts = pathname.split("/").filter(Boolean);
  if (host === "github.com" && parts.length >= 2) {
    const repo = `${parts[0]}/${parts[1]}`;
    return {
      url: `https://github.com/${repo}`,
      kind: "github",
      label: repo,
      repo,
      ...(parts[0].toLowerCase() === OWN_OWNER && { own: true as const }),
    };
  }
  if (host === "github.com" && parts.length === 1) {
    return { url, kind: "github-profile", label: parts[0] };
  }
  if (host.endsWith(".wikipedia.org") && parts[0] === "wiki" && parts[1]) {
    return { url, kind: "wikipedia", label: wikiTitle(parts.slice(1)) };
  }
  if (host === "npmjs.com" && parts[0] === "package" && parts[1]) {
    const name =
      parts[1].startsWith("@") && parts[2]
        ? `${parts[1]}/${parts[2]}`
        : parts[1];
    return { url, kind: "npm", label: name };
  }
  return { url, kind: "web", label: normalizeUrl(url) };
}

function wikiTitle(segments: string[]): string {
  const title = segments.join("/");
  try {
    return decodeURIComponent(title).replace(/_/g, " ");
  } catch {
    return title.replace(/_/g, " ");
  }
}

/**
 * External links in a post's MDX: the author's repositories first, then the
 * rest in order of appearance. Markdown links and `url`/`href` props such as
 * GithubLink's count; code blocks don't, and every GitHub repository appears
 * once, however many of its files are linked.
 */
export function extractLinks(body: string): PostLink[] {
  const prose = body.replace(/```[\s\S]*?```/g, " ");
  const pattern =
    /\]\((https?:\/\/[^)\s]+)\)|(?:url|href)="(https?:\/\/[^"]+)"/g;
  const seen = new Set<string>();
  const links: PostLink[] = [];
  for (const match of prose.matchAll(pattern)) {
    const url = match[1] ?? match[2];
    let key: string;
    try {
      key = normalizeUrl(url);
    } catch {
      continue;
    }
    if (OWN.some((own) => own.test(key))) continue;
    const link = classifyLink(url);
    const id = link.repo ? `github.com/${link.repo}` : key;
    if (seen.has(id)) continue;
    seen.add(id);
    links.push(link);
  }
  return [...links.filter((l) => l.own), ...links.filter((l) => !l.own)];
}

export function shownStars(
  link: PostLink & { stars?: number },
): number | undefined {
  if (link.stars === undefined) return undefined;
  return link.own && link.stars < MIN_OWN_STARS ? undefined : link.stars;
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 2269 → "2.3k", 179705 → "179.7k" */
export function compactNumber(value: number): string {
  return compact.format(value).toLowerCase();
}
