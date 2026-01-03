import type { Meta, StoryObj } from "storybook-astro";
import FeaturedSeries from "./FeaturedSeries.astro";

const meta: Meta<typeof FeaturedSeries> = {
  title: "Pages/Home/FeaturedSeries",
  component: FeaturedSeries,
  tags: ["autodocs"],
  argTypes: {
    slug: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FeaturedSeries>;

export const Default: Story = {
  args: {
    slug: "claude-code-setup-series",
  },
};
