import { describe, it, expect } from "vitest";
import {
  bootDuration,
  bootLines,
  greeting,
  seasonOfPalette,
  themeVersion,
} from "./boot";
import { BOOT_TIMING } from "./timing";

describe("greeting", () => {
  it("should greet by the visitor's time of day", () => {
    expect(greeting(8)).toBe("Good morning.");
    expect(greeting(14)).toBe("Good afternoon.");
    expect(greeting(20)).toBe("Good evening.");
    expect(greeting(2)).toBe("Hello, night owl.");
  });

  it("should switch exactly on the hour", () => {
    expect(greeting(5)).toBe("Good morning.");
    expect(greeting(12)).toBe("Good afternoon.");
    expect(greeting(18)).toBe("Good evening.");
    expect(greeting(23)).toBe("Hello, night owl.");
  });
});

describe("themeVersion", () => {
  it("should name the year, season and light or dark", () => {
    expect(themeVersion(2026, "winter", true)).toBe("v2026.winter/dark");
    expect(themeVersion(2027, "summer", false)).toBe("v2027.summer/light");
  });
});

describe("seasonOfPalette", () => {
  it("should map each palette back to its season", () => {
    expect(seasonOfPalette("blueprint")).toBe("winter");
    expect(seasonOfPalette("neon")).toBe("spring");
    expect(seasonOfPalette("notebook")).toBe("summer");
    expect(seasonOfPalette("circuit")).toBe("fall");
  });

  it("should fall back to fall when no palette is set", () => {
    expect(seasonOfPalette(undefined)).toBe("fall");
    expect(seasonOfPalette("sepia")).toBe("fall");
  });
});

describe("bootLines", () => {
  const context = {
    hour: 20,
    year: 2026,
    season: "winter" as const,
    dark: true,
  };

  it("should log in, greet, boot and apply the theme on a first visit", () => {
    expect(bootLines("full", context)).toEqual([
      { kind: "command", text: "ssh guest@mifkata.com" },
      { kind: "output", text: "Good evening. Welcome." },
      { kind: "output", text: "Booting mifkata", ok: true },
      { kind: "output", text: "Applying theme v2026.winter/dark", ok: true },
      { kind: "command", text: "whoami" },
    ]);
  });

  it("should keep a returning visit to a welcome back and the theme", () => {
    expect(bootLines("short", { ...context, dark: false })).toEqual([
      { kind: "output", text: "Welcome back." },
      { kind: "output", text: "Applying theme v2026.winter/light", ok: true },
    ]);
  });
});

describe("bootDuration", () => {
  const timing = {
    commandTyping: 10,
    logoTyping: 100,
    stepDelay: 50,
    lineDelay: 20,
    hold: 500,
    morph: 300,
  };

  it("should add up typing, steps, pauses, the hold and the morph", () => {
    const lines = [
      { kind: "command" as const, text: "whoami" },
      { kind: "output" as const, text: "Booting mifkata", ok: true },
    ];
    // 6 characters typed, one "ok" step, two line pauses, 7 tag characters.
    expect(bootDuration(lines, timing)).toBe(60 + 50 + 40 + 700 + 500 + 300);
  });

  it("should give a human time to read a first-visit boot", () => {
    const context = {
      hour: 9,
      year: 2026,
      season: "fall" as const,
      dark: false,
    };
    expect(
      bootDuration(bootLines("full", context), BOOT_TIMING),
    ).toBeGreaterThan(4000);
  });
});
