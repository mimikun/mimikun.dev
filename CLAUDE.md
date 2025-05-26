# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Development

- `pnpm run dev` - Start local dev server at localhost:4321
- `pnpm run build` - Build production site to ./dist/ with type checking and pagefind search
- `pnpm run preview` - Preview production build locally
- `pnpm run sync` - Generate TypeScript types for all Astro modules

### Code Quality

- `pnpm run lint` - Run ESLint on the codebase
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting without changes

## Architecture Overview

This is an Astro-based blog website using the AstroPaper theme with the following key components:

### Content Management

- Blog posts are stored as Markdown files in `src/data/blog/`
- Content schema is defined in `src/content.config.ts` with required fields: title, author, pubDatetime, description, and tags
- Posts support draft mode, featured posts, and scheduled publishing based on `pubDatetime`

### Core Configuration

- Site configuration in `src/config.ts` controls website metadata, features like archives and dark mode
- Build configuration in `astro.config.ts` includes Tailwind CSS, sitemap generation, and markdown plugins (TOC, collapsible sections)

### Page Structure

- Static pages in `src/pages/` (404, about, portfolio, search, index)
- Dynamic routes for blog posts at `/posts/[slug]` and pagination at `/posts/[page]`
- Tag-based browsing at `/tags/[tag]/[page]`
- Archive page at `/archives/` (controlled by `SITE.showArchives`)

### Styling and UI

- Tailwind CSS v4 with custom typography styles
- Light/dark mode toggle support
- Custom SVG icons in `src/assets/icons/`
- OpenGraph image generation for posts and site

### Important Notes

- DO NOT run `pnpm up` - dependency versions are locked
- The build process includes pagefind search indexing
- Site uses experimental Astro features: responsive images, SVG support, and preserved script order
