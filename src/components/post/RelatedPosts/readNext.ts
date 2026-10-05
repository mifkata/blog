/** Where a browser keeps the posts it has opened, newest first. */
export const READ_KEY = "mifkata-read-posts";

/** How many opened posts a browser remembers. */
export const REMEMBERED = 100;

// The first item is the lead card; the rest are rows
const LEAD_SIZES = "(min-width: 768px) 460px, 100vw";
const ROW_SIZES = "72px";

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
      const image = item.querySelector("img");
      if (image) image.sizes = i === 0 ? LEAD_SIZES : ROW_SIZES;
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
