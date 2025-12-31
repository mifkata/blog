import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
};

export default config;
