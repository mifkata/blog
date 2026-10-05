import { describe, it, expect } from "vitest";
import {
  activeSlug,
  progressBetween,
  readingLine,
  timeLeft,
  tocOutline,
} from "./toc";

describe("tocOutline", () => {
  it("should group sections under their chapter", () => {
    expect(
      tocOutline([
        { depth: 2, slug: "a", text: "A" },
        { depth: 3, slug: "a1", text: "A1" },
        { depth: 4, slug: "deep", text: "Deep" },
        { depth: 2, slug: "b", text: "B" },
      ]),
    ).toEqual([
      { slug: "a", text: "A", children: [{ slug: "a1", text: "A1" }] },
      { slug: "b", text: "B", children: [] },
    ]);
  });

  it("should drop sections that come before the first chapter", () => {
    expect(tocOutline([{ depth: 3, slug: "x", text: "X" }])).toEqual([]);
  });
});

describe("readingLine", () => {
  // A 900px viewport, the line 120px down, an article ending at 5000px
  const at = (scrollY: number) =>
    readingLine({ scrollY, viewport: 900, offset: 120, end: 5000 });

  it("should sit just under the header for most of the article", () => {
    expect(at(0)).toBe(120);
    expect(at(2000)).toBe(2120);
    expect(at(3320)).toBe(3440);
  });

  it("should reach the article's end once the end is on screen", () => {
    expect(at(4100)).toBe(5000);
    expect(at(3710)).toBe(4220);
  });

  it("should keep going with the page after the article", () => {
    expect(at(4500)).toBe(5400);
  });
});

describe("progressBetween", () => {
  it("should report the share behind the line", () => {
    expect(progressBetween(1500, 1000, 3000)).toBe(0.25);
    expect(progressBetween(500, 1000, 3000)).toBe(0);
    expect(progressBetween(5000, 1000, 3000)).toBe(1);
  });
});

describe("activeSlug", () => {
  const headings = [
    { slug: "a", top: 1000 },
    { slug: "b", top: 2000 },
    { slug: "c", top: 3000 },
  ];

  it("should pick the last heading the line has passed", () => {
    expect(activeSlug(headings, 2500)).toBe("b");
    expect(activeSlug(headings, 3000)).toBe("c");
  });

  it("should start with the first heading", () => {
    expect(activeSlug(headings, 0)).toBe("a");
    expect(activeSlug([], 0)).toBeUndefined();
  });
});

describe("timeLeft", () => {
  it("should count down the minutes and finish at the end", () => {
    expect(timeLeft(15, 0)).toBe("15 min left");
    expect(timeLeft(15, 0.5)).toBe("8 min left");
    expect(timeLeft(15, 0.98)).toBe("1 min left");
    expect(timeLeft(15, 1)).toBe("Finished");
  });
});
