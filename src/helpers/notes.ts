import type { CollectionEntry } from "astro:content";

/** Notes shown before "Load more", and revealed by each click after that */
export const NOTES_PAGE_SIZE = 20;

export const isPublishedNote = ({ data }: CollectionEntry<"notes">) =>
  import.meta.env.DEV || !data.draft;

export const newestFirst = <T extends { date: Date }>(notes: T[]): T[] =>
  [...notes].sort((a, b) => b.date.valueOf() - a.date.valueOf());

export interface NoteMonth<T> {
  /** "2026-10", for keys and aria labels */
  key: string;
  month: string;
  year: number;
  notes: T[];
}

/**
 * Groups notes, newest first, by the month they were written in. A note's
 * date is a calendar day, so months are read in UTC and never shift with the
 * machine's time zone.
 */
export function groupByMonth<T extends { date: Date }>(
  notes: T[],
): NoteMonth<T>[] {
  const months: NoteMonth<T>[] = [];
  for (const note of newestFirst(notes)) {
    const year = note.date.getUTCFullYear();
    const index = note.date.getUTCMonth();
    const key = `${year}-${String(index + 1).padStart(2, "0")}`;
    let group = months.at(-1);
    if (group?.key !== key) {
      group = {
        key,
        month: note.date.toLocaleDateString("en-us", {
          month: "long",
          timeZone: "UTC",
        }),
        year,
        notes: [],
      };
      months.push(group);
    }
    group.notes.push(note);
  }
  return months;
}

/**
 * A note's body as plain text, for places that can't hold links or markup,
 * like a card that is itself a link.
 */
export function plainText(body: string): string {
  return body
    .replace(/^(import|export)\s.*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** "2026-10-12", the day a note is dated */
export const isoDay = (date: Date): string => date.toISOString().slice(0, 10);

/** How much of a note a home card shows before it's cut */
export const EXCERPT_LENGTH = 120;

/**
 * Cuts text to about `max` characters at a word boundary, drops punctuation
 * left dangling at the cut and adds an ellipsis. Text that fits is returned
 * as is.
 */
export function excerpt(text: string, max = EXCERPT_LENGTH): string {
  if (text.length <= max) return text;
  let cut = text.slice(0, max + 1);
  const space = cut.lastIndexOf(" ");
  cut = space > 0 ? cut.slice(0, space) : cut.slice(0, max);
  return `${cut.replace(/[\s,;:.!?\-–—'"‘’“”()[\]]+$/, "")}…`;
}
