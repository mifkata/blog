import type { Meta, StoryObj } from "@storybook/react";
import GithubLink from "./GithubLinkReact";

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
    maxHeight: {
      control: "number",
      description: "Maximum height for iframe in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GithubLink>;

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
