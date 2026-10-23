/** Where a browser keeps the posts it has opened, newest first. */
export const READ_KEY = "mifkata-read-posts";

/** How many opened posts a browser remembers. */
export const REMEMBERED = 100;

/**
 * The lead is cropped taller than the art, so cover scales past the column
 * width. 460px made a 2× screen keep the 960px file and scale it up. 800px
 * is the slot where 2× picks 1280 and 1× still picks 960.
 */
export const LEAD_SIZES = "(min-width: 768px) 800px, 100vw";
export const ROW_SIZES = "72px";

/** Any card can be promoted to the lead, so each one carries the 1280px file. */
export const RELATED_WIDTHS = [144, 480, 960, 1280];

export function rememberRead(read: string[], id: string): string[] {
  return [id, ...read.filter((other) => other !== id)].slice(0, REMEMBERED);
}

/** Posts not read yet first, each group in its original order. */
export function unreadFirst<T>(
  items: T[],
  idOf: (item: T) => string,
  read: Set<string>,
): T[] {
  return [
    ...items.filter((item) => !read.has(idOf(item))),
    ...items.filter((item) => read.has(idOf(item))),
  ];
}

/** The browser picks the AVIF from source sizes, so a reorder updates that too. */
export function setSlotSizes(
  elements: { sizes: string }[],
  lead: boolean,
): void {
  const sizes = lead ? LEAD_SIZES : ROW_SIZES;
  for (const el of elements) el.sizes = sizes;
}

function loadRead(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(READ_KEY) ?? "[]");
    return Array.isArray(stored)
      ? stored.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function setupReadNext(): void {
  const list = document.querySelector<HTMLElement>("[data-related]");
  if (!list || list.dataset.readNextReady) return;
  list.dataset.readNextReady = "true";

  const read = loadRead();
  const items = [...list.querySelectorAll<HTMLElement>("[data-related-id]")];
  const ordered = unreadFirst(
    items,
    (item) => item.dataset.relatedId!,
    new Set(read),
  );
  if (ordered.some((item, i) => item !== items[i])) {
    list.append(...ordered);
    ordered.forEach((item, i) => {
      setSlotSizes(
        [
          ...item.querySelectorAll<HTMLImageElement | HTMLSourceElement>(
            "img, source",
          ),
        ],
        i === 0,
      );
    });
  }

  const current = list.dataset.current;
  if (!current) return;
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(rememberRead(read, current)));
  } catch {
    // Private windows and blocked storage just keep the built order
  }
}
