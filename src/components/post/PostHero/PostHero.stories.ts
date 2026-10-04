import type { Meta, StoryObj } from "@storybook-astro/framework";
import PostHero from "./PostHero.astro";

const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/1120/700`,
  width: 1120,
  height: 700,
  format: "jpg" as const,
});

const meta: Meta<typeof PostHero> = {
  title: "Post/PostHero",
  component: PostHero,
  tags: ["autodocs"],
  args: {
    description:
      "How the post opens: the description shows under the title in the hero card.",
    readingMinutes: 7,
  },
};

export default meta;
type Story = StoryObj<typeof PostHero>;

export const WithHeroImage: Story = {
  args: {
    title: "Building Scalable Systems with Astro",
    pubDate: new Date("2025-12-30"),
    heroImage: createMockImage(1),
    tags: ["astro", "architecture"],
  },
};

export const WithUpdatedDate: Story = {
  args: {
    title: "Understanding TypeScript Generics",
    pubDate: new Date("2025-11-10"),
    updatedDate: new Date("2025-12-01"),
    heroImage: createMockImage(2),
    tags: ["typescript"],
  },
};

export const InSeries: Story = {
  args: {
    title: "Spec-Driven Development (SDD) for AI Coding Agents",
    pubDate: new Date("2026-01-08"),
    updatedDate: new Date("2026-10-02"),
    heroImage: createMockImage(4),
    tags: ["ai", "sdd", "workflow"],
    series: { title: "Agentic Engineering Foundations", part: 3, total: 4 },
  },
};

/** A tall image: the hero shows all of it, up to the height of the screen. */
export const TallImage: Story = {
  args: {
    title: "A Post With a Tall Hero Image",
    pubDate: new Date("2025-08-12"),
    heroImage: {
      src: "https://picsum.photos/seed/tall/1120/900",
      width: 1120,
      height: 900,
      format: "jpg" as const,
    },
  },
};

export const WithoutHeroImage: Story = {
  args: {
    title: "A Text-Only Post",
    pubDate: new Date("2025-10-05"),
    tags: ["notes"],
  },
};

export const WithoutTags: Story = {
  args: {
    title: "Minimal Post Header",
    pubDate: new Date("2025-09-01"),
    heroImage: createMockImage(3),
  },
};
