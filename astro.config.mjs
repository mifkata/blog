// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

import tailwindcss from "@tailwindcss/vite";

const OWN_HOSTS = new Set(["mifkata.com", "www.mifkata.com"]);

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    rehypePlugins: [
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
