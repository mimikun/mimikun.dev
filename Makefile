# Starts local dev server at `localhost:4321`
dev :
	pnpm run dev

# Build your production site to `./dist/`
build :
	pnpm run build

# Preview your build locally, before deploying
preview :
	pnpm run preview

# Check code format with Prettier
format:check :
	pnpm run format:check

# Format codes with Prettier
format :
	pnpm run format

# Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync).
sync :
	pnpm run sync

# Lint with ESLint
lint :
	pnpm run lint
