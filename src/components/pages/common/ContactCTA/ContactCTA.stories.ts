import type { Meta, StoryObj } from "@storybook-astro/framework";
import ContactCTA from "./ContactCTA.astro";

const meta: Meta<typeof ContactCTA> = {
  title: "Pages/Common/ContactCTA",
  component: ContactCTA,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContactCTA>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    headline: "Have a project in mind?",
    description: "I take on a limited number of consulting engagements.",
    buttonText: "Say Hello",
    buttonHref: "mailto:hi@mifkata.com",
  },
};
