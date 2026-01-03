import type { StorybookConfig } from "storybook-astro";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "storybook-astro",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [...(config.plugins || []), tailwindcss()],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@": resolve(__dirname, "../src"),
          cssesc: resolve(__dirname, "patches/cssesc.mjs"),
          "astro:assets": resolve(__dirname, "mocks/astro-assets.ts"),
          "astro:content": resolve(__dirname, "mocks/astro-content.ts"),
          "astro:scripts/before-hydration.js": resolve(
            __dirname,
            "mocks/astro-scripts.ts",
          ),
        },
      },
    };
  },
};

export default config;
