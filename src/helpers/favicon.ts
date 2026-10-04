import { PALETTE_BY_SEASON, type Palette } from "./season";

/** Each season's terminal colours (tile, prompt, cursor), as in palettes.css. */
export const FAVICON_COLORS: Record<
  Palette,
  { tile: string; prompt: string; cursor: string }
> = {
  circuit: { tile: "#14201c", prompt: "#4fb39b", cursor: "#d7e2dc" },
  blueprint: { tile: "#0f1a2e", prompt: "#7cb3ff", cursor: "#dbe5f5" },
  notebook: { tile: "#1f1f24", prompt: "#ffe14d", cursor: "#e8e8ec" },
  neon: { tile: "#1e1230", prompt: "#4fd1e8", cursor: "#eadff5" },
};

/** What the mark shows: everything, the prompt alone, or an empty screen. */
export type FaviconFrame = "full" | "prompt" | "empty";

/**
 * tile: rounded screen for tabs. bleed: edge-to-edge for iOS, which rounds it
 * itself. maskable: edge-to-edge with the mark inside Android's safe zone.
 */
export type FaviconShape = "tile" | "bleed" | "maskable";

export const FAVICON_BY_PALETTE = Object.fromEntries(
  Object.entries(PALETTE_BY_SEASON).map(([season, palette]) => [
    palette,
    `/icons/favicon-${season}.svg`,
  ]),
) as Record<Palette, string>;

export function faviconSvg(
  palette: Palette,
  frame: FaviconFrame = "full",
  shape: FaviconShape = "tile",
): string {
  const { tile, prompt, cursor } = FAVICON_COLORS[palette];
  const screen =
    shape === "tile"
      ? `<rect x="1" y="1" width="30" height="30" rx="7" fill="${tile}" stroke="#ffffff" stroke-opacity="0.14"/>`
      : `<rect width="32" height="32" fill="${tile}"/>`;
  const parts = [
    frame !== "empty" &&
      `<path d="M8.5 10.5L14 16l-5.5 5.5" fill="none" stroke="${prompt}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    frame === "full" &&
      `<rect x="16" y="19.6" width="8.5" height="3.4" rx="1.2" fill="${cursor}"/>`,
  ]
    .filter(Boolean)
    .join("");
  const mark =
    shape === "maskable"
      ? `<g transform="translate(16 16) scale(0.72) translate(-16 -16)">${parts}</g>`
      : parts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${screen}${mark}</svg>`;
}

export function faviconDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Packs PNG images into one .ico file (PNG entries, supported since Windows Vista). */
export function encodeIco(
  images: { size: number; png: Uint8Array }[],
): Uint8Array<ArrayBuffer> {
  const header = 6;
  const entry = 16;
  const total =
    header +
    images.length * entry +
    images.reduce((sum, { png }) => sum + png.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);
  let offset = header + images.length * entry;
  images.forEach(({ size, png }, i) => {
    const at = header + i * entry;
    view.setUint8(at, size >= 256 ? 0 : size);
    view.setUint8(at + 1, size >= 256 ? 0 : size);
    view.setUint16(at + 4, 1, true);
    view.setUint16(at + 6, 32, true);
    view.setUint32(at + 8, png.length, true);
    view.setUint32(at + 12, offset, true);
    out.set(png, offset);
    offset += png.length;
  });
  return out;
}
