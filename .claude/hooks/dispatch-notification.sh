#!/bin/sh
REPO_ROOT="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

TITLE="$REPO_NAME/$BRANCH"

printf 'notify\t%s\t%s\t%s\n' "$TITLE" "$1" "$ITERM_SESSION_ID" | \
    nc host.docker.internal 4545
