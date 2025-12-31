# RecentPosts

`src/components/pages/home/RecentPosts/RecentPosts.astro` - Recent posts list.
Props: `posts` (CollectionEntry<"blog">[], required)
Output: `<section class="max-w-[960px] mx-auto px-6">` → header with title + hr + "View all posts →" link, `<ul>` of posts (title + date), border-b separator (except last), hover: accent color. Links: posts→`/blog/{id}/`, all→`/blog`
Uses: FormattedDate
