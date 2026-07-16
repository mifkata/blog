import type { Meta, StoryObj } from "@storybook-astro/framework";
import AboutSection from "./AboutSection.astro";

const iconSlot =
  '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor"/></svg>';

const meta: Meta<typeof AboutSection> = {
  title: "Pages/About/AboutSection",
  component: AboutSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AboutSection>;

export const Default: Story = {
  args: {
    title: "Interests",
    slots: {
      default: "<p>Hiking, chess, and building side projects with AI.</p>",
    },
  },
};

export const WithIcon: Story = {
  args: {
    title: "Values",
    slots: {
      icon: iconSlot,
      default: "<p>Craftsmanship, curiosity, and honesty.</p>",
    },
  },
};
