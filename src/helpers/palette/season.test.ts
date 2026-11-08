import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import {
  DEFAULT_PALETTE,
  PALETTE_BY_MONTH,
  PALETTE_BY_SEASON,
  THEME_COLORS,
  seasonOf,
} from "./season";

describe("seasonOf", () => {
  it("should follow the meteorological seasons", () => {
    expect([11, 0, 1].map(seasonOf)).toEqual(["winter", "winter", "winter"]);
    expect([2, 3, 4].map(seasonOf)).toEqual(["spring", "spring", "spring"]);
    expect([5, 6, 7].map(seasonOf)).toEqual(["summer", "summer", "summer"]);
    expect([8, 9, 10].map(seasonOf)).toEqual(["fall", "fall", "fall"]);
  });
});

describe("PALETTE_BY_MONTH", () => {
  it("should give every month its season's palette", () => {
    expect(PALETTE_BY_MONTH).toHaveLength(12);
    expect(PALETTE_BY_MONTH[0]).toBe("blueprint");
    expect(PALETTE_BY_MONTH[3]).toBe("neon");
    expect(PALETTE_BY_MONTH[6]).toBe("notebook");
    expect(PALETTE_BY_MONTH[9]).toBe("circuit");
  });

  it("should use every palette", () => {
    expect(new Set(PALETTE_BY_MONTH)).toEqual(
      new Set(Object.values(PALETTE_BY_SEASON)),
    );
  });
});

describe("palettes.css", () => {
  const css = readFileSync("src/styles/palettes.css", "utf8");

  // Each palette's page surface, light then dark, in the order they're declared.
  const surfaces = (selector: string) => {
    const start = css.indexOf(selector);
    return [...css.slice(start).matchAll(/--palette-surface: (#[0-9a-f]{6});/g)]
      .slice(0, 2)
      .map((match) => match[1]);
  };

  it("should define every seasonal palette for day and night", () => {
    for (const palette of Object.values(PALETTE_BY_SEASON)) {
      if (palette === DEFAULT_PALETTE) continue;
      expect(
        css.match(new RegExp(`data-palette="${palette}"`, "g")),
      ).toHaveLength(2);
    }
  });

  it("should match the browser bar colours to each palette's surface", () => {
    expect(surfaces(":root {")).toEqual([
      THEME_COLORS[DEFAULT_PALETTE].light,
      THEME_COLORS[DEFAULT_PALETTE].dark,
    ]);
    for (const palette of ["blueprint", "notebook", "neon"] as const) {
      expect(surfaces(`:root[data-palette="${palette}"]`)).toEqual([
        THEME_COLORS[palette].light,
        THEME_COLORS[palette].dark,
      ]);
    }
  });
});
