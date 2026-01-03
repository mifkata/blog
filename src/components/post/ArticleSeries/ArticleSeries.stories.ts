import type { Meta, StoryObj } from "storybook-astro";
import ArticleSeries from "./ArticleSeries.astro";

const meta: Meta<typeof ArticleSeries> = {
  title: "Post/ArticleSeries",
  component: ArticleSeries,
  tags: ["autodocs"],
  argTypes: {
    slug: { control: "text" },
    current: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleSeries>;

export const Default: Story = {
  args: {
    slug: "claude-code-setup-series",
  },
};

export const WithCurrentArticle: Story = {
  args: {
    slug: "claude-code-setup-series",
    current: "2026/01/claude-code-system-prompting-and-commands",
  },
};
