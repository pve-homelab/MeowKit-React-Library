# MeowKit React UI Library — Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the MeowKit monorepo and ship working `@meowkit/design-tokens`, `@meowkit/global-styles`, a path-importable `Button`, minimal `MeowKitProvider`, and Storybook with mode/accent knobs.

**Architecture:** pnpm workspaces with three publishable packages and one Storybook app. Tokens define semantic CSS variables for light/dark × default/lime; global-styles applies them to the document root; components consume only `var(--mk-*)` via CSS Modules. Radix is introduced later with overlays — Button is a plain accessible `<button>` for Phase 1.

**Tech Stack:** Node 24+, pnpm (via Corepack), TypeScript 5.x strict, Vite + vitest, tsup for package builds, React 18, CSS Modules, Storybook 8 (Vite).

**Spec:** `docs/superpowers/specs/2026-09-13-meowkit-react-ui-library-design.md`  
**Later phases (separate plans):** remaining primitives, layout, patterns, Monaco, Companion panels, Changesets/publish hardening.

## Global Constraints

- Package names: `@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components` only.
- CSS color values in components: only `var(--mk-…)` — never raw brand hex in component CSS.
- Prefer path imports: `@meowkit/components/button`.
- Standard React events (no `event.detail`).
- Modes: `light` | `dark`; accents: `default` | `lime`.
- Font: Inter (loaded from `@meowkit/global-styles`).
- Do not implement WebSerial/WebUSB/flash backends.
- Do not add Monaco or Companion panels in Phase 1.
- Keep `PROMPT.md` and existing `docs/superpowers/specs/` intact.

---

## File map (Phase 1)

| Path | Responsibility |
|------|----------------|
| `package.json` | Root scripts, `private`, pnpm workspace root |
| `pnpm-workspace.yaml` | `packages/*`, `apps/*` |
| `tsconfig.base.json` | Shared strict TS options |
| `.gitignore` | node_modules, dist, storybook-static, coverage |
| `packages/design-tokens/package.json` | Package manifest + exports |
| `packages/design-tokens/src/types.ts` | Mode, Accent, token value types |
| `packages/design-tokens/src/color.ts` | Semantic color maps per mode × accent |
| `packages/design-tokens/src/scales.ts` | space, radius, font, motion, shadow, zIndex |
| `packages/design-tokens/src/css-vars.ts` | Build `--mk-*` flat map from tokens |
| `packages/design-tokens/src/index.ts` | Public API |
| `packages/design-tokens/src/css-vars.test.ts` | Token/CSS var tests |
| `packages/global-styles/package.json` | Depends on design-tokens |
| `packages/global-styles/src/reset.css` | Minimal reset |
| `packages/global-styles/src/base.css` | Typography + Inter `@font-face` / Google fonts link strategy |
| `packages/global-styles/src/apply-theme.ts` | `applyMode`, `applyAccent`, `getMode`, `getAccent` |
| `packages/global-styles/src/index.ts` | Side-effect CSS imports + theme API |
| `packages/global-styles/src/apply-theme.test.ts` | Theme application tests (jsdom) |
| `packages/components/package.json` | Depends on global-styles + design-tokens; exports `./button`, `./provider` |
| `packages/components/src/button/styles.module.css` | Button styles via tokens |
| `packages/components/src/button/internal.tsx` | Button implementation |
| `packages/components/src/button/index.tsx` | Public Button + props types |
| `packages/components/src/button/button.test.tsx` | Button tests |
| `packages/components/src/provider/index.tsx` | MeowKitProvider (mode/accent context) |
| `packages/components/tsup.config.ts` | Multi-entry build including CSS |
| `apps/storybook/...` | Storybook 8 Vite app consuming workspace packages |
| `README.md` | Install + usage for Phase 1 |

---

### Task 1: Monorepo scaffold + Corepack pnpm

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `README.md` (stub; expanded in Task 7)

**Interfaces:**
- Consumes: none
- Produces: workspace root that can `pnpm install` once packages exist

- [ ] **Step 1: Enable pnpm via Corepack**

Run:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm -v
```

Expected: prints `9.15.0` (or the prepared version).

- [ ] **Step 2: Write root workspace files**

`package.json`:

```json
{
  "name": "meowkit-react-library",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "build": "pnpm -r --filter=@meowkit/* run build",
    "test": "pnpm -r --filter=@meowkit/* run test",
    "typecheck": "pnpm -r --filter=@meowkit/* run typecheck",
    "storybook": "pnpm --filter=@meowkit/storybook storybook"
  },
  "devDependencies": {
    "typescript": "^5.8.2"
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true
  }
}
```

`.gitignore`:

```
node_modules
dist
coverage
storybook-static
*.log
.DS_Store
```

`README.md` stub:

```markdown
# MeowKit React Library

Official MeowKit React UI library (Phase 1 foundation in progress).

See `docs/superpowers/specs/2026-09-13-meowkit-react-ui-library-design.md`.
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore README.md
git commit -m "chore: scaffold pnpm monorepo workspace"
```

---

### Task 2: `@meowkit/design-tokens`

**Files:**
- Create: `packages/design-tokens/package.json`
- Create: `packages/design-tokens/tsconfig.json`
- Create: `packages/design-tokens/vitest.config.ts`
- Create: `packages/design-tokens/tsup.config.ts`
- Create: `packages/design-tokens/src/types.ts`
- Create: `packages/design-tokens/src/color.ts`
- Create: `packages/design-tokens/src/scales.ts`
- Create: `packages/design-tokens/src/css-vars.ts`
- Create: `packages/design-tokens/src/index.ts`
- Test: `packages/design-tokens/src/css-vars.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `export type Mode = 'light' | 'dark'`
  - `export type Accent = 'default' | 'lime'`
  - `export function getCssVars(mode: Mode, accent: Accent): Record<string, string>`
  - `export const space`, `radius`, `font`, `motion`, `shadow`, `zIndex` scale objects

- [ ] **Step 1: Write failing test**

`packages/design-tokens/src/css-vars.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCssVars } from './css-vars';

describe('getCssVars', () => {
  it('returns lime accent primary for light+lime', () => {
    const vars = getCssVars('light', 'lime');
    expect(vars['--mk-color-primary']).toBe('#BBE700');
    expect(vars['--mk-color-primary-text']).toBe('#000000');
    expect(vars['--mk-color-background']).toBe('#FFFFFF');
  });

  it('returns black primary for light+default', () => {
    const vars = getCssVars('light', 'default');
    expect(vars['--mk-color-primary']).toBe('#000000');
    expect(vars['--mk-color-primary-text']).toBe('#FFFFFF');
    expect(vars['--mk-color-accent']).toBe('#BBE700');
  });

  it('returns dark background for dark mode', () => {
    const vars = getCssVars('dark', 'default');
    expect(vars['--mk-color-background']).toBe('#121412');
    expect(vars['--mk-color-text']).toBe('#F5F5F5');
  });

  it('includes spacing and radius scales', () => {
    const vars = getCssVars('light', 'default');
    expect(vars['--mk-space-4']).toBe('16px');
    expect(vars['--mk-radius-md']).toBe('12px');
  });
});
```

- [ ] **Step 2: Add package manifests and run test (expect fail)**

`packages/design-tokens/package.json`:

```json
{
  "name": "@meowkit/design-tokens",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts --clean",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.4.0",
    "typescript": "^5.8.2",
    "vitest": "^3.0.9"
  }
}
```

`packages/design-tokens/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"],
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

`packages/design-tokens/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

From repo root:

```bash
pnpm install
pnpm --filter=@meowkit/design-tokens test
```

Expected: FAIL (module `./css-vars` not found or `getCssVars` undefined).

- [ ] **Step 3: Implement tokens**

`packages/design-tokens/src/types.ts`:

```ts
export type Mode = 'light' | 'dark';
export type Accent = 'default' | 'lime';
```

`packages/design-tokens/src/scales.ts`:

```ts
export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
} as const;

export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const font = {
  familySans: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  familyMono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  sizeXs: '12px',
  sizeSm: '14px',
  sizeMd: '16px',
  sizeLg: '18px',
  sizeXl: '24px',
  weightRegular: '400',
  weightMedium: '500',
  weightBold: '700',
  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
} as const;

export const motion = {
  fast: '62ms',
  medium: '125ms',
  slow: '200ms',
  easingDefault: 'cubic-bezier(0, 0, 0.2, 1)',
  easingHover: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const shadow = {
  sm: '0 1px 2px rgb(0 0 0 / 0.08)',
  md: '0 4px 12px rgb(0 0 0 / 0.12)',
  lg: '0 12px 32px rgb(0 0 0 / 0.16)',
} as const;

export const zIndex = {
  dropdown: '1000',
  sticky: '1100',
  modal: '1300',
  toast: '1400',
} as const;
```

`packages/design-tokens/src/color.ts`:

```ts
import type { Accent, Mode } from './types';

export type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  focusRing: string;
  overlay: string;
};

const lightBase = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1EA',
  text: '#000000',
  textMuted: 'rgb(0 0 0 / 0.55)',
  textInverse: '#FFFFFF',
  border: '#DFDFDF',
  borderStrong: '#000000',
  success: '#006400',
  warning: '#EE9441',
  error: '#B42318',
  info: '#0B6BCB',
  focusRing: '#BBE700',
  overlay: 'rgb(0 0 0 / 0.45)',
  accent: '#BBE700',
  accentHover: '#9DDE00',
} as const;

const darkBase = {
  background: '#121412',
  surface: '#1A1D1A',
  surfaceMuted: '#242824',
  text: '#F5F5F5',
  textMuted: 'rgb(245 245 245 / 0.65)',
  textInverse: '#000000',
  border: '#2E322E',
  borderStrong: '#F5F5F5',
  success: '#3ED660',
  warning: '#EE9441',
  error: '#FF6B5A',
  info: '#5EB1FF',
  focusRing: '#D7FF4A',
  overlay: 'rgb(0 0 0 / 0.6)',
  accent: '#BBE700',
  accentHover: '#D7FF4A',
} as const;

export function getColorTokens(mode: Mode, accent: Accent): ColorTokens {
  const base = mode === 'light' ? lightBase : darkBase;

  if (accent === 'lime') {
    return {
      ...base,
      primary: mode === 'light' ? '#BBE700' : '#BBE700',
      primaryHover: mode === 'light' ? '#9DDE00' : '#D7FF4A',
      primaryText: '#000000',
    };
  }

  return {
    ...base,
    primary: mode === 'light' ? '#000000' : '#F5F5F5',
    primaryHover: mode === 'light' ? '#262626' : '#FFFFFF',
    primaryText: mode === 'light' ? '#FFFFFF' : '#000000',
  };
}
```

`packages/design-tokens/src/css-vars.ts`:

```ts
import { getColorTokens } from './color';
import { font, motion, radius, shadow, space, zIndex } from './scales';
import type { Accent, Mode } from './types';

export function getCssVars(mode: Mode, accent: Accent): Record<string, string> {
  const color = getColorTokens(mode, accent);
  const vars: Record<string, string> = {
    '--mk-color-background': color.background,
    '--mk-color-surface': color.surface,
    '--mk-color-surface-muted': color.surfaceMuted,
    '--mk-color-text': color.text,
    '--mk-color-text-muted': color.textMuted,
    '--mk-color-text-inverse': color.textInverse,
    '--mk-color-border': color.border,
    '--mk-color-border-strong': color.borderStrong,
    '--mk-color-primary': color.primary,
    '--mk-color-primary-hover': color.primaryHover,
    '--mk-color-primary-text': color.primaryText,
    '--mk-color-accent': color.accent,
    '--mk-color-accent-hover': color.accentHover,
    '--mk-color-success': color.success,
    '--mk-color-warning': color.warning,
    '--mk-color-error': color.error,
    '--mk-color-info': color.info,
    '--mk-color-focus-ring': color.focusRing,
    '--mk-color-overlay': color.overlay,
    '--mk-font-family-sans': font.familySans,
    '--mk-font-family-mono': font.familyMono,
    '--mk-font-size-xs': font.sizeXs,
    '--mk-font-size-sm': font.sizeSm,
    '--mk-font-size-md': font.sizeMd,
    '--mk-font-size-lg': font.sizeLg,
    '--mk-font-size-xl': font.sizeXl,
    '--mk-font-weight-regular': font.weightRegular,
    '--mk-font-weight-medium': font.weightMedium,
    '--mk-font-weight-bold': font.weightBold,
    '--mk-line-height-tight': font.lineHeightTight,
    '--mk-line-height-normal': font.lineHeightNormal,
    '--mk-motion-fast': motion.fast,
    '--mk-motion-medium': motion.medium,
    '--mk-motion-slow': motion.slow,
    '--mk-motion-easing-default': motion.easingDefault,
    '--mk-motion-easing-hover': motion.easingHover,
    '--mk-shadow-sm': shadow.sm,
    '--mk-shadow-md': shadow.md,
    '--mk-shadow-lg': shadow.lg,
    '--mk-z-dropdown': zIndex.dropdown,
    '--mk-z-sticky': zIndex.sticky,
    '--mk-z-modal': zIndex.modal,
    '--mk-z-toast': zIndex.toast,
  };

  for (const [key, value] of Object.entries(space)) {
    vars[`--mk-space-${key}`] = value;
  }
  for (const [key, value] of Object.entries(radius)) {
    vars[`--mk-radius-${key}`] = value;
  }

  return vars;
}
```

`packages/design-tokens/src/index.ts`:

```ts
export type { Accent, Mode } from './types';
export type { ColorTokens } from './color';
export { getColorTokens } from './color';
export { getCssVars } from './css-vars';
export { font, motion, radius, shadow, space, zIndex } from './scales';
```

- [ ] **Step 4: Run tests and build**

```bash
pnpm --filter=@meowkit/design-tokens test
pnpm --filter=@meowkit/design-tokens build
pnpm --filter=@meowkit/design-tokens typecheck
```

Expected: all PASS; `dist/` emitted.

- [ ] **Step 5: Commit**

```bash
git add packages/design-tokens
git commit -m "feat(design-tokens): add mode and accent CSS variable maps"
```

---

### Task 3: `@meowkit/global-styles`

**Files:**
- Create: `packages/global-styles/package.json`
- Create: `packages/global-styles/tsconfig.json`
- Create: `packages/global-styles/vitest.config.ts`
- Create: `packages/global-styles/tsup.config.ts`
- Create: `packages/global-styles/src/reset.css`
- Create: `packages/global-styles/src/base.css`
- Create: `packages/global-styles/src/apply-theme.ts`
- Create: `packages/global-styles/src/index.ts`
- Test: `packages/global-styles/src/apply-theme.test.ts`

**Interfaces:**
- Consumes: `getCssVars`, `Mode`, `Accent` from `@meowkit/design-tokens`
- Produces:
  - `applyMode(mode: Mode, root?: HTMLElement): void`
  - `applyAccent(accent: Accent, root?: HTMLElement): void`
  - `getMode(root?: HTMLElement): Mode`
  - `getAccent(root?: HTMLElement): Accent`
  - Side-effect CSS when importing `@meowkit/global-styles`

- [ ] **Step 1: Write failing test**

`packages/global-styles/src/apply-theme.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { applyAccent, applyMode, getAccent, getMode } from './apply-theme';

describe('apply theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-mk-mode');
    document.documentElement.removeAttribute('data-mk-accent');
    document.documentElement.removeAttribute('style');
  });

  it('applyMode sets data attribute and CSS vars', () => {
    applyMode('dark');
    expect(getMode()).toBe('dark');
    expect(document.documentElement.getAttribute('data-mk-mode')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--mk-color-background')).toBe(
      '#121412',
    );
  });

  it('applyAccent lime updates primary while preserving mode', () => {
    applyMode('light');
    applyAccent('lime');
    expect(getAccent()).toBe('lime');
    expect(document.documentElement.style.getPropertyValue('--mk-color-primary')).toBe('#BBE700');
  });
});
```

- [ ] **Step 2: Package config + install + fail test**

`packages/global-styles/package.json`:

```json
{
  "name": "@meowkit/global-styles",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@meowkit/design-tokens": "workspace:*"
  },
  "devDependencies": {
    "jsdom": "^26.0.0",
    "tsup": "^8.4.0",
    "typescript": "^5.8.2",
    "vitest": "^3.0.9"
  }
}
```

`packages/global-styles/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  loader: {
    '.css': 'copy',
  },
  esbuildOptions(options) {
    options.packages = 'external';
  },
});
```

`packages/global-styles/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

`packages/global-styles/tsconfig.json` — same pattern as design-tokens (`extends` base, `include: ["src"]`).

```bash
pnpm install
pnpm --filter=@meowkit/global-styles test
```

Expected: FAIL (missing `./apply-theme`).

- [ ] **Step 3: Implement theme + CSS**

`packages/global-styles/src/apply-theme.ts`:

```ts
import { getCssVars, type Accent, type Mode } from '@meowkit/design-tokens';

const MODE_ATTR = 'data-mk-mode';
const ACCENT_ATTR = 'data-mk-accent';

function resolveRoot(root?: HTMLElement): HTMLElement {
  return root ?? document.documentElement;
}

function readMode(root: HTMLElement): Mode {
  return root.getAttribute(MODE_ATTR) === 'dark' ? 'dark' : 'light';
}

function readAccent(root: HTMLElement): Accent {
  return root.getAttribute(ACCENT_ATTR) === 'lime' ? 'lime' : 'default';
}

function paint(root: HTMLElement): void {
  const vars = getCssVars(readMode(root), readAccent(root));
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export function getMode(root?: HTMLElement): Mode {
  return readMode(resolveRoot(root));
}

export function getAccent(root?: HTMLElement): Accent {
  return readAccent(resolveRoot(root));
}

export function applyMode(mode: Mode, root?: HTMLElement): void {
  const el = resolveRoot(root);
  el.setAttribute(MODE_ATTR, mode);
  if (!el.hasAttribute(ACCENT_ATTR)) {
    el.setAttribute(ACCENT_ATTR, 'default');
  }
  paint(el);
}

export function applyAccent(accent: Accent, root?: HTMLElement): void {
  const el = resolveRoot(root);
  el.setAttribute(ACCENT_ATTR, accent);
  if (!el.hasAttribute(MODE_ATTR)) {
    el.setAttribute(MODE_ATTR, 'light');
  }
  paint(el);
}
```

`packages/global-styles/src/reset.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}
```

`packages/global-styles/src/base.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

html {
  font-family: var(--mk-font-family-sans);
  font-size: var(--mk-font-size-md);
  line-height: var(--mk-line-height-normal);
  color: var(--mk-color-text);
  background: var(--mk-color-background);
}

code,
pre,
kbd {
  font-family: var(--mk-font-family-mono);
}
```

`packages/global-styles/src/index.ts`:

```ts
import './reset.css';
import './base.css';

export type { Accent, Mode } from '@meowkit/design-tokens';
export { applyAccent, applyMode, getAccent, getMode } from './apply-theme';
```

**Note:** If tsup CSS copy is awkward, switch build to Vite lib mode that emits `dist/index.js` + copies CSS next to it, and document `import '@meowkit/global-styles/reset.css'` separately. Prefer single entry that re-exports JS and documents:

```ts
import '@meowkit/global-styles';
```

For Vite consumers, add `"sideEffects": ["**/*.css", "./dist/index.js"]` on the package.

Update `package.json` exports if CSS is separate:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  },
  "./index.css": "./dist/index.css"
}
```

Bundle CSS into one `index.css` via a small build script or Vite if tsup copy is insufficient — verify Storybook loads styles in Task 6.

- [ ] **Step 4: Test + build**

```bash
pnpm --filter=@meowkit/global-styles test
pnpm --filter=@meowkit/global-styles build
pnpm --filter=@meowkit/global-styles typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/global-styles
git commit -m "feat(global-styles): add applyMode/applyAccent and base CSS"
```

---

### Task 4: `Button` in `@meowkit/components`

**Files:**
- Create: `packages/components/package.json`
- Create: `packages/components/tsconfig.json`
- Create: `packages/components/vitest.config.ts`
- Create: `packages/components/tsup.config.ts`
- Create: `packages/components/src/button/styles.module.css`
- Create: `packages/components/src/button/internal.tsx`
- Create: `packages/components/src/button/index.tsx`
- Test: `packages/components/src/button/button.test.tsx`

**Interfaces:**
- Consumes: CSS vars from global theme (runtime); React 18
- Produces:
  - `export interface ButtonProps` with `variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon'`, `disabled?`, `type?`, `onClick?`, `className?`, `children`, `aria-label?`
  - Default export `Button`
  - Package export path `@meowkit/components/button`

- [ ] **Step 1: Write failing test**

`packages/components/src/button/button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from './index';

describe('Button', () => {
  it('renders children and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('requires accessible name for icon variant without text', () => {
    render(
      <Button variant="icon" aria-label="Close">
        ×
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Package scaffolding + fail test**

`packages/components/package.json`:

```json
{
  "name": "@meowkit/components",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    "./button": {
      "types": "./dist/button/index.d.ts",
      "import": "./dist/button/index.js"
    },
    "./provider": {
      "types": "./dist/provider/index.d.ts",
      "import": "./dist/provider/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "dependencies": {
    "@meowkit/design-tokens": "workspace:*",
    "@meowkit/global-styles": "workspace:*",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "jsdom": "^26.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tsup": "^8.4.0",
    "typescript": "^5.8.2",
    "vitest": "^3.0.9"
  }
}
```

`packages/components/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  css: {
    modules: {
      classNameStrategy: 'non-scoped',
    },
  },
});
```

`packages/components/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

```bash
pnpm install
pnpm --filter=@meowkit/components test
```

Expected: FAIL.

- [ ] **Step 3: Implement Button**

`packages/components/src/button/styles.module.css`:

```css
.root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--mk-space-2);
  min-height: 36px;
  padding: var(--mk-space-2) var(--mk-space-4);
  border-radius: var(--mk-radius-md);
  border: 1px solid transparent;
  font-family: var(--mk-font-family-sans);
  font-size: var(--mk-font-size-sm);
  font-weight: var(--mk-font-weight-bold);
  line-height: var(--mk-line-height-tight);
  cursor: pointer;
  transition:
    background-color var(--mk-motion-medium) var(--mk-motion-easing-hover),
    border-color var(--mk-motion-medium) var(--mk-motion-easing-hover),
    color var(--mk-motion-medium) var(--mk-motion-easing-hover);
}

.root:focus-visible {
  outline: 2px solid var(--mk-color-focus-ring);
  outline-offset: 2px;
}

.root:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.primary {
  background: var(--mk-color-primary);
  color: var(--mk-color-primary-text);
}

.primary:hover:not(:disabled) {
  background: var(--mk-color-primary-hover);
}

.secondary {
  background: transparent;
  color: var(--mk-color-text);
  border-color: var(--mk-color-border-strong);
}

.secondary:hover:not(:disabled) {
  background: var(--mk-color-surface-muted);
}

.ghost {
  background: transparent;
  color: var(--mk-color-text);
}

.ghost:hover:not(:disabled) {
  background: var(--mk-color-surface-muted);
}

.destructive {
  background: var(--mk-color-error);
  color: var(--mk-color-text-inverse);
}

.destructive:hover:not(:disabled) {
  filter: brightness(0.92);
}

.icon {
  min-width: 36px;
  padding: var(--mk-space-2);
}
```

`packages/components/src/button/internal.tsx`:

```tsx
import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
}

export function InternalButton({
  variant = 'primary',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.root, styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
```

`packages/components/src/button/index.tsx`:

```tsx
export type { ButtonProps, ButtonVariant } from './internal';
export { InternalButton as default, InternalButton as Button } from './internal';
```

`packages/components/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/button/index.tsx', 'src/provider/index.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  loader: {
    '.css': 'local-css',
  },
});
```

If tsup `local-css` is unavailable in the installed version, use Vite library mode with `cssModules: true` instead — keep the same export paths.

- [ ] **Step 4: Test + build**

```bash
pnpm --filter=@meowkit/components test
pnpm --filter=@meowkit/components build
pnpm --filter=@meowkit/components typecheck
```

Expected: PASS. Confirm `dist/button/index.js` exists.

- [ ] **Step 5: Commit**

```bash
git add packages/components
git commit -m "feat(components): add Button with token-based variants"
```

---

### Task 5: `MeowKitProvider`

**Files:**
- Create: `packages/components/src/provider/context.ts`
- Create: `packages/components/src/provider/index.tsx`
- Test: `packages/components/src/provider/provider.test.tsx`

**Interfaces:**
- Consumes: `applyMode`, `applyAccent`, `Mode`, `Accent` from `@meowkit/global-styles`
- Produces:
  - `MeowKitProviderProps: { mode?: Mode; accent?: Accent; children: ReactNode }`
  - `useMeowKit(): { mode: Mode; accent: Accent; setMode; setAccent }`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MeowKitProvider, useMeowKit } from './index';

function Probe() {
  const { mode, accent, setMode, setAccent } = useMeowKit();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="accent">{accent}</span>
      <button type="button" onClick={() => setMode('dark')}>
        dark
      </button>
      <button type="button" onClick={() => setAccent('lime')}>
        lime
      </button>
    </div>
  );
}

describe('MeowKitProvider', () => {
  it('applies mode and accent to documentElement', async () => {
    const user = userEvent.setup();
    render(
      <MeowKitProvider mode="light" accent="default">
        <Probe />
      </MeowKitProvider>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    await user.click(screen.getByRole('button', { name: 'dark' }));
    expect(document.documentElement.getAttribute('data-mk-mode')).toBe('dark');
    await user.click(screen.getByRole('button', { name: 'lime' }));
    expect(document.documentElement.getAttribute('data-mk-accent')).toBe('lime');
  });
});
```

- [ ] **Step 2: Run test (expect fail), then implement**

`packages/components/src/provider/context.ts`:

```ts
import { createContext } from 'react';
import type { Accent, Mode } from '@meowkit/global-styles';

export type MeowKitContextValue = {
  mode: Mode;
  accent: Accent;
  setMode: (mode: Mode) => void;
  setAccent: (accent: Accent) => void;
};

export const MeowKitContext = createContext<MeowKitContextValue | null>(null);
```

`packages/components/src/provider/index.tsx`:

```tsx
import { applyAccent, applyMode, type Accent, type Mode } from '@meowkit/global-styles';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MeowKitContext, type MeowKitContextValue } from './context';
import { useContext } from 'react';

export interface MeowKitProviderProps {
  mode?: Mode;
  accent?: Accent;
  children: ReactNode;
}

export function MeowKitProvider({
  mode: modeProp = 'light',
  accent: accentProp = 'default',
  children,
}: MeowKitProviderProps) {
  const [mode, setModeState] = useState<Mode>(modeProp);
  const [accent, setAccentState] = useState<Accent>(accentProp);

  useEffect(() => {
    setModeState(modeProp);
  }, [modeProp]);

  useEffect(() => {
    setAccentState(accentProp);
  }, [accentProp]);

  useEffect(() => {
    applyMode(mode);
    applyAccent(accent);
  }, [mode, accent]);

  const value = useMemo<MeowKitContextValue>(
    () => ({
      mode,
      accent,
      setMode: setModeState,
      setAccent: setAccentState,
    }),
    [mode, accent],
  );

  return <MeowKitContext.Provider value={value}>{children}</MeowKitContext.Provider>;
}

export function useMeowKit(): MeowKitContextValue {
  const ctx = useContext(MeowKitContext);
  if (!ctx) {
    throw new Error('useMeowKit must be used within MeowKitProvider');
  }
  return ctx;
}
```

Move `useContext` import to the top with other React imports (no inline imports).

- [ ] **Step 3: Test + build + commit**

```bash
pnpm --filter=@meowkit/components test
pnpm --filter=@meowkit/components build
git add packages/components/src/provider packages/components/src/button
git commit -m "feat(components): add MeowKitProvider for mode and accent"
```

---

### Task 6: Storybook app

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.tsx`
- Create: `apps/storybook/stories/Button.stories.tsx`
- Modify: root `package.json` scripts if needed

**Interfaces:**
- Consumes: `@meowkit/global-styles`, `@meowkit/components/button`, `@meowkit/components/provider`
- Produces: `pnpm storybook` serving Button docs with mode/accent toolbar globals

- [ ] **Step 1: Scaffold Storybook 8 (Vite + React)**

```bash
pnpm --filter=@meowkit/storybook exec echo ok
```

Create `apps/storybook/package.json`:

```json
{
  "name": "@meowkit/storybook",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@meowkit/components": "workspace:*",
    "@meowkit/global-styles": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^8.6.4",
    "@storybook/addon-interactions": "^8.6.4",
    "@storybook/react": "^8.6.4",
    "@storybook/react-vite": "^8.6.4",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "storybook": "^8.6.4",
    "typescript": "^5.8.2",
    "vite": "^6.2.2"
  }
}
```

`apps/storybook/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

`apps/storybook/.storybook/preview.tsx`:

```tsx
import type { Preview } from '@storybook/react';
import { MeowKitProvider } from '@meowkit/components/provider';
import '@meowkit/global-styles';
import React from 'react';

const preview: Preview = {
  globalTypes: {
    mode: {
      name: 'Mode',
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    accent: {
      name: 'Accent',
      description: 'Accent theme',
      defaultValue: 'default',
      toolbar: {
        items: [
          { value: 'default', title: 'Default' },
          { value: 'lime', title: 'Lime' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <MeowKitProvider
        mode={context.globals.mode}
        accent={context.globals.accent}
      >
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </MeowKitProvider>
    ),
  ],
};

export default preview;
```

`apps/storybook/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@meowkit/components/button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  args: {
    children: 'Continue',
    variant: 'primary',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Erase' } };
export const Icon: Story = {
  args: { variant: 'icon', 'aria-label': 'Close', children: '×' },
};
```

- [ ] **Step 2: Install and run Storybook**

```bash
pnpm install
pnpm --filter=@meowkit/design-tokens build
pnpm --filter=@meowkit/global-styles build
pnpm --filter=@meowkit/components build
pnpm storybook
```

Expected: Storybook opens; Button stories render; toggling Mode/Accent updates button colors.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook package.json pnpm-lock.yaml
git commit -m "docs(storybook): add Button playground with mode and accent knobs"
```

---

### Task 7: Root README + verify smoke script

**Files:**
- Modify: `README.md`
- Create: `scripts/smoke-exports.mjs`
- Modify: `package.json` (add `smoke` script)

**Interfaces:**
- Produces: documented install/usage; `pnpm smoke` imports built entries

- [ ] **Step 1: Write smoke script**

`scripts/smoke-exports.mjs`:

```js
import { getCssVars } from '@meowkit/design-tokens';
import { applyMode } from '@meowkit/global-styles';
import Button from '@meowkit/components/button';

const vars = getCssVars('light', 'lime');
if (vars['--mk-color-primary'] !== '#BBE700') {
  throw new Error('design-tokens export failed');
}
if (typeof applyMode !== 'function') {
  throw new Error('global-styles export failed');
}
if (typeof Button !== 'function' && typeof Button !== 'object') {
  throw new Error('components/button export failed');
}
console.log('smoke ok');
```

Add to root `package.json`:

```json
"smoke": "node scripts/smoke-exports.mjs"
```

Ensure Node can resolve workspace packages (run from root after `pnpm build`, or use `pnpm exec` with package dependencies). If bare imports fail, change smoke to import via relative `packages/*/dist` paths:

```js
import { getCssVars } from '../packages/design-tokens/dist/index.js';
```

- [ ] **Step 2: Expand README**

Include:

```markdown
# MeowKit React Library

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
```

- [ ] **Step 3: Run full verification**

```bash
pnpm build
pnpm test
pnpm smoke
```

Expected: build + tests green; `smoke ok`.

- [ ] **Step 4: Commit**

```bash
git add README.md scripts/smoke-exports.mjs package.json
git commit -m "docs: add Phase 1 usage README and export smoke check"
```

---

## Phase 1 done criteria

- [ ] `pnpm build` succeeds for all three `@meowkit/*` packages  
- [ ] `pnpm test` green  
- [ ] Storybook shows Button under light/dark × default/lime  
- [ ] Path import `@meowkit/components/button` works  
- [ ] No raw hex in `packages/components/**/*.css`  

## Follow-up plans (not this document)

1. Phase 2 — Form primitives (Input, Select, Switch, Checkbox) + Alert/Modal (Radix)  
2. Phase 3 — Layout (AppLayout, Toolbar, Sidebar, StatusBar)  
3. Phase 4 — Patterns (Toast, FileExplorerTree, Table)  
4. Phase 5 — Monaco theme + MonacoEditor  
5. Phase 6 — Companion product panels  
6. Phase 7 — Changesets, a11y axe CI, publish  

---

## Plan self-review

| Spec item | Covered in Phase 1? |
|-----------|---------------------|
| Package split tokens / global-styles / components | Yes — Tasks 2–4 |
| Light/dark + lime accent | Yes — Tasks 2–3, 5–6 |
| CSS Modules + token vars only in components | Yes — Task 4 |
| Path imports | Yes — Task 4 exports + Task 6 |
| Storybook docs | Yes — Task 6 |
| MeowKitProvider | Yes — Task 5 (toast host deferred to Phase 4) |
| Button variants | Yes — Task 4 |
| Monaco / Companion panels | Explicitly deferred |
| Radix | Deferred until overlays (Phase 2) |
| Inter font | Yes — global-styles `base.css` |

No TBD placeholders. Provider toast portal intentionally deferred with a named follow-up phase.
