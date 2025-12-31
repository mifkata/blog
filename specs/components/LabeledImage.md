# LabeledImage

`src/components/LabeledImage/LabeledImage.astro` - Image with caption and lightbox modal.

Props: `src: ImageMetadata` (required), `alt: string` (required), `width?: number` (default: 1280)

Output: `<figure>` with `<Image>` + `<figcaption>` + modal overlay

Behavior: click image→fullscreen modal, click backdrop/Escape→close

Visual: `rounded-lg cursor-zoom-in`, caption: `text-center text-sm text-gray italic`

Slot: caption content (supports links)
