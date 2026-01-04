import React from "react";
import { marked } from "marked";

interface Props {
  text?: string;
  className?: string;
}

export function Markdown({ text, className }: Props) {
  if (!text) return null;

  const html = marked.parse(text, { async: false }) as string;

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
