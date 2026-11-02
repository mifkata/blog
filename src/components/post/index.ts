import ArticleSeries from "./ArticleSeries/ArticleSeries.astro";
import ClaudeCommand from "./ClaudeCommand/ClaudeCommand.astro";
import GithubLink from "./GithubLink/GithubLink.astro";
import Highlight from "./Highlight/Highlight.astro";
import { LabeledImage } from "./LabeledImage/LabeledImage";
import RedditEmbed from "./RedditEmbed/RedditEmbed.astro";
import WrapText from "./WrapText/WrapText.astro";

export { default as ArticleCard } from "./ArticleCard/ArticleCard.astro";
export { default as ArticleSeries } from "./ArticleSeries/ArticleSeries.astro";
export { default as ClaudeCommand } from "./ClaudeCommand/ClaudeCommand.astro";
export { default as Comments } from "./Comments/Comments.astro";
export { default as GithubLink } from "./GithubLink/GithubLink.astro";
export { default as Highlight } from "./Highlight/Highlight.astro";
export { LabeledImage } from "./LabeledImage/LabeledImage";
export { default as RedditEmbed } from "./RedditEmbed/RedditEmbed.astro";
export { default as WrapText } from "./WrapText/WrapText.astro";

export const embedComponents = {
  ArticleSeries,
  ClaudeCommand,
  GithubLink,
  Highlight,
  LabeledImage,
  RedditEmbed,
  WrapText,
};
