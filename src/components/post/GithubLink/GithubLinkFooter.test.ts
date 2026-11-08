import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GithubLink from "./GithubLinkReact";

const footerText = (url: string) => {
  const html = renderToStaticMarkup(createElement(GithubLink, { url }));
  const host = /<a[^>]*class="repo-card-host"[^>]*>(.*?)<\/a>/s.exec(html);
  return host?.[1]
    .replace(/<[^>]*>/g, "")
    .replace(/\(opens in new tab\)/, "")
    .trim();
};

describe("GithubLink footer", () => {
  it("drops scheme, www and the tree or blob branch", () => {
    expect(footerText("https://github.com/mifkata/blog/tree/main/src")).toBe(
      "github.com/mifkata/blog/src",
    );
  });

  it("keeps blob-less and owner-named paths intact", () => {
    expect(footerText("https://github.com/mifkata/blog")).toBe(
      "github.com/mifkata/blog",
    );
    expect(footerText("https://github.com/tree/blob")).toBe(
      "github.com/tree/blob",
    );
    expect(footerText("https://github.com/mifkata/blog/blob/main/a.ts")).toBe(
      "github.com/mifkata/blog/a.ts",
    );
  });

  it("shows the raw string when the URL does not parse", () => {
    expect(footerText("not a url")).toBe("not a url");
  });
});
