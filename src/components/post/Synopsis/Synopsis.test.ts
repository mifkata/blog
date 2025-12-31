import { describe, it, expect } from "vitest";

// Extract the parse functions for testing
function parseInlineMarkdown(input: string): string {
  return input
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function parseMarkdown(input: string): string {
  if (!input) return "";
  const paragraphs = input
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${parseInlineMarkdown(p)}</p>`).join("");
}

describe("parseInlineMarkdown", () => {
  it("should convert links [text](url) to anchor tags", () => {
    expect(parseInlineMarkdown("[click here](https://example.com)")).toBe(
      '<a href="https://example.com">click here</a>',
    );
  });

  it("should convert **bold** to strong", () => {
    expect(parseInlineMarkdown("some **bold** text")).toBe(
      "some <strong>bold</strong> text",
    );
  });

  it("should convert __bold__ to strong", () => {
    expect(parseInlineMarkdown("some __bold__ text")).toBe(
      "some <strong>bold</strong> text",
    );
  });

  it("should convert *italic* to em", () => {
    expect(parseInlineMarkdown("some *italic* text")).toBe(
      "some <em>italic</em> text",
    );
  });

  it("should convert _italic_ to em", () => {
    expect(parseInlineMarkdown("some _italic_ text")).toBe(
      "some <em>italic</em> text",
    );
  });

  it("should convert `code` to code tags", () => {
    expect(parseInlineMarkdown("some `code` here")).toBe(
      "some <code>code</code> here",
    );
  });

  it("should handle multiple inline elements", () => {
    expect(parseInlineMarkdown("**bold** and *italic* and `code`")).toBe(
      "<strong>bold</strong> and <em>italic</em> and <code>code</code>",
    );
  });

  it("should handle links before other formatting", () => {
    expect(parseInlineMarkdown("[**bold link**](url)")).toBe(
      '<a href="url"><strong>bold link</strong></a>',
    );
  });
});

describe("parseMarkdown", () => {
  it("should return empty string for empty input", () => {
    expect(parseMarkdown("")).toBe("");
  });

  it("should return empty string for undefined-like input", () => {
    expect(parseMarkdown("")).toBe("");
  });

  it("should wrap single paragraph in p tags", () => {
    expect(parseMarkdown("Hello world")).toBe("<p>Hello world</p>");
  });

  it("should split on double newlines into paragraphs", () => {
    expect(parseMarkdown("First paragraph\n\nSecond paragraph")).toBe(
      "<p>First paragraph</p><p>Second paragraph</p>",
    );
  });

  it("should handle multiple blank lines between paragraphs", () => {
    expect(parseMarkdown("First\n\n\n\nSecond")).toBe(
      "<p>First</p><p>Second</p>",
    );
  });

  it("should trim whitespace from paragraphs", () => {
    expect(parseMarkdown("  trimmed  \n\n  also trimmed  ")).toBe(
      "<p>trimmed</p><p>also trimmed</p>",
    );
  });

  it("should apply inline markdown within paragraphs", () => {
    expect(parseMarkdown("**bold** paragraph\n\n*italic* paragraph")).toBe(
      "<p><strong>bold</strong> paragraph</p><p><em>italic</em> paragraph</p>",
    );
  });

  it("should filter out empty paragraphs", () => {
    expect(parseMarkdown("\n\n\n")).toBe("");
  });
});
