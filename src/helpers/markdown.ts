import { Marked, Renderer } from "marked";
import { isExternalHref } from "./externalLinks";

const markdown = new Marked({
  renderer: {
    link(token) {
      const html = Renderer.prototype.link.call(this, token);
      if (!isExternalHref(token.href)) {
        return html.replace("<a ", '<a class="link" ');
      }
      return html
        .replace(
          "<a ",
          '<a class="link" target="_blank" rel="noopener noreferrer" ',
        )
        .replace(
          /<\/a>$/,
          '<span class="sr-only">(opens in new tab)</span></a>',
        );
    },
  },
});

export function renderMarkdown(text: string): string {
  return markdown.parse(text, { async: false });
}

export function renderInlineMarkdown(text: string): string {
  return markdown.parseInline(text, { async: false });
}
