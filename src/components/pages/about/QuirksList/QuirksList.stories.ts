import type { Meta, StoryObj } from "@storybook-astro/framework";
import QuirksList from "./QuirksList.astro";

const meta: Meta<typeof QuirksList> = {
  title: "Pages/About/QuirksList",
  component: QuirksList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QuirksList>;

export const Default: Story = {
  args: {
    quirks: [
      "Types faster than I think, then has to slow down to fix it.",
      "Reads changelogs for fun.",
      "Owns way too many mechanical keyboards.",
    ],
  },
};

export const SingleQuirk: Story = {
  args: {
    quirks: ["Names every side project after a movie."],
  },
};
