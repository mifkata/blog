import type { Meta, StoryObj } from "@/helpers/storybook";
import { postsByYear } from "@/helpers/content/tags";
import { STORY_POSTS } from "@/components/pages/tags/tags.data";
import TagPostsByYear from "./TagPostsByYear.astro";

const meta: Meta<typeof TagPostsByYear> = {
  title: "Pages/Tags/TagPostsByYear",
  component: TagPostsByYear,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagPostsByYear>;

export const SeveralYears: Story = {
  args: {
    years: postsByYear(STORY_POSTS.filter((p) => p.tags.includes("agents"))),
  },
};

export const OneYear: Story = {
  args: { years: postsByYear(STORY_POSTS.slice(0, 2)) },
};
