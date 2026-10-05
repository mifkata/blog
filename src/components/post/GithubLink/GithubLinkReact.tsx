import React, { useState, useEffect, useId, type ReactNode } from "react";
import { ExternalLinkIcon } from "@/components/ui/icons/ExternalLinkIcon";

interface Props {
  url: string;
  expanded?: boolean;
  maxHeight?: number;
  /** Star count, already formatted, for repository links */
  stars?: string;
  children?: ReactNode;
}

interface ParsedUrl {
  isValid: boolean;
  owner: string;
  repo: string;
  type?: "tree" | "blob";
  branch: string;
  path: string;
  displayName: string;
  rawUrl: string | null;
  isImage: boolean;
  isCode: boolean;
  hasPreview: boolean;
}

export function parseGithubUrl(url: string): ParsedUrl {
  const githubRegex =
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/(tree|blob)\/([^\/]+)\/(.+))?/;
  const match = url.match(githubRegex);

  const isValid = !!match;
  const owner = match?.[1] ?? "";
  const repo = match?.[2] ?? "";
  const type = match?.[3] as "tree" | "blob" | undefined;
  const branch = match?.[4] ?? "";
  const path = match?.[5] ?? "";

  const displayName = path ? `${owner}/${repo}/${path}` : `${owner}/${repo}`;

  const rawUrl =
    type === "blob"
      ? `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      : null;

  const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(path);
  const isCode =
    /\.(js|ts|jsx|tsx|css|html|json|md|mdx|yml|yaml|sh|py|rb|go|rs|java|c|cpp|h)$/i.test(
      path,
    );

  const isFile = type === "blob" && (isImage || isCode);
  const hasPreview = isFile;

  return {
    isValid,
    owner,
    repo,
    type,
    branch,
    path,
    displayName,
    rawUrl,
    isImage,
    isCode,
    hasPreview,
  };
}

// Line height in emgithub embed (approx)
const LINE_HEIGHT = 21;
const EMBED_PADDING = 60; // Header, footer, padding

// The terminal command that would show what the link points at
const COMMANDS = { blob: "cat", tree: "ls" } as const;

export default function GithubLink({
  url,
  expanded: initialExpanded = false,
  maxHeight,
  stars,
  children,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [iframeHeight, setIframeHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const parsed = parseGithubUrl(url);
  const previewId = useId();

  useEffect(() => {
    if (!isExpanded || !parsed.isCode || !parsed.rawUrl) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetch(parsed.rawUrl, { signal: controller.signal })
      .then((res) => res.text())
      .then((content) => {
        const lineCount = content.split("\n").length;
        const calculatedHeight = lineCount * LINE_HEIGHT + EMBED_PADDING;
        const finalHeight = maxHeight
          ? Math.min(calculatedHeight, maxHeight)
          : calculatedHeight;
        setIframeHeight(finalHeight);
      })
      .catch(() => {
        setIframeHeight(maxHeight || 400);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [isExpanded, parsed.isCode, parsed.rawUrl, maxHeight]);

  const embedUrl = `https://emgithub.com/iframe.html?target=${encodeURIComponent(url)}&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on`;

  const command = parsed.type ? COMMANDS[parsed.type] : "gh repo view";

  return (
    <div className="repo-card">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="repo-card-bar"
      >
        <span className="repo-card-command">
          <span className="repo-card-prompt">$ {command}</span>{" "}
          {parsed.displayName}
        </span>
        {stars && (
          <span className="repo-card-stars" title={`${stars} stars on GitHub`}>
            ★ {stars}
          </span>
        )}
        <span className="sr-only">(opens in new tab)</span>
      </a>

      {children && <div className="repo-card-body">{children}</div>}

      {!parsed.isValid && (
        <div className="repo-card-body text-amber-600">
          Could not parse the GitHub URL. Preview unavailable.
        </div>
      )}

      <div className="repo-card-foot">
        {parsed.hasPreview && (
          <button
            type="button"
            className="repo-card-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={previewId}
          >
            {isExpanded ? "Hide preview" : "Show preview"}
          </button>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-card-host"
        >
          github.com <ExternalLinkIcon size={11} />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>

      {parsed.hasPreview && isExpanded && (
        <div id={previewId} className="repo-card-preview">
          {parsed.isImage && parsed.rawUrl && (
            <img
              src={parsed.rawUrl}
              alt={parsed.path}
              className="max-w-full rounded-lg border border-gray-light"
              loading="lazy"
            />
          )}

          {parsed.isCode && (
            <>
              {isLoading && (
                <div className="text-gray text-sm py-2">Loading...</div>
              )}
              <iframe
                src={embedUrl}
                className="w-full border-0 rounded-lg"
                style={{
                  height: `${iframeHeight}px`,
                  maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                  overflowY: maxHeight ? "auto" : undefined,
                }}
                loading="lazy"
                title={`Code preview: ${parsed.path}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
