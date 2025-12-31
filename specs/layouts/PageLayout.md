# PageLayout

`src/layouts/PageLayout.astro` - Base page layout wrapper.

Props: `title` (string, required), `description` (string, required), `image?` (ImageMetadata), `size?: "default"|"wide"|"full"` (default: "default"), `class?` (string)

Sizes: default=`max-w-[720px]`, wide=`max-w-[960px]`, full=none

Output: `<html lang="en">` → BaseHead + Header + `<main class="w-full mx-auto px-6 py-12 {sizeClass}">` slot + Footer

Uses: BaseHead, Header, Footer

Page sizes: Home=full, About/Resume/Services/Blog-Index/Blog-Year/Tags-Index/Tag=wide, 404=default

Note: BlogPost layout separate (has TOC, related posts, comments)
