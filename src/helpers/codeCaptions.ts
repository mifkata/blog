/** The bits of a HAST node this plugin reads. */
export interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const isElement = (node: HastNode | undefined, tagName: string) =>
  node?.type === "element" && node.tagName === tagName;

const isBlank = (node: HastNode) => node.type === "text" && !node.value?.trim();

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/** A quote holding nothing but one piece of inline code, like a file name. */
function soleCode(quote: HastNode): HastNode | undefined {
  const blocks = (quote.children ?? []).filter((child) => !isBlank(child));
  if (blocks.length !== 1 || !isElement(blocks[0], "p")) return undefined;
  const inline = (blocks[0].children ?? []).filter((child) => !isBlank(child));
  return inline.length === 1 && isElement(inline[0], "code")
    ? inline[0]
    : undefined;
}

/**
 * Posts label code with a quote right above it (`> \`.devcontainer/Dockerfile\``).
 * Such a quote becomes the code block's title; one that's only a file name,
 * with no code under it, becomes a small label. Real quotes stay quotes.
 */
export function captionCodeBlocks(node: HastNode): void {
  const children = node.children;
  if (!children) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!isElement(child, "blockquote")) {
      captionCodeBlocks(child);
      continue;
    }
    let next = i + 1;
    while (next < children.length && isBlank(children[next])) next++;
    const code = children[next];
    if (isElement(code, "pre")) {
      code.properties = {
        ...code.properties,
        dataTitle: textOf(child).replace(/\s+/g, " ").trim(),
      };
      children.splice(i, next - i);
      i--;
      continue;
    }
    const fileName = soleCode(child);
    if (fileName) {
      children[i] = {
        type: "element",
        tagName: "p",
        properties: { className: ["file-label"] },
        children: [fileName],
      };
      continue;
    }
    captionCodeBlocks(child);
  }
}

export function rehypeCodeCaptions() {
  return (tree: HastNode) => captionCodeBlocks(tree);
}
