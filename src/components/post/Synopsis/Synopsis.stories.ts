import type { Meta, StoryObj } from "@storybook/html";

interface SynopsisProps {
  text: string;
}

function parseInlineMarkdown(input: string): string {
  return input
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function parseMarkdown(input: string): string {
  if (!input) return "";
  const paragraphs = input
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${parseInlineMarkdown(p)}</p>`).join("");
}

const createSynopsis = (args: SynopsisProps): string => {
  const html = parseMarkdown(args.text);
  return `<div>${html}</div>`;
};

const meta: Meta<SynopsisProps> = {
  title: "Components/Synopsis",
  render: (args) => createSynopsis(args),
  argTypes: {
    text: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<SynopsisProps>;

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
