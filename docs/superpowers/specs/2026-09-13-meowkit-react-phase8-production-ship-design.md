# MeowKit React Library — Phase 8 Production Ship Design

**Date:** 2026-09-13  
**Branch / worktree:** `feat/phase1-foundation`  
**Status:** Approved for autonomous execution (user unavailable; finish without babysitting)

## 1. Purpose

Ship `@meowkit/design-tokens`, `@meowkit/global-styles`, and `@meowkit/components` as a **public, production-ready React UI library** on GitHub so a Companion App (with a custom Monaco/VS Code–style IDE) can depend on the whole surface with confidence.

Phases 1–7 delivered the component inventory. Phase 8 makes that inventory **typed, CI-backed, documented, legally publishable, and IDE-proven**.

## 2. Success criteria

A Companion App author can:

1. Clone the repo (and later install published packages) and get TypeScript types for every path export.
2. Compose `AppLayout` + `FileExplorerTree` + `MonacoEditor` + `IDEToolbar` + Companion panels without library-side device I/O.
3. Run `pnpm install && pnpm build && pnpm test && pnpm smoke` on CI green.
4. Open Storybook and see a **live** Monaco editor themed by `MeowKitProvider`.
5. Copy from `examples/companion-ide` as a starter composition.

## 3. Non-goals (unchanged)

- Shipping a Companion App binary
- WebSerial / WebUSB / flash / filesystem backends inside the library
- Full Cloudscape parity (PropertyFilter, Board, …)
- Visual regression suite (optional post-v1)
- Publishing to npm from this session if registry credentials are unavailable — wire the **workflow**; leave publish gated on secrets

## 4. Assumed product decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| License | MIT | Standard for public React UI kits; place `LICENSE` at repo root and set `license` on packages |
| Package scope | Keep path imports only | Matches Phases 1–7 API |
| Monaco | Optional peers + live Storybook + example app | Companion IDE requires a proven consumption path |
| Device panels | Remain presentational | Spec §9 |
| Fonts | Keep Google Fonts import for v1; document CSP/offline note | Avoid large self-host churn in ship window |
| Release | Changesets + GitHub Action (version PR + publish when `NPM_TOKEN` present) | Already partially configured |
| Storybook host | GitHub Pages workflow | Spec §7.4 deferred item |

## 5. Workstreams

### A. Build & types (P0)

- Fix components DTS generation (OOM): prefer **JS via tsup (`dts: false`)** + **declarations via `tsc --emitDeclarationOnly`** with a dedicated `tsconfig.build.json`, or raise Node heap in scripts if split proves unnecessary.
- Root/package `build` must produce `packages/components/dist/**/index.d.ts` for every export.
- Smoke must assert each `exports[key].types` file exists.

### B. Legal & package metadata (P0)

- Root `LICENSE` (MIT)
- Each public package: `license`, `repository`, `homepage`, `bugs`, `publishConfig.access=public`
- First Changeset for `0.1.0` (or current versions) documenting Phase 8 ship readiness

### C. CI (P0)

- `.github/workflows/ci.yml`: install → build (heap if needed) → test → typecheck → smoke → assert DTS count
- `.github/workflows/release.yml`: Changesets action (version/publish)
- `.github/workflows/storybook.yml`: build-storybook → GitHub Pages

### D. Storybook reliability (P0)

- Commit automatic JSX runtime fix (`apps/storybook/tsconfig.json` + `viteFinal` esbuild `jsx: 'automatic'`)

### E. Monaco / IDE production path (P1)

- Type `MonacoEditorProps.options` as `editor.IStandaloneEditorConstructionOptions`
- Export small helper `setModelMarkers` wrapper types/docs (Companion supplies diagnostics)
- Add Storybook peer deps + **live** Monaco story (keep docs-only story or replace)
- Document Vite/webpack worker setup in README

### F. Example Companion IDE (P1)

- `examples/companion-ide`: Vite + React app composing layout, tree, Monaco, toolbar, build output, serial panel with mock data/callbacks
- Workspace member; README section “Consume like a Companion App”

### G. Quality polish (P1–P2)

- Axe tests for IDEToolbar, FileExplorerTree, SerialConsoleView, DeviceManagerPanel (smoke-level)
- Select `aria-describedby` parity with Multiselect/FormField
- `CONTRIBUTING.md`
- README: npm consumer install, CI badge placeholders, IDE composition snippet
- IDEToolbar: omit action buttons when their handlers are undefined (optional polish)

## 6. Architecture notes

- No new packages unless the example needs its own `package.json` under `examples/`.
- Monaco remains externalized in tsup; Storybook and the example install peers locally.
- Library still has zero device I/O.

## 7. Verification gate (Definition of Done)

Before declaring complete:

1. `pnpm build` produces DTS for all 56 component exports
2. `pnpm test` passes
3. `pnpm smoke` passes including types assertion
4. Live Monaco Storybook story loads without console errors
5. `examples/companion-ide` starts and shows editor + chrome
6. CI workflow files exist and are valid YAML
7. LICENSE + package metadata present
8. Storybook JSX fix committed

## 8. Execution mode

Write the Phase 8 implementation plan, then execute via **subagent-driven development** continuously until DoD is met or blocked on missing credentials (npm publish token). Do not wait for interactive approval between tasks.
