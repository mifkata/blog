# Helpers

Utility modules for data loading and transformation.

## Series Helper

📁 Path: `src/helpers/series.ts`
📦 Data: `src/data/series.json`

Loads blog series data and maps series items to their corresponding blog posts.

### Data Format

Each series entry contains:

- `slug` — unique identifier
- `title` — display name
- `description` — series overview text
- `heroImage` — optional cover image
- `trim` — optional prefix to strip from post titles
- `items` — ordered list of `post.id` values

### getSeriesWithPosts(slug)

- Looks up the series by slug in `series.json`
- Throws if not found
- Loads all blog posts via `getCollection("blog")`
- Maps each item to its post, building URL as `/blog/{post.id}/`
- Applies `trim` prefix removal to post titles
- Returns enriched series object preserving original item order

### Related Specs

- 🔗 `blog-post` — ArticleSeries uses this helper
- 🔗 `home-page` — FeaturedSeries uses this helper
