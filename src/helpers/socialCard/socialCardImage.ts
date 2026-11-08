/**
 * Draws a social card: the home hero's circuit board in the card's palette,
 * the <mifkata /> logo, and the page's title knocked out of the traces.
 * Satori lays it out as SVG with the site's fonts; sharp turns that into a
 * 1200×630 PNG.
 */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import type satoriModule from "satori";
import sharp from "sharp";
import { DAY_PALETTES } from "@/helpers/palettes";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  titleSize,
  type CardContent,
} from "@/helpers/socialCard";

// Satori's ES module build reads __dirname, which ES modules don't have, and
// fails on import; its CommonJS build works
const satori = (
  createRequire(import.meta.url)("satori") as {
    default: typeof satoriModule;
  }
).default;

interface Node {
  type: string;
  props: Record<string, unknown>;
}

function h(
  type: string,
  props: Record<string, unknown>,
  ...children: (Node | string | false | undefined)[]
): Node {
  const kids = children.filter(
    (child) => child !== false && child !== undefined,
  );
  // Satori counts an array as several children, even with one in it, and
  // asks for flex on those
  return {
    type,
    props: { ...props, children: kids.length === 1 ? kids[0] : kids },
  };
}

// Satori reads TTF, not the site's WOFF2; these are the same fonts converted.
// Builds run from the project root.
let fonts: Promise<Parameters<typeof satori>[1]["fonts"]> | undefined;
function loadFonts() {
  const file = (name: string) =>
    readFile(join(process.cwd(), "src/assets/fonts/og", name));
  fonts ??= Promise.all([
    file("zilla-slab-bold.ttf"),
    file("kedebideri-regular.ttf"),
  ]).then(([zilla, kedebideri]) => [
    { name: "Zilla Slab", data: zilla, weight: 700, style: "normal" },
    { name: "Kedebideri", data: kedebideri, weight: 400, style: "normal" },
  ]);
  return fonts;
}

// The traces, chip and pads, on the right of the card and along its edges
const TRACES = [
  "M960 270H900L860 230H800",
  "M960 300H880L840 340H780",
  "M960 330H920L880 370V460H820",
  "M960 360H940V520L900 560H840",
  "M990 240V160L1030 120H1200",
  "M1050 240V40",
  "M1080 240V200L1120 160H1200",
  "M1110 290H1200",
  "M1110 330H1160L1200 370",
  "M1000 390V480L1040 520V630",
  "M1040 390V450L1080 490H1200",
  "M1070 390V600",
  "M0 580H140L180 620H440",
  "M520 630V600L560 560H700",
  "M860 0V60L900 100H1010",
];
const PADS = [
  [800, 230],
  [780, 340],
  [820, 460],
  [840, 560],
  [1050, 40],
  [1070, 600],
  [440, 620],
  [700, 560],
  [1010, 100],
];

function board(c: Record<string, string>): Node {
  return h(
    "svg",
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      viewBox: `0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`,
      style: { position: "absolute", top: 0, left: 0 },
    },
    ...TRACES.map((d) =>
      h("path", {
        d,
        fill: "none",
        stroke: c["trace-mid"],
        "stroke-width": 3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    ),
    h("rect", {
      x: 960,
      y: 240,
      width: 150,
      height: 150,
      rx: 12,
      fill: c["trace-faint"],
      stroke: c["trace-strong"],
      "stroke-width": 3,
    }),
    h("rect", {
      x: 990,
      y: 270,
      width: 90,
      height: 90,
      rx: 6,
      fill: "none",
      stroke: c["trace-strong"],
      "stroke-width": 3,
    }),
    ...PADS.map(([cx, cy]) =>
      h("circle", {
        cx,
        cy,
        r: 7,
        fill: c.hero,
        stroke: c["trace-strong"],
        "stroke-width": 3,
      }),
    ),
    // A packet on its way, and a charge on a pin
    h("path", {
      d: "M1200 160H1150",
      stroke: c.accent,
      "stroke-width": 5,
      "stroke-linecap": "round",
    }),
    h("path", {
      d: "M880 370V420",
      stroke: c["button-hi"],
      "stroke-width": 5,
      "stroke-linecap": "round",
    }),
  );
}

function logo(c: Record<string, string>, knockout: string): Node {
  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 14 } },
    h(
      "svg",
      { width: 44, height: 44, viewBox: "0 0 32 32" },
      h("rect", { x: 1, y: 3, width: 30, height: 26, rx: 5, fill: c.terminal }),
      h("path", {
        d: "M7 11l5 4.5L7 20",
        fill: "none",
        stroke: c["terminal-prompt"],
        "stroke-width": 2.6,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
      h("rect", {
        x: 16,
        y: 18,
        width: 8,
        height: 2.6,
        rx: 1,
        fill: c["terminal-text"],
      }),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontFamily: "Zilla Slab",
          fontSize: 34,
          color: c.heading,
          textShadow: knockout,
        },
      },
      h("span", { style: { color: c.accent } }, "<"),
      h("span", {}, "mifkata"),
      h("span", { style: { color: c.accent, marginLeft: 9 } }, "/>"),
    ),
  );
}

export function cardElement(content: CardContent): Node {
  const c = DAY_PALETTES[content.palette];
  // A ring of the board's colour around every glyph, so traces stop short of
  // the text, as in the home hero
  const k = c.hero;
  const knockout = [
    `0 0 3px ${k}`,
    `2px 0 ${k}`,
    `-2px 0 ${k}`,
    `0 2px ${k}`,
    `0 -2px ${k}`,
    `1.5px 1.5px ${k}`,
    `-1.5px -1.5px ${k}`,
    `1.5px -1.5px ${k}`,
    `-1.5px 1.5px ${k}`,
  ].join(", ");

  return h(
    "div",
    {
      style: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        position: "relative",
        background: c.hero,
        fontFamily: "Kedebideri",
      },
    },
    board(c),
    h(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px 52px",
        },
      },
      logo(c, knockout),
      h(
        "div",
        {
          style: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            maxWidth: 780,
          },
        },
        h(
          "div",
          {
            style: {
              fontSize: 20,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: c.accent,
              textShadow: knockout,
            },
          },
          content.eyebrow,
        ),
        h(
          "div",
          {
            style: {
              display: "block",
              fontFamily: "Zilla Slab",
              fontSize: titleSize(content.title),
              lineHeight: 1.08,
              color: c.heading,
              textShadow: knockout,
              lineClamp: 3,
            },
          },
          content.title,
        ),
        content.sub &&
          h(
            "div",
            {
              style: {
                fontFamily: "Zilla Slab",
                fontSize: 40,
                lineHeight: 1.15,
                color: c.heading,
                textShadow: knockout,
              },
            },
            content.sub,
          ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 21,
          },
        },
        ...content.chips.map((chip) =>
          h(
            "div",
            {
              style: {
                padding: "6px 14px",
                borderRadius: 8,
                background: c.tag,
                color: c["tag-text"],
              },
            },
            chip,
          ),
        ),
        h(
          "div",
          { style: { color: c.muted, textShadow: knockout } },
          content.meta,
        ),
      ),
    ),
  );
}

export async function renderCard(content: CardContent): Promise<Buffer> {
  const svg = await satori(
    cardElement(content) as unknown as Parameters<typeof satori>[0],
    { width: CARD_WIDTH, height: CARD_HEIGHT, fonts: await loadFonts() },
  );
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
