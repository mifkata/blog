# PostCard

`src/components/post/PostCard/PostCard.astro` - Compact blog post card (list item).

## Props

- `post: CollectionEntry<"blog">` (required)
- `class?: string`
- `showImage?: boolean` (default: true)
- `featured?: boolean` (default: false)

## Output

- `<li>` with link containing image + title + date

## Featured Mode

- Full width, larger text (text-4xl), centered on md+

## Visual

- `w-full md:w-[calc(50%-1rem)]`
- Hover -> shadow + accent color

## Dependencies

- FormattedDate
