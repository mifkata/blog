# LabeledImage

`src/components/post/LabeledImage/LabeledImage.astro` - Image with caption and lightbox modal.

Props: `src: ImageMetadata` (required), `alt: string` (required), `width?: number` (default: 1280)

Output: `<figure>` with `<Image>` + `<figcaption>` + modal overlay

Behavior: click/Enter/Space on image→fullscreen modal, click backdrop/Escape→close

Visual: `rounded-lg cursor-zoom-in`, caption: `text-center text-sm text-gray italic`

Slot: caption content (supports links)

Accessibility: `role="button"`, `tabindex="0"`, `aria-label="{alt} - Click to enlarge"` on image; keyboard handler in `imageModal.ts`
