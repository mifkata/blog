#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const USAGE =
  'usage: new.mjs --title "<title>" --description "<description>" [--date <ISO date>] [--dry-run]';
const PLACEHOLDER = "src/assets/blog/placeholder.png";
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

function parse() {
  try {
    return parseArgs({
      options: {
        title: { type: "string" },
        description: { type: "string" },
        date: { type: "string" },
        "dry-run": { type: "boolean", default: false },
      },
    }).values;
  } catch (error) {
    return fail(`${error.message}\n${USAGE}`, 2);
  }
}

const args = parse();
const title = args.title?.trim();
const description = args.description?.trim();
if (!title || !description) fail(USAGE, 2);

const slug = slugify(title);
if (!slug) fail(`title gives no slug: ${title}`, 2);

const date = new Date(args.date ?? Date.now());
if (Number.isNaN(date.getTime())) fail(`invalid date: ${args.date}`, 2);

const iso = date.toISOString();
const year = iso.slice(0, 4);
const month = iso.slice(5, 7);
const day = iso.slice(8, 10);

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();
const path = `src/content/blog/${year}/${month}/${slug}.mdx`;

if (existsSync(join(root, path))) fail(`already exists: ${path}`);
if (!existsSync(join(root, PLACEHOLDER))) fail(`missing: ${PLACEHOLDER}`);

const values = { slug, year, monthDay: `${month}${day}` };
const dryRun = args["dry-run"];

if (!dryRun) {
  const content = fill(readFileSync(join(assets, "post.mdx"), "utf8"), {
    title: JSON.stringify(title),
    description: JSON.stringify(description),
    pubDate: `${iso.slice(0, 16)}:00Z`,
  });
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content, { flag: "wx" });
}

const next = fill(readFileSync(join(assets, "next-steps.md"), "utf8"), values);

console.log(
  JSON.stringify(
    {
      action: dryRun ? "plan" : "created",
      title,
      description,
      slug,
      path,
      url: `${devOrigin(root)}/blog/${year}/${month}/${slug}/`,
      next: next.trim().split("\n"),
    },
    null,
    2,
  ),
);
