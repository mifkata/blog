import quotes from "@/data/quotes.json";

export interface Quote {
  text: string;
  author: string;
  source?: string;
  /** For reviewers of quotes.json; never shown. */
  note?: string;
}

/** Shown in this order, wrapping around; the first is in the page's HTML. */
export const QUOTES: readonly Quote[] = quotes;

/** Seconds each quote stays before the next one, while the footer is in view. */
export const QUOTE_ROTATE_SECONDS = 7;

/** Seconds the flame takes to cycle through its three shades. */
export const FLAME_CYCLE_SECONDS = 1.5;

/** Milliseconds a quote fades out before the next one replaces it. */
const QUOTE_FADE_MS = 200;

/* A 5×7 pixel flame, top row first: o outer, m mid, c core, . empty */
const FLAME = ["..o..", "..oo.", ".omo.", ".ommo", "omcmo", "omcmo", ".omo."];
const FLAME_LAYERS = { o: "outer", m: "mid", c: "core" } as const;

export type FlameLayer = (typeof FLAME_LAYERS)[keyof typeof FLAME_LAYERS];

export function flameCells(
  rows: readonly string[] = FLAME,
): { x: number; y: number; layer: FlameLayer }[] {
  return rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) => {
      const layer = FLAME_LAYERS[cell as keyof typeof FLAME_LAYERS];
      return layer ? [{ x, y, layer }] : [];
    }),
  );
}

export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/** A YYYY-MM-DD date in the reader's own format, e.g. "Oct 5, 2026". */
export function localDate(iso: string, locale?: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  // Built from its parts, so the day doesn't shift west of UTC
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(year, month - 1, day),
  );
}

function writeQuote(figure: HTMLElement, quote: Quote): void {
  figure.querySelector("[data-quote-text]")!.textContent = `"${quote.text}"`;
  const credit = figure.querySelector("[data-quote-credit]")!;
  credit.textContent = quote.author;
  if (quote.source) {
    const source = document.createElement("cite");
    source.textContent = `· ${quote.source}`;
    credit.append(" ", source);
  }
}

function rotateQuotes(footer: HTMLElement, figure: HTMLElement): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const text = figure.querySelector<HTMLElement>("[data-quote-text]")!;
  let index = 0;
  let timer: number | undefined;
  let fade: number | undefined;
  let inView = false;
  let held = false;

  const show = (next: number, announce: boolean) => {
    index = wrapIndex(next, QUOTES.length);
    text.setAttribute("aria-live", announce ? "polite" : "off");
    window.clearTimeout(fade);
    if (reduced.matches) return writeQuote(figure, QUOTES[index]);
    figure.classList.add("is-out");
    fade = window.setTimeout(() => {
      writeQuote(figure, QUOTES[index]);
      figure.classList.remove("is-out");
    }, QUOTE_FADE_MS);
  };

  const restart = () => {
    window.clearInterval(timer);
    if (inView && !held) {
      timer = window.setInterval(
        () => show(index + 1, false),
        QUOTE_ROTATE_SECONDS * 1000,
      );
    }
  };

  // Holds the tallest quote's height, so a swap never moves the page
  const reserve = () => {
    figure.style.minHeight = "";
    let tallest = 0;
    for (const quote of QUOTES) {
      writeQuote(figure, quote);
      tallest = Math.max(tallest, figure.getBoundingClientRect().height);
    }
    writeQuote(figure, QUOTES[index]);
    figure.style.minHeight = `${Math.ceil(tallest)}px`;
  };

  figure.querySelector("[data-quote-next]")!.addEventListener("click", () => {
    show(index + 1, true);
    restart();
  });

  // Paused while someone is reading or using it
  const hold = (value: boolean) => {
    held = value;
    restart();
  };
  figure.addEventListener("pointerenter", () => hold(true));
  figure.addEventListener("pointerleave", () => hold(false));
  figure.addEventListener("focusin", () => hold(true));
  figure.addEventListener("focusout", () => hold(false));

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      restart();
    },
    { threshold: 0.3 },
  ).observe(footer);

  let width = 0;
  new ResizeObserver(([entry]) => {
    const next = Math.round(entry.contentRect.width);
    if (next === width) return;
    width = next;
    reserve();
  }).observe(figure.parentElement!);
  document.fonts?.ready.then(reserve);
}

export function setupFooter(): void {
  const footer = document.querySelector<HTMLElement>("[data-footer]");
  if (!footer || footer.dataset.footerReady) return;
  footer.dataset.footerReady = "true";

  footer
    .querySelectorAll<HTMLTimeElement>("[data-local-date]")
    .forEach((time) => (time.textContent = localDate(time.dateTime)));

  const figure = footer.querySelector<HTMLElement>("[data-footer-quotes]");
  if (figure && QUOTES.length > 1) rotateQuotes(footer, figure);
}
