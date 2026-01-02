import type { Meta, StoryObj } from "storybook-astro";
import ArticleCard from "./ArticleCard.astro";

// Mock ImageMetadata for heroImage
const createMockImage = (id: number) => ({
  src: `https://picsum.photos/seed/${id}/200/120`,
  width: 200,
  height: 120,
  format: "jpg" as const,
});

// Mock post data that satisfies CollectionEntry<"blog"> structure
const createMockPost = (overrides: {
  id?: string;
  title?: string;
  synopsis?: string;
  pubDate?: string;
  tags?: string[];
  heroImage?: ReturnType<typeof createMockImage>;
}) => ({
  id: overrides.id ?? "example-post",
  data: {
    title: overrides.title ?? "Example Post",
    synopsis: overrides.synopsis,
    description: overrides.synopsis ?? "Example description",
    pubDate: overrides.pubDate ?? "2025-12-30",
    tags: overrides.tags ?? ["example"],
    heroImage: overrides.heroImage,
  },
});

const meta: Meta<typeof ArticleCard> = {
  title: "Post/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  argTypes: {
    showTags: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    post: createMockPost({
      title: "Getting Started with Astro",
      synopsis:
        "Learn how to build fast, content-focused websites with Astro framework.",
      tags: ["astro", "web"],
      heroImage: createMockImage(1),
    }),
    showTags: true,
  },
};

export const WithoutTags: Story = {
  args: {
    post: createMockPost({
      title: "Understanding TypeScript Generics",
      synopsis:
        "A deep dive into TypeScript generics and how to use them effectively.",
      tags: ["typescript"],
      heroImage: createMockImage(2),
    }),
    showTags: false,
  },
};

export const LongSynopsis: Story = {
  args: {
    post: createMockPost({
      title: "Building Scalable Systems",
      synopsis:
        "This is a very long synopsis that should be truncated after two lines. It contains a lot of text that explains the article in great detail but should not overflow the card layout.",
      tags: ["architecture", "scalability", "backend"],
      heroImage: createMockImage(3),
    }),
    showTags: true,
  },
};

export const WithoutHeroImage: Story = {
  args: {
    post: createMockPost({
      title: "Text Only Article",
      synopsis: "An article without a hero image.",
      tags: ["minimal"],
    }),
    showTags: true,
  },
};
