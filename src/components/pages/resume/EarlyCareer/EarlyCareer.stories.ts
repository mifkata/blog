import type { Meta, StoryObj } from "@storybook-astro/framework";
import EarlyCareer from "./EarlyCareer.astro";

const meta: Meta<typeof EarlyCareer> = {
  title: "Pages/Resume/EarlyCareer",
  component: EarlyCareer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EarlyCareer>;

export const Default: Story = {
  args: {
    period: "2003 – 2010",
    description:
      "Freelance PHP development and early web projects before moving into full-time software engineering.",
    companies: ["Freelance", "Various Agencies"],
  },
};
