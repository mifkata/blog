import { describe, expect, it } from "vitest";
import { DAY_PALETTES, parseDayPalettes } from "./palettes";

describe("parseDayPalettes", () => {
  it("reads each palette's day colours and skips the night ones", () => {
    const css = `
      :root { --palette-accent: #1c7461; --palette-hero: #eef2ef; }
      :root[data-palette="neon"] { --palette-accent: #007283; }
      @media (prefers-color-scheme: dark) {
        :root { --palette-accent: #5cc9a7; }
        :root[data-palette="neon"] { --palette-accent: #4fd1e8; }
      }
    `;
    expect(parseDayPalettes(css)).toEqual({
      circuit: { accent: "#1c7461", hero: "#eef2ef" },
      neon: { accent: "#007283" },
    });
  });
});

describe("DAY_PALETTES", () => {
  it("has every season's palette with the colours the cards draw with", () => {
    for (const name of ["circuit", "blueprint", "notebook", "neon"] as const) {
      for (const token of [
        "hero",
        "heading",
        "accent",
        "muted",
        "tag",
        "tag-text",
        "trace-faint",
        "trace-mid",
        "trace-strong",
        "terminal",
        "terminal-prompt",
        "terminal-text",
        "button-hi",
      ]) {
        expect(DAY_PALETTES[name][token], `${name} ${token}`).toMatch(
          /^#[0-9a-f]{6}$/i,
        );
      }
    }
  });
});
