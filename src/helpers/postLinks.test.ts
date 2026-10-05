import { describe, it, expect } from "vitest";
import {
  classifyLink,
  compactNumber,
  extractLinks,
  normalizeUrl,
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

  it("should collect markdown links and url/href props in order", () => {
    expect(extractLinks(body).map((link) => link.label)).toEqual([
      "agentskills.io/home",
      "mgechev/skillgrade",
      "skills.sh",
      "mifkata/tu-varna-elixir-phone-billing",
    ]);
  });

  it("should list a repository once, skip code blocks and the blog itself", () => {
    const urls = extractLinks(body).map((link) => link.url);
    expect(urls.filter((url) => url.includes("skillgrade"))).toHaveLength(1);
    expect(urls.some((url) => url.includes("example.com"))).toBe(false);
    expect(urls.some((url) => url.includes("mifkata.com"))).toBe(false);
  });
});

describe("compactNumber", () => {
  it("should shorten thousands with one decimal", () => {
    expect(compactNumber(720)).toBe("720");
    expect(compactNumber(2269)).toBe("2.3k");
    expect(compactNumber(179705)).toBe("179.7k");
  });
});
