import type { Meta, StoryObj } from "@storybook/html";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import GithubLink from "./GithubLinkReact";

interface GithubLinkArgs {
  url: string;
  expanded?: boolean;
  maxHeight?: number;
  children?: string;
}

const meta: Meta<GithubLinkArgs> = {
  title: "Post/GithubLink",
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
    maxHeight: {
      control: "number",
      description: "Maximum height for iframe in pixels",
    },
    children: {
      control: "text",
      description: "Description text",
    },
  },
  render: (args) => {
    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(createElement(GithubLink, args));
    return container;
  },
};

export default meta;
type Story = StoryObj<GithubLinkArgs>;

export const Repository: Story = {
  args: {
    url: "https://github.com/mifkata/blog",
    children: "Personal blog built with Astro",
  },
};

export const Directory: Story = {
  args: {
    url: "https://github.com/mifkata/blog/tree/main/src",
    children: "Source code directory",
  },
};

export const CodeFile: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/content.config.ts",
    children: "Code file",
  },
};

export const CodeFileExpanded: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/content.config.ts",
    expanded: true,
  },
};

export const CodeFileWithMaxHeight: Story = {
  args: {
    url: "https://github.com/mifkata/blog/blob/main/src/content.config.ts",
    expanded: true,
    maxHeight: 200,
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
