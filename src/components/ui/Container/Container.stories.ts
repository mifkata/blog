import type { Meta, StoryObj } from "storybook-astro";
import Container from "./Container.astro";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "wide"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    size: "default",
    slots: {
      default: "<p>This is the default container with max-width of 720px.</p>",
    },
  },
};

export const Wide: Story = {
  args: {
    size: "wide",
    slots: {
      default: "<p>This is the wide container with max-width of 960px.</p>",
    },
  },
};
