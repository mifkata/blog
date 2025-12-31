import type { Meta, StoryObj } from "@storybook/html";

interface RedditEmbedProps {
  url: string;
  height: number;
}

const createRedditEmbed = (args: RedditEmbedProps): string => {
  const match = args.url.match(/reddit\.com\/r\/[\w]+\/comments\/([\w]+)/);
  const isValid = match !== null;

  if (!isValid) {
    return `<p style="color: #ef4444;">Invalid Reddit URL</p>`;
  }

  return `
    <div style="margin: 1.5rem 0; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; background: rgba(243,244,246,0.2); text-align: center;">
      <p style="margin: 0 0 0.5rem; color: #6b7280;">Reddit Post (Placeholder)</p>
      <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: #9ca3af;">Height: ${args.height}px</p>
      <a href="${args.url}" target="_blank" rel="noopener noreferrer" style="color: #f97316;">
        View on Reddit →
      </a>
      <p style="margin: 0.5rem 0 0; font-size: 0.75rem; color: #9ca3af;">
        (Actual embed lazy-loads when visible in viewport)
      </p>
    </div>
  `;
};

const meta: Meta<RedditEmbedProps> = {
  title: "Components/RedditEmbed",
  render: (args) => createRedditEmbed(args),
  argTypes: {
    url: { control: "text" },
    height: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<RedditEmbedProps>;

export const Default: Story = {
  args: {
    url: "https://www.reddit.com/r/programming/comments/abc123/example_post/",
    height: 320,
  },
};

export const TallEmbed: Story = {
  args: {
    url: "https://www.reddit.com/r/webdev/comments/xyz789/another_post/",
    height: 500,
  },
};

export const InvalidUrl: Story = {
  args: {
    url: "https://example.com/not-reddit",
    height: 320,
  },
};
