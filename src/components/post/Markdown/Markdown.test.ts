import { describe, it, expect } from "vitest";
import { marked } from "marked";

function parseMarkdown(text: string): string {
  if (!text) return "";
  return marked.parse(text, { async: false }) as string;
}

describe("Markdown parsing with marked", () => {
  describe("empty input handling", () => {
    it("returns empty string for empty input", () => {
      expect(parseMarkdown("")).toBe("");
    });

    it("returns empty string for whitespace-only input", () => {
      const result = parseMarkdown("   ");
      expect(result.trim()).toBe("");
    });
  });

  describe("inline formatting", () => {
    it("converts **bold** to strong", () => {
      const result = parseMarkdown("some **bold** text");
      expect(result).toContain("<strong>bold</strong>");
    });

    it("converts *italic* to em", () => {
      const result = parseMarkdown("some *italic* text");
      expect(result).toContain("<em>italic</em>");
    });

    it("converts `code` to code tags", () => {
      const result = parseMarkdown("some `code` here");
      expect(result).toContain("<code>code</code>");
    });

    it("converts [text](url) to anchor tags", () => {
      const result = parseMarkdown("[click here](https://example.com)");
      expect(result).toContain('<a href="https://example.com">click here</a>');
    });
  });

  describe("paragraphs", () => {
    it("wraps text in paragraph tags", () => {
      const result = parseMarkdown("Hello world");
      expect(result).toContain("<p>Hello world</p>");
    });

    it("splits on double newlines into separate paragraphs", () => {
      const result = parseMarkdown("First paragraph\n\nSecond paragraph");
      expect(result).toContain("<p>First paragraph</p>");
      expect(result).toContain("<p>Second paragraph</p>");
    });
  });

  describe("marked configuration", () => {
    it("does not mangle email addresses", () => {
      const result = parseMarkdown("Contact: test@example.com");
      expect(result).toContain("test@example.com");
      expect(result).not.toContain("&#");
    });

    it("does not add ids to headers", () => {
      const result = parseMarkdown("# Heading");
      expect(result).not.toContain('id="');
    });
  });

  describe("complex markdown", () => {
    it("handles nested formatting", () => {
      const result = parseMarkdown("**bold and *italic* text**");
      expect(result).toContain("<strong>");
      expect(result).toContain("<em>");
    });

    it("handles links with formatting", () => {
      const result = parseMarkdown("[**bold link**](https://example.com)");
      expect(result).toContain('<a href="https://example.com">');
      expect(result).toContain("<strong>bold link</strong>");
    });

    it("handles code blocks", () => {
      const result = parseMarkdown("```js\nconst x = 1;\n```");
      expect(result).toContain("<pre><code");
      expect(result).toContain("const x = 1;");
    });

    it("handles lists", () => {
      const result = parseMarkdown("- Item 1\n- Item 2");
      expect(result).toContain("<ul>");
      expect(result).toContain("<li>");
    });
  });
});
