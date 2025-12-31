# Button

`src/components/ui/Button/Button.astro` - Clickable action element.

Props: `href?: string` (→`<a>`), `variant?: "normal"|"inverse"|"ghost"` (default: normal), `class?: string`

Variants: normal=light gradient+brown text, inverse=orange gradient+light text, ghost=transparent+border

Visual: `inline-flex gap-2 px-4 py-2 rounded`, hover: lift -0.5 + shadow, transition 200ms

Slot: button content (text/icons)
