// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, sharpImageService } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

import tailwindcss from "@tailwindcss/vite";
import { rehypeCodeCaptions } from "./src/helpers/codeCaptions.ts";

const OWN_HOSTS = new Set(["mifkata.com", "www.mifkata.com"]);

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  integrations: [mdx(), sitemap(), react()],
  // The CSS arrives with the page instead of in requests that block the first
  // paint; it's small enough that caching it separately saves little
  build: { inlineStylesheets: "always" },
  image: {
    // AVIF looks as good as WebP at a much lower quality setting; WebP is the
    // fallback for browsers without AVIF, and JPEG is for link previews.
    // Images are cached by their own props, not these, so clear the build
    // cache after changing them.
    service: sharpImageService({
      avif: { quality: 40, chromaSubsampling: "4:2:0", effort: 6 },
      webp: { quality: 70, effort: 6 },
      jpeg: { quality: 80, mozjpeg: true },
    }),
  },
  markdown: {
    // Token colours come from CSS variables, which code blocks set from the
    // season's palette
    shikiConfig: { theme: "css-variables" },
    rehypePlugins: [
      rehypeCodeCaptions,
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          // Absolute links back to this site stay in the same tab
          test: (/** @type {any} */ node) =>
            !OWN_HOSTS.has(
              new URL(String(node.properties.href), "https://x").hostname,
            ),
          content: { type: "text", value: "(opens in new tab)" },
          contentProperties: { className: ["sr-only"] },
        },
      ],
    ],
  },
  server: {
    host: "0.0.0.0",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
