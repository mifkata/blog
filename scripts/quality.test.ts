import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const quality: unknown = JSON.parse(readFileSync("quality.json", "utf8"));

describe("quality.json", () => {
  it("holds only the lighthouse and axe limits", () => {
    expect(Object.keys(quality as object).sort()).toEqual([
      "axe",
      "lighthouse",
    ]);
  });
});
