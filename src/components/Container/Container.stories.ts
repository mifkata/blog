import type { Meta, StoryObj } from "@storybook/html";

interface ContainerProps {
  size: "default" | "wide";
  content: string;
}

const createContainer = (args: ContainerProps): string => {
  const maxWidth = args.size === "wide" ? "960px" : "720px";
  return `
    <main style="max-width: ${maxWidth}; margin: 0 auto; padding: 3rem 1rem; background: #f3f4f6; border: 1px dashed #9ca3af;">
      <p style="margin: 0; color: #374151;">Container (${args.size}): max-width ${maxWidth}</p>
      <div style="margin-top: 1rem;">${args.content}</div>
    </main>
  `;
};

const meta: Meta<ContainerProps> = {
  title: "Components/Container",
  render: (args) => createContainer(args),
  argTypes: {
    size: {
      control: "select",
      options: ["default", "wide"],
    },
    content: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<ContainerProps>;

export const Default: Story = {
  args: {
    size: "default",
    content: "<p>This is the default container with max-width of 720px.</p>",
  },
};

export const Wide: Story = {
  args: {
    size: "wide",
    content: "<p>This is the wide container with max-width of 960px.</p>",
  },
};

export const Comparison: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${createContainer({ size: "default", content: "Default (720px)" })}
      ${createContainer({ size: "wide", content: "Wide (960px)" })}
    </div>
  `,
};
