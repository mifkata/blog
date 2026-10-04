import {
  faviconDataUri,
  faviconSvg,
  type FaviconFrame,
} from "@/helpers/favicon";
import { DEFAULT_PALETTE, type Palette } from "@/helpers/season";

/** Cursor blinks when the visitor comes back to the tab. */
const RETURN_BLINKS = 4;
/** One blink phase (cursor on or off), in ms. */
const BLINK = 450;
/** How long the tab must have been in the background for a return to count, in ms. */
const AWAY = 30_000;

let timer = 0;
let restHref: string | null = null;
let watching = false;

function link() {
  return document.querySelector<HTMLLinkElement>("link[data-favicon]");
}

function palette(): Palette {
  return (
    (document.documentElement.dataset.palette as Palette | undefined) ??
    DEFAULT_PALETTE
  );
}

/** Shows one frame of the mark, or the season's own icon again with null. */
export function showFrame(frame: FaviconFrame | null): void {
  const el = link();
  if (!el) return;
  restHref ??= el.getAttribute("href");
  if (frame === null) {
    if (restHref) el.setAttribute("href", restHref);
    return;
  }
  el.setAttribute("href", faviconDataUri(faviconSvg(palette(), frame)));
}

export function stopBlinking(): void {
  window.clearTimeout(timer);
  timer = 0;
  showFrame(null);
}

export function startBlinking(times = Infinity): void {
  stopBlinking();
  let phase = 0;
  const tick = () => {
    if (phase >= times * 2) {
      showFrame(null);
      return;
    }
    showFrame(phase % 2 === 0 ? "prompt" : "full");
    phase++;
    timer = window.setTimeout(tick, BLINK);
  };
  tick();
}

export function watchReturns(): void {
  if (watching) return;
  watching = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let hiddenAt = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = Date.now();
      return;
    }
    const away = hiddenAt > 0 && Date.now() - hiddenAt >= AWAY;
    if (away && !document.documentElement.dataset.boot) {
      startBlinking(RETURN_BLINKS);
    }
  });
}
