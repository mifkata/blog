import { describe, it, expect } from "vitest";
import { QUIET_STEPS, quietRects, stepOpacity } from "./circuitQuiet";

describe("quietRects", () => {
  const box = { x: 100, y: 50, width: 400, height: 200 };
  const rects = quietRects(box);

  it("should start with the box itself", () => {
    expect(rects).toHaveLength(QUIET_STEPS);
    expect(rects[0]).toMatchObject(box);
  });

  it("should grow evenly outwards around the same centre", () => {
    rects.slice(1).forEach((rect, i) => {
      const inner = rects[i];
      expect(rect.x).toBeLessThan(inner.x);
      expect(inner.x - rect.x).toBe(rects[0].x - rects[1].x);
      expect(rect.x + rect.width / 2).toBe(box.x + box.width / 2);
      expect(rect.y + rect.height / 2).toBe(box.y + box.height / 2);
    });
  });
});

describe("stepOpacity", () => {
  it("should leave the requested share visible where every step overlaps", () => {
    for (const kept of [0.28, 0.6]) {
      expect((1 - stepOpacity(kept)) ** QUIET_STEPS).toBeCloseTo(kept, 10);
    }
  });

  it("should not fade anything when everything is kept", () => {
    expect(stepOpacity(1)).toBe(0);
  });
});
