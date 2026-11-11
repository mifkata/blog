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

  it("lists .astro files, styles and deleted files under src as targets", () => {
    expect(
      affected("src/pages/index.astro", "src/styles/global.css", "src/gone.ts"),
    ).toBe("src/gone.ts\nsrc/pages/index.astro\nsrc/styles/global.css");
  });

  it("is full for a lockfile, a config file or a path outside the folder", () => {
    expect(affected("pnpm-lock.yaml")).toBe("full");
    expect(affected("astro.config.mjs")).toBe("full");
    expect(affected("../outside/file.ts")).toBe("full");
  });
});
