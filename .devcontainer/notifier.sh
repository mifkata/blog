#!/bin/bash
IFS=$'\t' read -r CMD GROUP MESSAGE SID || exit 1

case "$CMD" in
  notify)
    terminal-notifier \
      -title "$GROUP" \
      -message "$MESSAGE" \
      -group "$GROUP" \
      -remove "$GROUP" \
      -open "itermfocus://session?sessionId=$SID"
    ;;
  *)
    echo "DENIED"
    ;;
esac