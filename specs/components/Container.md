# Container

`src/components/Container/Container.astro` - Centered content wrapper.

Props: `size?: "default"|"wide"` (default: "default"), `class?: string`, `...HTMLAttributes<"main">`

Output: `<main class="mx-auto px-4 py-12 {maxWidth}">`

Sizes: default=`max-w-[720px]`, wide=`max-w-[960px]`

Slot: page content
