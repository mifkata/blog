import type { Meta, StoryObj } from "@storybook-astro/framework";
import RecentPosts from "./RecentPosts.astro";
import { recentIndex, tagCounts, type RecentPost } from "./recentIndex";

const POSTS: RecentPost[] = [
  {
    id: "2026/09/must-have-tools",
    title: "3 must-have tools for a leaner AI agent context",
    description:
      "Three tools that cut token spend and keep your coding agent focused.",
    date: new Date("2026-09-21T08:45:00Z"),
    tags: ["ai", "agents", "tools", "tokens"],
    minutes: 5,
  },
  {
    id: "2026/01/spec-driven-development",
    title: "Spec-Driven Development (SDD) for AI Coding Agents",
    description:
      "What spec-driven development is, why AI coding agents need it, and how to start.",
    date: new Date("2026-01-08T17:45:00Z"),
    tags: ["ai", "sdd", "workflow"],
    minutes: 6,
  },
  {
    id: "2026/01/agent-instructions-and-commands",
    title: "Project Instructions and Reusable Commands",
    description:
      "Best practices for organising project instructions and reusable commands.",
    date: new Date("2026-01-02T17:15:00Z"),
    tags: ["ai", "devex", "howto"],
    minutes: 7,
  },
  {
    id: "2025/howto-make-custom-astro-blog-in-a-day",
    title: "How to Build a Custom Astro Blog in a Day",
    description:
      "A practical walkthrough of shipping a custom Astro blog in less than 24 hours.",
    date: new Date("2025-12-09T14:00:00Z"),
    tags: ["astro", "ai", "coding"],
    minutes: 2,
  },
];

const options = {
  counts: tagCounts(POSTS),
  seriesUrls: [
    "/blog/2025/sandboxing-ai-agents-with-devcontainers/",
    "/blog/2026/01/agent-instructions-and-commands/",
    "/blog/2026/01/spec-driven-development/",
  ],
};

const meta: Meta<typeof RecentPosts> = {
  title: "Pages/Home/RecentPosts",
  component: RecentPosts,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecentPosts>;

export const SpanningYears: Story = {
  args: {
    index: recentIndex(POSTS, options),
    seriesTitle: "Agentic Engineering Foundations",
  },
};

export const SingleYear: Story = {
  args: {
    index: recentIndex(
      POSTS.filter((post) => post.date.getFullYear() === 2026),
      options,
    ),
    seriesTitle: "Agentic Engineering Foundations",
  },
};
