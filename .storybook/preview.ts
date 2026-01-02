import type { Preview } from "@storybook/html";
import "../src/styles/global.css";
import { initToggle } from "../src/components/post/GithubLink/toggle";

// Initialize Astro component scripts (not executed by storybook-astro)
initToggle();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
