import type { ImageOutputFormat } from "astro";

export const SITE_TITLE = "Mifkata.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/andriyan";
export const SITE_DESCRIPTION =
  "Andriyan Ivanov, Holistic Product Generalist. AI adoption and engineering.";
export const REPO_URL = "https://github.com/mifkata/blog";

/** For <Picture>: AVIF where the browser supports it, WebP otherwise */
export const PICTURE_FORMATS: {
  formats: ImageOutputFormat[];
  fallbackFormat: ImageOutputFormat;
} = { formats: ["avif"], fallbackFormat: "webp" };
