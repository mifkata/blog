/**
 * Hover animation for the filled and outlined buttons. A tilted honeycomb
 * forms around the pointer (rippling out from it, or converging on it), a
 * flash of current wipes it away, and a spark then circles the border until
 * the pointer leaves. The honeycomb is built on first hover, sized to the
 * button, so it fits any label.
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/** Degrees; negative tilts the honeycomb to the left. */
export const TILT = -45;
/** Hexagon radius, px. */
export const HEX = 6.5;
/** Time for the honeycomb to sweep across the button, ms. */
const WAVE = 320;
/** When the flash starts, ms after the pointer enters. */
const CLEAR_AT = 560;
/**
 * The flash moves a full-width band from -110% to 110% of the button over
 * SWEEP ms with SWEEP_EASE. Keep both in sync with Button.astro.
 */
const SWEEP = 750;
const SWEEP_EASE = [0.25, 0.6, 0.2, 1] as const;
/** How far into hex-out (160ms) a hexagon flares brightest, ms. */
const FLARE = 0.3 * 160;

export interface Cell {
  x: number;
  y: number;
}

/** Share of the sweep's duration at which the eased band reaches `progress`. */
export function sweepTime(progress: number): number {
  const [x1, y1, x2, y2] = SWEEP_EASE;
  const bezier = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (bezier(mid, y1, y2) < progress) low = mid;
    else high = mid;
  }
  return bezier((low + high) / 2, x1, x2);
}

/** Sweep progress at which the band's centre is `share` of the way across. */
export function bandAt(share: number): number {
  return Math.min(1, Math.max(0, (share + 0.6) / 2.2));
}

/** The spark takes over as the flash leaves the right edge. */
const SPARK_AT = Math.round(CLEAR_AT + sweepTime(bandAt(1)) * SWEEP);

/**
 * Centres of a honeycomb tilted by TILT that covers a `width` × `height`
 * button. Walks an untilted grid around the button's centre, rotates each
 * cell into place and keeps the ones that land on the button.
 */
export function honeycomb(width: number, height: number): Cell[] {
  const angle = (Math.PI / 180) * TILT;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const step = Math.sqrt(3) * HEX;
  const rowHeight = 1.5 * HEX;
  const reach = Math.hypot(width, height) / 2 + HEX;
  const cells: Cell[] = [];
  for (
    let row = -Math.ceil(reach / rowHeight);
    row * rowHeight <= reach;
    row++
  ) {
    for (
      let col = -Math.ceil(reach / step) - 1;
      col * step <= reach + step;
      col++
    ) {
      const gx = col * step + (row % 2 ? step / 2 : 0);
      const gy = row * rowHeight;
      const x = width / 2 + gx * cos - gy * sin;
      const y = height / 2 + gx * sin + gy * cos;
      if (x < -HEX || x > width + HEX || y < -HEX || y > height + HEX) {
        continue;
      }
      cells.push({ x, y });
    }
  }
  return cells;
}

function hexPoints({ x, y }: Cell, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30 + TILT);
    return `${(x + r * Math.cos(angle)).toFixed(2)},${(y + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

interface Field {
  svg: SVGSVGElement;
  hexes: { el: SVGPolygonElement; cell: Cell }[];
  width: number;
  height: number;
}

function buildField(button: HTMLElement): Field {
  const width = button.clientWidth;
  const height = button.clientHeight;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "hex-field");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");
  const hexes = honeycomb(width, height).map((cell) => {
    const el = document.createElementNS(SVG_NS, "polygon");
    el.setAttribute("class", "hex");
    el.setAttribute("points", hexPoints(cell, HEX - 0.9));
    svg.append(el);
    return { el, cell };
  });
  button.prepend(svg);
  return { svg, hexes, width, height };
}

/** Times each hexagon's entrance from the pointer and its exit from the flash. */
function wave(field: Field, x: number, y: number, converging: boolean) {
  const far = Math.max(
    Math.hypot(x, y),
    Math.hypot(field.width - x, y),
    Math.hypot(x, field.height - y),
    Math.hypot(field.width - x, field.height - y),
  );
  for (const { el, cell } of field.hexes) {
    const distance = Math.hypot(cell.x - x, cell.y - y);
    const share = Math.min(1, distance / far);
    const order = converging ? 1 - share : share;
    const passing = sweepTime(bandAt(cell.x / field.width)) * SWEEP;
    el.style.setProperty("--in", `${Math.round(order * WAVE)}ms`);
    el.style.setProperty(
      "--out",
      `${Math.round(CLEAR_AT + passing - FLARE)}ms`,
    );
    el.style.setProperty(
      "--ux",
      distance ? ((cell.x - x) / distance).toFixed(3) : "0",
    );
    el.style.setProperty(
      "--uy",
      distance ? ((cell.y - y) / distance).toFixed(3) : "0",
    );
  }
}

/** Wires up every `[data-hex]` button on the page; safe to call repeatedly. */
export function setupHexButtons(): void {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  for (const button of document.querySelectorAll<HTMLElement>("[data-hex]")) {
    if (button.dataset.hexReady) continue;
    button.dataset.hexReady = "true";
    const converging = button.dataset.hex === "in";
    let field: Field | undefined;

    const charge = (x: number, y: number) => {
      button.style.setProperty(
        "--spark-at",
        `${reducedMotion ? 0 : SPARK_AT}ms`,
      );
      button.style.setProperty("--clear-at", `${CLEAR_AT}ms`);
      button.style.setProperty("--sweep", `${SWEEP}ms`);
      if (!reducedMotion) {
        field ??= buildField(button);
        wave(field, x, y, converging);
        // Restart the one-shot wave, even when re-entering mid-way.
        button.classList.remove("is-waving");
        void field.svg.getBoundingClientRect();
        button.classList.add("is-waving");
      }
      button.classList.add("is-charged");
    };
    const rest = () => button.classList.remove("is-charged");

    button.addEventListener("pointerenter", (event) => {
      const box = button.getBoundingClientRect();
      charge(event.clientX - box.left, event.clientY - box.top);
    });
    button.addEventListener("pointerleave", rest);
    button.addEventListener("focus", () => {
      if (button.matches(":focus-visible")) {
        charge(button.clientWidth / 2, button.clientHeight / 2);
      }
    });
    button.addEventListener("blur", rest);
  }
}
