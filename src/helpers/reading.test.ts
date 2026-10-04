import { describe, it, expect } from "vitest";
import { WORDS_PER_MINUTE, firstParagraph, readingMinutes } from "./reading";

const words = (count: number) => Array(count).fill("word").join(" ");

describe("readingMinutes", () => {
  it("should round the word count to whole minutes", () => {
    expect(readingMinutes(words(WORDS_PER_MINUTE * 3))).toBe(3);
    expect(readingMinutes(words(WORDS_PER_MINUTE * 3.6))).toBe(4);
  });

  it("should never return less than a minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("Short note.")).toBe(1);
  });

  it("should skip code blocks, MDX imports and markup", () => {
    const body = [
      'import Image from "@/components/Image.astro";',
      words(WORDS_PER_MINUTE * 2),
      "```bash",
      words(WORDS_PER_MINUTE * 5),
      "```",
      '<Image src="/a.png" alt="" />',
    ].join("\n");
    expect(readingMinutes(body)).toBe(2);
  });

  it("should not count punctuation and symbols as words", () => {
    expect(readingMinutes(`${words(WORDS_PER_MINUTE)} - — * # |`)).toBe(1);
  });
});

describe("firstParagraph", () => {
  it("should return the text before the first blank line", () => {
    expect(firstParagraph("One **bold** line.\n\nSecond paragraph.")).toBe(
      "One **bold** line.",
    );
  });

  it("should keep a single paragraph whole", () => {
    expect(firstParagraph("  Only one.  ")).toBe("Only one.");
  });

  it("should return undefined for missing or blank text", () => {
    expect(firstParagraph(undefined)).toBeUndefined();
    expect(firstParagraph("  \n ")).toBeUndefined();
  });
});
