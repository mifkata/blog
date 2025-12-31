import type { Meta, StoryObj } from "@storybook/html";

interface HighlightProps {
  text: string;
  color: "yellow" | "green" | "blue" | "pink";
  block: boolean;
}

const colorClasses = {
  yellow: "background-color: rgba(254, 240, 138, 0.6);",
  green: "background-color: rgba(187, 247, 208, 0.6);",
  blue: "background-color: rgba(191, 219, 254, 0.6);",
  pink: "background-color: rgba(251, 207, 232, 0.6);",
};

const createHighlight = (args: HighlightProps): string => {
  if (args.block) {
    return `<div style="padding: 1rem; border-radius: 0.375rem; margin: 1rem 0; ${colorClasses[args.color]}">${args.text}</div>`;
  }
  return `<mark style="padding: 0 0.25rem; border-radius: 0.125rem; ${colorClasses[args.color]}">${args.text}</mark>`;
};

const meta: Meta<HighlightProps> = {
  title: "Components/Highlight",
  render: (args) => createHighlight(args),
  argTypes: {
    color: {
      control: "select",
      options: ["yellow", "green", "blue", "pink"],
    },
    block: {
      control: "boolean",
    },
    text: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<HighlightProps>;

export const Yellow: Story = {
  args: {
    text: "Highlighted text",
    color: "yellow",
    block: false,
  },
};

export const Green: Story = {
  args: {
    text: "Highlighted text",
    color: "green",
    block: false,
  },
};

export const Blue: Story = {
  args: {
    text: "Highlighted text",
    color: "blue",
    block: false,
  },
};

export const Pink: Story = {
  args: {
    text: "Highlighted text",
    color: "pink",
    block: false,
  },
};

export const BlockYellow: Story = {
  args: {
    text: "This is a block highlight that can contain longer text, multiple sentences, or even entire paragraphs of content.",
    color: "yellow",
    block: true,
  },
};

export const AllColors: Story = {
  render: () => `
    <p>Inline highlights: ${createHighlight({ text: "yellow", color: "yellow", block: false })} ${createHighlight({ text: "green", color: "green", block: false })} ${createHighlight({ text: "blue", color: "blue", block: false })} ${createHighlight({ text: "pink", color: "pink", block: false })}</p>
  `,
};

export const AllBlockColors: Story = {
  render: () => `
    <div>
      ${createHighlight({ text: "Yellow block highlight", color: "yellow", block: true })}
      ${createHighlight({ text: "Green block highlight", color: "green", block: true })}
      ${createHighlight({ text: "Blue block highlight", color: "blue", block: true })}
      ${createHighlight({ text: "Pink block highlight", color: "pink", block: true })}
    </div>
  `,
};
