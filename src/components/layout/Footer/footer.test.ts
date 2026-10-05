import { describe, it, expect } from "vitest";
import { flameCells, localDate, wrapIndex } from "./footer";

describe("flameCells", () => {
  it("should place a cell for every filled spot, top row first", () => {
    expect(flameCells([".o", "mc"])).toEqual([
      { x: 1, y: 0, layer: "outer" },
      { x: 0, y: 1, layer: "mid" },
      { x: 1, y: 1, layer: "core" },
    ]);
  });

  it("should draw the footer's flame in all three layers", () => {
    const layers = new Set(flameCells().map((cell) => cell.layer));
    expect(layers).toEqual(new Set(["outer", "mid", "core"]));
  });
});

describe("wrapIndex", () => {
  it("should wrap past the last item back to the first", () => {
    expect(wrapIndex(2, 3)).toBe(2);
    expect(wrapIndex(3, 3)).toBe(0);
  });

  it("should wrap backwards to the last item", () => {
    expect(wrapIndex(-1, 3)).toBe(2);
  });
});

describe("localDate", () => {
  it("should format the date the way the reader's locale does", () => {
    expect(localDate("2026-10-05", "en-US")).toBe("Oct 5, 2026");
    expect(localDate("2026-10-05", "en-GB")).toBe("5 Oct 2026");
    expect(localDate("2026-10-05", "de-DE")).toBe("05.10.2026");
  });

  it("should keep the day as written, whatever the time zone", () => {
    expect(localDate("2026-01-01", "en-US")).toBe("Jan 1, 2026");
  });

  it("should leave anything that isn't a date as it is", () => {
    expect(localDate("", "en-US")).toBe("");
    expect(localDate("soon", "en-US")).toBe("soon");
  });
});
