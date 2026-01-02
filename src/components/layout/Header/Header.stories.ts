import type { Meta, StoryObj } from "storybook-astro";
import Header from "./Header.astro";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
