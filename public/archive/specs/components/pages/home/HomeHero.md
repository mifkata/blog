# HomeHero

`src/components/pages/home/HomeHero/HomeHero.astro` - Full-width hero section with background image.

## Props

- None (static content)

## Output

- `<section class="relative px-14 py-12 bg-cover bg-center bg-no-repeat -mx-6 -mt-12">` (negates PageLayout padding)
- Background: `home-hero-bg.png`, white overlay (30%)
- Content: `max-w-[960px]`, text `max-w-[720px]`
- Intro/name/subtitle/description
- Two Buttons: inverse→/blog, ghost→/about

## Visual

- Uses negative margins (-mx-6 -mt-12) to break out of PageLayout container and span full viewport width

## Dependencies

- Button
