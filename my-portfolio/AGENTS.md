# AGENTS.md

Single Next.js app; all commands run from this directory (`my-portfolio/`). The git repo root is one level up and also holds `../images/` — source design assets, not referenced by the app.

## Stack

- Next.js 16.4.3, App Router, entrypoint `src/app/page.tsx`; path alias `@/*` → `./src/*`
- Tailwind CSS v4, CSS-first config: `@import "tailwindcss"` + `@theme` in `src/app/globals.css`; there is no `tailwind.config.*`
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`) — don't add `useMemo`/`useCallback`/`React.memo` for performance
- Turbopack with the `@tailwindcss/turbopack` loader for CSS (see `next.config.ts`)

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run lint     # biome check — lint + format check
npm run format   # biome format --write
npx tsc --noEmit # typecheck (no npm script for it)
npm run build    # production build
```

## Tooling quirks

- Biome is the only linter/formatter (no ESLint, no Prettier) — never add config for those; `npm run lint` is the pre-merge gate
- Package manager is npm (`package-lock.json`); no test runner exists — don't invent one unless asked
- There is no CI

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
