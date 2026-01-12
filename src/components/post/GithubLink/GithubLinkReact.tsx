import React, { useState, useEffect, useId, type ReactNode } from "react";
import { GitHubIcon } from "@/components/ui/icons/GitHubIcon";
import { ExternalLinkIcon } from "@/components/ui/icons/ExternalLinkIcon";

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
  const previewId = useId();

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
        <GitHubIcon size={20} className="text-gray-dark" />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-gray-dark hover:text-accent no-underline flex items-center gap-1 break-all"
        >
          {parsed.displayName}
          <ExternalLinkIcon size={12} />
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
            aria-controls={previewId}
          >
            {isExpanded ? "▼ Hide preview" : "▶ Show preview"}
          </button>

          {isExpanded && (
            <div id={previewId} className="mt-3">
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
