# LabeledImage

`src/components/post/LabeledImage/LabeledImage.tsx` - React image with caption and lightbox modal.

## Props

```tsx
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  children?: ReactNode; // caption content
}
```

## Output

`<figure>` with `<img>` + `<figcaption>` + modal overlay (React portal)

## Behavior

- Click/Enter/Space on image → fullscreen modal
- Click backdrop/Escape → close modal
- Body scroll locked when modal open
- Uses React state for modal visibility (no external script)

## Visual

- Image: `rounded-lg cursor-zoom-in`, centered
- Caption: `text-center text-sm text-gray italic`, supports links via children
- Modal: fixed fullscreen, `bg-black/90` backdrop, image `max-w-full max-h-full object-contain`

## Accessibility

- Image: `role="button"`, `tabindex={0}`, `aria-label="{alt} - Click to enlarge"`
- Modal: `aria-hidden` when closed, focus trap when open
- Keyboard: Enter/Space to open, Escape to close
