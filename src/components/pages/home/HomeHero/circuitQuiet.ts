/**
 * A feathered "quiet" area that fades the circuit board behind the hero copy,
 * so the text stays readable while the board stays visible everywhere else.
 *
 * The feather is built from concentric rounded rectangles stacked at low
 * opacity rather than a blur filter, which would be re-run every time an
 * animated layer under the mask repaints.
 */

export interface QuietBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface QuietRect extends QuietBox {
  rx: number;
}

/** Stacked rectangles that make up the feathered edge. */
export const QUIET_STEPS = 10;
/** Gap between neighbouring rectangles, in viewBox units. */
const QUIET_SPREAD = 6;

/**
 * Where the copy sits on the board in the default desktop layout (1280px wide
 * hero). Server-rendered so the fade is in place before any script runs.
 */
export const DESKTOP_COPY: QuietBox = {
  x: 104,
  y: 74,
  width: 560,
  height: 292,
};

/** Concentric rectangles from `box` outwards; overlapping, they darken towards the middle. */
export function quietRects({ x, y, width, height }: QuietBox): QuietRect[] {
  return Array.from({ length: QUIET_STEPS }, (_, i) => {
    const grow = i * QUIET_SPREAD;
    return {
      x: x - grow,
      y: y - grow,
      width: width + grow * 2,
      height: height + grow * 2,
      rx: grow + 4,
    };
  });
}

/** Per-rectangle opacity that leaves `kept` of the layer visible where all of them overlap. */
export function stepOpacity(kept: number): number {
  return 1 - kept ** (1 / QUIET_STEPS);
}

/**
 * Keeps the quiet area behind `copy`. The board is scaled and cropped to cover
 * the hero, so where the copy lands on it changes with the viewport. Returns a
 * cleanup function.
 */
export function followCopy(svg: SVGSVGElement, copy: HTMLElement): () => void {
  const rects = [
    ...svg.querySelectorAll<SVGRectElement>("[data-circuit-quiet] rect"),
  ];

  function place() {
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const inverse = ctm.inverse();
    const box = copy.getBoundingClientRect();
    const a = new DOMPoint(box.left, box.top).matrixTransform(inverse);
    const b = new DOMPoint(box.right, box.bottom).matrixTransform(inverse);
    quietRects({ x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y }).forEach(
      (rect, i) => {
        for (const [name, value] of Object.entries(rect)) {
          rects[i]?.setAttribute(name, value.toFixed(1));
        }
      },
    );
  }

  // Fires once on observe, then on every resize, including web fonts settling.
  const observer = new ResizeObserver(place);
  observer.observe(svg);
  observer.observe(copy);
  return () => observer.disconnect();
}
