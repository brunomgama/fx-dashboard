# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server (auto-selects an available port starting at 3000)
pnpm build      # production build
pnpm lint       # ESLint with Next.js + TypeScript rules
```

There are no tests. Every task is done when `pnpm lint` passes with 0 warnings and `pnpm build` compiles clean.

## Architecture

**Next.js 16 App Router** with a strict feature-centric layout:

- `app/` — routes only. Each page is a thin wrapper that imports from `features/`.
- `features/<name>/` — all logic for a feature: `api.ts`, `types.ts`, `components/`, `hooks/`.
- `app/api/<name>/` — server-side API routes (use `NextResponse`, Node `fs`/`child_process` are allowed).
- `components/ui/` — shadcn/ui primitives (installed: button, checkbox, dialog, dropdown-menu, input, label, select, separator, sheet, sidebar, skeleton, tabs, textarea, tooltip).
- `components/layout/app-sidebar.tsx` — sidebar rendered from `NAV_ITEMS` in `lib/sidebar.ts`.
- `components/providers/` — three global providers composed in `app/layout.tsx`: `ThemeProvider`, `LanguageProvider`, `EnvironmentProvider`.

### Navigation

To add a page to the sidebar, add an entry to `NAV_ITEMS` in `lib/sidebar.ts`. The sidebar supports three levels of nesting. Icons come from `lucide-react`.

### Environment system

`lib/environment.ts` defines four environments: `jaimy-staging`, `jaimy-prod`, `asr-staging`, `asr-prod`. Each carries AWS account/region/profile and service URLs (Flow Launcher, Email API) sourced from `NEXT_PUBLIC_*` env vars with hardcoded fallbacks.

Access the active environment anywhere with `useEnvironment()` from `components/providers/environment-provider.tsx`. The user switches environments via the sidebar footer.

### Feature API pattern

Feature API calls go through a typed `request<T>()` helper (see `features/flow-launcher/api.ts`) that attaches `x-api-key` and handles empty responses. The `FlowLauncherConfig` object (`{ url, apiKey }`) is passed down from the environment context.

## Conventions

- All pages use `'use client'` and follow the header/content layout:
  ```tsx
  <div className='flex h-screen flex-col'>
    <header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
      <SidebarTrigger />
      <h1 className='text-xl font-semibold'>Title</h1>
    </header>
    <div className='flex-1 overflow-auto p-6'>…</div>
  </div>
  ```
- No `any` types. Multi-param functions use a single named input object with a typed interface.
- Do not call `setState` synchronously inside `useEffect` — the `react-hooks/set-state-in-effect` ESLint rule will error. Initialize state with the loading value (e.g. `useState(true)`) and only call `setState` inside async callbacks.
- Localization strings live in `locales/en.json` and `locales/pt.json`; access them via `useLanguage()`.
- Import alias: `@/` maps to the project root.
