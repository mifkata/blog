import { describe, it, expect } from "vitest";
import quotes from "./quotes.json";

// The footer shows the first quote in the page's HTML, then rotates through
// the rest in this order and wraps around.
describe("quotes.json", () => {
  it("should give every quote its text and author", () => {
    expect(quotes.length).toBeGreaterThan(0);
    for (const quote of quotes) {
      expect(quote.text.trim(), JSON.stringify(quote)).not.toBe("");
      expect(quote.author.trim(), JSON.stringify(quote)).not.toBe("");
    }
  });

  it("should never show the same author twice in a row, wrap-around included", () => {
    quotes.forEach((quote, i) => {
      const next = quotes[(i + 1) % quotes.length];
      expect(
        next.author,
        `quotes ${i + 1} and ${((i + 1) % quotes.length) + 1}`,
      ).not.toBe(quote.author);
    });
  });
});
