# PostsList

`src/components/pages/blog/PostsList/PostsList.astro` - Blog posts list section.

## Props

- `posts: CollectionEntry<"blog">[]` (required)
- `title?: string` (default: "All Posts")
- `showHeader?: boolean` (default: true)

## Output

- `<section>` → optional header (h3 uppercase + hr line) + ArticleCard list

## Dependencies

- ArticleCard
