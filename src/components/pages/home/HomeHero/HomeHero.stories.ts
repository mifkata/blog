import type { Meta, StoryObj } from "@storybook-astro/framework";
import HomeHero from "./HomeHero.astro";

const meta: Meta<typeof HomeHero> = {
  title: "Pages/Home/HomeHero",
  component: HomeHero,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HomeHero>;

export const Default: Story = {};
