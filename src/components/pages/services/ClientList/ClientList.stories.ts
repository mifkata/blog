import type { Meta, StoryObj } from "@storybook-astro/framework";
import ClientList from "./ClientList.astro";

const meta: Meta<typeof ClientList> = {
  title: "Pages/Services/ClientList",
  component: ClientList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClientList>;

export const Default: Story = {
  args: {
    clients: ["Acme Corp", "Globex", "Initech", "Umbrella Corp"],
  },
};
