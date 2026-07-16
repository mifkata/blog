import type { Meta, StoryObj } from "@storybook-astro/framework";
import AboutHero from "./AboutHero.astro";

const meta: Meta<typeof AboutHero> = {
  title: "Pages/About/AboutHero",
  component: AboutHero,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AboutHero>;

export const Default: Story = {};
