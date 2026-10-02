import { describe, it, expect } from "vitest";
import { HEX, TILT, bandAt, honeycomb, sweepTime } from "./hexField";

describe("honeycomb", () => {
  const width = 230;
  const height = 50;
  const cells = honeycomb(width, height);

  it("should keep every cell on or just around the button", () => {
    for (const { x, y } of cells) {
      expect(x).toBeGreaterThanOrEqual(-HEX);
      expect(x).toBeLessThanOrEqual(width + HEX);
      expect(y).toBeGreaterThanOrEqual(-HEX);
      expect(y).toBeLessThanOrEqual(height + HEX);
    }
  });

  it("should cover the whole button without gaps", () => {
    for (let x = 0; x <= width; x += 5) {
      for (let y = 0; y <= height; y += 5) {
        const nearest = Math.min(
          ...cells.map((cell) => Math.hypot(cell.x - x, cell.y - y)),
        );
        expect(nearest, `gap at ${x},${y}`).toBeLessThanOrEqual(HEX);
      }
    }
  });

  it("should tilt the grid by TILT", () => {
    const [first] = cells;
    const neighbour = cells
      .filter((cell) => cell !== first)
      .reduce((best, cell) =>
        Math.hypot(cell.x - first.x, cell.y - first.y) <
        Math.hypot(best.x - first.x, best.y - first.y)
          ? cell
          : best,
      );
    const angle =
      (Math.atan2(neighbour.y - first.y, neighbour.x - first.x) * 180) /
      Math.PI;
    // Neighbours sit every 60°, so the tilt shows modulo 60.
    const offset = (((angle - TILT) % 60) + 60) % 60;
    expect(Math.min(offset, 60 - offset)).toBeCloseTo(0, 5);
  });
});

describe("sweepTime", () => {
  it("should start at 0 and end at 1", () => {
    expect(sweepTime(0)).toBeCloseTo(0, 5);
    expect(sweepTime(1)).toBeCloseTo(1, 5);
  });

  it("should only move forward", () => {
    let previous = 0;
    for (let progress = 0.05; progress <= 1; progress += 0.05) {
      const time = sweepTime(progress);
      expect(time).toBeGreaterThan(previous);
      previous = time;
    }
  });

  it("should cover early progress quickly, like an ease-out", () => {
    expect(sweepTime(0.5)).toBeLessThan(0.5);
  });
});

describe("bandAt", () => {
  it("should map the button's edges inside the sweep", () => {
    expect(bandAt(0)).toBeCloseTo(0.6 / 2.2);
    expect(bandAt(1)).toBeCloseTo(1.6 / 2.2);
  });

  it("should clamp points far outside the button", () => {
    expect(bandAt(-5)).toBe(0);
    expect(bandAt(5)).toBe(1);
  });
});
