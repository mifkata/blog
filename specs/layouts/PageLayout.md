# PageLayout

`src/layouts/PageLayout.astro` - Base page layout wrapper.

## Props

- `title: string` (required)
- `description: string` (required)
- `image?: ImageMetadata`
- `size?: "default"|"wide"|"full"` (default: "default")
- `class?: string`

## Sizes

- Default: `max-w-[720px]`
- Wide: `max-w-[960px]`
- Full: none

## Output

- `<html lang="en">` -> BaseHead + Header + `<main class="w-full mx-auto px-6 py-12 {sizeClass}">` slot + Footer

## Page Sizes

- Home: full
- About/Resume/Services/Blog-Index/Blog-Year/Tags-Index/Tag: wide
- 404: default

## Dependencies

- BaseHead, Header, Footer

## Notes

- BlogPost layout is separate (has TOC, related posts, comments)
