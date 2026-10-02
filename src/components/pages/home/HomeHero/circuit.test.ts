import { describe, it, expect } from "vitest";
import {
  generateCircuit,
  toCircuitData,
  toPathData,
  type Circuit,
} from "./circuit";

const STEP = 10;

// Every half-step lattice point a trace passes through, on the board only.
function latticePoints(circuit: Circuit, trace: number): string[] {
  const { points } = circuit.traces[trace];
  const keys: string[] = [];
  points.forEach(([x, y], i) => {
    const next = points[i + 1];
    if (!next) return;
    const steps = Math.max(Math.abs(next[0] - x), Math.abs(next[1] - y)) / STEP;
    const dx = Math.sign(next[0] - x) * STEP;
    const dy = Math.sign(next[1] - y) * STEP;
    for (let half = 0; half <= steps * 2; half++) {
      const px = x + (dx * half) / 2;
      const py = y + (dy * half) / 2;
      if (px < 0 || py < 0 || px > circuit.width || py > circuit.height) {
        continue;
      }
      keys.push(`${px},${py}`);
    }
  });
  return [...new Set(keys)];
}

describe("generateCircuit", () => {
  const circuit = generateCircuit({ step: STEP });

  it("should produce the same board for the same seed", () => {
    expect(generateCircuit({ seed: 42 })).toEqual(
      generateCircuit({ seed: 42 }),
    );
  });

  it("should produce different boards for different seeds", () => {
    expect(generateCircuit({ seed: 1 }).traces).not.toEqual(
      generateCircuit({ seed: 2 }).traces,
    );
  });

  it("should fill the board with chips, traces and pads", () => {
    expect(circuit.chips.length).toBeGreaterThan(1);
    expect(circuit.traces.length).toBeGreaterThan(80);
    expect(circuit.pads.length).toBeGreaterThan(80);
  });

  it("should never let two traces touch or cross", () => {
    const owners = new Map<string, number>();
    circuit.traces.forEach((_, trace) => {
      for (const key of latticePoints(circuit, trace)) {
        expect(owners.get(key), `trace ${trace} hits ${key}`).toBeUndefined();
        owners.set(key, trace);
      }
    });
  });

  it("should only use straight and 45° segments", () => {
    for (const { points } of circuit.traces) {
      points.slice(1).forEach(([x, y], i) => {
        const dx = Math.abs(x - points[i][0]);
        const dy = Math.abs(y - points[i][1]);
        expect(dx === 0 || dy === 0 || dx === dy).toBe(true);
      });
    }
  });

  it("should place every pad on the end of exactly one trace", () => {
    const seen = new Set<number>();
    for (const { points, start, end } of circuit.traces) {
      for (const [pad, point] of [
        [start, points[0]],
        [end, points[points.length - 1]],
      ] as const) {
        if (pad < 0) continue;
        expect(seen.has(pad)).toBe(false);
        seen.add(pad);
        expect([circuit.pads[pad].x, circuit.pads[pad].y]).toEqual(point);
      }
    }
    expect(seen.size).toBe(circuit.pads.length);
  });

  it("should start chip traces on their chip's outline", () => {
    circuit.chips.forEach((chip, index) => {
      for (const trace of chip.traces) {
        const { points, chip: owner, start } = circuit.traces[trace];
        const [x, y] = points[0];
        expect(owner).toBe(index);
        expect(start).toBe(-1);
        expect(
          x === chip.x ||
            x === chip.x + chip.width ||
            y === chip.y ||
            y === chip.y + chip.height,
        ).toBe(true);
      }
    });
  });
});

describe("toPathData", () => {
  it("should build an SVG polyline path", () => {
    expect(
      toPathData([
        [0, 0],
        [10, 10],
        [30, 10],
      ]),
    ).toBe("M0 0L10 10L30 10");
  });
});

describe("toCircuitData", () => {
  it("should keep only what the animation needs", () => {
    const data = toCircuitData(generateCircuit({ seed: 7 }));
    expect(Object.keys(data.traces[0]).sort()).toEqual([
      "chip",
      "end",
      "points",
      "start",
    ]);
    expect(Object.keys(data.pads[0]).sort()).toEqual(["x", "y"]);
    expect(Object.keys(data.chips[0])).toEqual(["traces"]);
  });
});
