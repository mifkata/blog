export interface Book {
  title: string;
  subtitle?: string;
  author: string;
  pages: number;
  topic: string;
  url: string;
}

export interface ReadingTopic<T> {
  topic: string;
  /** Its colour's hue, in OKLCH degrees */
  hue: number;
  books: T[];
}

/** Topic colours, in the order topics first appear in books.json. */
export const HUES = [300, 238, 62, 350, 168, 25, 200];

export function byTopic<T extends { topic: string }>(
  books: T[],
): ReadingTopic<T>[] {
  return [...new Set(books.map((book) => book.topic))].map((topic, i) => ({
    topic,
    hue: HUES[i % HUES.length],
    books: books.filter((book) => book.topic === topic),
  }));
}

function hash(text: string): number {
  let h = 0;
  for (const char of text) h = (h * 31 + char.codePointAt(0)!) >>> 0;
  return h;
}

/**
 * A spine's size in pixels: as thick as the book's page count suggests,
 * between 28 and 58px, and as tall as its title picks, the same on every
 * build.
 */
export function spineSize(
  title: string,
  pages: number,
): { width: number; height: number } {
  return {
    width: Math.min(58, Math.max(28, Math.round(22 + pages * 0.048))),
    height: 166 + ((hash(title) >>> 3) % 9) * 4,
  };
}

/**
 * Books in shelf order: shuffled the same way on every build, with no two
 * books of a topic side by side where that can be avoided.
 */
export function shelfOrder<T extends { title: string; topic: string }>(
  books: T[],
): T[] {
  const pool = [...books].sort((a, b) => hash(a.title) - hash(b.title));
  const order: T[] = [];
  while (pool.length) {
    const previous = order.at(-1)?.topic;
    const left = new Map<string, number>();
    for (const { topic } of pool) left.set(topic, (left.get(topic) ?? 0) + 1);
    // The topic with the most books left goes next, so none piles up at the
    // end; the shuffle picks among equals
    let next = -1;
    pool.forEach((book, i) => {
      if (book.topic === previous) return;
      if (next === -1 || left.get(book.topic)! > left.get(pool[next].topic)!)
        next = i;
    });
    order.push(...pool.splice(Math.max(next, 0), 1));
  }
  return order;
}

/**
 * How a book's cover differs from others of its topic: a lightness shift
 * (OKLCH, -0.03 to 0.03) and where a worn, lighter patch sits (% from top).
 */
export function spineTone(title: string): { tone: number; wear: number } {
  const h = hash(title);
  return {
    tone: (((h >>> 7) % 7) - 3) / 100,
    wear: 20 + ((h >>> 11) % 5) * 15,
  };
}

/** The first three letters of the first author's surname, for the spine. */
export function spineAuthor(author: string): string {
  const first = author.split(" & ")[0].trim().split(/\s+/);
  return first[first.length - 1].slice(0, 3).toUpperCase();
}
