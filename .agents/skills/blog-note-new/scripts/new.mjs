#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const USAGE =
  'usage: new.mjs --title "<title>" [--date YYYY-MM-DD] [--tag <tag>]… [--body-file <path|->] [--dry-run]';
const PLACEHOLDER_BODY = "TODO: write the note.";
const DEFAULT_ORIGIN = "http://localhost:4321";
const assets = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");

function fail(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fill(template, values) {
  return template.replace(/{{(\w+)}}/g, (_, key) => values[key]);
}

function devOrigin(root) {
  try {
    const status = execFileSync("pnpm", ["exec", "astro", "dev", "status"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 10000,
    });
    return /running at (http:\/\/[^\s]+)/.exec(status)?.[1] ?? DEFAULT_ORIGIN;
  } catch {
    return DEFAULT_ORIGIN;
  }
}

function isCalendarDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const parsed = new Date(`${day}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === day
  );
}

function readBody(source) {
  if (!source) return PLACEHOLDER_BODY;
  try {
    const text = readFileSync(source === "-" ? 0 : source, "utf8");
    return text.replace(/\n+$/, "") || PLACEHOLDER_BODY;
  } catch (error) {
    return fail(`cannot read body: ${error.message}`);
  }
}

function parse() {
  try {
    return parseArgs({
      options: {
        title: { type: "string" },
        date: { type: "string" },
        tag: { type: "string", multiple: true, default: [] },
        "body-file": { type: "string" },
        "dry-run": { type: "boolean", default: false },
      },
    }).values;
  } catch (error) {
    return fail(`${error.message}\n${USAGE}`, 2);
  }
}

const args = parse();
const title = args.title?.trim();
if (!title) fail(USAGE, 2);

const slug = slugify(title);
if (!slug) fail(`title gives no slug: ${title}`, 2);

const date = args.date ?? new Date().toISOString().slice(0, 10);
if (!isCalendarDay(date)) fail(`invalid date: ${date}`, 2);

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const id = `${date}-${slug}`;
const path = `src/content/notes/${id}.mdx`;

if (existsSync(join(root, path))) fail(`already exists: ${path}`);

const tags = [...new Set(args.tag)];
const dryRun = args["dry-run"];

if (!dryRun) {
  const content = fill(readFileSync(join(assets, "note.mdx"), "utf8"), {
    title: JSON.stringify(title),
    date,
    tags: `[${tags.join(", ")}]`,
    body: readBody(args["body-file"]),
  });
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content, { flag: "wx" });
}

const next = readFileSync(join(assets, "next-steps.md"), "utf8");

console.log(
  JSON.stringify(
    {
      action: dryRun ? "plan" : "created",
      title,
      date,
      tags,
      slug,
      path,
      url: `${devOrigin(root)}/notes/#${id}`,
      next: next.trim().split("\n"),
    },
    null,
    2,
  ),
);
