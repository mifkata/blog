import type { Meta, StoryObj } from "storybook-astro";
import GithubLink from "./GithubLink.astro";
import { initToggle } from "./toggle";

const meta: Meta<typeof GithubLink> = {
  title: "Post/GithubLink",
  component: GithubLink,
  tags: ["autodocs"],
  argTypes: {
    url: {
      control: "text",
      description: "GitHub URL (repo, directory, or file)",
    },
    expanded: {
      control: "boolean",
      description: "Show preview expanded by default (files only)",
    },
  },
  decorators: [
    (storyFn) => {
      const result = storyFn();
      setTimeout(initToggle, 0);
      return result;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GithubLink>;

export const Repository: Story = {
  args: {
    url: "https://github.com/mifkata/blog",
    slots: { default: "Personal blog built with Astro" },
  },
};

export const Directory: Story = {
  args: {
    url: "https://github.com/mifkata/blog/tree/main/src",
    slots: { default: "Source code directory" },
  },
};

export const CodeFile: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/content.config.ts",
    slots: { default: "Code file" },
  },
};

export const CodeFileExpanded: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/content.config.ts",
    expanded: true,
  },
};

export const ImageFile: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/assets/404.png",
  },
};

export const InvalidUrl: Story = {
  args: {
    url: "https://gitlab.com/owner/repo",
  },
};
