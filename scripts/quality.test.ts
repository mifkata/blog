import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const quality: unknown = JSON.parse(readFileSync("quality.json", "utf8"));

// git grep exits 1 when nothing matches; any other failure is an error.
const grep = (cwd: string, ...args: string[]) => {
  try {
    return execFileSync("git", ["grep", "-l", ...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 1
    )
      return [];
    throw error;
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
      grep(".", "-E", "softPercent|hardPercent|floorBytes", "--", `:!${self}`),
    ).toEqual([]);
    const readers = grep(".", "quality\\.json", "--", `:!${self}`);
    expect(
      readers.filter((path) =>
        /\.(?:size|serve|paths)\b|\[["'](?:size|serve|paths)["']\]/.test(
          readFileSync(path, "utf8"),
        ),
      ),
    ).toEqual([]);
  });

  it("fails the reader scan outside a git checkout instead of passing it", () => {
    const dir = mkdtempSync(join(tmpdir(), "quality-test-"));
    try {
      expect(() => grep(dir, "quality\\.json")).toThrow();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
