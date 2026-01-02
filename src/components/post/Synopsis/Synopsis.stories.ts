import type { Meta, StoryObj } from "storybook-astro";
import Synopsis from "./Synopsis.astro";

const meta: Meta<typeof Synopsis> = {
  title: "Post/Synopsis",
  component: Synopsis,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Synopsis>;

export const PlainText: Story = {
  args: {
    text: "A simple synopsis without any formatting.",
  },
};

export const WithBold: Story = {
  args: {
    text: "This synopsis has **bold text** for emphasis.",
  },
};

export const WithItalic: Story = {
  args: {
    text: "This synopsis has *italic text* for emphasis.",
  },
};

export const WithCode: Story = {
  args: {
    text: "This synopsis mentions `code` and `variables`.",
  },
};

export const WithLink: Story = {
  args: {
    text: "Check out [this link](https://example.com) for more info.",
  },
};

export const MultipleParagraphs: Story = {
  args: {
    text: "First paragraph with **bold**.\n\nSecond paragraph with *italic* and `code`.",
  },
};

export const ComplexFormatting: Story = {
  args: {
    text: "Learn about **Astro** framework. Read the [documentation](https://astro.build) for details.\n\nUse `npm create astro` to get started.",
  },
};
