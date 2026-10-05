export type CalloutType = "note" | "warning" | "tip";
export type HighlightColor = "yellow" | "green" | "blue" | "pink";

// Posts colour-code their callouts: pink for warnings, green for tips
const BY_COLOR: Record<HighlightColor, CalloutType> = {
  yellow: "note",
  blue: "note",
  pink: "warning",
  green: "tip",
};

export function calloutType(
  type?: CalloutType,
  color: HighlightColor = "yellow",
): CalloutType {
  return type ?? BY_COLOR[color];
}
