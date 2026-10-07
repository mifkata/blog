/**
 * The day palettes from styles/palettes.css as plain values, for images drawn
 * at build time such as the social cards, so the colours keep living in one
 * place.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_PALETTE, type Palette } from "@/helpers/season";

/** A palette's colours by token name without the prefix: "accent" for --palette-accent. */
export type PaletteColors = Record<string, string>;

/** The stylesheet without its @media blocks, which hold the night palettes. */
function withoutMediaBlocks(source: string): string {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const start = source.indexOf("@media", i);
    if (start === -1) return out + source.slice(i);
    out += source.slice(i, start);
    let depth = 0;
    let j = source.indexOf("{", start);
    for (; j < source.length; j++) {
      if (source[j] === "{") depth++;
      else if (source[j] === "}" && --depth === 0) break;
    }
    i = j + 1;
  }
  return out;
}

export function parseDayPalettes(
  source: string,
): Record<string, PaletteColors> {
  const palettes: Record<string, PaletteColors> = {};
  const rules = withoutMediaBlocks(source).matchAll(
    /:root(?:\[data-palette="(\w+)"\])?\s*\{([^}]*)\}/g,
  );
  for (const [, name, body] of rules) {
    palettes[name ?? DEFAULT_PALETTE] = Object.fromEntries(
      [...body.matchAll(/--palette-([\w-]+):\s*([^;]+);/g)].map(
        ([, token, value]) => [token, value.trim()],
      ),
    );
  }
  return palettes;
}

// Read from disk rather than imported: test runs stub out CSS imports. Builds
// and tests run from the project root.
export const DAY_PALETTES = parseDayPalettes(
  readFileSync(join(process.cwd(), "src/styles/palettes.css"), "utf8"),
) as Record<Palette, PaletteColors>;
