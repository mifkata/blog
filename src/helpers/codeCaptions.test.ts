import { describe, it, expect } from "vitest";
import { captionCodeBlocks, type HastNode } from "./codeCaptions";

const text = (value: string): HastNode => ({ type: "text", value });
const el = (tagName: string, children: HastNode[] = []): HastNode => ({
  type: "element",
  tagName,
  properties: {},
  children,
});
const quote = (...inline: HastNode[]) => el("blockquote", [el("p", inline)]);
const pre = () => el("pre", [el("code", [text("FROM node:22")])]);
const root = (...children: HastNode[]): HastNode => ({
  type: "root",
  children,
});

describe("captionCodeBlocks", () => {
  it("should turn a quote above code into the code's title", () => {
    const tree = root(
      quote(el("code", [text(".devcontainer/Dockerfile")])),
      text("\n"),
      pre(),
    );
    captionCodeBlocks(tree);
    expect(tree.children).toHaveLength(1);
    expect(tree.children![0].properties).toEqual({
      dataTitle: ".devcontainer/Dockerfile",
    });
  });

  it("should keep the text of a longer caption", () => {
    const tree = root(
      quote(
        text("This requires me to add some ugliness to "),
        el("code", [text(".gitignore")]),
        text(", but it's manageable"),
      ),
      pre(),
    );
    captionCodeBlocks(tree);
    expect(tree.children![0].properties?.dataTitle).toBe(
      "This requires me to add some ugliness to .gitignore, but it's manageable",
    );
  });

  it("should make a lone file name a label", () => {
    const fileName = el("code", [text("specs/Testing.md")]);
    const card: HastNode = { type: "mdxJsxFlowElement" };
    const tree = root(quote(fileName), text("\n"), card);
    captionCodeBlocks(tree);
    expect(tree.children![0]).toEqual({
      type: "element",
      tagName: "p",
      properties: { className: ["file-label"] },
      children: [fileName],
    });
    expect(tree.children![2]).toBe(card);
  });

  it("should leave real quotes alone, nested ones included", () => {
    const shipIt = quote(text("Ship the blog today."));
    const callout = el("div", [quote(text("Skills are for agents."))]);
    const tree = root(shipIt, el("p", [text("And then…")]), callout);
    captionCodeBlocks(tree);
    expect(tree.children![0]).toBe(shipIt);
    expect(callout.children![0].tagName).toBe("blockquote");
  });
});
