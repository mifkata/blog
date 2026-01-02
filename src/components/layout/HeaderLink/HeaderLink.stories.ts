import type { Meta, StoryObj } from "storybook-astro";
import HeaderLink from "./HeaderLink.astro";

const meta: Meta<typeof HeaderLink> = {
  title: "Layout/HeaderLink",
  component: HeaderLink,
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    number: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderLink>;

export const Default: Story = {
  args: {
    href: "/blog",
    slots: { default: "Blog" },
  },
};

export const WithNumber: Story = {
  args: {
    href: "/blog",
    number: "01",
    slots: { default: "Blog" },
  },
};

export const Navigation: Story = {
  args: {
    href: "/about",
    number: "02",
    slots: { default: "About" },
  },
};
