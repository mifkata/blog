import type { Meta, StoryObj } from "@storybook-astro/framework";
import ListSection from "./ListSection.astro";

const meta: Meta<typeof ListSection> = {
  title: "Pages/Common/ListSection",
  component: ListSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ListSection>;

export const Default: Story = {
  args: {
    title: "Recent Posts",
    slots: { default: "<p>List content goes here.</p>" },
  },
};

export const WithoutLine: Story = {
  args: {
    title: "Recent Posts",
    showLine: false,
    slots: { default: "<p>List content goes here.</p>" },
  },
};
