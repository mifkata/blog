/**
 * Procedural circuit board for the home hero background.
 *
 * Runs at build time. Traces are routed on a half-step lattice, so they never
 * overlap or cross (diagonals included), and a fixed seed keeps the board
 * identical between builds.
 */

export type Vec = [number, number];

export interface CircuitTrace {
  /** Polyline in viewBox units, starting at the chip pin or start pad. */
  points: Vec[];
  tone: 0 | 1 | 2;
  /** Owning chip index, or -1 for free-standing traces. */
  chip: number;
  /** Pad index at the first point, or -1 (chip pin or board edge). */
  start: number;
  /** Pad index at the last point, or -1 when the trace runs off the board. */
  end: number;
}

export interface CircuitPad {
  x: number;
  y: number;
  r: number;
  hollow: boolean;
}

export interface CircuitChip {
  x: number;
  y: number;
  width: number;
  height: number;
  traces: number[];
}

export interface CircuitMark {
  kind: "box" | "ring" | "dash";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circuit {
  width: number;
  height: number;
  traces: CircuitTrace[];
  pads: CircuitPad[];
  chips: CircuitChip[];
  marks: CircuitMark[];
}

export interface CircuitOptions {
  width?: number;
  height?: number;
  /** Grid spacing in viewBox units; also the gap between bundled traces. */
  step?: number;
  seed?: number;
}

type Move = [dir: number, length: number];
type Tone = CircuitTrace["tone"];

// E, SE, S, SW, W, NW, N, NE (y grows downwards); +1 turns 45° clockwise.
const DIRS: readonly Vec[] = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
const E = 0;
const S = 2;
const W = 4;
const N = 6;

const turn = (dir: number, by: number) => (((dir + by) % 8) + 8) % 8;

class Random {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  // mulberry32
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  weighted<T>(entries: readonly [T, number][]): T {
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = this.next() * total;
    for (const [value, weight] of entries) {
      roll -= weight;
      if (roll < 0) return value;
    }
    return entries[entries.length - 1][0];
  }
}

/** Occupancy on a half-step lattice: grid points plus the midpoints between them. */
class Grid {
  readonly cols: number;
  readonly rows: number;
  private readonly span: number;
  private readonly cells: Uint8Array;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.span = cols * 2 + 1;
    this.cells = new Uint8Array(this.span * (rows * 2 + 1));
  }

  inside(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x <= this.cols && y <= this.rows;
  }

  private takenHalf(hx: number, hy: number): boolean {
    return this.cells[hy * this.span + hx] === 1;
  }

  private claimHalf(hx: number, hy: number) {
    if (hx < 0 || hy < 0 || hx > this.cols * 2 || hy > this.rows * 2) return;
    this.cells[hy * this.span + hx] = 1;
  }

  isFree(x: number, y: number): boolean {
    return this.inside(x, y) && !this.takenHalf(x * 2, y * 2);
  }

  isAreaFree(x0: number, y0: number, x1: number, y1: number): boolean {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (!this.isFree(x, y)) return false;
      }
    }
    return true;
  }

  /** Occupied grid points around (x, y), the point itself excluded. */
  neighbours(x: number, y: number): number {
    let count = 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (this.inside(nx, ny) && this.takenHalf(nx * 2, ny * 2)) count++;
    }
    return count;
  }

  canStep(x: number, y: number, dir: number): "ok" | "exit" | "blocked" {
    const [dx, dy] = DIRS[dir];
    if (!this.inside(x + dx, y + dy)) return "exit";
    if (this.takenHalf(x * 2 + dx, y * 2 + dy)) return "blocked";
    if (this.takenHalf((x + dx) * 2, (y + dy) * 2)) return "blocked";
    return "ok";
  }

  /** True when `steps` moves in `dir` are possible (running off the board counts). */
  isClear(x: number, y: number, dir: number, steps: number): boolean {
    for (let i = 0; i < steps; i++) {
      const state = this.canStep(x, y, dir);
      if (state === "blocked") return false;
      if (state === "exit") return true;
      x += DIRS[dir][0];
      y += DIRS[dir][1];
    }
    return true;
  }

  claimPath(points: Vec[]) {
    points.forEach(([x, y], i) => {
      this.claimHalf(x * 2, y * 2);
      const next = points[i + 1];
      if (next) this.claimHalf(x + next[0], y + next[1]);
    });
  }

  claimRect(x0: number, y0: number, x1: number, y1: number) {
    for (let hy = y0 * 2; hy <= y1 * 2; hy++) {
      for (let hx = x0 * 2; hx <= x1 * 2; hx++) this.claimHalf(hx, hy);
    }
  }
}

/**
 * Follows `plan` from `start` until it ends, hits another trace or leaves the
 * board. Before each bend the current leg may run a few steps longer, which is
 * what lets the outer traces of a bundle clear the inner ones.
 */
function route(
  grid: Grid,
  start: Vec,
  plan: Move[],
): { points: Vec[]; exited: boolean } {
  let [x, y] = start;
  const points: Vec[] = [[x, y]];
  const advance = (dir: number) => {
    x += DIRS[dir][0];
    y += DIRS[dir][1];
    points.push([x, y]);
  };

  let previous = -1;
  for (const [dir, length] of plan) {
    if (previous !== -1 && previous !== dir) {
      for (
        let extra = 0;
        extra < 3 &&
        !grid.isClear(x, y, dir, 2) &&
        grid.canStep(x, y, previous) === "ok";
        extra++
      ) {
        advance(previous);
      }
      if (!grid.isClear(x, y, dir, 2)) break;
    }
    for (let i = 0; i < length; i++) {
      const state = grid.canStep(x, y, dir);
      if (state === "blocked") return { points, exited: false };
      advance(dir);
      if (state === "exit") return { points, exited: true };
    }
    previous = dir;
  }
  return { points, exited: false };
}

/**
 * A staircase that only ever bends towards `side`: alternating diagonal and
 * straight legs, sometimes turning a full 90° before coming back.
 */
function makePlan(
  rng: Random,
  heading: number,
  side: number,
  bends: number,
): Move[] {
  const plan: Move[] = [[heading, rng.int(1, 4)]];
  let rotation = 0;
  for (let i = 0; i < bends * 2; i++) {
    if (rotation === 0 || Math.abs(rotation) === 2) rotation = side;
    else rotation = rng.chance(0.3) ? side * 2 : 0;
    const diagonal = rotation % 2 !== 0;
    plan.push([
      turn(heading, rotation),
      diagonal ? rng.int(2, 6) : rng.int(3, 14),
    ]);
  }
  return plan;
}

/** The side (+1 clockwise, -1 counter-clockwise) whose bend moves along `lateral`. */
function sideToward(heading: number, lateral: Vec): number {
  const [dx, dy] = DIRS[turn(heading, 1)];
  return dx * lateral[0] + dy * lateral[1] > 0 ? 1 : -1;
}

function simplify(points: Vec[]): Vec[] {
  return points.filter((point, i) => {
    const before = points[i - 1];
    const after = points[i + 1];
    if (!before || !after) return true;
    return (
      point[0] - before[0] !== after[0] - point[0] ||
      point[1] - before[1] !== after[1] - point[1]
    );
  });
}

interface BundleOptions {
  chip: number;
  tone: Tone;
  startPad: boolean;
  minSteps: number;
  /** Points drawn before the start, e.g. so edge traces enter from off-board. */
  lead?: Vec;
}

class Board {
  readonly traces: CircuitTrace[] = [];
  readonly pads: CircuitPad[] = [];
  readonly chips: CircuitChip[] = [];
  readonly marks: CircuitMark[] = [];
  private readonly grid: Grid;
  private readonly rng: Random;
  private readonly step: number;

  constructor(grid: Grid, rng: Random, step: number) {
    this.grid = grid;
    this.rng = rng;
    this.step = step;
  }

  private tone(): Tone {
    return this.rng.weighted<Tone>([
      [0, 5],
      [1, 4],
      [2, 2],
    ]);
  }

  private addPad(x: number, y: number): number {
    // Big pads only where nothing but the trace itself is adjacent.
    const roomy = this.grid.neighbours(x, y) <= 1;
    this.pads.push({
      x: x * this.step,
      y: y * this.step,
      r: roomy
        ? this.rng.weighted([
            [2.5, 4],
            [3.5, 3],
            [5, 2],
          ])
        : 2.5,
      hollow: roomy && this.rng.chance(0.2),
    });
    return this.pads.length - 1;
  }

  /** Routes parallel traces sharing one plan, bend-side trace first. */
  private bundle(
    starts: Vec[],
    heading: number,
    side: number,
    plan: Move[],
    options: BundleOptions,
  ): number[] {
    const added: number[] = [];
    for (const start of starts) {
      // Stagger where bundled traces stop, like pads on a real board.
      const staggered = plan.map<Move>(([dir, length], i) =>
        i === plan.length - 1
          ? [dir, Math.max(1, length + this.rng.int(-3, 4))]
          : [dir, length],
      );
      const { points, exited } = route(this.grid, start, staggered);
      if (points.length - 1 < options.minSteps) continue;

      this.grid.claimPath(points);
      const [lastX, lastY] = points[points.length - 1];
      const startPad = options.startPad ? this.addPad(start[0], start[1]) : -1;
      const endPad = exited ? -1 : this.addPad(lastX, lastY);
      if (options.lead) {
        points.unshift([
          start[0] + options.lead[0],
          start[1] + options.lead[1],
        ]);
      }
      this.traces.push({
        points: simplify(points).map(([x, y]) => [
          x * this.step,
          y * this.step,
        ]),
        tone: options.tone,
        chip: options.chip,
        start: startPad,
        end: endPad,
      });
      added.push(this.traces.length - 1);
    }
    return added;
  }

  /** Splits a column of pins into bundles that fan away from `centre`. */
  private fanOut(pins: Vec[], heading: number, centre: Vec, chip: number) {
    const [hx, hy] = DIRS[heading];
    const lateralAxis: Vec = [hy !== 0 ? 1 : 0, hx !== 0 ? 1 : 0];
    let i = 0;
    while (i < pins.length) {
      const group = pins.slice(i, i + this.rng.int(2, 5));
      i += group.length;

      const middle = group[Math.floor(group.length / 2)];
      const offset =
        (middle[0] - centre[0]) * lateralAxis[0] +
        (middle[1] - centre[1]) * lateralAxis[1];
      const straight = Math.abs(offset) <= 1;
      const away: Vec = [
        lateralAxis[0] * Math.sign(offset || 1),
        lateralAxis[1] * Math.sign(offset || 1),
      ];
      const side = sideToward(heading, away);
      const plan = straight
        ? [[heading, this.rng.int(15, 40)] as Move]
        : makePlan(this.rng, heading, side, this.rng.int(1, 3));

      const ordered = [...group].sort(
        (a, b) =>
          b[0] * away[0] + b[1] * away[1] - (a[0] * away[0] + a[1] * away[1]),
      );
      const traces = this.bundle(ordered, heading, side, plan, {
        chip,
        tone: this.tone(),
        startPad: false,
        minSteps: 2,
      });
      this.chips[chip].traces.push(...traces);
    }
  }

  addChip(
    x: number,
    y: number,
    width: number,
    height: number,
    sides: readonly number[],
  ): boolean {
    if (!this.grid.isAreaFree(x - 2, y - 2, x + width + 2, y + height + 2)) {
      return false;
    }
    this.grid.claimRect(x, y, x + width, y + height);
    const chip = this.chips.length;
    this.chips.push({
      x: x * this.step,
      y: y * this.step,
      width: width * this.step,
      height: height * this.step,
      traces: [],
    });

    const centre: Vec = [x + width / 2, y + height / 2];
    const column = (
      fixed: number,
      from: number,
      to: number,
      vertical: boolean,
    ) =>
      Array.from(
        { length: to - from + 1 },
        (_, i): Vec => (vertical ? [fixed, from + i] : [from + i, fixed]),
      );

    for (const heading of sides) {
      if (heading === E)
        this.fanOut(
          column(x + width, y + 1, y + height - 1, true),
          E,
          centre,
          chip,
        );
      if (heading === W)
        this.fanOut(column(x, y + 1, y + height - 1, true), W, centre, chip);
      if (heading === N)
        this.fanOut(column(y, x + 1, x + width - 1, false), N, centre, chip);
      if (heading === S)
        this.fanOut(
          column(y + height, x + 1, x + width - 1, false),
          S,
          centre,
          chip,
        );
    }
    return true;
  }

  /** Traces that enter the board from one of its edges. */
  addEdgeBundle(heading: number): void {
    const { cols, rows } = this.grid;
    const size = this.rng.int(1, 4);
    const vertical = heading === N || heading === S;
    const along = this.rng.int(2, (vertical ? cols : rows) - size - 2);
    const fixed =
      heading === S ? 0 : heading === N ? rows : heading === E ? 0 : cols;
    const starts = Array.from(
      { length: size },
      (_, i): Vec => (vertical ? [along + i, fixed] : [fixed, along + i]),
    );
    if (!starts.every(([x, y]) => this.grid.isFree(x, y))) return;

    const side = this.rng.pick([-1, 1]);
    const lateral = DIRS[turn(heading, side * 2)];
    starts.sort(
      (a, b) =>
        b[0] * lateral[0] +
        b[1] * lateral[1] -
        (a[0] * lateral[0] + a[1] * lateral[1]),
    );
    const [dx, dy] = DIRS[heading];
    this.bundle(
      starts,
      heading,
      side,
      makePlan(this.rng, heading, side, this.rng.int(1, 2)),
      {
        chip: -1,
        tone: this.tone(),
        startPad: false,
        minSteps: 4,
        lead: [-dx, -dy],
      },
    );
  }

  /** A small bundle that starts and ends on pads somewhere in open space. */
  addFreeBundle(): void {
    const { cols, rows } = this.grid;
    const heading = this.rng.weighted([
      [E, 3],
      [W, 3],
      [N, 1],
      [S, 1],
    ]);
    const side = this.rng.pick([-1, 1]);
    const lateral = DIRS[turn(heading, side * 2)];
    const x = this.rng.int(1, cols - 1);
    const y = this.rng.int(1, rows - 1);
    const size = this.rng.int(1, 3);
    const starts = Array.from(
      { length: size },
      (_, i): Vec => [x - lateral[0] * i, y - lateral[1] * i],
    );
    if (
      !starts.every(([sx, sy]) =>
        this.grid.isAreaFree(sx - 1, sy - 1, sx + 1, sy + 1),
      )
    ) {
      return;
    }
    this.bundle(
      starts,
      heading,
      side,
      makePlan(this.rng, heading, side, this.rng.int(1, 2)),
      {
        chip: -1,
        tone: this.tone(),
        startPad: true,
        minSteps: 5,
      },
    );
  }

  addMark(kind: CircuitMark["kind"]): void {
    const { cols, rows } = this.grid;
    const width =
      kind === "ring"
        ? 0
        : kind === "box"
          ? this.rng.int(2, 3)
          : this.rng.int(2, 4);
    const height = kind === "box" ? 2 : kind === "dash" ? 1 : 0;
    const x = this.rng.int(1, cols - width - 1);
    const y = this.rng.int(1, rows - height - 1);
    if (!this.grid.isAreaFree(x - 1, y - 1, x + width + 1, y + height + 1))
      return;
    this.grid.claimRect(x, y, x + width, y + height);
    this.marks.push({
      kind,
      x: x * this.step,
      y: y * this.step,
      width: width * this.step,
      height: height * this.step,
    });
  }
}

export function generateCircuit({
  width = 1280,
  height = 440,
  step = 10,
  seed = 1984,
}: CircuitOptions = {}): Circuit {
  const rng = new Random(seed);
  const cols = Math.floor(width / step);
  const rows = Math.floor(height / step);
  const board = new Board(new Grid(cols, rows), rng, step);

  // The main chip sits right of centre, clear of the hero copy, and gets the
  // first pick of the board; smaller chips fill in around it.
  const mainHeight = Math.min(14, rows - 12);
  board.addChip(
    Math.round(cols * 0.72),
    Math.round((rows - mainHeight) / 2),
    5,
    mainHeight,
    [E, W, N, S],
  );
  for (let placed = 0, tries = 0; placed < 4 && tries < 60; tries++) {
    const w = rng.int(2, 4);
    const h = rng.int(3, 6);
    const x = rng.int(4, cols - w - 4);
    const y = rng.int(3, rows - h - 3);
    const sides = rng.chance(0.5)
      ? [E, W]
      : rng.pick([[E], [W], [E, W, S], [E, W, N]]);
    if (board.addChip(x, y, w, h, sides)) placed++;
  }
  for (let i = 0; i < 18; i++) board.addEdgeBundle(rng.pick([E, W, N, S]));
  for (let i = 0; i < 40; i++)
    board.addMark(rng.pick(["box", "ring", "dash"] as const));
  for (let i = 0; i < 400; i++) board.addFreeBundle();

  return {
    width: cols * step,
    height: rows * step,
    traces: board.traces,
    pads: board.pads,
    chips: board.chips,
    marks: board.marks,
  };
}

/** The slice of the board the browser needs to animate it. */
export interface CircuitData {
  traces: Pick<CircuitTrace, "points" | "chip" | "start" | "end">[];
  pads: Pick<CircuitPad, "x" | "y">[];
  chips: Pick<CircuitChip, "traces">[];
}

export function toCircuitData({ traces, pads, chips }: Circuit): CircuitData {
  return {
    traces: traces.map(({ points, chip, start, end }) => ({
      points,
      chip,
      start,
      end,
    })),
    pads: pads.map(({ x, y }) => ({ x, y })),
    chips: chips.map(({ traces }) => ({ traces })),
  };
}

export function toPathData(points: Vec[]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("");
}
