import type { StorybookConfig } from "@storybook-astro/framework";
import { react } from "@storybook-astro/framework/integrations";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook-astro/framework",
    options: {
      integrations: [react()],
    },
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, options) {
    // Vite hands the aliases over as an array once its config is resolved.
    const existing = config.resolve?.alias ?? [];
    const inherited = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({
          find,
          replacement,
        }));

    return {
      ...config,
      base: options.configType === "PRODUCTION" ? "/storybook/" : config.base,
      resolve: {
        ...config.resolve,
        alias: [
          { find: "@", replacement: resolve(__dirname, "../src") },
          {
            find: "cssesc",
            replacement: resolve(__dirname, "patches/cssesc.mjs"),
          },
          {
            find: "astro:assets",
            replacement: resolve(__dirname, "mocks/astro-assets.ts"),
          },
          {
            find: "astro:content",
            replacement: resolve(__dirname, "mocks/astro-content.ts"),
          },
          {
            find: "astro:scripts/before-hydration.js",
            replacement: resolve(__dirname, "mocks/astro-scripts.ts"),
          },
          ...inherited,
        ],
      },
    };
  },
};

export default config;
