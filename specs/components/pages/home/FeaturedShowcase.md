# FeaturedShowcase

`src/components/pages/home/FeaturedShowcase/FeaturedShowcase.astro` - Featured content cards grid.
Props: `latestPost?` (CollectionEntry<"blog">), `popularPost?` (CollectionEntry<"blog">)
Output: `<section class="max-w-[960px] mx-auto px-6 pb-12">` → header with title + hr line, 3-col grid (`md:grid-cols-3`), cards: Latest Post (optional), Popular Post (optional), About Me (always). Cards hover: border-accent + shadow-lg. Links: posts→`/blog/{id}/`, about→`/about`
Uses: FormattedDate
