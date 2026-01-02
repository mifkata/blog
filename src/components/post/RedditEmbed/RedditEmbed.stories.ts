import type { Meta, StoryObj } from "storybook-astro";
import RedditEmbed from "./RedditEmbed.astro";
import { initRedditEmbeds } from "./redditEmbed";

const meta: Meta<typeof RedditEmbed> = {
  title: "Post/RedditEmbed",
  component: RedditEmbed,
  tags: ["autodocs"],
  argTypes: {
    url: { control: "text" },
    height: { control: "number" },
  },
  decorators: [
    (storyFn) => {
      const result = storyFn();
      setTimeout(initRedditEmbeds, 0);
      return result;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof RedditEmbed>;

export const Default: Story = {
  args: {
    url: "https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/",
    height: 320,
  },
};

export const TallEmbed: Story = {
  args: {
    url: "https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/",
    height: 500,
  },
};

export const InvalidUrl: Story = {
  args: {
    url: "https://example.com/not-reddit",
    height: 320,
  },
};
