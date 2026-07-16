import type { Meta, StoryObj } from "@storybook-astro/framework";
import Comments from "./Comments.astro";

const meta: Meta<typeof Comments> = {
  title: "Post/Comments",
  component: Comments,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Comments>;

export const Default: Story = {};
