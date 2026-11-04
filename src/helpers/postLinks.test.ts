import { describe, it, expect } from "vitest";
import {
  classifyLink,
  compactNumber,
  extractLinks,
  normalizeUrl,
  shownStars,
} from "./postLinks";

describe("normalizeUrl", () => {
  it("should drop the protocol, www and a trailing slash", () => {
    expect(normalizeUrl("https://www.Kiro.dev/")).toBe("kiro.dev");
    expect(normalizeUrl("http://agentskills.io/home/")).toBe(
      "agentskills.io/home",
    );
  });

  it("should keep the query, which makes it a different page", () => {
    expect(normalizeUrl("https://skills.sh/?q=docs")).toBe("skills.sh?q=docs");
  });
});

describe("classifyLink", () => {
  it("should name GitHub links by repository, pointing at its root", () => {
    expect(
      classifyLink("https://github.com/tmux/tmux/wiki/Getting-Started"),
    ).toEqual({
      url: "https://github.com/tmux/tmux",
      kind: "github",
      label: "tmux/tmux",
      repo: "tmux/tmux",
    });
  });

  it("should name npm packages, scoped ones included", () => {
    expect(classifyLink("https://www.npmjs.com/package/skills").label).toBe(
      "skills",
    );
    expect(
      classifyLink("https://www.npmjs.com/package/@lucide/astro").label,
    ).toBe("@lucide/astro");
  });

  it("should name a GitHub profile or organisation by its owner", () => {
    expect(classifyLink("https://github.com/mifkata/")).toEqual({
      url: "https://github.com/mifkata/",
      kind: "github-profile",
      label: "mifkata",
    });
  });

  it("should mark the author's own repositories", () => {
    expect(classifyLink("https://github.com/mifkata/bins").own).toBe(true);
    expect(classifyLink("https://github.com/tmux/tmux").own).toBeUndefined();
  });

  it("should name Wikipedia articles by title", () => {
    expect(
      classifyLink("https://en.wikipedia.org/wiki/Directed_acyclic_graph"),
    ).toEqual({
      url: "https://en.wikipedia.org/wiki/Directed_acyclic_graph",
      kind: "wikipedia",
      label: "Directed acyclic graph",
    });
    expect(
      classifyLink("https://de.wikipedia.org/wiki/K%C3%B6nigsberg").label,
    ).toBe("Königsberg");
  });

  it("should label a Wikipedia page that is not an article by host and path", () => {
    expect(classifyLink("https://en.wikipedia.org/").kind).toBe("web");
  });

  it("should label anything else by host and path", () => {
    expect(classifyLink("https://agentskills.io/home")).toEqual({
      url: "https://agentskills.io/home",
      kind: "web",
      label: "agentskills.io/home",
    });
  });
});

describe("extractLinks", () => {
  const body = [
    "The format is an open standard ([agentskills.io](https://agentskills.io/home)).",
    '<GithubLink url="https://github.com/mgechev/skillgrade">',
    "See [the wiki](https://github.com/mgechev/skillgrade/wiki) too.",
    '<a href="https://skills.sh">skills.sh</a>',
    "```md",
    "[ignored](https://example.com/in-a-code-block)",
    "```",
    "Mine: [tags](https://mifkata.com/tags/ai/) and [source](https://github.com/mifkata/blog/blob/main/CLAUDE.md).",
    "Other work: [billing](https://github.com/mifkata/tu-varna-elixir-phone-billing).",
  ].join("\n");

  it("should list the author's repositories first, then the rest in order", () => {
    expect(extractLinks(body).map((link) => link.label)).toEqual([
      "mifkata/tu-varna-elixir-phone-billing",
      "agentskills.io/home",
      "mgechev/skillgrade",
      "skills.sh",
    ]);
  });

  it("should list a repository once, skip code blocks and the blog itself", () => {
    const urls = extractLinks(body).map((link) => link.url);
    expect(urls.filter((url) => url.includes("skillgrade"))).toHaveLength(1);
    expect(urls.some((url) => url.includes("example.com"))).toBe(false);
    expect(urls.some((url) => url.includes("mifkata.com"))).toBe(false);
  });
});

describe("shownStars", () => {
  const repo = classifyLink("https://github.com/tmux/tmux");
  const own = classifyLink("https://github.com/mifkata/bins");

  it("should show stars on other repositories, however few", () => {
    expect(shownStars({ ...repo, stars: 3 })).toBe(3);
  });

  it("should show stars on the author's repositories from 20 up", () => {
    expect(shownStars({ ...own, stars: 19 })).toBeUndefined();
    expect(shownStars({ ...own, stars: 20 })).toBe(20);
  });

  it("should show nothing without a count", () => {
    expect(shownStars(repo)).toBeUndefined();
  });
});

describe("compactNumber", () => {
  it("should shorten thousands with one decimal", () => {
    expect(compactNumber(720)).toBe("720");
    expect(compactNumber(2269)).toBe("2.3k");
    expect(compactNumber(179705)).toBe("179.7k");
  });
});
