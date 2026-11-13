import type { Meta, StoryObj } from "@/helpers/storybook";
import { activityMonths, summarizeTags } from "@/helpers/content/tags";
import {
  STORY_NOW,
  STORY_POSTS,
  STORY_TAG_INFO,
} from "@/components/pages/tags/tags.data";
import TagsTimeline from "./TagsTimeline.astro";

const meta: Meta<typeof TagsTimeline> = {
  title: "Pages/Tags/TagsTimeline",
  component: TagsTimeline,
  tags: ["autodocs"],
  args: { months: activityMonths(STORY_NOW) },
};

export default meta;
type Story = StoryObj<typeof TagsTimeline>;

export const Default: Story = {
  args: { tags: summarizeTags(STORY_POSTS, STORY_TAG_INFO, STORY_NOW) },
};

export const WithoutCopy: Story = {
  args: {
    tags: summarizeTags(STORY_POSTS, {}, STORY_NOW).filter(
      (tag) => tag.count === 1,
    ),
  },
};

export const Empty: Story = {
  args: { tags: [] },
};
