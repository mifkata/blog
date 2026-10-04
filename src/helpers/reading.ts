/** Reading speed for technical prose, in words per minute. */
export const WORDS_PER_MINUTE = 230;

/** Minutes to read a post body. Code blocks, imports and markup don't count. */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^(import|export) .*$/gm, " ")
    .replace(/<[^>]+>/g, " ");
  const words = prose
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function firstParagraph(markdown?: string): string | undefined {
  return (
    markdown
      ?.trim()
      .split(/\n\s*\n/)[0]
      .trim() || undefined
  );
}
