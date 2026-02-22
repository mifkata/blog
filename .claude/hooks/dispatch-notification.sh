#!/bin/sh
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
BRANCH_LAST="${BRANCH##*/}"

if git remote get-url origin >/dev/null 2>&1; then
  origin_url="$(git remote get-url origin)"
  REPO_NAME="$(
    printf '%s\n' "$origin_url" \
    | sed -E 's#^[^:]+:##; s#^.*/##; s#\.git$##'
  )"
else
  root="$(cd "$(git rev-parse --git-common-dir)/.." && pwd)"
  REPO_NAME="$(basename "$root")"
fi

TITLE="$REPO_NAME/$BRANCH_LAST"

printf 'notify\t%s\t%s\t%s\n' "$TITLE" "$1" "$ITERM_SESSION_ID" | \
    nc host.docker.internal 4545
