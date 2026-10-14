import { describe, it, expect } from "vitest";
import { excerpt, groupByMonth, isoDay, newestFirst, plainText } from "./notes";

const note = (id: string, date: Date) => ({ id, date });

describe("newestFirst", () => {
  it("should sort by date, newest first, without changing the input", () => {
    const input = [
      note("old", new Date(Date.UTC(2026, 8, 3))),
      note("new", new Date(Date.UTC(2026, 9, 12))),
    ];

    expect(newestFirst(input).map((n) => n.id)).toEqual(["new", "old"]);
    expect(input.map((n) => n.id)).toEqual(["old", "new"]);
  });
});

describe("groupByMonth", () => {
  it("should group notes by month and year, newest first", () => {
    const months = groupByMonth([
      note("sep", new Date(Date.UTC(2026, 8, 3))),
      note("oct-late", new Date(Date.UTC(2026, 9, 12))),
      note("oct-early", new Date(Date.UTC(2026, 9, 4))),
      note("last-year", new Date(Date.UTC(2025, 8, 20))),
    ]);

    expect(
      months.map((m) => [m.key, m.month, m.year, m.notes.map((n) => n.id)]),
    ).toEqual([
      ["2026-10", "October", 2026, ["oct-late", "oct-early"]],
      ["2026-09", "September", 2026, ["sep"]],
      ["2025-09", "September", 2025, ["last-year"]],
    ]);
  });

  it("should return nothing for no notes", () => {
    expect(groupByMonth([])).toEqual([]);
  });
});

describe("plainText", () => {
  it("should keep link text and drop the URL", () => {
    expect(plainText("Read [the docs](https://astro.build) first.")).toBe(
      "Read the docs first.",
    );
  });

  it("should drop emphasis and code markers", () => {
    expect(plainText("It is **bold**, _soft_ and `pnpm dev`.")).toBe(
      "It is bold, soft and pnpm dev.",
    );
  });

  it("should drop imports and tags, and collapse whitespace", () => {
    expect(plainText('import X from "x";\n\nOne <b>two</b>\n\nthree')).toBe(
      "One two three",
    );
  });
});

describe("isoDay", () => {
  it("should format the calendar day", () => {
    expect(isoDay(new Date("2026-10-12"))).toBe("2026-10-12");
  });
});

describe("excerpt", () => {
  it("should return text that fits as is", () => {
    expect(excerpt("Short, and done.", 40)).toBe("Short, and done.");
  });

  it("should cut at a word, never inside one", () => {
    expect(
      excerpt("Moved the notifier into a script and it survives", 30),
    ).toBe("Moved the notifier into a…");
  });

  it("should keep a word that ends exactly at the limit", () => {
    expect(excerpt("one two three four", 13)).toBe("one two three…");
  });

  it("should drop trailing punctuation before the ellipsis", () => {
    expect(excerpt("Fixed contrast, focus, and more things", 22)).toBe(
      "Fixed contrast, focus…",
    );
    expect(excerpt("Done. Next up is the shelf and more", 8)).toBe("Done…");
  });

  it("should cut a single long word at the limit", () => {
    expect(excerpt("supercalifragilistic", 5)).toBe("super…");
  });
});
