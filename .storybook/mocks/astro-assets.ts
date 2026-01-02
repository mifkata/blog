// Mock for astro:assets in Storybook
export { default as Image } from "./Image.astro";
export const getImage = () => Promise.resolve({ src: "", attributes: {} });
