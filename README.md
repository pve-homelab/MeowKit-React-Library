# MeowKit React Library

Official MeowKit React UI library (Phase 1 foundation).

See `docs/superpowers/specs/2026-09-13-meowkit-react-ui-library-design.md`.

## Packages

- `@meowkit/design-tokens`
- `@meowkit/global-styles`
- `@meowkit/components`

## Quick start

```bash
corepack enable
pnpm install
pnpm build
pnpm storybook
```

On Windows without Corepack (or if `corepack enable` fails with EPERM), use `npx pnpm@9.15.0` for every `pnpm` command:

```bash
npx pnpm@9.15.0 install
npx pnpm@9.15.0 build
npx pnpm@9.15.0 storybook
```

Build the workspace packages before Storybook or the export smoke check. Storybook and `pnpm smoke` read compiled `dist` entries, not source.

```bash
pnpm build
pnpm test
pnpm smoke
```

## Usage

Importing `@meowkit/global-styles` injects light + default CSS variables on `:root`, so first paint works without JavaScript. `MeowKitProvider` also applies mode and accent in `useLayoutEffect` before the browser paints.

Optional spec bootstrap: call `applyMode` / `applyAccent` before React renders (needed for a non-default theme on first paint):

```tsx
import '@meowkit/global-styles';
import { applyAccent, applyMode } from '@meowkit/global-styles';
import { MeowKitProvider } from '@meowkit/components/provider';
import Button from '@meowkit/components/button';
import { createRoot } from 'react-dom/client';

applyMode('light');
applyAccent('default');

createRoot(document.getElementById('root')!).render(
  <MeowKitProvider mode="light" accent="default">
    <Button variant="primary">Continue</Button>
  </MeowKitProvider>,
);
```

`pnpm smoke` asserts compiled `dist` exports and that Button CSS is emitted. It does not rebuild — run `pnpm build` first.
