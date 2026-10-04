/** How fast the hero image follows the page, as a share of the scroll distance. */
export const SPEED = 0.35;
/** How much the image darkens once the hero has scrolled out of view, 0 to 1. */
export const DIM = 0.3;
/** The header's shrink transition, in ms, so the image catches up after it. */
const HEADER_SETTLE = 350;

/**
 * Downward shift of the image inside its frame. It moves at SPEED, but never
 * further than the part of the frame already under the header, so the gap it
 * opens at the top always stays hidden, even while the header shrinks.
 */
export function imageShift(
  scrollY: number,
  frameTop: number,
  headerBottom: number,
): number {
  return Math.min(SPEED * scrollY, Math.max(0, headerBottom - frameTop));
}

/** How far the hero has scrolled out of view, from 0 to 1. */
export function heroProgress(frameTop: number, frameHeight: number): number {
  return Math.min(1, Math.max(0, -frameTop / Math.max(1, frameHeight)));
}

export function setupHeroParallax(): void {
  const frame = document.querySelector<HTMLElement>("[data-post-hero-media]");
  const image = frame?.querySelector<HTMLElement>("img");
  if (!frame || !image || frame.dataset.parallaxReady) return;
  frame.dataset.parallaxReady = "true";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const header = document.getElementById("site-header-slot")?.firstElementChild;
  let queued = 0;
  let settle = 0;

  const update = () => {
    queued = 0;
    const box = frame.getBoundingClientRect();
    if (box.bottom < 0) return;
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
    const shift = imageShift(window.scrollY, box.top, headerBottom);
    image.style.transform = `translateY(${shift}px)`;
    image.style.filter = `brightness(${1 - heroProgress(box.top, box.height) * DIM})`;
  };
  const schedule = () => {
    queued ||= requestAnimationFrame(update);
    window.clearTimeout(settle);
    settle = window.setTimeout(update, HEADER_SETTLE);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
}
