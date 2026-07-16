import type { Meta, StoryObj } from "@storybook-astro/framework";
import ServicesGrid from "./ServicesGrid.astro";

const meta: Meta<typeof ServicesGrid> = {
  title: "Pages/Services/ServicesGrid",
  component: ServicesGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ServicesGrid>;

export const Default: Story = {
  args: {
    services: [
      {
        title: "Backend Architecture",
        description: "Designing scalable, maintainable backend systems.",
        icon: "server",
      },
      {
        title: "Frontend Development",
        description: "Building fast, accessible user interfaces.",
        icon: "layout",
      },
      {
        title: "DevOps & Infrastructure",
        description: "CI/CD pipelines and cloud infrastructure setup.",
        icon: "cloud",
      },
      {
        title: "Team Consulting",
        description: "Helping teams adopt better engineering practices.",
        icon: "users",
      },
    ],
  },
};
