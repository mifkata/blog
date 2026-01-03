import type { Meta, StoryObj } from "storybook-astro";
import ClaudeCommand from "./ClaudeCommand.astro";

const meta: Meta<typeof ClaudeCommand> = {
  title: "Post/ClaudeCommand",
  component: ClaudeCommand,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    external: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ClaudeCommand>;

export const Internal: Story = {
  args: {
    name: "commit-staged",
  },
};

export const InternalSpecCommand: Story = {
  args: {
    name: "spec-create",
  },
};

export const External: Story = {
  args: {
    name: "help",
    external: true,
  },
};

export const ExternalClear: Story = {
  args: {
    name: "clear",
    external: true,
  },
};
