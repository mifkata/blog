import type { Meta, StoryObj } from "@storybook-astro/framework";
import HomeTerminal from "./HomeTerminal.astro";

const meta: Meta<typeof HomeTerminal> = {
  title: "Pages/Home/HomeTerminal",
  component: HomeTerminal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HomeTerminal>;

export const Default: Story = {};

export const CustomCommand: Story = {
  args: {
    command: "whoami",
    output: "A software engineer who talks to a lot of AI agents.",
  },
};
