import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import { DEFAULT_PALETTE, PALETTE_BY_SEASON } from "@/helpers/season";
import { encodeIco, faviconSvg, type FaviconShape } from "@/helpers/favicon";

const png = async (size: number, shape: FaviconShape = "tile") =>
  new Uint8Array(
    await sharp(Buffer.from(faviconSvg(DEFAULT_PALETTE, "full", shape)))
      .resize(size, size)
      .png()
      .toBuffer(),
  );

const ICONS: Record<
  string,
  () => Promise<{ body: Uint8Array<ArrayBuffer> | string; type: string }>
> = {
  "favicon.svg": async () => ({
    body: faviconSvg(DEFAULT_PALETTE),
    type: "image/svg+xml",
  }),
  ...Object.fromEntries(
    Object.entries(PALETTE_BY_SEASON).map(([season, palette]) => [
      `favicon-${season}.svg`,
      async () => ({ body: faviconSvg(palette), type: "image/svg+xml" }),
    ]),
  ),
  "favicon.ico": async () => ({
    body: encodeIco(
      await Promise.all(
        [16, 32, 48].map(async (size) => ({ size, png: await png(size) })),
      ),
    ),
    type: "image/x-icon",
  }),
  "apple-touch-icon.png": async () => ({
    body: await png(180, "bleed"),
    type: "image/png",
  }),
  "web-app-manifest-192x192.png": async () => ({
    body: await png(192, "maskable"),
    type: "image/png",
  }),
  "web-app-manifest-512x512.png": async () => ({
    body: await png(512, "maskable"),
    type: "image/png",
  }),
};

export const getStaticPaths = (() =>
  Object.keys(ICONS).map((icon) => ({
    params: { icon },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const { body, type } = await ICONS[params.icon as string]();
  return new Response(body, { headers: { "Content-Type": type } });
};
