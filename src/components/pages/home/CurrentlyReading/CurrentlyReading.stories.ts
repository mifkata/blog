import type { Meta, StoryObj } from "@storybook-astro/framework";
import CurrentlyReading from "./CurrentlyReading.astro";

const meta: Meta<typeof CurrentlyReading> = {
  title: "Pages/Home/CurrentlyReading",
  component: CurrentlyReading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CurrentlyReading>;

export const Default: Story = {};
