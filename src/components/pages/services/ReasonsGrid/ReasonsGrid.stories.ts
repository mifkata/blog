import type { Meta, StoryObj } from "@storybook-astro/framework";
import ReasonsGrid from "./ReasonsGrid.astro";

const meta: Meta<typeof ReasonsGrid> = {
  title: "Pages/Services/ReasonsGrid",
  component: ReasonsGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReasonsGrid>;

export const Default: Story = {
  args: {
    reasons: [
      {
        title: "Fast delivery",
        description: "I ship working software early and iterate from there.",
      },
      {
        title: "Clear communication",
        description: "Regular updates, no surprises, no black boxes.",
      },
      {
        title: "Pragmatic engineering",
        description:
          "I build for the problem you have, not the one you might have.",
      },
      {
        title: "Long-term thinking",
        description: "Code that's easy to maintain after I'm gone.",
      },
    ],
  },
};
