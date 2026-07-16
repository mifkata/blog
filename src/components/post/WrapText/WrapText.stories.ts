import type { Meta, StoryObj } from "@storybook-astro/framework";
import WrapText from "./WrapText.astro";

const meta: Meta<typeof WrapText> = {
  title: "Post/WrapText",
  component: WrapText,
  tags: ["autodocs"],
  argTypes: {
    media: {
      control: "select",
      options: ["all", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof WrapText>;

export const Default: Story = {
  args: {
    media: "all",
    slots: {
      default:
        "<pre>const veryLongVariableNameThatWouldNormallyOverflow = 'this text should wrap instead of scrolling horizontally';</pre>",
    },
  },
};
