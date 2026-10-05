export type LinkKind = "github" | "npm" | "web";

export interface PostLink {
  url: string;
  kind: LinkKind;
  label: string;
  /** `owner/repo`, for GitHub links */
  repo?: string;
}

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
    };
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

/**
 * External links in a post's MDX, in order of appearance: markdown links and
 * `url`/`href` props such as GithubLink's. Code blocks don't count, and every
 * GitHub repository appears once, however many of its files are linked.
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
  return links;
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 2269 → "2.3k", 179705 → "179.7k" */
export function compactNumber(value: number): string {
  return compact.format(value).toLowerCase();
}
