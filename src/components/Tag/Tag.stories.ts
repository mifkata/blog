import type { Meta, StoryObj } from "@storybook/html";

interface TagProps {
  tag: string;
}

const createTag = (args: TagProps): string => {
  return `<a href="/tags/${args.tag}/" class="py-1 px-2 bg-gray-light rounded text-gray-dark text-sm no-underline hover:bg-accent hover:text-white" style="padding: 0.25rem 0.5rem; background-color: #e5e7eb; border-radius: 0.25rem; color: #374151; font-size: 0.875rem; text-decoration: none;">${args.tag}</a>`;
};

const meta: Meta<TagProps> = {
  title: "Components/Tag",
  render: (args) => createTag(args),
  argTypes: {
    tag: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<TagProps>;

export const Default: Story = {
  args: {
    tag: "javascript",
  },
};

export const MultipleTags: Story = {
  render: () => `
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      ${createTag({ tag: "astro" })}
      ${createTag({ tag: "typescript" })}
      ${createTag({ tag: "tailwind" })}
      ${createTag({ tag: "ai" })}
      ${createTag({ tag: "web-development" })}
    </div>
  `,
};
