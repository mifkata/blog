import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import {
  FAVICON_BY_PALETTE,
  FAVICON_COLORS,
  encodeIco,
  faviconSvg,
} from "./favicon";

describe("FAVICON_COLORS", () => {
  const css = readFileSync("src/styles/palettes.css", "utf8");

  const dayTerminal = (selector: string) => {
    const block = css.slice(css.indexOf(selector));
    const token = (name: string) =>
      block.match(new RegExp(`--palette-${name}: (#[0-9a-f]{6});`))?.[1];
    return {
      tile: token("terminal"),
      prompt: token("terminal-prompt"),
      cursor: token("terminal-text"),
    };
  };

  it("should use each season's terminal colours from palettes.css", () => {
    expect(FAVICON_COLORS.circuit).toEqual(dayTerminal(":root {"));
    for (const palette of ["blueprint", "notebook", "neon"] as const) {
      expect(FAVICON_COLORS[palette]).toEqual(
        dayTerminal(`:root[data-palette="${palette}"]`),
      );
    }
  });
});

describe("FAVICON_BY_PALETTE", () => {
  it("should point each palette at its season's icon", () => {
    expect(FAVICON_BY_PALETTE).toEqual({
      circuit: "/icons/favicon-fall.svg",
      blueprint: "/icons/favicon-winter.svg",
      neon: "/icons/favicon-spring.svg",
      notebook: "/icons/favicon-summer.svg",
    });
  });
});

describe("faviconSvg", () => {
  it("should draw the prompt and cursor in the season's colours", () => {
    const svg = faviconSvg("blueprint");
    expect(svg).toContain('fill="#0f1a2e"');
    expect(svg).toContain('stroke="#7cb3ff"');
    expect(svg).toContain('fill="#dbe5f5"');
  });

  it("should drop the cursor, then the prompt, for the typing frames", () => {
    expect(faviconSvg("circuit", "prompt")).not.toContain("#d7e2dc");
    expect(faviconSvg("circuit", "prompt")).toContain("<path");
    expect(faviconSvg("circuit", "empty")).not.toContain("<path");
  });

  it("should fill the whole square for home screen icons", () => {
    expect(faviconSvg("circuit", "full", "bleed")).toContain(
      '<rect width="32" height="32"',
    );
    expect(faviconSvg("circuit", "full", "maskable")).toContain("scale(0.72)");
    expect(faviconSvg("circuit")).toContain('rx="7"');
  });
});

describe("encodeIco", () => {
  it("should write an icon directory pointing at each image", () => {
    const small = new Uint8Array([1, 2, 3]);
    const large = new Uint8Array([4, 5]);
    const ico = encodeIco([
      { size: 16, png: small },
      { size: 256, png: large },
    ]);
    const view = new DataView(ico.buffer);

    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);
    expect(ico[6]).toBe(16);
    expect(ico[22]).toBe(0);
    expect(view.getUint32(6 + 8, true)).toBe(3);
    expect(view.getUint32(6 + 12, true)).toBe(38);
    expect(view.getUint32(22 + 12, true)).toBe(41);
    expect([...ico.slice(38)]).toEqual([1, 2, 3, 4, 5]);
  });
});
