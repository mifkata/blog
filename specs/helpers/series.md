# series

`src/helpers/series.ts` - Helper for loading and mapping blog series data.

## Data

`src/data/series.json`:

```json
[
  {
    "slug": "series-slug",
    "title": "Series Title",
    "description": "Series description text",
    "heroImage": "",
    "trim": "Prefix to remove: ",
    "items": ["2025/post-slug", "2026/01/another-post"]
  }
]
```

- `items`: array of `post.id` values (path without `/blog/` prefix or trailing `/`)
- `trim`: optional prefix to remove from post titles

## Functions

### `getSeriesWithPosts(slug: string)`

1. Find series by slug from `series.json`
2. Throw if not found
3. Load all blog posts via `getCollection("blog")`
4. Map `series.items` to posts, preserving order:
   - Match by `post.id`
   - Build `url` as `/blog/${post.id}/`
   - Build `title` from `post.data.title`, removing `series.trim` prefix
5. Return series object with enriched `items` array
