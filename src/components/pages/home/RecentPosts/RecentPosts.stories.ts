import type { Meta, StoryObj } from "@storybook-astro/framework";
import RecentPosts from "./RecentPosts.astro";

const createMockPost = (id: string, title: string, pubDate: string) => ({
  id,
  data: { title, pubDate },
});

const meta: Meta<typeof RecentPosts> = {
  title: "Pages/Home/RecentPosts",
  component: RecentPosts,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecentPosts>;

export const Default: Story = {
  args: {
    posts: [
      createMockPost("post-1", "Getting Started with Astro", "2025-12-30"),
      createMockPost(
        "post-2",
        "Understanding TypeScript Generics",
        "2025-12-20",
      ),
      createMockPost("post-3", "Building Scalable Systems", "2025-12-10"),
    ],
  },
};
