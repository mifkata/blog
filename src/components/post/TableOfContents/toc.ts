export interface TocEntry {
  slug: string;
  text: string;
}

export interface TocChapter extends TocEntry {
  children: TocEntry[];
}

/** Chapters (h2) with their sections (h3); anything else is left out. */
export function tocOutline(
  headings: { depth: number; slug: string; text: string }[],
): TocChapter[] {
  const chapters: TocChapter[] = [];
  for (const { depth, slug, text } of headings) {
    if (depth === 2) chapters.push({ slug, text, children: [] });
    else if (depth === 3) chapters.at(-1)?.children.push({ slug, text });
  }
  return chapters;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Where the reader is, in page coordinates. Normally a line just under the
 * header. Over the last screen of the article it speeds up to the bottom of
 * the viewport, so it reaches the article's end once the end is on screen:
 * the last section gets its turn and the progress gets to 100%.
 */
export function readingLine({
  scrollY,
  viewport,
  offset,
  end,
}: {
  scrollY: number;
  viewport: number;
  offset: number;
  end: number;
}): number {
  const span = Math.max(1, viewport - offset);
  const speedUpFrom = end - viewport - span;
  return scrollY + offset + clamp((scrollY - speedUpFrom) / span) * span;
}

/** Share of the stretch from `start` to `end` that's behind the line. */
export function progressBetween(line: number, start: number, end: number) {
  return end > start ? clamp((line - start) / (end - start)) : 1;
}

/** The last heading the line has passed; the first one until then. */
export function activeSlug(
  headings: { slug: string; top: number }[],
  line: number,
): string | undefined {
  let active = headings[0]?.slug;
  for (const { slug, top } of headings) {
    if (top <= line + 1) active = slug;
    else break;
  }
  return active;
}

export function timeLeft(minutes: number, progress: number): string {
  if (progress >= 0.99) return "Finished";
  return `${Math.max(1, Math.ceil(minutes * (1 - progress)))} min left`;
}

/** Milliseconds the sections take to open, while the markers follow them. */
const OPEN_MS = 350;

export function setupToc(): void {
  const body = document.querySelector<HTMLElement>("[data-post-body]");
  const lists = [...document.querySelectorAll<HTMLElement>("[data-toc-list]")];
  if (!body || lists.length === 0 || body.dataset.tocReady) return;
  body.dataset.tocReady = "true";

  const chapterOf = new Map<string, string>();
  for (const chapter of lists[0].querySelectorAll<HTMLElement>(
    "[data-toc-chapter]",
  )) {
    const slug = chapter.dataset.tocChapter!;
    for (const link of chapter.querySelectorAll<HTMLElement>("[data-toc-link]"))
      chapterOf.set(link.dataset.tocLink!, slug);
  }
  const chapters = [...new Set(chapterOf.values())];
  const headings = [...chapterOf.keys()]
    .map((slug) => document.getElementById(slug))
    .filter((el): el is HTMLElement => el !== null);
  if (headings.length === 0) return;

  const links = [...document.querySelectorAll<HTMLElement>("[data-toc-link]")];
  const segments = [
    ...document.querySelectorAll<HTMLElement>("[data-chapter-segment]"),
  ];
  const menu = document.querySelector<HTMLElement>("[data-chapter-menu]");
  const toggle = document.querySelector<HTMLElement>("[data-chapter-toggle]");
  const pageTop = (el: Element) => el.getBoundingClientRect().top + scrollY;
  // A heading counts as reached where a jump to it lands it
  const offset =
    (parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 112) + 8;

  let active: string | undefined;
  let pinned: string | undefined;
  let ticking = false;

  const moveMarkers = () => {
    for (const list of lists) {
      const marker = list.querySelector<HTMLElement>("[data-toc-marker]");
      let link = list.querySelector<HTMLElement>("[data-toc-link].is-active");
      if (link?.closest(".toc-sub") && !link.closest("li.is-open")) {
        link = link
          .closest<HTMLElement>("[data-toc-chapter]")
          ?.querySelector("[data-toc-link]") as HTMLElement | null;
      }
      if (!marker || !link) continue;
      marker.style.top = `${link.offsetTop}px`;
      marker.style.height = `${link.offsetHeight}px`;
    }
  };
  const followMarkers = () => {
    const start = performance.now();
    const step = () => {
      moveMarkers();
      if (performance.now() - start < OPEN_MS) requestAnimationFrame(step);
    };
    step();
  };

  const setActive = (slug: string) => {
    const chapter = chapterOf.get(slug)!;
    for (const link of links)
      link.classList.toggle("is-active", link.dataset.tocLink === slug);
    for (const item of document.querySelectorAll<HTMLElement>(
      "[data-toc-chapter]",
    ))
      item.classList.toggle("is-open", item.dataset.tocChapter === chapter);
    const index = chapters.indexOf(chapter);
    const title = lists[0].querySelector(`[data-toc-link="${chapter}"]`);
    document
      .querySelectorAll("[data-chapter-number]")
      .forEach((el) => (el.textContent = `§ ${index + 1}/${chapters.length}`));
    document
      .querySelectorAll("[data-chapter-title]")
      .forEach((el) => (el.textContent = title?.textContent ?? ""));
    followMarkers();
  };

  const update = () => {
    ticking = false;
    const start = pageTop(body);
    const end = start + body.offsetHeight;
    const line = readingLine({
      scrollY,
      viewport: innerHeight,
      offset,
      end,
    });
    const progress = progressBetween(line, start, end);
    document
      .querySelectorAll<HTMLElement>("[data-toc-progress]")
      .forEach((el) => el.style.setProperty("--progress", `${progress}`));
    document.querySelectorAll<HTMLElement>("[data-toc-left]").forEach((el) => {
      el.textContent = timeLeft(Number(el.dataset.tocLeft), progress);
    });

    // Each chapter's segment spans from its heading to the next one; the
    // first also takes the introduction
    const starts = chapters.map((slug, i) =>
      i === 0 ? start : pageTop(document.getElementById(slug) ?? body),
    );
    segments.forEach((segment, i) => {
      const from = starts[i];
      const to = starts[i + 1] ?? end;
      segment.style.flexGrow = `${Math.max(1, to - from)}`;
      segment.style.setProperty(
        "--progress",
        `${progressBetween(line, from, to)}`,
      );
    });

    const current =
      pinned ??
      activeSlug(
        headings.map((el) => ({ slug: el.id, top: pageTop(el) })),
        line,
      );
    if (current && current !== active) {
      active = current;
      setActive(current);
    }
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  // A jump keeps the chosen heading active until the reader scrolls on their own
  const unpin = () => {
    if (!pinned) return;
    pinned = undefined;
    schedule();
  };
  const closeMenu = () => {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    toggle?.setAttribute("aria-expanded", "false");
  };
  document.addEventListener("click", (event) => {
    const target = event.target as Element;
    const jump = target.closest<HTMLElement>(
      "[data-toc-link], [data-chapter-segment]",
    );
    if (jump) {
      pinned = jump.dataset.tocLink ?? jump.dataset.chapterSegment;
      closeMenu();
      if (pinned && pinned !== active) {
        active = pinned;
        setActive(pinned);
      }
      return;
    }
    if (target.closest("[data-chapter-toggle]") && menu) {
      menu.hidden = !menu.hidden;
      toggle?.setAttribute("aria-expanded", String(!menu.hidden));
      if (!menu.hidden) followMarkers();
      return;
    }
    if (target.closest("[data-toc-top]")) {
      pinned = undefined;
      scrollTo({ top: 0 });
      return;
    }
    if (!target.closest("[data-chapter-menu]")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
    unpin();
  });
  for (const type of ["wheel", "touchmove", "pointerdown"])
    addEventListener(type, unpin, { passive: true });
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
}
