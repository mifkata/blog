import { describe, it, expect } from "vitest";
import { seriesPosition } from "./seriesPosition";

const series = [
  { title: "First Series", items: ["2025/a", "2026/01/b", "2026/02/c"] },
  { title: "Second Series", items: ["2026/03/d"] },
];

describe("seriesPosition", () => {
  it("should give the series title and the post's part, counted from 1", () => {
    expect(seriesPosition("2026/01/b", series)).toEqual({
      title: "First Series",
      part: 2,
      total: 3,
    });
  });

  it("should find posts in any series", () => {
    expect(seriesPosition("2026/03/d", series)).toEqual({
      title: "Second Series",
      part: 1,
      total: 1,
    });
  });

  it("should return undefined for posts outside every series", () => {
    expect(seriesPosition("2026/04/e", series)).toBeUndefined();
  });
});
