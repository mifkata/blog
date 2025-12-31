# HomeHero

`src/components/pages/home/HomeHero/HomeHero.astro` - Full-width hero section with background image.
Props: none (static content)
Output: `<section class="relative px-14 py-12 bg-cover bg-center bg-no-repeat -mx-6 -mt-12">` (negates PageLayout padding) with `home-hero-bg.png`, white overlay (30%), content `max-w-[960px]`, text `max-w-[720px]`, intro/name/subtitle/description, two Buttons (inverse→/blog, ghost→/about)
Uses: Button
Note: Uses negative margins (-mx-6 -mt-12) to break out of PageLayout container and span full viewport width
