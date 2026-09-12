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

```tsx
import '@meowkit/global-styles';
import { MeowKitProvider } from '@meowkit/components/provider';
import Button from '@meowkit/components/button';

export function App() {
  return (
    <MeowKitProvider mode="light" accent="default">
      <Button variant="primary">Continue</Button>
    </MeowKitProvider>
  );
}
```
