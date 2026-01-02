import type { Meta, StoryObj } from "storybook-astro";
import Button from "./Button.astro";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["normal", "inverse", "ghost"],
    },
    href: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Normal: Story = {
  args: {
    variant: "normal",
    slots: { default: "Normal Button" },
  },
};

export const Inverse: Story = {
  args: {
    variant: "inverse",
    slots: { default: "Inverse Button" },
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    slots: { default: "Ghost Button" },
  },
};

export const AsLink: Story = {
  args: {
    variant: "inverse",
    href: "/example",
    slots: { default: "Link Button" },
  },
};
