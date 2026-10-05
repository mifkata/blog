import { describe, it, expect } from "vitest";
import {
  assignment,
  rankRelated,
  relatedForAll,
  spreadLeads,
  tagWeights,
  type RankedPick,
  type RelatedInput,
} from "./related";

const post = (id: string, tags: string[], date: string): RelatedInput => ({
  id,
  tags,
  date: new Date(date),
});

// The blog as it stands: every post shares "ai"
const POSTS = [
  post("init", ["astro", "cloudflare", "terraform"], "2025-12-01"),
  post("howto", ["astro", "ai", "coding"], "2025-12-09"),
  post("vibe", ["ai", "productivity", "coding"], "2025-12-01"),
  post(
    "sandbox",
    ["coding", "ai", "devcontainers", "claude", "devex", "howto"],
    "2025-12-30",
  ),
  post("commands", ["ai", "coding", "claude", "devex", "howto"], "2026-01-02"),
  post(
    "sdd",
    ["ai", "coding", "claude", "devex", "howto", "sdd", "workflow"],
    "2026-01-08",
  ),
  post("openclaw", ["ai", "agents", "openclaw"], "2026-02-04"),
  post(
    "tools",
    ["ai", "agents", "claude", "tools", "tokens", "workflow"],
    "2026-09-21",
  ),
  post("skills", ["ai", "agents", "devex", "skills", "sdd"], "2026-10-02"),
];
const SERIES = [["sandbox", "commands", "sdd", "skills"]];
const byId = (id: string) => POSTS.find((p) => p.id === id)!;
const ids = (picks: { id: string }[]) => picks.map((pick) => pick.id);

describe("tagWeights", () => {
  it("should weigh a tag by how rare it is", () => {
    const weights = tagWeights(POSTS);
    expect(weights.get("skills")).toBeGreaterThan(weights.get("agents")!);
    expect(weights.get("agents")).toBeGreaterThan(weights.get("ai")!);
    expect(weights.get("ai")).toBeLessThan(0.2);
  });
});

describe("rankRelated", () => {
  it("should put the neighbouring part first, then rarer shared tags", () => {
    const ranked = rankRelated(byId("skills"), POSTS, { series: SERIES });
    expect(ids(ranked)).toEqual([
      "sdd",
      "tools",
      "openclaw",
      "commands",
      "sandbox",
    ]);
    expect(ranked[0]).toMatchObject({
      kind: "series",
      reason: "Previous in the series",
    });
    expect(ranked[1].reason).toBe("Also about agents");
    expect(ranked[3].reason).toBe("Earlier in the series");
  });

  it("should leave out posts that only share common tags", () => {
    expect(ids(rankRelated(byId("openclaw"), POSTS))).toEqual([
      "skills",
      "tools",
    ]);
  });

  it("should name the tag with its label and mark the next part", () => {
    const [astro] = rankRelated(byId("init"), POSTS, {
      tagLabel: (tag) => (tag === "astro" ? "Astro" : tag),
    });
    expect(astro.reason).toBe("Also about Astro");
    const [next] = rankRelated(byId("sandbox"), POSTS, { series: SERIES });
    expect(next.reason).toBe("Next in the series");
  });
});

describe("assignment", () => {
  it("should find the cheapest way to give every row its own column", () => {
    expect(
      assignment([
        [4, 1, 3],
        [2, 0, 5],
        [3, 2, 2],
      ]),
    ).toEqual([1, 0, 2]);
  });
});

describe("spreadLeads", () => {
  const pick = (id: string, score: number): RankedPick => ({
    id,
    score,
    kind: "topic",
    reason: "",
  });

  it("should give each post a different lead when it can", () => {
    // Everyone's best match is "hub"; only one of them gets it
    const leads = spreadLeads(
      new Map([
        ["a", [pick("hub", 5), pick("b", 2)]],
        ["b", [pick("hub", 4), pick("c", 3)]],
        ["c", [pick("hub", 3), pick("b", 1)]],
        ["hub", [pick("a", 5)]],
      ]),
    );
    expect(leads).toEqual(
      new Map([
        ["a", "hub"],
        ["b", "c"],
        ["c", "b"],
        ["hub", "a"],
      ]),
    );
  });

  it("should reuse the least used match when nothing else is left", () => {
    const leads = spreadLeads(
      new Map([
        ["a", [pick("hub", 5)]],
        ["b", [pick("hub", 4)]],
        ["hub", []],
      ]),
    );
    expect(leads.get("a")).toBe("hub");
    expect(leads.get("b")).toBe("hub");
    expect(leads.has("hub")).toBe(false);
  });
});

describe("relatedForAll", () => {
  const all = relatedForAll(POSTS, { series: SERIES });

  it("should spread the leads across the blog", () => {
    const leads = [...all.values()].map(([first]) => first.id);
    const timesLeading = (id: string) => leads.filter((l) => l === id).length;
    expect(new Set(leads).size).toBe(8);
    expect(timesLeading("sdd")).toBe(2);
    expect(all.get("tools")![0].id).toBe("openclaw");
    expect(all.get("skills")![0].id).toBe("sdd");
  });

  it("should fill with the newest posts, labelled, up to six", () => {
    const picks = all.get("openclaw")!;
    expect(picks).toHaveLength(6);
    expect(ids(picks.slice(0, 2)).sort()).toEqual(["skills", "tools"]);
    expect(picks.slice(2)).toEqual([
      { id: "sdd", kind: "latest", reason: "More from the blog" },
      { id: "commands", kind: "latest", reason: "More from the blog" },
      { id: "sandbox", kind: "latest", reason: "More from the blog" },
      { id: "howto", kind: "latest", reason: "More from the blog" },
    ]);
  });

  it("should never list the post itself", () => {
    for (const [id, picks] of all) expect(ids(picks)).not.toContain(id);
  });
});
