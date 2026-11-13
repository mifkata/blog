import type { Meta, StoryObj } from "@/helpers/storybook";
import { relatedTags, summarizeTags } from "@/helpers/content/tags";
import {
  STORY_NOW,
  STORY_POSTS,
  STORY_TAG_INFO,
} from "@/components/pages/tags/tags.data";
import TagCloud from "./TagCloud.astro";

const meta: Meta<typeof TagCloud> = {
  title: "Pages/Tags/TagCloud",
  component: TagCloud,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagCloud>;

export const AllTagsWithCounts: Story = {
  args: {
    label: "Tags by number of posts",
    size: "lg",
    showCounts: true,
    tags: summarizeTags(STORY_POSTS, STORY_TAG_INFO, STORY_NOW),
  },
};

export const Related: Story = {
  args: {
    label: "Tagged together with agents",
    tags: relatedTags(STORY_POSTS, "agents"),
    class: "max-w-75",
  },
};
