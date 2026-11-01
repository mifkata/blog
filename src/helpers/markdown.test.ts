import { describe, expect, it } from "vitest";
import { isExternalHref } from "./externalLinks";
import { renderInlineMarkdown, renderMarkdown } from "./markdown";

const NEW_TAB = '<span class="sr-only">(opens in new tab)</span>';

describe("isExternalHref", () => {
  it("matches other sites", () => {
    expect(isExternalHref("https://github.com/gastownhall/beads")).toBe(true);
    expect(isExternalHref("//example.com/page")).toBe(true);
  });

  it("leaves this site, relative paths and other schemes alone", () => {
    expect(isExternalHref("https://mifkata.com/about/")).toBe(false);
    expect(isExternalHref("https://www.mifkata.com/")).toBe(false);
    expect(isExternalHref("/blog/2026/01/spec-driven-development/")).toBe(
      false,
    );
    expect(isExternalHref("#section")).toBe(false);
    expect(isExternalHref("mailto:me@example.com")).toBe(false);
  });
});

describe("renderMarkdown", () => {
  it("marks external links like the post body does", () => {
    expect(renderMarkdown("[beads](https://example.com/beads)")).toBe(
      `<p><a class="link" target="_blank" rel="noopener noreferrer" href="https://example.com/beads">beads${NEW_TAB}</a></p>\n`,
    );
  });

  it("styles internal links without opening a new tab", () => {
    expect(renderMarkdown("[post](/blog/one/)")).toBe(
      '<p><a class="link" href="/blog/one/">post</a></p>\n',
    );
  });

  it("keeps a link's title and inner formatting", () => {
    const html = renderMarkdown('[**bold**](https://example.com "Title")');
    expect(html).toContain('title="Title"');
    expect(html).toContain("<strong>bold</strong>");
  });

  it("splits paragraphs on a blank line", () => {
    expect(renderMarkdown("One.\n\nTwo.")).toBe("<p>One.</p>\n<p>Two.</p>\n");
  });
});

describe("renderInlineMarkdown", () => {
  it("renders links the same way, without a paragraph", () => {
    expect(renderInlineMarkdown("See [post](/blog/one/).")).toBe(
      'See <a class="link" href="/blog/one/">post</a>.',
    );
  });
});
