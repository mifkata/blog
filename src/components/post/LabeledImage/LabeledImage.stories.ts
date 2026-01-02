import type { Meta, StoryObj } from "storybook-astro";
import LabeledImage from "./LabeledImage.astro";
import { setupImageModals } from "./imageModal";

// Mock ImageMetadata - the mock Image component handles this
const createMockImage = (url: string, width: number, height: number) => ({
  src: url,
  width,
  height,
  format: "png" as const,
});

const meta: Meta<typeof LabeledImage> = {
  title: "Post/LabeledImage",
  component: LabeledImage,
  tags: ["autodocs"],
  argTypes: {
    alt: { control: "text" },
    width: { control: "number" },
  },
  decorators: [
    (storyFn) => {
      const result = storyFn();
      setTimeout(setupImageModals, 0);
      return result;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LabeledImage>;

export const Default: Story = {
  args: {
    src: createMockImage("https://picsum.photos/800/400", 800, 400),
    alt: "A sample image",
    slots: { default: "Figure 1: A beautiful landscape photograph" },
  },
};

export const WithLink: Story = {
  args: {
    src: createMockImage("https://picsum.photos/801/400", 801, 400),
    alt: "Screenshot of a website",
    slots: {
      default:
        'Screenshot from <a href="https://astro.build" class="text-accent">Astro.build</a>',
    },
  },
};

export const NarrowWidth: Story = {
  args: {
    src: createMockImage("https://picsum.photos/400/300", 400, 300),
    alt: "A smaller image",
    width: 400,
    slots: { default: "A smaller, centered image" },
  },
};
