#!/bin/bash
read -r CMD ARG

case "$CMD" in
  notify)
    terminal-notifier -title "Claude" -message "$ARG" -open "iterm2://session"
    ;;
  *)
    echo "DENIED"
    ;;
esac