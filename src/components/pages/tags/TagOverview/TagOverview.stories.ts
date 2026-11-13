import type { Meta, StoryObj } from "@/helpers/storybook";
import { relatedTags } from "@/helpers/content/tags";
import { STORY_POSTS, STORY_TAG_INFO } from "@/components/pages/tags/tags.data";
import TagOverview from "./TagOverview.astro";

const meta: Meta<typeof TagOverview> = {
  title: "Pages/Tags/TagOverview",
  component: TagOverview,
  tags: ["autodocs"],
  args: { class: "max-w-75" },
};

export default meta;
type Story = StoryObj<typeof TagOverview>;

export const Default: Story = {
  args: {
    slug: "agents",
    ...STORY_TAG_INFO.agents,
    count: 5,
    updated: new Date("2026-10-02T00:00:00Z"),
    related: relatedTags(STORY_POSTS, "agents"),
  },
};

export const SinglePostWithoutCopy: Story = {
  args: {
    slug: "openclaw",
    title: "openclaw",
    count: 1,
    updated: new Date("2026-02-04T00:00:00Z"),
    related: relatedTags(STORY_POSTS, "openclaw"),
  },
};

export const NoRelatedTags: Story = {
  args: {
    slug: "astro",
    title: "Astro",
    description: "Posts about the Astro web framework.",
    count: 2,
    updated: new Date("2025-12-09T00:00:00Z"),
    related: [],
  },
};
