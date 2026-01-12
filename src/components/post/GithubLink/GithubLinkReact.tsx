import React, { useState, useEffect, type ReactNode } from "react";

interface Props {
  url: string;
  expanded?: boolean;
  maxHeight?: number;
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

function parseGithubUrl(url: string): ParsedUrl {
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

export default function GithubLink({
  url,
  expanded: initialExpanded = false,
  maxHeight,
  children,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [iframeHeight, setIframeHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const parsed = parseGithubUrl(url);

  // Fetch file to count lines and calculate height
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
        // On error, use default height
        setIframeHeight(maxHeight || 400);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [isExpanded, parsed.isCode, parsed.rawUrl, maxHeight]);

  const embedUrl = `https://emgithub.com/iframe.html?target=${encodeURIComponent(url)}&style=default&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on`;

  return (
    <div className="border border-gray-light rounded-lg p-4 my-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-5 h-5 text-gray-dark"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-gray-dark hover:text-accent no-underline flex items-center gap-1 break-all"
        >
          {parsed.displayName}
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>

      {/* Description */}
      {children && <div className="text-gray text-sm">{children}</div>}

      {/* Invalid URL Warning */}
      {!parsed.isValid && (
        <div className="text-amber-600 text-sm bg-amber-50 rounded p-2">
          ⚠️ Could not parse GitHub URL. Preview unavailable.
        </div>
      )}

      {/* Preview Toggle & Content */}
      {parsed.hasPreview && (
        <div>
          <button
            type="button"
            className="text-sm text-accent hover:text-accent-dark cursor-pointer bg-transparent border-0 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="github-link-preview"
          >
            {isExpanded ? "▼ Hide preview" : "▶ Show preview"}
          </button>

          {isExpanded && (
            <div id="github-link-preview" className="mt-3">
              {/* Image preview */}
              {parsed.isImage && parsed.rawUrl && (
                <img
                  src={parsed.rawUrl}
                  alt={parsed.path}
                  className="max-w-full rounded-lg border border-gray-light"
                  loading="lazy"
                />
              )}

              {/* Code preview */}
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
      )}
    </div>
  );
}
