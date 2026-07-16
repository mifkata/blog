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
