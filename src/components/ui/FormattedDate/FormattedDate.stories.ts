import type { Meta, StoryObj } from "storybook-astro";
import FormattedDate from "./FormattedDate.astro";

const meta: Meta<typeof FormattedDate> = {
  title: "UI/FormattedDate",
  component: FormattedDate,
  tags: ["autodocs"],
  argTypes: {
    date: { control: "date" },
  },
};

export default meta;
type Story = StoryObj<typeof FormattedDate>;

export const Default: Story = {
  args: {
    date: new Date("2025-12-31"),
  },
};

export const Today: Story = {
  args: {
    date: new Date(),
  },
};

export const OldDate: Story = {
  args: {
    date: new Date("2020-01-15"),
  },
};
