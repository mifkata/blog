import type { Meta, StoryObj } from "@storybook-astro/framework";
import SkillsGrid from "./SkillsGrid.astro";

const meta: Meta<typeof SkillsGrid> = {
  title: "Pages/Resume/SkillsGrid",
  component: SkillsGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SkillsGrid>;

export const Default: Story = {
  args: {
    skills: [
      { name: "Backend", icon: "server", items: ["Elixir", "Node.js", "Go"] },
      {
        name: "Frontend",
        icon: "layout",
        items: ["React", "Astro", "TypeScript"],
      },
      {
        name: "Data",
        icon: "database",
        items: ["PostgreSQL", "Redis", "Kafka"],
      },
      {
        name: "Infrastructure",
        icon: "cloud",
        items: ["AWS", "Terraform", "Docker"],
      },
    ],
  },
};
