import type { Meta, StoryObj } from "@storybook-astro/framework";
import ExperienceTimeline from "./ExperienceTimeline.astro";

const meta: Meta<typeof ExperienceTimeline> = {
  title: "Pages/Resume/ExperienceTimeline",
  component: ExperienceTimeline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExperienceTimeline>;

export const Default: Story = {
  args: {
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Acme Corp",
        location: "Remote",
        dates: "2023 – Present",
        current: true,
        description:
          "Leading backend architecture for a distributed systems platform.",
        highlights: [
          "Redesigned the event pipeline, cutting latency by 40%",
          "Mentored a team of 4 engineers",
        ],
        tech: "Elixir, PostgreSQL, Kafka",
      },
      {
        title: "Software Engineer",
        company: "Contract Work",
        location: "Remote",
        dates: "2019 – 2023",
        current: false,
        description: "Consulting across multiple client engagements.",
        roles: [
          {
            client: "Client A",
            period: "2021 – 2023",
            highlights: [
              "Built a real-time analytics dashboard",
              "Migrated legacy monolith to microservices",
            ],
            tech: "Node.js, React, AWS",
          },
          {
            client: "Client B",
            period: "2019 – 2021",
            highlights: ["Shipped a mobile-first e-commerce platform"],
            tech: "TypeScript, Next.js",
          },
        ],
      },
    ],
  },
};
