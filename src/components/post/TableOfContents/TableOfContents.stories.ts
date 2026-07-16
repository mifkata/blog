import type { Meta, StoryObj } from "@storybook-astro/framework";
import TableOfContents from "./TableOfContents.astro";

const meta: Meta<typeof TableOfContents> = {
  title: "Post/TableOfContents",
  component: TableOfContents,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

export const Default: Story = {
  args: {
    headings: [
      { depth: 2, slug: "introduction", text: "Introduction" },
      { depth: 3, slug: "background", text: "Background" },
      { depth: 2, slug: "getting-started", text: "Getting Started" },
      { depth: 3, slug: "installation", text: "Installation" },
      { depth: 3, slug: "configuration", text: "Configuration" },
      { depth: 2, slug: "conclusion", text: "Conclusion" },
    ],
  },
};

export const ShortList: Story = {
  args: {
    headings: [
      { depth: 2, slug: "overview", text: "Overview" },
      { depth: 2, slug: "summary", text: "Summary" },
    ],
  },
};
