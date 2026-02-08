# BaseHead

`src/components/layout/BaseHead/BaseHead.astro` - HTML head with meta tags and assets.

## Props

- `title: string` (required)
- `description: string` (required)
- `image?: ImageMetadata` (default: og-default.jpg)

## Includes

- global.css
- GoogleAnalytics
- Fonts (preload)
- Favicon
- Sitemap
- RSS

## Meta

- charset, viewport, generator, canonical URL

## SEO

- title, description
- Open Graph (og:*)
- Twitter Card (twitter:*)
