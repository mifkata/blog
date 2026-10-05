import { describe, it, expect } from "vitest";
import {
  rarestTag,
  recentIndex,
  tagCounts,
  type RecentPost,
} from "./recentIndex";

const post = (id: string, date: Date, tags: string[] = ["ai"]): RecentPost => ({
  id,
  title: id,
  date,
  tags,
  minutes: 3,
});

const labels = (index: ReturnType<typeof recentIndex>) =>
  index.groups.map((group) => [group.label, group.rows.map((row) => row.id)]);

describe("recentIndex", () => {
  const counts = new Map([["ai", 9]]);

  it("should group by year when the posts span more than one", () => {
    const index = recentIndex(
      [
        post("tools", new Date(2026, 8, 21)),
        post("sdd", new Date(2026, 0, 8)),
        post("sandbox", new Date(2025, 11, 30)),
      ],
      { counts },
    );
    expect(index.by).toBe("year");
    expect(labels(index)).toEqual([
      ["2026", ["tools", "sdd"]],
      ["2025", ["sandbox"]],
    ]);
    expect(index.eyebrow).toBe("Writing · 3 posts since Dec 2025");
  });

  it("should group by month, spelled out, within a single year", () => {
    const index = recentIndex(
      [
        post("tools", new Date(2026, 8, 21)),
        post("sdd", new Date(2026, 0, 8)),
        post("instructions", new Date(2026, 0, 2)),
      ],
      { counts },
    );
    expect(index.by).toBe("month");
    expect(labels(index)).toEqual([
      ["September", ["tools"]],
      ["January", ["sdd", "instructions"]],
    ]);
    expect(index.eyebrow).toBe("Writing · 3 posts in 2026");
  });

  it("should mark the featured series' parts and tag the rest", () => {
    const index = recentIndex(
      [
        post("tools", new Date(2026, 8, 21), ["ai", "tools"]),
        post("sdd", new Date(2026, 0, 8), ["ai", "sdd"]),
      ],
      {
        counts: new Map([
          ["ai", 9],
          ["tools", 1],
          ["sdd", 2],
        ]),
        seriesUrls: ["/blog/sandbox/", "/blog/instructions/", "/blog/sdd/"],
      },
    );
    const [tools, sdd] = index.groups.flatMap((group) => group.rows);
    expect(tools).toMatchObject({ url: "/blog/tools/", tag: "tools" });
    expect(tools.part).toBeUndefined();
    expect(sdd).toMatchObject({ url: "/blog/sdd/", part: 3 });
    expect(sdd.tag).toBeUndefined();
  });

  it("should count a single post and leave an empty list unlabelled", () => {
    expect(
      recentIndex([post("init", new Date(2025, 11, 1))], { counts }).eyebrow,
    ).toBe("Writing · 1 post in 2025");
    expect(recentIndex([], { counts })).toEqual({
      by: "month",
      eyebrow: "Writing",
      groups: [],
    });
  });
});

describe("rarestTag", () => {
  const counts = tagCounts([
    { tags: ["ai", "astro", "cloudflare", "terraform"] },
    { tags: ["ai", "astro"] },
    { tags: ["ai", "tools", "tokens"] },
  ]);

  it("should pick the tag the fewest posts share", () => {
    expect(rarestTag(["ai", "astro", "cloudflare"], counts)).toBe("cloudflare");
  });

  it("should prefer the later tag on a tie", () => {
    expect(rarestTag(["astro", "cloudflare", "terraform"], counts)).toBe(
      "terraform",
    );
    expect(rarestTag(["ai", "tools", "tokens"], counts)).toBe("tokens");
  });

  it("should have nothing to pick without tags", () => {
    expect(rarestTag([], counts)).toBeUndefined();
  });
});
