import React from "react";
import { marked } from "marked";

interface Props {
  text?: string;
  className?: string;
}

export function Markdown({ text, className }: Props) {
  if (!text) return null;

  const html = marked.parse(text, { async: false }) as string;

  // Links are underlined, not told apart from the text by colour alone
  const linkCue = "[&_a]:underline [&_a]:underline-offset-2";

  return (
    <div
      className={className ? `${linkCue} ${className}` : linkCue}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
