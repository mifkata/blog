import { describe, it, expect } from "vitest";
import {
  HUES,
  byTopic,
  spineAuthor,
  shelfOrder,
  spineSize,
  spineTone,
} from "./readingTopics";

describe("byTopic", () => {
  it("should group books in the order topics first appear, each with a hue", () => {
    const topics = byTopic([
      { title: "Programming Erlang", topic: "Languages" },
      { title: "Zero to One", topic: "Startups" },
      { title: "The Rust Programming Language", topic: "Languages" },
    ]);
    expect(
      topics.map(({ topic, hue, books }) => [
        topic,
        hue,
        books.map((book) => book.title),
      ]),
    ).toEqual([
      [
        "Languages",
        HUES[0],
        ["Programming Erlang", "The Rust Programming Language"],
      ],
      ["Startups", HUES[1], ["Zero to One"]],
    ]);
  });

  it("should reuse hues when there are more topics than colours", () => {
    const books = Array.from({ length: HUES.length + 1 }, (_, i) => ({
      topic: `Topic ${i}`,
    }));
    expect(byTopic(books).at(-1)!.hue).toBe(HUES[0]);
  });
});

describe("spineSize", () => {
  it("should make thicker books wider, within a shelf's range", () => {
    const thin = spineSize("Zero to One", 195);
    const thick = spineSize("Noise", 454);
    expect(thick.width).toBeGreaterThan(thin.width);
    expect(spineSize("Pamphlet", 10).width).toBe(28);
    expect(spineSize("Encyclopedia", 2000).width).toBe(58);
  });

  it("should give a title the same height every time, within a book's range", () => {
    const { height } = spineSize("Foundation", 244);
    expect(spineSize("Foundation", 244).height).toBe(height);
    expect(height).toBeGreaterThanOrEqual(166);
    expect(height).toBeLessThanOrEqual(198);
  });
});

describe("shelfOrder", () => {
  const books = [
    { title: "Programming Erlang", topic: "Languages" },
    { title: "The Rust Programming Language", topic: "Languages" },
    { title: "Designing Data-Intensive Applications", topic: "Data & ML" },
    { title: "Deep Learning with Python", topic: "Data & ML" },
    { title: "Zero to One", topic: "Startups" },
    { title: "The Hard Thing About Hard Things", topic: "Startups" },
    { title: "Foundation", topic: "Science & sci-fi" },
    { title: "A Brief History of Time", topic: "Science & sci-fi" },
  ];

  it("should keep every book and the same order on every build", () => {
    const order = shelfOrder(books);
    expect(order).toHaveLength(books.length);
    expect(new Set(order)).toEqual(new Set(books));
    expect(shelfOrder([...books].reverse())).toEqual(order);
  });

  it("should not put two books of a topic side by side", () => {
    const order = shelfOrder(books);
    for (let i = 1; i < order.length; i++)
      expect(order[i].topic).not.toBe(order[i - 1].topic);
  });
});

describe("spineTone", () => {
  it("should vary each book slightly, the same way on every build", () => {
    const tone = spineTone("Foundation");
    expect(spineTone("Foundation")).toEqual(tone);
    expect(Math.abs(tone.tone)).toBeLessThanOrEqual(0.03);
    expect(tone.wear).toBeGreaterThanOrEqual(20);
    expect(tone.wear).toBeLessThanOrEqual(80);
  });
});

describe("spineAuthor", () => {
  it("should take the first author's surname", () => {
    expect(spineAuthor("Joe Armstrong")).toBe("ARM");
    expect(spineAuthor("Steve Klabnik & Carol Nichols")).toBe("KLA");
  });
});
