import type { Meta, StoryObj } from "@storybook/html";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { FeaturedSeries, type SeriesItem } from "./FeaturedSeries";

interface FeaturedSeriesArgs {
  title: string;
  items: SeriesItem[];
}

const mockItems: SeriesItem[] = [
  {
    url: "/blog/2025/article-one",
    title: "Getting Started with Claude Code",
    synopsis:
      "Learn how to set up **Claude Code** in your development environment. This guide covers installation, configuration, and your first commands.",
    heroImage: "https://picsum.photos/seed/article1/400/200",
    updatedDate: "2025-01-15T00:00:00.000Z",
  },
  {
    url: "/blog/2025/article-two",
    title: "System Prompting and Commands",
    synopsis:
      "A comprehensive guide to customizing Claude Code with system prompts and slash commands. Learn how to create *powerful workflows*.",
    heroImage: "https://picsum.photos/seed/article2/400/200",
    updatedDate: "2025-01-10T00:00:00.000Z",
  },
  {
    url: "/blog/2025/article-three",
    title: "Spec-Driven Development",
    synopsis:
      "Deep dive into using specs to guide your development process. Learn how to write `specs` that Claude Code can implement.",
    heroImage: "https://picsum.photos/seed/article3/400/200",
    updatedDate: "2025-01-05T00:00:00.000Z",
  },
];

const meta: Meta<FeaturedSeriesArgs> = {
  title: "Pages/Home/FeaturedSeries",
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Series title",
    },
    items: {
      control: "object",
      description: "Array of series items",
    },
  },
  render: (args) => {
    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(createElement(FeaturedSeries, args));
    return container;
  },
};

export default meta;
type Story = StoryObj<FeaturedSeriesArgs>;

export const Default: Story = {
  args: {
    title: "Claude Code Setup",
    items: mockItems,
  },
};

export const TwoItems: Story = {
  args: {
    title: "Getting Started",
    items: mockItems.slice(0, 2),
  },
};

export const FourItems: Story = {
  args: {
    title: "Complete Guide",
    items: [
      ...mockItems,
      {
        url: "/blog/2025/article-four",
        title: "Advanced Techniques",
        synopsis:
          "The final piece of the puzzle. This article wraps up the series with practical examples and advanced patterns.",
        heroImage: "https://picsum.photos/seed/article4/400/200",
        updatedDate: "2025-01-01T00:00:00.000Z",
      },
    ],
  },
};

export const WithoutImages: Story = {
  args: {
    title: "Text Only Series",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    items: mockItems.map(({ heroImage, ...item }) => item),
  },
};
