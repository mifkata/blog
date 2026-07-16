import type { Meta, StoryObj } from "@storybook-astro/framework";
import PostsList from "./PostsList.astro";

const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/200/120`,
  width: 200,
  height: 120,
  format: "jpg" as const,
});

const createMockPost = (overrides: {
  id?: string;
  title?: string;
  synopsis?: string;
  tags?: string[];
  heroImage?: ReturnType<typeof createMockImage>;
}) => ({
  id: overrides.id ?? "example-post",
  data: {
    title: overrides.title ?? "Example Post",
    synopsis: overrides.synopsis,
    description: overrides.synopsis ?? "Example description",
    pubDate: "2025-12-30",
    tags: overrides.tags ?? ["example"],
    heroImage: overrides.heroImage,
  },
});

const mockPosts = [
  createMockPost({
    id: "post-1",
    title: "Getting Started with Astro",
    synopsis: "Learn how to build fast, content-focused websites.",
    tags: ["astro"],
    heroImage: createMockImage(1),
  }),
  createMockPost({
    id: "post-2",
    title: "Understanding TypeScript Generics",
    synopsis: "A deep dive into TypeScript generics.",
    tags: ["typescript"],
    heroImage: createMockImage(2),
  }),
  createMockPost({
    id: "post-3",
    title: "Building Scalable Systems",
    synopsis: "Practical patterns for scaling backend systems.",
    tags: ["architecture"],
    heroImage: createMockImage(3),
  }),
];

const meta: Meta<typeof PostsList> = {
  title: "Pages/Blog/PostsList",
  component: PostsList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PostsList>;

export const Default: Story = {
  args: {
    posts: mockPosts,
  },
};

export const CustomTitle: Story = {
  args: {
    posts: mockPosts,
    title: "Featured Series",
  },
};

export const WithoutHeader: Story = {
  args: {
    posts: mockPosts,
    showHeader: false,
  },
};
