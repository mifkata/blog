#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
usage: tools/repo/toolchain.sh [set <tool> <version>]
Checks every Dockerfile at the git root against the root mise pins:
FROM node:<v>, FROM python:<v>, ARG OTP_VERSION (erlang), ARG ELIXIR_VERSION (elixir as <v>-otp-<OTP major>).
set <tool> <version> moves the root pin and the matching Dockerfile lines.
Exit 1 on a mismatch, an unpinned image tool or a failed set.
EOF
  exit 2
}

mode="check"
if [ $# -gt 0 ]; then
  [ $# -eq 3 ] && [ "$1" = set ] || usage
  mode="set"
  tool=$2
  version=$3
  case $tool in node | python | erlang | elixir) ;; *) usage ;; esac
fi

self=$(cd "$(dirname "$0")" && pwd)/$(basename "$0")
root=$(git rev-parse --show-toplevel)
cd "$root"
[ -f mise.toml ] || {
  echo "toolchain: no mise.toml at $root" >&2
  exit 1
}

dockerfiles() {
  find . -maxdepth 1 -type f -name 'Dockerfile*' ! -name '*.dockerignore' | sort
}

pin() {
  yq -p toml -o tsv "(.tools // {}).\"$1\" // \"\"" mise.toml
}

image_version() {
  sed -n -E "s/^FROM[[:space:]]+(--[^[:space:]]+[[:space:]]+)*$2:([^-@:[:space:]]+).*/\\2/p" "$1" | sort -u
}

arg_value() {
  sed -n -E "s/^ARG[[:space:]]+$2=\"?([^\"[:space:]]+)\"?.*/\\1/p" "$1" | head -n 1
}

failed=0
report() {
  echo "$1"
  case $1 in ok*) ;; *) failed=1 ;; esac
}

compare() {
  local file=$1 name=$2 found=$3 expected
  expected=$(pin "$name")
  if [ -z "$expected" ]; then
    report "unpinned  $file: $name $found has no mise pin"
  elif [ "$found" = "$expected" ]; then
    report "ok        $file: $name $found"
  else
    report "mismatch  $file: $name $found, pin $expected"
  fi
}

check_file() {
  local file=$1 found otp elixir
  for name in node python; do
    for found in $(image_version "$file" "$name"); do compare "$file" "$name" "$found"; done
  done
  otp=$(arg_value "$file" OTP_VERSION)
  elixir=$(arg_value "$file" ELIXIR_VERSION)
  if [ -n "$otp" ]; then compare "$file" erlang "$otp"; fi
  if [ -n "$elixir" ]; then compare "$file" elixir "$elixir-otp-${otp%%.*}"; fi
}

replace() {
  local file=$1 expression=$2 tmp
  tmp=$(mktemp)
  sed -E "$expression" "$file" >"$tmp"
  if cmp -s "$file" "$tmp"; then
    rm -f "$tmp"
  else
    cat "$tmp" >"$file"
    rm -f "$tmp"
    echo "updated   $file"
  fi
}

set_root_pin() {
  local tmp
  if [ "$(yq -p toml -o tsv "(.tools // {}) | has(\"$tool\")" mise.toml)" != true ]; then
    echo "toolchain: $tool is not pinned in mise.toml" >&2
    exit 1
  fi
  tmp=$(mktemp)
  awk -v tool="$tool" -v version="$version" '
    /^\[/ { section = $0 }
    section == "[tools]" && ($1 == tool || $1 == "\"" tool "\"") && $2 == "=" { sub(/=.*/, "= \"" version "\"") }
    { print }
  ' mise.toml >"$tmp"
  if cmp -s mise.toml "$tmp"; then rm -f "$tmp"; else
    cat "$tmp" >mise.toml
    rm -f "$tmp"
    echo "updated   mise.toml"
  fi
}

validate_file() {
  local file=$1 otp
  [ "$tool" = elixir ] && [ -n "$(arg_value "$file" ELIXIR_VERSION)" ] || return 0
  otp=$(arg_value "$file" OTP_VERSION)
  if [ "${version##*-otp-}" != "${otp%%.*}" ]; then
    echo "toolchain: $file: elixir $version needs OTP ${version##*-otp-}, the image has $otp; move erlang first" >&2
    exit 1
  fi
}

set_file() {
  local file=$1
  case $tool in
    node | python)
      replace "$file" "s/^(FROM[[:space:]]+(--[^[:space:]]+[[:space:]]+)*$tool:)[^-@:[:space:]]+/\\1$version/"
      ;;
    erlang)
      replace "$file" "s/^(ARG[[:space:]]+OTP_VERSION=\"?)[^\"[:space:]]+/\\1$version/"
      ;;
    elixir)
      replace "$file" "s/^(ARG[[:space:]]+ELIXIR_VERSION=\"?)[^\"[:space:]]+/\\1${version%-otp-*}/"
      ;;
  esac
}

each_file() {
  local file
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    file=${file#./}
    case $1 in
      check) check_file "$file" ;;
      validate) validate_file "$file" ;;
      set) set_file "$file" ;;
    esac
  done <<EOF
$(dockerfiles)
EOF
}

if [ "$mode" = set ]; then
  each_file validate
  set_root_pin
  each_file set
  exec "$self"
fi
each_file check
exit "$failed"
