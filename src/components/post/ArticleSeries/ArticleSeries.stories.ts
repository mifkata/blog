import type { Meta, StoryObj } from "@storybook-astro/framework";
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
    slug: "agentic-engineering-foundations",
  },
};

export const WithCurrentArticle: Story = {
  args: {
    slug: "agentic-engineering-foundations",
    current: "2026/01/agent-instructions-and-commands",
  },
};
