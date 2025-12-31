# PageHeader

`src/components/pages/common/PageHeader/PageHeader.astro` - Page title section.
Props: `title` (string, required), `subtitle?` (string), `description?` (string), `class?` (string)
Output: `<div class="mb-12">` → `<h1>` + optional subtitle (`text-xl text-gray`) + optional description (`text-gray-dark`) + slot
