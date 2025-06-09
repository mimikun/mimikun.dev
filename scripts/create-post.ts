#!/usr/bin/env -S deno run --allow-read --allow-write

import { parseArgs } from "jsr:@std/cli@^1.0.0/parse-args";
import { join, dirname, fromFileUrl } from "jsr:@std/path@^1.0.0";
import { exists } from "jsr:@std/fs@^1.0.0";

// Inline slugify function (same as lodash.kebabcase logic)
const slugifyStr = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Default author
const DEFAULT_AUTHOR = "mimikun";

const __filename = fromFileUrl(import.meta.url);
const __dirname = dirname(__filename);

// Simple prompt function
async function prompt(message: string, defaultValue?: string): Promise<string> {
  console.log(message);
  if (defaultValue) {
    console.log(`(default: ${defaultValue})`);
  }
  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf);
  const answer = new TextDecoder().decode(buf.subarray(0, n!)).trim();
  return answer || defaultValue || "";
}

// Simple confirm function
async function confirm(message: string, defaultValue = false): Promise<boolean> {
  const answer = await prompt(`${message} (y/N)`, defaultValue ? "y" : "n");
  return answer.toLowerCase() === "y";
}

// Parse command line arguments
const args = parseArgs(Deno.args, {
  string: ["title", "t", "slug", "s", "description", "d", "tags", "author", "a"],
  boolean: ["draft", "featured", "help", "h"],
  default: {
    tags: "others",
    author: DEFAULT_AUTHOR,
    draft: false,
    featured: false,
  },
  alias: {
    t: "title",
    s: "slug",
    d: "description",
    a: "author",
    h: "help",
  },
});

// Show help
if (args.help) {
  console.log(`
create-post - Create a new blog post for Astro site

Usage:
  deno run --allow-read --allow-write scripts/create-post.ts [options]

Options:
  -t, --title <title>          Post title
  -s, --slug <slug>            Post slug (filename)
  -d, --description <desc>     Post description
  --tags <tags>                Comma-separated tags (default: "others")
  -a, --author <author>        Post author (default: "${DEFAULT_AUTHOR}")
  --draft                      Create as draft
  --featured                   Create as featured post
  -h, --help                   Show this help message
`);
  Deno.exit(0);
}

// Get required fields
const title = args.title || await prompt("Post title:");
if (!title.trim()) {
  console.error("Error: Title is required");
  Deno.exit(1);
}

const description = args.description || await prompt("Post description:");
if (!description.trim()) {
  console.error("Error: Description is required");
  Deno.exit(1);
}

// Get optional fields
const suggestedSlug = slugifyStr(title);
const slug = args.slug || await prompt(`Post slug (leave empty for "${suggestedSlug}"):`, suggestedSlug);

const tags = args.tags === "others" 
  ? await prompt("Tags (comma-separated):", "others")
  : args.tags;

const draft = args.draft || await confirm("Create as draft?", false);
const featured = args.featured || await confirm("Create as featured post?", false);

// Process tags
const tagsArray = tags
  .split(",")
  .map((tag: string) => tag.trim())
  .filter((tag: string) => tag !== "");

// Generate ISO date
const now = new Date();
const isoDate = now.toISOString();

// Create frontmatter
const frontmatter = `---
pubDatetime: ${isoDate}
modDatetime: ${isoDate}
title: ${title}
featured: ${featured}
draft: ${draft}
tags:
${tagsArray.map((tag) => `  - ${tag}`).join("\n")}
description:
  ${description}
---

## Table of contents

`;

// Define file path
const blogDir = join(__dirname, "..", "src", "data", "blog");
const filePath = join(blogDir, `${slug}.md`);

// Check if file already exists
if (await exists(filePath)) {
  console.error(`Error: File already exists at ${filePath}`);
  Deno.exit(1);
}

// Write file
try {
  await Deno.writeTextFile(filePath, frontmatter);
  console.log(`✨ Post created successfully at: ${filePath}`);
  console.log(`\nPost details:`);
  console.log(`  Title: ${title}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Tags: ${tagsArray.join(", ")}`);
  console.log(`  Draft: ${draft}`);
  console.log(`  Featured: ${featured}`);
} catch (error) {
  console.error("Error creating post:", error);
  Deno.exit(1);
}