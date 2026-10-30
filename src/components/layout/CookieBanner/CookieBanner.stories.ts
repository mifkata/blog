import type { Meta, StoryObj } from "@/helpers/storybook";
import CookieBanner from "./CookieBanner.astro";

const meta: Meta<typeof CookieBanner> = {
  title: "Layout/CookieBanner",
  component: CookieBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CookieBanner>;

export const Default: Story = { args: { open: true } };
