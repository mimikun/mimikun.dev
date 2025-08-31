# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` (components, layouts, pages, styles, utils, config). Blog content lives in `src/data/blog/*.md` (kebab-case filenames = slugs).
- Public assets: `public/` (images, icons). Search assets are generated into `public/pagefind/` during build; do not edit manually.
- Output: `dist/` (build artifacts). Ignored by lint and commits.
- Config: `astro.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs`.

## Build, Test, and Development Commands
- `pnpm dev`: Start Astro dev server at `http://localhost:4321`.
- `pnpm build`: Type-check (`astro check`), build, run Pagefind, then copy `dist/pagefind` to `public/`.
- `pnpm preview`: Serve the production build locally.
- `pnpm lint`: Run ESLint (see config). `pnpm format` / `pnpm format:check`: Prettier write/check.
- Make/mise helpers: `make dev|build|preview|sync|lint|format` and `mise tasks run lint|format` wrap the same tasks.
- Content helper: `pnpm new-post` (Deno script) scaffolds `src/data/blog/<slug>.md` with frontmatter.

## Coding Style & Naming Conventions
- Formatting: Prettier (2 spaces, width 80, semicolons, double quotes). Plugins: Astro, Tailwind.
- Linting: ESLint with Astro + TypeScript presets; `no-console` is an error. Ignore: `dist/`, `.astro/`, `public/pagefind/`.
- TypeScript: strict config, path alias `@/*` to `src/*`.
- Content: blog filenames use kebab-case (e.g., `my-first-post.md`).

## Testing Guidelines
- No unit test suite. CI “tests” are lint + type-check + build. Ensure `pnpm lint`, `pnpm format:check`, and `pnpm build` pass before opening a PR.

## Commit & Pull Request Guidelines
- Conventional Commits enforced by commitlint. Allowed types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`.
- Format examples: `feat(pages): add tags archive`, `fix(utils): handle null input`.
- Scopes: lowercase `^[a-z\-.]*$` (e.g., `blog`, `pages`, `styles`). Keep subject ≤ 100 chars.
- PRs: include summary, linked issues, screenshots for UI changes, and steps to verify (`pnpm build`/`preview`).

## Security & Configuration Tips
- Use `pnpm`; do not run `pnpm up` (repo note). Avoid editing generated `public/pagefind/` and `dist/`.
- Local tools used by some tasks: actionlint, ghalint, typos, zizmor (optional via `mise`). Install only if running `mise` tasks.

