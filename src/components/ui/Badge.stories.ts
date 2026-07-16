import type { Meta, StoryObj } from "@storybook-astro/framework";
import Badge from "./Badge.astro";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Small: Story = {
  args: {
    size: "sm",
    slots: { default: "React" },
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    slots: { default: "TypeScript" },
  },
};
