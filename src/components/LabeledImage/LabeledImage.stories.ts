import type { Meta, StoryObj } from "@storybook/html";

interface LabeledImageProps {
  src: string;
  alt: string;
  caption: string;
  width: number;
}

const createLabeledImage = (args: LabeledImageProps): string => {
  return `
    <figure style="margin: 1.5rem 0; padding: 0;">
      <img
        src="${args.src}"
        alt="${args.alt}"
        width="${args.width}"
        style="display: block; margin: 0 auto; border-radius: 0.5rem; cursor: zoom-in;"
      />
      <figcaption style="text-align: center; font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;">
        ${args.caption}
      </figcaption>
    </figure>
  `;
};

const meta: Meta<LabeledImageProps> = {
  title: "Components/LabeledImage",
  render: (args) => createLabeledImage(args),
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    caption: { control: "text" },
    width: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<LabeledImageProps>;

export const Default: Story = {
  args: {
    src: "https://picsum.photos/800/400",
    alt: "A sample image",
    caption: "Figure 1: A beautiful landscape photograph",
    width: 800,
  },
};

export const WithLink: Story = {
  args: {
    src: "https://picsum.photos/801/400",
    alt: "Screenshot of a website",
    caption:
      'Screenshot from <a href="https://astro.build" style="color: #f97316;">Astro.build</a>',
    width: 800,
  },
};

export const NarrowWidth: Story = {
  args: {
    src: "https://picsum.photos/400/300",
    alt: "A smaller image",
    caption: "A smaller, centered image",
    width: 400,
  },
};

export const MultipleImages: Story = {
  render: () => `
    <div>
      ${createLabeledImage({
        src: "https://picsum.photos/802/400",
        alt: "First image",
        caption: "Figure 1: Before the change",
        width: 600,
      })}
      ${createLabeledImage({
        src: "https://picsum.photos/803/400",
        alt: "Second image",
        caption: "Figure 2: After the change",
        width: 600,
      })}
    </div>
  `,
};
