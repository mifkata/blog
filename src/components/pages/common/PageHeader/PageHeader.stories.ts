import type { Meta, StoryObj } from "@storybook-astro/framework";
import PageHeader from "./PageHeader.astro";

const meta: Meta<typeof PageHeader> = {
  title: "Pages/Common/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: {
    title: "About Me",
  },
};

export const WithSubtitleAndDescription: Story = {
  args: {
    title: "Services",
    subtitle: "Contract engineering & consulting",
    description:
      "I help teams ship reliable software faster, from architecture to implementation.",
  },
};
