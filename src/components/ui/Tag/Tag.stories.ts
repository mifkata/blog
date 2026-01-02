import type { Meta, StoryObj } from "storybook-astro";
import Tag from "./Tag.astro";

const meta: Meta<typeof Tag> = {
  title: "UI/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    tag: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    tag: "javascript",
  },
};

export const Astro: Story = {
  args: {
    tag: "astro",
  },
};

export const TypeScript: Story = {
  args: {
    tag: "typescript",
  },
};
