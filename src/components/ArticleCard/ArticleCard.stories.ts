import type { Meta, StoryObj } from "@storybook/html";

interface ArticleCardProps {
  title: string;
  synopsis: string;
  date: string;
  tags: string[];
  showTags: boolean;
  imageUrl?: string;
}

const createArticleCard = (args: ArticleCardProps): string => {
  const tagsHtml =
    args.showTags && args.tags.length > 0
      ? `<div style="display: flex; gap: 0.5rem;">
        ${args.tags.map((tag) => `<a href="/tags/${tag}/" style="padding: 0.25rem 0.5rem; background: #e5e7eb; border-radius: 0.25rem; color: #374151; font-size: 0.75rem; text-decoration: none;">${tag}</a>`).join("")}
      </div>`
      : "";

  const imageHtml = args.imageUrl
    ? `<a href="/blog/example/">
        <img src="${args.imageUrl}" alt="" style="border-radius: 0.5rem; width: 200px; height: 120px; object-fit: cover;" />
      </a>`
    : "";

  return `
    <article style="display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem;">
      ${imageHtml}
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <a href="/blog/example/" style="text-decoration: none;">
          <h4 style="font-size: 1.25rem; margin: 0 0 0.5rem; color: black;">${args.title}</h4>
        </a>
        <p style="color: #6b7280; margin: 0 0 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${args.synopsis}
        </p>
        <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.875rem; color: #6b7280;">
          <time>${args.date}</time>
          ${tagsHtml}
        </div>
      </div>
    </article>
  `;
};

const meta: Meta<ArticleCardProps> = {
  title: "Components/ArticleCard",
  render: (args) => createArticleCard(args),
  argTypes: {
    title: { control: "text" },
    synopsis: { control: "text" },
    date: { control: "text" },
    tags: { control: "object" },
    showTags: { control: "boolean" },
    imageUrl: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<ArticleCardProps>;

export const Default: Story = {
  args: {
    title: "Getting Started with Astro",
    synopsis:
      "Learn how to build fast, content-focused websites with Astro framework.",
    date: "Dec 30, 2025",
    tags: ["astro", "web"],
    showTags: true,
    imageUrl: "https://picsum.photos/400/240",
  },
};

export const WithoutTags: Story = {
  args: {
    title: "Understanding TypeScript Generics",
    synopsis:
      "A deep dive into TypeScript generics and how to use them effectively.",
    date: "Dec 25, 2025",
    tags: ["typescript"],
    showTags: false,
    imageUrl: "https://picsum.photos/401/240",
  },
};

export const LongSynopsis: Story = {
  args: {
    title: "Building Scalable Systems",
    synopsis:
      "This is a very long synopsis that should be truncated after two lines. It contains a lot of text that explains the article in great detail but should not overflow the card layout.",
    date: "Dec 20, 2025",
    tags: ["architecture", "scalability", "backend"],
    showTags: true,
    imageUrl: "https://picsum.photos/402/240",
  },
};

export const MultipleCards: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      ${createArticleCard({
        title: "First Post",
        synopsis: "Introduction to the blog.",
        date: "Dec 30, 2025",
        tags: ["intro"],
        showTags: true,
        imageUrl: "https://picsum.photos/403/240",
      })}
      ${createArticleCard({
        title: "Second Post",
        synopsis: "More content for readers.",
        date: "Dec 28, 2025",
        tags: ["tutorial"],
        showTags: true,
        imageUrl: "https://picsum.photos/404/240",
      })}
    </div>
  `,
};
