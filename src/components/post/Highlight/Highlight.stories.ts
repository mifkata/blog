import type { Meta, StoryObj } from "storybook-astro";
import Highlight from "./Highlight.astro";

const meta: Meta<typeof Highlight> = {
  title: "Post/Highlight",
  component: Highlight,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["yellow", "green", "blue", "pink"],
    },
    block: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Highlight>;

export const Yellow: Story = {
  args: {
    color: "yellow",
    slots: { default: "Highlighted text" },
  },
};

export const Green: Story = {
  args: {
    color: "green",
    slots: { default: "Highlighted text" },
  },
};

export const Blue: Story = {
  args: {
    color: "blue",
    slots: { default: "Highlighted text" },
  },
};

export const Pink: Story = {
  args: {
    color: "pink",
    slots: { default: "Highlighted text" },
  },
};

export const BlockYellow: Story = {
  args: {
    color: "yellow",
    block: true,
    slots: {
      default:
        "This is a block highlight that can contain longer text, multiple sentences, or even entire paragraphs of content.",
    },
  },
};

export const BlockGreen: Story = {
  args: {
    color: "green",
    block: true,
    slots: { default: "Green block highlight" },
  },
};
