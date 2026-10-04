import type { Meta, StoryObj } from "@storybook-astro/framework";
import FeaturedSeries from "./FeaturedSeries.astro";

const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/series${id}/720/405`,
  width: 720,
  height: 405,
  format: "jpg" as const,
});

const parts = [
  {
    url: "/blog/2025/claude-code-devcontainers/",
    title: "Dev Containers and How-to Work Securely with AI Agents",
    synopsis:
      "Using tools like **Claude Code** on a daily basis can be quite amazing, however, you cannot always trust it to keep your files safe.",
    heroImage: createMockImage(1),
    updatedDate: new Date("2026-01-08"),
    readingMinutes: 8,
  },
  {
    url: "/blog/2026/01/claude-code-system-prompting-and-commands/",
    title: "System prompting and commands",
    synopsis:
      "The main entry points for working with an agent in a project are `CLAUDE.md` and custom commands.",
    heroImage: createMockImage(2),
    updatedDate: new Date("2026-02-22"),
    readingMinutes: 7,
  },
  {
    url: "/blog/2026/01/claude-code-spec-driven-development/",
    title: "Spec-Driven Development (SDD)",
    synopsis:
      "Coding agents forget everything between sessions, and the bigger the codebase grows, the more they have to rediscover.",
    heroImage: createMockImage(3),
    updatedDate: new Date("2026-10-02"),
    readingMinutes: 6,
  },
  {
    url: "/blog/example/part-4/",
    title: "Hooks and Guardrails That Run on Their Own",
    synopsis:
      "Hooks run your own scripts at fixed points in a session: before a tool call, after an edit, or when the agent stops.",
    heroImage: createMockImage(4),
    updatedDate: new Date("2026-03-14"),
    readingMinutes: 9,
  },
  {
    url: "/blog/example/part-5/",
    title: "Subagents: Splitting Work Without Losing the Thread",
    synopsis:
      "A single agent on a long task fills its context with search results and dead ends long before it finishes.",
    heroImage: createMockImage(5),
    updatedDate: new Date("2026-05-02"),
    readingMinutes: 11,
  },
  {
    url: "/blog/example/part-6/",
    title: "MCP Servers",
    synopsis:
      "MCP servers connect the agent to the tools your team already uses: issue trackers, docs and databases.",
    heroImage: createMockImage(6),
    updatedDate: new Date("2026-08-19"),
    readingMinutes: 5,
  },
];

const meta: Meta<typeof FeaturedSeries> = {
  title: "Pages/Home/FeaturedSeries",
  component: FeaturedSeries,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Series title" },
    description: { control: "text", description: "Series description" },
    parts: { control: "object", description: "Posts in reading order" },
  },
  args: {
    title: "Claude Code Basics",
    description:
      "A collection of articles focused on setting up dev environment, configuring commands and CLAUDE.md for a spec-driven development workflow.",
  },
};

export default meta;
type Story = StoryObj<typeof FeaturedSeries>;

export const ThreeParts: Story = {
  args: { parts: parts.slice(0, 3) },
};

export const SixParts: Story = {
  args: { parts },
};

/** Two parts fit on desktop, so the arrows, counter and dots hide. */
export const FitsWithoutScrolling: Story = {
  args: { parts: parts.slice(0, 2) },
};

export const WithoutImagesOrDescription: Story = {
  args: {
    description: undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parts: parts.slice(0, 3).map(({ heroImage, ...part }) => part),
  },
};
