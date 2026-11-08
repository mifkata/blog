import React from "react";
import { renderMarkdown } from "@/helpers/markdown/markdown";

interface Props {
  text?: string;
  className?: string;
}

export function Markdown({ text, className }: Props) {
  if (!text) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}
