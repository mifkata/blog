import { describe, expect, it } from "vitest";
import {
  cardPath,
  pageCards,
  postCard,
  postCardId,
  titleSize,
} from "./socialCard";

describe("cardPath", () => {
  it("serves a post's card next to the other cards", () => {
    expect(cardPath(postCardId("2026/10/some-post"))).toBe(
      "/og/blog/2026/10/some-post.png",
    );
    expect(cardPath("home")).toBe("/og/home.png");
  });
});

describe("titleSize", () => {
  it("steps down as titles get longer", () => {
    expect(titleSize("Andriyan Ivanov.")).toBe(76);
    expect(titleSize("Tips for writing efficient skills for LLM agents")).toBe(
      66,
    );
    expect(titleSize("a".repeat(70))).toBe(58);
    expect(titleSize("a".repeat(95))).toBe(50);
  });
});

describe("postCard", () => {
  const post = {
    title: "Spec-Driven Development",
    pubDate: new Date("2026-01-08T10:00:00Z"),
    tags: ["ai", "coding", "claude", "devex", "sdd"],
    minutes: 6,
  };

  it("dates the card and keeps four tags", () => {
    expect(postCard(post)).toMatchObject({
      eyebrow: "Blog · Jan 8, 2026",
      title: "Spec-Driven Development",
      chips: ["ai", "coding", "claude", "devex"],
      meta: "6 min read",
    });
  });

  it("wears the palette of the season it was published in", () => {
    expect(postCard(post).palette).toBe("blueprint");
    expect(
      postCard({ ...post, pubDate: new Date("2026-10-02T15:47:00Z") }).palette,
    ).toBe("circuit");
    expect(
      postCard({ ...post, pubDate: new Date("2026-04-15T12:00:00Z") }).palette,
    ).toBe("neon");
  });

  it("goes by the UTC date, the same on every build machine", () => {
    // Still November in UTC, though December in the east
    const lateNovember = new Date("2026-11-30T23:30:00Z");
    expect(postCard({ ...post, pubDate: lateNovember })).toMatchObject({
      eyebrow: "Blog · Nov 30, 2026",
      palette: "circuit",
    });
  });

  it("copes with a post without tags", () => {
    expect(postCard({ ...post, tags: undefined }).chips).toEqual([]);
  });
});

describe("pageCards", () => {
  it("wears the season of the build and counts the posts", () => {
    const cards = pageCards(new Date("2026-07-01T00:00:00Z"), 9);
    expect(Object.keys(cards)).toEqual(["home", "about", "blog"]);
    expect(cards.home.palette).toBe("notebook");
    expect(cards.blog.meta).toBe("9 posts · mifkata.com/blog");
  });
});
