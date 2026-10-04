/** Distance in px a mouse must move before a press becomes a drag. */
export const DRAG_START = 6;
/** Release speed in px/ms above which a drag moves one card in its direction. */
export const FLICK = 0.3;
/** Tolerance in px for scroll positions that land between whole pixels. */
const EDGE = 2;
/** Fallback in ms for browsers without the scrollend event. */
const SETTLE = 600;

export interface RailMetrics {
  scrollLeft: number;
  viewport: number;
  scrollWidth: number;
  /** Card width plus the gap: the distance between two snap positions. */
  step: number;
  cardWidth: number;
  count: number;
}

export interface RailPosition {
  /** First and last card fully in view, zero-based. */
  first: number;
  last: number;
  atStart: boolean;
  atEnd: boolean;
  /** The card the dots mark as current. */
  current: number;
}

export function railPosition({
  scrollLeft,
  viewport,
  scrollWidth,
  step,
  cardWidth,
  count,
}: RailMetrics): RailPosition {
  const first = Math.min(
    count - 1,
    Math.max(0, Math.ceil(scrollLeft / step - 0.05)),
  );
  const fits = Math.max(1, Math.floor((viewport + step - cardWidth) / step));
  const atEnd = scrollLeft + viewport >= scrollWidth - EDGE;
  return {
    first,
    last: Math.min(count - 1, first + fits - 1),
    atStart: scrollLeft <= EDGE,
    atEnd,
    current: atEnd ? count - 1 : Math.round(scrollLeft / step),
  };
}

export function rangeLabel({ first, last }: RailPosition, count: number) {
  return first === last
    ? `${first + 1} of ${count}`
    : `${first + 1}–${last + 1} of ${count}`;
}

export function isCutOff(
  start: number,
  width: number,
  scrollLeft: number,
  viewport: number,
): boolean {
  return start < scrollLeft - 1 || start + width > scrollLeft + viewport + 1;
}

/** The nearest snap position that shows a cut-off card whole. */
export function revealTarget({
  start,
  width,
  scrollLeft,
  viewport,
  step,
  maxScroll,
}: {
  start: number;
  width: number;
  scrollLeft: number;
  viewport: number;
  step: number;
  maxScroll: number;
}): number {
  const target =
    start < scrollLeft
      ? start
      : Math.ceil((start + width - viewport) / step - 0.01) * step;
  return Math.min(Math.max(0, target), maxScroll);
}

/** Card to settle on after a drag, from the position in cards and the release velocity. */
export function settleIndex(position: number, velocity: number): number {
  if (velocity < -FLICK) return Math.ceil(position);
  if (velocity > FLICK) return Math.floor(position);
  return Math.round(position);
}

interface Drag {
  id: number;
  x: number;
  left: number;
  moved: boolean;
  lastX: number;
  lastT: number;
  velocity: number;
}

export function setupSeriesRails(): void {
  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
    ? "auto"
    : "smooth";

  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-series-rail]",
  )) {
    if (root.dataset.railReady) continue;
    const track = root.querySelector<HTMLElement>("[data-rail-track]");
    const cards = [...root.querySelectorAll<HTMLElement>("[data-rail-card]")];
    if (!track || cards.length === 0) continue;
    root.dataset.railReady = "true";

    const prev = root.querySelector<HTMLButtonElement>("[data-rail-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-rail-next]");
    const counter = root.querySelector<HTMLElement>("[data-rail-count]");
    const dots = [
      ...root.querySelectorAll<HTMLButtonElement>("[data-rail-dot]"),
    ];
    const startOf = (card: HTMLElement) =>
      card.offsetLeft - cards[0].offsetLeft;
    const step = () =>
      cards.length > 1 ? startOf(cards[1]) : cards[0].offsetWidth;
    const maxScroll = () => track.scrollWidth - track.clientWidth;

    const update = () => {
      const position = railPosition({
        scrollLeft: track.scrollLeft,
        viewport: track.clientWidth,
        scrollWidth: track.scrollWidth,
        step: step(),
        cardWidth: cards[0].offsetWidth,
        count: cards.length,
      });
      root.classList.toggle("is-static", maxScroll() <= EDGE);
      track.classList.toggle("has-more", !position.atEnd);
      if (counter) counter.textContent = rangeLabel(position, cards.length);
      if (prev) prev.disabled = position.atStart;
      if (next) next.disabled = position.atEnd;
      dots.forEach((dot, i) =>
        dot.setAttribute("aria-current", String(i === position.current)),
      );
      for (const card of cards) {
        card.classList.toggle(
          "is-peek",
          isCutOff(
            startOf(card),
            card.offsetWidth,
            track.scrollLeft,
            track.clientWidth,
          ),
        );
      }
    };

    prev?.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior }),
    );
    next?.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior }),
    );
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () =>
        track.scrollTo({ left: Math.min(i * step(), maxScroll()), behavior }),
      ),
    );

    let frame = 0;
    track.addEventListener(
      "scroll",
      () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
      },
      { passive: true },
    );
    new ResizeObserver(update).observe(track);

    // Touch and trackpads scroll the track natively; a mouse has to drag it.
    let drag: Drag | null = null;
    let dragged = false;
    track.addEventListener("dragstart", (e) => e.preventDefault());
    track.addEventListener("pointerdown", (e) => {
      dragged = false;
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = {
        id: e.pointerId,
        x: e.clientX,
        left: track.scrollLeft,
        moved: false,
        lastX: e.clientX,
        lastT: e.timeStamp,
        velocity: 0,
      };
    });
    track.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < DRAG_START) return;
        drag.moved = true;
        track.setPointerCapture(e.pointerId);
        track.classList.add("is-dragging");
        window.getSelection()?.removeAllRanges();
      }
      track.scrollLeft = drag.left - dx;
      drag.velocity =
        (e.clientX - drag.lastX) / Math.max(1, e.timeStamp - drag.lastT);
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
    });
    const endDrag = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { moved, velocity } = drag;
      drag = null;
      if (!moved) return;
      dragged = true;
      const index = settleIndex(track.scrollLeft / step(), velocity);
      track.scrollTo({ left: Math.min(index * step(), maxScroll()), behavior });
      // Snapping stays off until the glide ends, or it would cut the glide short.
      const settle = () => track.classList.remove("is-dragging");
      track.addEventListener("scrollend", settle, { once: true });
      window.setTimeout(settle, SETTLE);
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    // A drag isn't a click, and a cut-off card scrolls into view instead of opening.
    // Keyboard clicks (detail 0) always open: focus has already scrolled the card in.
    track.addEventListener(
      "click",
      (e) => {
        if (dragged) {
          dragged = false;
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const card = (e.target as Element).closest<HTMLElement>(
          "[data-rail-card]",
        );
        if (e.detail === 0 || !card?.classList.contains("is-peek")) return;
        e.preventDefault();
        track.scrollTo({
          left: revealTarget({
            start: startOf(card),
            width: card.offsetWidth,
            scrollLeft: track.scrollLeft,
            viewport: track.clientWidth,
            step: step(),
            maxScroll: maxScroll(),
          }),
          behavior,
        });
      },
      true,
    );

    update();
  }
}
