/**
 * Seasonal palettes. The site wears a different palette each season (northern
 * hemisphere, by calendar month); day or night within it follows the
 * visitor's OS setting. The palettes themselves live in styles/palettes.css.
 */

export type Season = "winter" | "spring" | "summer" | "fall";
export type Palette = "circuit" | "blueprint" | "notebook" | "neon";

export const PALETTE_BY_SEASON: Record<Season, Palette> = {
  winter: "blueprint",
  spring: "neon",
  summer: "notebook",
  fall: "circuit",
};

/** Used when no palette is picked, e.g. with JavaScript off. */
export const DEFAULT_PALETTE: Palette = "circuit";

/** Browser bar colour per palette: each palette's page surface, day and night. */
export const THEME_COLORS: Record<Palette, { light: string; dark: string }> = {
  circuit: { light: "#fbfcfa", dark: "#0f1714" },
  blueprint: { light: "#fbfcfe", dark: "#0d1d3a" },
  notebook: { light: "#fdfdfb", dark: "#19191d" },
  neon: { light: "#fdfbff", dark: "#150e1f" },
};

/** Meteorological seasons: winter is December to February, and so on. */
export function seasonOf(month: number): Season {
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}

/** Palette for each month, January first, as `Date.getMonth()` counts. */
export const PALETTE_BY_MONTH: Palette[] = Array.from(
  { length: 12 },
  (_, month) => PALETTE_BY_SEASON[seasonOf(month)],
);
