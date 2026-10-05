import type { Meta, StoryObj } from "@storybook-astro/framework";
import ReadingShelf from "./ReadingShelf.astro";

const meta: Meta<typeof ReadingShelf> = {
  title: "Pages/Home/ReadingShelf",
  component: ReadingShelf,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReadingShelf>;

export const Default: Story = {};
