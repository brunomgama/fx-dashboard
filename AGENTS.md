# AGENTS.md

## Overview
This project is a modular Next.js dashboard for AWS and organizational workflows. It is structured around feature domains (AWS SSO, Flow Launcher, Organization) and leverages React Server Components, TypeScript, and Tailwind CSS. The codebase is designed for extensibility and clear separation of concerns.

## Architecture & Patterns
- **Feature-centric structure**: Major features are in `features/`, each with their own `api.ts`, `types.ts`, `components/`, and `hooks/`.
- **App directory**: Uses Next.js `/app` directory for routing, layouts, and API endpoints. API routes are colocated under `app/api/`.
- **Providers**: Global context providers for environment, language, and theme are in `components/providers/` and wrapped in `app/layout.tsx`.
- **Sidebar navigation**: Centralized in `components/layout/app-sidebar.tsx`, referencing feature routes and environment switching.
- **Environment abstraction**: `lib/environment.ts` and `components/providers/environment-provider.tsx` manage environment configs and selection, exposing AWS account/region/profile and service URLs.
- **UI components**: Reusable UI primitives are in `components/ui/`, styled via Tailwind and shadcn/ui conventions.
- **Type safety**: All domain models and API responses are defined in `features/*/types.ts` and `lib/types.ts`.

## Developer Workflows
- **Development**: Use `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`) to start the local server.
- **Build**: `npm run build` compiles the app for production.
- **Linting**: `npm run lint` runs ESLint with Next.js and TypeScript rules (see `eslint.config.mjs`).
- **Environment variables**: Use `.env.local` for secrets and service URLs. Environment configs reference `NEXT_PUBLIC_*` variables.
- **API mocking**: API routes in `app/api/` can be extended for local development or integration.

## Project-specific Conventions
- **Aliases**: TypeScript and shadcn/ui aliases (e.g. `@/components`, `@/lib/utils`) are defined in `tsconfig.json` and `components.json`.
- **Dark mode**: Theme switching is handled via `next-themes` and Tailwind custom variants.
- **Localization**: Language context uses `locales/en.json` and `locales/pt.json`.
- **State management**: Context providers and hooks are preferred for global state; avoid Redux or third-party stores.
- **API integration**: Feature APIs (e.g. AWS SSO, Flow Launcher) use fetch with custom headers and error handling. See `features/*/api.ts`.
- **Service boundaries**: Each environment exposes its own service URLs and API keys, managed via context and `.env.local`.

## Integration Points
- **AWS SDK**: Used for SSO and Step Function integration (`@aws-sdk/client-sfn`, `@aws-sdk/credential-providers`).
- **Flow Launcher**: External workflow service, integrated via environment config and API key.
- **shadcn/ui**: UI primitives and style conventions, configured in `components.json`.
- **Lucide icons**: Used for navigation and UI elements.

## Examples
- To add a new feature, create a folder in `features/` with `api.ts`, `types.ts`, `components/`, and `hooks/`.
- To add a new environment, update `lib/environment.ts` and reference new `NEXT_PUBLIC_*` variables in `.env.local`.
- To extend sidebar navigation, update `components/layout/app-sidebar.tsx`.

## Key Files
- `app/layout.tsx`: Root layout and provider composition
- `components/layout/app-sidebar.tsx`: Navigation and environment switching
- `lib/environment.ts`: Environment configs and service URLs
- `features/*/api.ts`: Feature-specific API integration
- `components/providers/`: Global context providers
- `components/ui/`: UI primitives

