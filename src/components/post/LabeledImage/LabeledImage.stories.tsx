import type { Meta, StoryObj } from "@storybook/html";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LabeledImage } from "./LabeledImage";

interface LabeledImageArgs {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  children?: string;
}

// Track roots for cleanup to prevent memory leaks
const rootMap = new WeakMap<HTMLElement, Root>();

const meta: Meta<LabeledImageArgs> = {
  title: "Post/LabeledImage",
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    width: {
      control: "number",
      description: "Image width in pixels",
    },
    height: {
      control: "number",
      description: "Image height in pixels",
    },
    children: {
      control: "text",
      description: "Caption content (supports HTML)",
    },
  },
  render: (args, { canvasElement }) => {
    // Clean up previous root if re-rendering
    const existingRoot = rootMap.get(canvasElement);
    if (existingRoot) {
      existingRoot.unmount();
      rootMap.delete(canvasElement);
    }

    const container = document.createElement("div");
    const root = createRoot(container);
    rootMap.set(canvasElement, root);

    const { children, ...props } = args;
    root.render(
      createElement(
        LabeledImage,
        props,
        children
          ? createElement("span", {
              dangerouslySetInnerHTML: { __html: children },
            })
          : undefined,
      ),
    );
    return container;
  },
};

export default meta;
type Story = StoryObj<LabeledImageArgs>;

export const Default: Story = {
  args: {
    src: "https://picsum.photos/800/400",
    alt: "A sample image",
    width: 800,
    height: 400,
    children: "Figure 1: A beautiful landscape photograph",
  },
};

export const WithLink: Story = {
  args: {
    src: "https://picsum.photos/801/400",
    alt: "Screenshot of a website",
    width: 801,
    height: 400,
    children:
      'Screenshot from <a href="https://astro.build" class="text-accent">Astro.build</a>',
  },
};

export const NarrowWidth: Story = {
  args: {
    src: "https://picsum.photos/400/300",
    alt: "A smaller image",
    width: 400,
    height: 300,
    children: "A smaller, centered image",
  },
};

export const NoCaption: Story = {
  args: {
    src: "https://picsum.photos/600/400",
    alt: "Image without caption",
    width: 600,
    height: 400,
  },
};
