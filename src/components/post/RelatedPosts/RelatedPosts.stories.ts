import type { Meta, StoryObj } from "@storybook-astro/framework";
import RelatedPosts from "./RelatedPosts.astro";

const image = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/960/540`,
  width: 960,
  height: 540,
  format: "jpg" as const,
});

const meta: Meta<typeof RelatedPosts> = {
  title: "Post/RelatedPosts",
  component: RelatedPosts,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RelatedPosts>;

export const FourPosts: Story = {
  args: {
    items: [
      {
        id: "post-1",
        url: "/blog/post-1/",
        title: "Spec-Driven Development (SDD) for AI Coding Agents",
        description:
          "What spec-driven development is, why AI coding agents need it, and how to start.",
        pubDate: new Date("2026-01-08"),
        heroImage: image(1),
        minutes: 6,
        kind: "series",
        reason: "Previous in the series",
      },
      {
        id: "post-2",
        url: "/blog/post-2/",
        title: "3 must-have tools for a leaner AI agent context",
        pubDate: new Date("2026-09-21"),
        heroImage: image(2),
        minutes: 5,
        kind: "topic",
        reason: "Also about agents",
      },
      {
        id: "post-3",
        url: "/blog/post-3/",
        title: "The rise of OpenClaw",
        pubDate: new Date("2026-02-04"),
        heroImage: image(3),
        minutes: 4,
        kind: "topic",
        reason: "Also about agents",
      },
      {
        id: "post-4",
        url: "/blog/post-4/",
        title: "Project Instructions and Reusable Commands",
        pubDate: new Date("2026-01-02"),
        heroImage: image(4),
        minutes: 7,
        kind: "latest",
        reason: "More from the blog",
      },
    ],
  },
};

export const SinglePost: Story = {
  args: {
    items: [
      {
        id: "post-1",
        url: "/blog/post-1/",
        title: "The rise of OpenClaw",
        description:
          "OpenClaw, the agentic sensation that took the world by storm.",
        pubDate: new Date("2026-02-04"),
        heroImage: image(5),
        minutes: 4,
        kind: "topic",
        reason: "Also about agents",
      },
    ],
  },
};
