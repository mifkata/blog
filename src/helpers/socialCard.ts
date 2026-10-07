/**
 * What each page's social card (og:image) says, and in which palette. A post's
 * card wears the palette of the season it was published in; the home, about
 * and blog cards wear the season of the build.
 */
import { PALETTE_BY_MONTH, type Palette } from "@/helpers/season";

/** Social card size in px: the 1.91:1 that link previews expect */
export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

export interface CardContent {
  /** Small caps line above the title */
  eyebrow: string;
  title: string;
  /** A second, smaller line under the title */
  sub?: string;
  /** Tag chips along the bottom */
  chips: string[];
  /** Text after the chips, such as the reading time */
  meta: string;
  palette: Palette;
}

/** Cards rendered for pages other than posts; any other page uses "home". */
export type PageCard = "home" | "about" | "blog";

/** Where a card is served, e.g. "/og/blog/2026/10/some-post.png". */
export function cardPath(card: string): string {
  return `/og/${card}.png`;
}

/** The card id for a post, e.g. "blog/2026/10/some-post". */
export function postCardId(postId: string): string {
  return `blog/${postId}`;
}

/** Title size in px: long titles step down so they fit in three lines. */
export function titleSize(title: string): number {
  if (title.length <= 32) return 76;
  if (title.length <= 56) return 66;
  if (title.length <= 80) return 58;
  return 50;
}

function cardDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function postCard(post: {
  title: string;
  pubDate: Date;
  tags?: string[];
  minutes: number;
}): CardContent {
  return {
    eyebrow: `Blog · ${cardDate(post.pubDate)}`,
    title: post.title,
    chips: (post.tags ?? []).slice(0, 4),
    meta: `${post.minutes} min read`,
    palette: PALETTE_BY_MONTH[post.pubDate.getUTCMonth()],
  };
}

export function pageCards(
  builtAt: Date,
  postCount: number,
): Record<PageCard, CardContent> {
  const palette = PALETTE_BY_MONTH[builtAt.getUTCMonth()];
  return {
    home: {
      eyebrow: "Hello, my name is",
      title: "Andriyan Ivanov.",
      sub: "Holistic Product Generalist.",
      chips: [],
      meta: "AI adoption and engineering · mifkata.com",
      palette,
    },
    about: {
      eyebrow: "About",
      title: "Andriyan Ivanov",
      sub: "Born in Varna, Bulgaria in 1983.",
      chips: [],
      meta: "Holistic Product Generalist · mifkata.com/about",
      palette,
    },
    blog: {
      eyebrow: "Blog",
      title:
        "Thoughts on software engineering, AI-assisted development, and building things for the web.",
      chips: [],
      meta: `${postCount} posts · mifkata.com/blog`,
      palette,
    },
  };
}
