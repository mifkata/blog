import CodeBlock from "./CodeBlock.astro";
import H2 from "./H2.astro";
import H3 from "./H3.astro";
import H4 from "./H4.astro";
import Link from "./Link.astro";
import OrderedList from "./OrderedList.astro";
import Quote from "./Quote.astro";
import UnorderedList from "./UnorderedList.astro";

export { default as Callout } from "./Callout.astro";
export { default as Prose } from "./Prose.astro";

/** Markdown elements and the components that render them in posts. */
export const proseComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  a: Link,
  ul: UnorderedList,
  ol: OrderedList,
  blockquote: Quote,
  pre: CodeBlock,
};
