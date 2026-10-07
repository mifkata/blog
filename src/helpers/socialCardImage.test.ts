import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { pageCards, postCard } from "./socialCard";
import { cardElement, renderCard } from "./socialCardImage";

const post = postCard({
  title: "Tips for writing efficient skills for LLM agents",
  pubDate: new Date("2026-10-02T15:47:00Z"),
  tags: ["ai", "agents"],
  minutes: 12,
});

describe("cardElement", () => {
  it("gives single children to Satori as they are, not in an array", () => {
    const texts: unknown[] = [];
    const walk = (node: unknown) => {
      if (!node || typeof node !== "object") return;
      const { children } = (node as { props: { children?: unknown } }).props;
      if (typeof children === "string") texts.push(children);
      if (Array.isArray(children)) children.forEach(walk);
      else walk(children);
    };
    walk(cardElement(post));
    expect(texts).toContain(post.title);
    expect(texts).toContain("12 min read");
  });
});

describe("renderCard", () => {
  it("draws a 1200×630 PNG for a post and for a page", async () => {
    for (const content of [post, pageCards(new Date(), 9).home]) {
      const png = await renderCard(content);
      const { format, width, height } = await sharp(png).metadata();
      expect({ format, width, height }).toEqual({
        format: "png",
        width: 1200,
        height: 630,
      });
    }
  }, 20_000);
});
