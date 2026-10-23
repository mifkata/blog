import { describe, it, expect } from "vitest";
import {
  LEAD_SIZES,
  RELATED_WIDTHS,
  REMEMBERED,
  ROW_SIZES,
  rememberRead,
  setSlotSizes,
  unreadFirst,
} from "./readNext";

/** Which file a browser picks: the width whose density is closest to dpr. */
function pickedWidth(slot: number, dpr: number): number {
  return RELATED_WIDTHS.reduce((best, width) =>
    Math.abs(width / slot - dpr) < Math.abs(best / slot - dpr) ? width : best,
  );
}

describe("unreadFirst", () => {
  const same = (id: string) => id;

  it("should move posts already read behind the rest, keeping each order", () => {
    expect(
      unreadFirst(
        ["sdd", "tools", "openclaw", "commands"],
        same,
        new Set(["sdd", "openclaw"]),
      ),
    ).toEqual(["tools", "commands", "sdd", "openclaw"]);
  });

  it("should keep the order when nothing has been read", () => {
    expect(unreadFirst(["a", "b"], same, new Set())).toEqual(["a", "b"]);
  });
});

describe("lead image", () => {
  const slot = Number(LEAD_SIZES.match(/(\d+)px/)?.[1]);

  it("should give a retina screen the full file and a normal screen the 960", () => {
    expect(pickedWidth(slot, 2)).toBe(1280);
    expect(pickedWidth(slot, 1)).toBe(960);
  });

  it("should set sizes on the source as well as the img", () => {
    const source = { sizes: ROW_SIZES };
    const img = { sizes: ROW_SIZES };
    setSlotSizes([source, img], true);
    expect(source.sizes).toBe(LEAD_SIZES);
    expect(img.sizes).toBe(LEAD_SIZES);
  });
});

describe("rememberRead", () => {
  it("should put the post first and list it once", () => {
    expect(rememberRead(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("should forget the oldest beyond the limit", () => {
    const read = Array.from({ length: REMEMBERED }, (_, i) => `post-${i}`);
    const next = rememberRead(read, "new");
    expect(next).toHaveLength(REMEMBERED);
    expect(next[0]).toBe("new");
    expect(next).not.toContain(`post-${REMEMBERED - 1}`);
  });
});
