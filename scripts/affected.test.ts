import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const affected = (...paths: string[]) =>
  execFileSync("node", ["scripts/affected.mjs"], {
    input: paths.join("\n"),
    encoding: "utf8",
  }).trim();

describe("affected", () => {
  it("is none for docs, markdown and beads paths only", () => {
    expect(affected("docs/a.json", "README.md", ".beads/x.jsonl")).toBe("none");
  });

  it("lists source files as targets, ignoring docs", () => {
    expect(affected("docs/a.md", "src/consts.data.ts")).toBe(
      "src/consts.data.ts",
    );
  });

  it("is full for an .astro file, which the import graph does not reach", () => {
    expect(affected("src/pages/index.astro")).toBe("full");
  });

  it("is full for a lockfile, a deleted file or a path outside the folder", () => {
    expect(affected("pnpm-lock.yaml")).toBe("full");
    expect(affected("src/gone.ts")).toBe("full");
    expect(affected("../outside/file.ts")).toBe("full");
  });
});
