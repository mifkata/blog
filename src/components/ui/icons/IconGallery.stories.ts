import type { Meta, StoryObj } from "@/helpers/storybook";
import IconGallery from "./IconGallery.astro";

const meta: Meta<typeof IconGallery> = {
  title: "UI/Icons",
  component: IconGallery,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const AllIcons: Story = {};
