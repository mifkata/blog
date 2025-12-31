# HeaderLink

`src/components/layout/HeaderLink/HeaderLink.astro` - Navigation link with active state detection.

Props: `href: string`, `number?: string`, `class?: string`, `...HTMLAttributes<"a">`

Active: matches current pathname or first path segment → `text-accent font-medium`

Visual: `inline-flex items-center gap-1 text-gray-dark`, hover: `text-accent`

Number: renders as `<span class="text-sm text-gray">{number}.</span>` prefix

Slot: link text
