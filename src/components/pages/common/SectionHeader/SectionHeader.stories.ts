import type { Meta, StoryObj } from "@storybook-astro/framework";
import SectionHeader from "./SectionHeader.astro";

const iconSlot =
  '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg>';

const meta: Meta<typeof SectionHeader> = {
  title: "Pages/Common/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = {
  args: {
    title: "Experience",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Skills",
    slots: { icon: iconSlot },
  },
};
