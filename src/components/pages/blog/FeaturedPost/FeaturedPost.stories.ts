import type { Meta, StoryObj } from "@storybook-astro/framework";
import FeaturedPost from "./FeaturedPost.astro";

const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/720/400`,
  width: 720,
  height: 400,
  format: "jpg" as const,
});

const createMockPost = (overrides: {
  id?: string;
  title?: string;
  synopsis?: string;
  pubDate?: string;
  tags?: string[];
  heroImage?: ReturnType<typeof createMockImage>;
}) => ({
  id: overrides.id ?? "example-post",
  data: {
    title: overrides.title ?? "Example Post",
    synopsis: overrides.synopsis,
    description: overrides.synopsis ?? "Example description",
    pubDate: overrides.pubDate ?? "2025-12-30",
    tags: overrides.tags ?? ["example"],
    heroImage: overrides.heroImage,
  },
});

const meta: Meta<typeof FeaturedPost> = {
  title: "Pages/Blog/FeaturedPost",
  component: FeaturedPost,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeaturedPost>;

export const Default: Story = {
  args: {
    post: createMockPost({
      title: "Getting Started with Astro",
      synopsis:
        "Learn how to build fast, content-focused websites with Astro framework.",
      tags: ["astro", "web"],
      heroImage: createMockImage(10),
    }),
  },
};

export const WithoutHeroImage: Story = {
  args: {
    post: createMockPost({
      title: "Text Only Article",
      synopsis: "An article without a hero image.",
      tags: ["minimal"],
    }),
  },
};
