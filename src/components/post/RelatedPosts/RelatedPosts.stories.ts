import type { Meta, StoryObj } from "@storybook-astro/framework";
import RelatedPosts from "./RelatedPosts.astro";

const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/300/170`,
  width: 300,
  height: 170,
  format: "jpg" as const,
});

const createMockPost = (overrides: {
  id?: string;
  title?: string;
  heroImage?: ReturnType<typeof createMockImage>;
}) => ({
  id: overrides.id ?? "example-post",
  data: {
    title: overrides.title ?? "Example Post",
    heroImage: overrides.heroImage,
  },
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
    posts: [
      createMockPost({
        id: "post-1",
        title: "Getting Started with Astro",
        heroImage: createMockImage(1),
      }),
      createMockPost({
        id: "post-2",
        title: "Understanding TypeScript Generics",
        heroImage: createMockImage(2),
      }),
      createMockPost({
        id: "post-3",
        title: "Building Scalable Systems",
        heroImage: createMockImage(3),
      }),
      createMockPost({
        id: "post-4",
        title: "A Deep Dive into Component Architecture",
        heroImage: createMockImage(4),
      }),
    ],
  },
};

export const TwoPosts: Story = {
  args: {
    posts: [
      createMockPost({
        id: "post-1",
        title: "Getting Started with Astro",
        heroImage: createMockImage(5),
      }),
      createMockPost({
        id: "post-2",
        title: "Understanding TypeScript Generics",
        heroImage: createMockImage(6),
      }),
    ],
  },
};

export const NoPosts: Story = {
  args: {
    posts: [],
  },
};
