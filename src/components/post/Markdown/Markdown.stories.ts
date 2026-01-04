import type { Meta, StoryObj } from "@storybook/html";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Markdown } from "./Markdown";

interface MarkdownArgs {
  text: string;
  className?: string;
}

const meta: Meta<MarkdownArgs> = {
  title: "Post/Markdown",
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Markdown content to render",
    },
    className: {
      control: "text",
      description: "CSS class for the wrapper div",
    },
  },
  render: (args) => {
    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(createElement(Markdown, args));
    return container;
  },
};

export default meta;
type Story = StoryObj<MarkdownArgs>;

export const PlainText: Story = {
  args: {
    text: "A simple text without any formatting.",
  },
};

export const WithBold: Story = {
  args: {
    text: "This text has **bold text** for emphasis.",
  },
};

export const WithItalic: Story = {
  args: {
    text: "This text has *italic text* for emphasis.",
  },
};

export const WithCode: Story = {
  args: {
    text: "This text mentions `code` and `variables`.",
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

export const WithHeadings: Story = {
  args: {
    text: "# Heading 1\n\n## Heading 2\n\nSome paragraph text.",
  },
};

export const WithList: Story = {
  args: {
    text: "Features:\n\n- Fast builds\n- Easy to use\n- Great DX",
  },
};

export const WithCodeBlock: Story = {
  args: {
    text: "Example code:\n\n```js\nconst greeting = 'Hello';\nconsole.log(greeting);\n```",
  },
};
