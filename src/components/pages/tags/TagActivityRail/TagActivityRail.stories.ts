import type { Meta, StoryObj } from "@/helpers/storybook";
import { activityMonths } from "@/helpers/content/tags";
import TagActivityRail from "./TagActivityRail.astro";

const months = activityMonths(new Date("2026-11-13T00:00:00Z"));

const meta: Meta<typeof TagActivityRail> = {
  title: "Pages/Tags/TagActivityRail",
  component: TagActivityRail,
  tags: ["autodocs"],
  args: { months, class: "max-w-80" },
};

export default meta;
type Story = StoryObj<typeof TagActivityRail>;

export const Busy: Story = {
  args: { activity: [3, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0] },
};

export const Single: Story = {
  args: { activity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
};

export const Quiet: Story = {
  args: { activity: Array.from({ length: 12 }, () => 0) },
};
