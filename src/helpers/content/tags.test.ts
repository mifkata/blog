import { describe, it, expect } from "vitest";
import {
  activityLabel,
  activityMonths,
  cloudWeight,
  compareTags,
  isTagSort,
  postsByYear,
  relatedTags,
  summarizeTags,
  tagRowFromData,
} from "./tags";

const post = (id: string, date: string, tags: string[]) => ({
  id,
  title: id,
  date: new Date(`${date}T00:00:00Z`),
  tags,
});

const NOW = new Date("2026-11-13T12:00:00Z");

const POSTS = [
  post("skills", "2026-10-02", ["ai", "agents", "skills"]),
  post("tools", "2026-09-21", ["ai", "agents", "tools"]),
  post("beads", "2026-11-05", ["workflow", "dag"]),
  post("openclaw", "2026-02-04", ["ai", "agents"]),
  post("init", "2024-12-01", ["astro"]),
];

describe("activityMonths", () => {
  it("should list the months up to the current one, oldest first", () => {
    const months = activityMonths(NOW, 3);

    expect(months.map((m) => [m.key, m.initial, m.label])).toEqual([
      ["2026-09", "S", "September 2026"],
      ["2026-10", "O", "October 2026"],
      ["2026-11", "N", "November 2026"],
    ]);
  });

  it("should cross into the previous year", () => {
    expect(activityMonths(NOW, 12)[0].key).toBe("2025-12");
  });
});

describe("summarizeTags", () => {
  const info = {
    agents: { title: "AI Agents", description: "Agents." },
    dag: { title: "Task Graphs" },
  };

  it("should sort tags by their newest post, then by post count", () => {
    const tags = summarizeTags(POSTS, info, NOW, { months: 3 });

    expect(tags.map((t) => t.slug)).toEqual([
      "dag",
      "workflow",
      "agents",
      "ai",
      "skills",
      "tools",
      "astro",
    ]);
  });

  it("should count posts, keep the newest ones and read the copy", () => {
    const agents = summarizeTags(POSTS, info, NOW, { months: 3, latest: 2 })
      .filter((t) => t.slug === "agents")
      .at(0);

    expect(agents).toMatchObject({
      title: "AI Agents",
      description: "Agents.",
      count: 3,
      updated: new Date("2026-10-02T00:00:00Z"),
    });
    expect(agents?.latest.map((p) => p.id)).toEqual(["skills", "tools"]);
  });

  it("should fall back to the slug when a tag has no title", () => {
    const tools = summarizeTags(POSTS, info, NOW).find(
      (t) => t.slug === "tools",
    );

    expect(tools?.title).toBe("tools");
    expect(tools?.description).toBeUndefined();
  });

  it("should count posts per month inside the window only", () => {
    const tags = summarizeTags(POSTS, info, NOW, { months: 3 });
    const activity = (slug: string) =>
      tags.find((t) => t.slug === slug)?.activity;

    expect(activity("agents")).toEqual([1, 1, 0]);
    expect(activity("workflow")).toEqual([0, 0, 1]);
    expect(activity("astro")).toEqual([0, 0, 0]);
  });
});

describe("activityLabel", () => {
  it("should name the window and every month with posts", () => {
    const months = activityMonths(NOW, 3);

    expect(activityLabel([1, 0, 2], months)).toBe(
      "Posts per month, September 2026 to November 2026: September 2026: 1, November 2026: 2",
    );
  });

  it("should say when the window has no posts", () => {
    const months = activityMonths(NOW, 3);

    expect(activityLabel([0, 0, 0], months)).toBe(
      "Posts per month, September 2026 to November 2026: none",
    );
  });
});

describe("relatedTags", () => {
  it("should list the tags sharing posts with a tag, most shared first", () => {
    expect(relatedTags(POSTS, "agents")).toEqual([
      { slug: "ai", count: 3 },
      { slug: "skills", count: 1 },
      { slug: "tools", count: 1 },
    ]);
  });

  it("should return nothing for a tag on no post", () => {
    expect(relatedTags(POSTS, "missing")).toEqual([]);
  });
});

describe("cloudWeight", () => {
  it("should spread counts over four weights", () => {
    expect([1, 2, 3, 5, 8].map((n) => cloudWeight(n, 8))).toEqual([
      1, 1, 2, 3, 4,
    ]);
  });

  it("should give every tag the top weight when the counts are all one", () => {
    expect(cloudWeight(1, 1)).toBe(4);
  });
});

describe("postsByYear", () => {
  it("should group posts by year, newest first", () => {
    const years = postsByYear(POSTS);

    expect(years.map((y) => [y.year, y.posts.map((p) => p.id)])).toEqual([
      [2026, ["beads", "skills", "tools", "openclaw"]],
      [2024, ["init"]],
    ]);
  });
});

describe("compareTags", () => {
  const rows = [
    { slug: "ai", title: "Artificial Intelligence", count: 8, updated: 20 },
    { slug: "dag", title: "Task Graphs", count: 1, updated: 30 },
    { slug: "agents", title: "AI Agents", count: 5, updated: 20 },
    { slug: "astro", title: "Astro", count: 2, updated: 10 },
  ];
  const order = (mode: "recent" | "posts" | "az") =>
    [...rows].sort(compareTags(mode)).map((r) => r.slug);

  it("should put the most recently updated tags first", () => {
    expect(order("recent")).toEqual(["dag", "ai", "agents", "astro"]);
  });

  it("should put the tags with the most posts first", () => {
    expect(order("posts")).toEqual(["ai", "agents", "astro", "dag"]);
  });

  it("should order tags by title", () => {
    expect(order("az")).toEqual(["agents", "ai", "astro", "dag"]);
  });
});

describe("isTagSort", () => {
  it("should accept the sort modes only", () => {
    expect(["recent", "posts", "az", "size", undefined].map(isTagSort)).toEqual(
      [true, true, true, false, false],
    );
  });
});

describe("tagRowFromData", () => {
  it("should read a row's sort keys from its data attributes", () => {
    expect(
      tagRowFromData({
        slug: "agents",
        title: "AI Agents",
        count: "5",
        updated: "2026-10-02T00:00:00.000Z",
      }),
    ).toEqual({
      slug: "agents",
      title: "AI Agents",
      count: 5,
      updated: Date.UTC(2026, 9, 2),
    });
  });

  it("should reject a row with missing or broken attributes", () => {
    expect(tagRowFromData({ slug: "agents", count: "5" })).toBeNull();
    expect(
      tagRowFromData({
        slug: "agents",
        title: "AI Agents",
        count: "many",
        updated: "2026-10-02",
      }),
    ).toBeNull();
  });
});
