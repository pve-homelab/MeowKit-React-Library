# Contributing to MeowKit

Thanks for helping improve the MeowKit React library. This repo is a pnpm workspace with three public packages (`@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components`), a private Storybook app, and example apps under `examples/`.

## Prerequisites

- Node.js 22 (matches CI)
- pnpm 9.15.0 via Corepack:

```bash
corepack enable
pnpm install
```

On Windows, if `corepack enable` fails with EPERM, prefix every `pnpm` command with `npx pnpm@9.15.0` instead.

## Build

Build all `@meowkit/*` packages before Storybook, smoke checks, or the companion example — those consumers read compiled `dist` entries, not source.

```bash
pnpm build
```

The components package emits many declaration files. If the build runs out of memory locally or in CI, raise the Node heap:

```bash
# PowerShell
$env:NODE_OPTIONS="--max-old-space-size=8192"
pnpm build

# bash
NODE_OPTIONS=--max-old-space-size=8192 pnpm build
```

CI sets `NODE_OPTIONS=--max-old-space-size=8192` for the build step in `.github/workflows/ci.yml`.

## Test and typecheck

```bash
pnpm test
pnpm typecheck
```

Package tests live next to components under `packages/components/src/**/*.test.tsx`. Accessibility coverage includes:

- `packages/components/src/a11y/critical.a11y.test.tsx` — Button, Input, Modal, Alert, Checkbox, Tabs
- `packages/components/src/a11y/companion.a11y.test.tsx` — IDEToolbar, FileExplorerTree, SerialConsoleView, DeviceManagerPanel

Run a single package:

```bash
pnpm --filter=@meowkit/components test
```

## Smoke check

After `pnpm build`, assert every public `@meowkit/components` export resolves and ships types:

```bash
pnpm smoke
```

Smoke does not rebuild — run `pnpm build` first.

## Storybook

Storybook depends on compiled packages. Build, then start:

```bash
pnpm build
pnpm storybook
```

Build a static bundle (same path CI uses for GitHub Pages):

```bash
pnpm build
pnpm --filter=@meowkit/storybook build-storybook
```

The live Monaco editor story is **`Patterns/MonacoEditor/Live`** (Storybook id `patterns-monacoeditor--live`). Storybook installs Monaco as optional peers; the default docs story remains docs-only via `CodeView`.

## Example apps

The companion IDE example composes layout, tree, Monaco, toolbar, and panels with mock state:

```bash
pnpm build
pnpm --filter=@meowkit/example-companion-ide dev
```

See `examples/companion-ide/` and the README “Consume like a Companion App” section.

## Changesets and releases

Public packages version together with [Changesets](https://github.com/changesets/changesets). `@meowkit/storybook` is private and ignored.

When your PR includes a user-facing change to a public package:

1. Add a changeset:

```bash
pnpm changeset
```

2. Select the affected packages (`@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components`) and choose semver bump (patch/minor/major).
3. Write a short summary for the changelog.

Maintainers run `pnpm version-packages` on the release PR to apply pending changesets, bump versions, and update changelogs.

Publishing is automated on pushes to `main` via `.github/workflows/release.yml` using `changesets/action`. npm publish requires a repository secret **`NPM_TOKEN`** with publish access to the `@meowkit` scope. Without it, the workflow can still open version PRs but will not publish.

Do not publish manually from a contributor machine unless you are explicitly performing a release with valid credentials.

## CI

Pull requests and pushes to `main` / `feat/**` run `.github/workflows/ci.yml`:

1. `pnpm install --frozen-lockfile`
2. `pnpm build` (with raised heap)
3. `pnpm test`
4. `pnpm typecheck`
5. `pnpm smoke`

Keep PRs green before merge. Storybook Pages deploy and npm release run on separate workflows when changes land on `main`.

## Conventions

- Path imports only: `@meowkit/components/<name>` (no barrel import).
- React peers: `^18.3.1`.
- Monaco peers (`monaco-editor`, `@monaco-editor/react`) are optional — only required for Monaco entries and IDE examples.
- Companion/IDE panels are presentational: expose callbacks only; no WebSerial, WebUSB, flash, or filesystem I/O inside the library.
- Match existing test patterns (Vitest + Testing Library + jest-axe for a11y).
- Commit after each logical task; do not force-push shared branches unless asked.

## Fonts and CSP

`@meowkit/global-styles` loads Inter from Google Fonts via `@import` in `packages/global-styles/src/base.css`. Host apps with a strict Content-Security-Policy must allow `https://fonts.googleapis.com` (styles) and `https://fonts.gstatic.com` (font files), or self-host Inter and remove/replace the import. Self-hosting is not bundled in v1; see the README CSP note for consumers.
