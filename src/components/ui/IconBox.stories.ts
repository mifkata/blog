import type { Meta, StoryObj } from "@storybook-astro/framework";
import IconBox from "./IconBox.astro";

const iconSlot =
  '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg>';

const meta: Meta<typeof IconBox> = {
  title: "UI/IconBox",
  component: IconBox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["accent", "muted"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconBox>;

export const Accent: Story = {
  args: {
    size: "md",
    variant: "accent",
    slots: { default: iconSlot },
  },
};

export const Muted: Story = {
  args: {
    size: "md",
    variant: "muted",
    slots: { default: iconSlot },
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "accent",
    slots: { default: iconSlot },
  },
};
