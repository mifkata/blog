import type { Meta, StoryObj } from "@storybook/html";

interface PostCardProps {
  title: string;
  date: string;
  showImage: boolean;
  featured: boolean;
  imageUrl?: string;
}

const createPostCard = (args: PostCardProps): string => {
  const imageHtml =
    args.showImage && args.imageUrl
      ? `<img src="${args.imageUrl}" alt="" style="margin-bottom: 0.5rem; border-radius: 0.75rem; ${args.featured ? "width: 100%;" : ""}" />`
      : "";

  const width = args.featured ? "100%" : "calc(50% - 0.5rem)";
  const titleSize = args.featured ? "2.25rem" : "1rem";

  return `
    <li style="width: ${width}; list-style: none; ${args.featured ? "text-align: center;" : ""}">
      <a href="/blog/example/" style="display: block; text-decoration: none;">
        ${imageHtml}
        <h4 style="margin: 0; color: black; font-size: ${titleSize}; line-height: 1;">
          ${args.title}
        </h4>
        <p style="margin: 0; color: #6b7280;">
          ${args.date}
        </p>
      </a>
    </li>
  `;
};

const meta: Meta<PostCardProps> = {
  title: "Components/PostCard",
  render: (args) => createPostCard(args),
  argTypes: {
    title: { control: "text" },
    date: { control: "text" },
    showImage: { control: "boolean" },
    featured: { control: "boolean" },
    imageUrl: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<PostCardProps>;

export const Default: Story = {
  args: {
    title: "Getting Started with Astro",
    date: "Dec 30, 2025",
    showImage: true,
    featured: false,
    imageUrl: "https://picsum.photos/720/360",
  },
};

export const Featured: Story = {
  args: {
    title: "Featured: Building Modern Web Apps",
    date: "Dec 30, 2025",
    showImage: true,
    featured: true,
    imageUrl: "https://picsum.photos/721/360",
  },
};

export const WithoutImage: Story = {
  args: {
    title: "Text Only Post",
    date: "Dec 25, 2025",
    showImage: false,
    featured: false,
  },
};

export const Grid: Story = {
  render: () => `
    <ul style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 0; margin: 0;">
      ${createPostCard({
        title: "First Post",
        date: "Dec 30, 2025",
        showImage: true,
        featured: false,
        imageUrl: "https://picsum.photos/722/360",
      })}
      ${createPostCard({
        title: "Second Post",
        date: "Dec 28, 2025",
        showImage: true,
        featured: false,
        imageUrl: "https://picsum.photos/723/360",
      })}
      ${createPostCard({
        title: "Third Post",
        date: "Dec 26, 2025",
        showImage: true,
        featured: false,
        imageUrl: "https://picsum.photos/724/360",
      })}
      ${createPostCard({
        title: "Fourth Post",
        date: "Dec 24, 2025",
        showImage: true,
        featured: false,
        imageUrl: "https://picsum.photos/725/360",
      })}
    </ul>
  `,
};
