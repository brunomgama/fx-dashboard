# CLAUDE.md

Personal developer dashboard. Purpose: test, monitor and maintain own implementations. Bruno is the sole developer.

---

## Commands

```bash
pnpm dev      # start dev server (auto-selects port from 3000)
pnpm build    # production build
pnpm lint     # ESLint — Next.js + TypeScript rules
```

**A task is only done when `pnpm lint` passes with 0 warnings AND `pnpm build` compiles clean.** Never declare done without running both.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 — strict |
| Styling | Tailwind v4 |
| Components | shadcn/ui |
| Package manager | pnpm |
| Icons | lucide-react |

---

## Folder Structure

```
app/
  (route)/page.tsx          → thin page wrapper only — no logic
  api/(domain)/route.ts     → HTTP handler only — delegates to services/
components/
  ui/                       → shadcn primitives — never modify these files
  layout/                   → app chrome: sidebar, header
  providers/                → React context providers
  error/                    → shared ErrorComponent
  loading/                  → shared LoadingComponent
  (domain)/                 → feature-specific components (e.g. aws-sso/, flow-launcher/)
hooks/                      → all custom React hooks (use-*.ts)
services/                   → server-side business logic (Node.js, fs, AWS, external APIs)
types/                      → TypeScript interfaces and types
lib/                        → pure utility functions (no side effects, no I/O)
config/                     → static constants and configuration objects
locales/                    → i18n strings (en.json, pt.json)
public/                     → static assets
```

### Rules

- `app/(route)/page.tsx` imports one component from `components/` and renders it. Nothing else.
- `app/api/(domain)/route.ts` validates the request, calls a function from `services/`, returns `Response.json(...)`. No business logic in the route file.
- `services/(domain).ts` contains all server-side logic: file I/O, AWS calls, external HTTP, data transformation. This is the only place that uses Node.js APIs.
- `components/ui/` is owned by shadcn. **Do not edit these files.**
- `hooks/` contains only React hooks (`use-` prefix). A hook that belongs to one component lives next to that component, not in `hooks/`.
- `types/` contains interfaces and types that are shared across multiple layers. Types used only within one file stay in that file.
- `lib/` contains pure functions: no `fetch`, no `fs`, no React. If it has a side effect, it belongs in `services/`.
- `config/` contains exported constants and configuration objects (e.g. `NAV_ITEMS`, `ENVIRONMENTS`). No logic, just data.

---

## Page Layout Convention

Every page follows this exact structure:

```tsx
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { MyComponent } from '@/components/...';

export default function MyPage() {
  return (
    <div className='flex h-screen flex-col'>
      <header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
        <SidebarTrigger />
        <h1 className='font-montserrat text-xl font-black'>Page Title</h1>
      </header>
      <div className='flex-1 overflow-auto p-6'>
        <MyComponent />
      </div>
    </div>
  );
}
```

---

## Navigation

To add a page to the sidebar, add an entry to `NAV_ITEMS` in `config/navigation.ts`. The sidebar supports three levels of nesting. Icons come from `lucide-react`.

---

## API Route Convention

Route files are thin. The full pattern:

```ts
// app/api/wiki/files/route.ts
import { getWikiFiles } from '@/services/wiki';

export async function GET() {
  const files = await getWikiFiles();
  return Response.json(files);
}
```

```ts
// services/wiki.ts
import fs from 'fs/promises';
// ... all real logic here
export async function getWikiFiles() { ... }
```

Validation, error mapping, and `Response` construction happen in the route. Everything else happens in the service.

For routes that are environment-aware, the active environment is passed as a query param by the client and read in the route:

```ts
// client
fetch(`/api/flow-launcher/flows?environment=${environment}`)

// route
const environment = searchParams.get('environment') as Environment;
```

---

## Typography

Font: **Montserrat** (`font-montserrat`). Loaded weights: 100, 300, 400, 500, 600, 700, 900.

| Role | Tailwind class | Weight |
|---|---|---|
| Titles (sidebar title, page headings) | `font-montserrat font-black` | 900 |
| Selectors / interactive labels | `font-montserrat font-semibold` | 600 |
| Body / general text | `font-montserrat font-light` | 300 |

Tailwind weight reference:

| Class | font-weight |
|---|---|
| `font-thin` | 100 |
| `font-extralight` | 200 |
| `font-light` | 300 |
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |
| `font-extrabold` | 800 |
| `font-black` | 900 |

---

## Components

- Only use shadcn components from `components/ui/`. Tailwind utilities for everything else.
- Adding a new shadcn component is free — run `pnpm dlx shadcn@latest add <name>` and document it in the response.
- Installing a new npm package requires a stated reason before installing.
- No component-level CSS files. All styling via Tailwind class names.
- No inline styles except for dynamic values that Tailwind cannot express (e.g. calculated pixel dimensions).

---

## TypeScript Rules

- **No `any`**. Use `unknown` and narrow, or define a proper type.
- Multi-parameter functions take a single named input object with a typed interface:
  ```ts
  // wrong
  function doThing(id: string, name: string, active: boolean) {}
  // correct
  interface DoThingInput { active: boolean; id: string; name: string; }
  function doThing({ active, id, name }: DoThingInput) {}
  ```
- Destructured keys sorted alphabetically.
- No non-null assertions (`!`) on values that could genuinely be null. Narrow properly instead.
- No `as` casts unless interfacing with an untyped external boundary (e.g. `JSON.parse`, a raw API response).

---

## React Rules

- **No `setState` synchronously inside `useEffect`**. The `react-hooks/set-state-in-effect` rule will error.
  - Initialize state with the loading value: `useState(true)` for loading flags.
  - Only call `setState` inside `.then()`, `.catch()`, `.finally()`, or after an `await`.
- **No `useCallback` or `useMemo`** except when a function is a direct dependency of `useEffect` (required to keep the effect stable). All other uses need a measurable performance justification.
- **No `useEffect` for derived state** — compute derived values directly in the render function.
- No `useEffect` to sync two pieces of React state — restructure instead.
- No floating promises in event handlers — either `void fn()` or `fn().catch(...)`.

---

## State Management

There is no global state library. State lives either:
- In the component that owns it.
- In a custom hook if multiple components need the same logic.
- In a React context (`components/providers/`) if it is truly app-wide (theme, language, environment).

Do not reach for context to solve prop-drilling across two levels. Pass props.

---

## Error Handling

- API routes return `Response.json({ error: string }, { status: number })` on failure. Never expose raw error messages or stack traces.
- Service functions throw `Error` with a human-readable message. The route catches and maps to HTTP status.
- No `try/catch` blocks that silently swallow errors. At minimum, log or rethrow.
- No `alert()` or `confirm()` in production code.

---

## Code Style

- No comments that explain what the code does. Well-named identifiers do that.
- Add a comment only when the **why** is non-obvious: a hidden constraint, a workaround, a subtle invariant.
- No multi-line comment blocks or docstrings.
- No `console.log` left in committed code.
- No dead code, commented-out code, or TODO comments committed to the repo.

---

## Scope Discipline

- Fix what was asked. Nothing else.
- If something adjacent should be fixed: mention it in one line, do not fix it.
- No proactive refactors. If a refactor is warranted, ask: "I noticed X — want me to refactor it?" Then wait.
- No tests unless explicitly requested.
- No error handling or abstractions for scenarios that cannot happen.
- No feature flags. No backwards-compatibility shims. Change the code directly.

---

## Dependencies

| Type | Rule |
|---|---|
| shadcn component | Add freely via `pnpm dlx shadcn@latest add <name>` |
| npm package | State the reason before installing. Wait for approval if the reason is unclear. |
| Dev-only tool | Same as npm — needs a reason |

---

## Environment System

`config/environments.ts` defines the available environments (jaimy-staging, jaimy-prod, asr-staging, asr-prod). Each carries AWS account/region/profile and service URLs sourced from `NEXT_PUBLIC_*` env vars.

Access the active environment via `useEnvironment()` from `components/providers/environment-provider.tsx`. The user switches environments in the sidebar footer.

---

## Localization

Strings live in `locales/en.json` and `locales/pt.json`. Access via `useLanguage()` from `components/providers/language-provider.tsx`. Do not hardcode user-facing strings in components.

---

## Import Alias

`@/` maps to the project root. Always use it for internal imports. No relative `../../` paths.

---

## Security

- No secrets, tokens, or credentials in source code.
- No PII or raw error details in API responses.
- Validate and sanitize all values that come from the outside: URL params, request bodies, `process.env`.
- `process.env` access only in `services/` or `config/`. Never in components.

---

## Git

Bruno writes all commit messages and pushes. Never run:
- `git commit`
- `git push`
- `prisma migrate reset`
- `terraform apply` / `terraform destroy`

Before running `prisma migrate dev` or `docker compose down`: ask explicitly, wait for yes.
