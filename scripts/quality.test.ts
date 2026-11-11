import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const quality: unknown = JSON.parse(readFileSync("quality.json", "utf8"));

// git grep exits 1 when nothing matches.
const grep = (...args: string[]) => {
  try {
    return execFileSync("git", ["grep", "-l", ...args], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
};

describe("quality.json", () => {
  it("holds only the lighthouse and axe limits", () => {
    expect(quality).toEqual({
      lighthouse: { floor: 90, runs: 3 },
      axe: {
        critical: "blocker",
        serious: "major",
        moderate: "minor",
        minor: "nit",
      },
    });
  });

  it("has no reader of the removed size budget, serve or paths keys", () => {
    const self = "scripts/quality.test.ts";
    expect(
      grep("-E", "softPercent|hardPercent|floorBytes", "--", `:!${self}`),
    ).toEqual([]);
    const readers = grep("quality\\.json", "--", `:!${self}`);
    expect(
      readers.filter((path) =>
        /\.(?:size|serve|paths)\b|\[["'](?:size|serve|paths)["']\]/.test(
          readFileSync(path, "utf8"),
        ),
      ),
    ).toEqual([]);
  });
});
