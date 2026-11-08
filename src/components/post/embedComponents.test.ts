import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const mapped = new Set(
  /export const embedComponents = \{([^}]*)\}/
    .exec(readFileSync(join(__dirname, "index.ts"), "utf8"))?.[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean),
);

const mdxFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? mdxFiles(join(dir, entry.name))
      : entry.name.endsWith(".mdx")
        ? [join(dir, entry.name)]
        : [],
  );

const usedTags = (source: string) =>
  [
    ...source
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`\n]*`/g, "")
      .matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g),
  ].map((match) => match[1]);

const importedNames = (source: string) =>
  [...source.matchAll(/^import\s+(?:\{([^}]*)\}|(\w+))/gm)].flatMap((match) =>
    (match[1] ?? match[2]).split(",").map((n) =>
      n
        .trim()
        .split(/\s+as\s+/)
        .pop()!,
    ),
  );

describe("embedComponents", () => {
  it("maps every post component the content imports from @/components/post", () => {
    const fromPost = mdxFiles(join(__dirname, "../../content")).flatMap(
      (file) => {
        const source = readFileSync(file, "utf8");
        return [
          ...source.matchAll(
            /^import\s*\{([^}]*)\}\s*from\s*"@\/components\/post"/gm,
          ),
        ].flatMap((match) =>
          match[1]
            .split(",")
            .map((n) => n.trim())
            .filter(Boolean),
        );
      },
    );
    expect(fromPost.filter((name) => !mapped.has(name))).toEqual([]);
  });

  it("covers every capitalised tag a post or note uses without importing it", () => {
    const missing = mdxFiles(join(__dirname, "../../content")).flatMap(
      (file) => {
        const source = readFileSync(file, "utf8");
        const imported = new Set(importedNames(source));
        return usedTags(source).filter(
          (tag) => !imported.has(tag) && !mapped.has(tag),
        );
      },
    );
    expect(missing).toEqual([]);
  });
});
