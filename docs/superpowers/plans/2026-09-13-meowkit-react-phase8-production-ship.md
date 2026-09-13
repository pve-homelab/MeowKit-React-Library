# MeowKit Phase 8 Production Ship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the MeowKit React library production-ready for public GitHub use by a Companion App that embeds a custom Monaco IDE — typed dist, CI, legal metadata, live Monaco docs, and an example IDE composition.

**Architecture:** Keep the existing three-package monorepo and path-import API. Fix declaration emit separately from ESM bundling if needed. Monaco stays optional peers. Companion panels stay presentational. Add CI/release/Storybook workflows and an `examples/companion-ide` Vite app.

**Tech Stack:** pnpm 9.15.0 workspaces, tsup, TypeScript 5.8, Vitest, Storybook 8 (Vite), Playwright (existing), Changesets, GitHub Actions, monaco-editor + @monaco-editor/react peers, Vite example app.

**Spec:** `docs/superpowers/specs/2026-09-13-meowkit-react-phase8-production-ship-design.md`

**Worktree:** `c:\Users\chris\OneDrive\Desktop\Cursor_Git\MeowKit React Library\MeowKit-React-Library\.worktrees\feat-phase1-foundation`

## Global Constraints

- pnpm via `npx pnpm@9.15.0` when Corepack EPERM on Windows
- Path imports only for `@meowkit/components/<name>`
- No device I/O (WebSerial/WebUSB/flash/FS) inside the library
- React peers `^18.3.1`; Monaco peers optional `monaco-editor@^0.56.0`, `@monaco-editor/react@^4.7.0`
- MIT license
- Commit after each task; do not push unless asked
- Storybook must use automatic JSX runtime
- `NODE_OPTIONS=--max-old-space-size=8192` for component builds that emit DTS if heap pressure remains
- Every public `exports` entry must ship matching `.d.ts`
- Tests: TDD where adding behavior; run focused tests then package/workspace suite before commit
- Do not publish to npm without `NPM_TOKEN`; still add the workflow

---

## File structure (create/modify)

| Path | Responsibility |
| --- | --- |
| `LICENSE` | MIT text |
| `CONTRIBUTING.md` | Contributor workflow |
| `README.md` | Consumer + IDE docs |
| `packages/*/package.json` | license, repository, publishConfig |
| `packages/components/tsup.config.ts` | `dts: false` if splitting |
| `packages/components/tsconfig.build.json` | emitDeclarationOnly |
| `packages/components/package.json` | build script + heap |
| `scripts/smoke-exports.mjs` | assert types files |
| `apps/storybook/.storybook/main.ts` | jsx automatic |
| `apps/storybook/tsconfig.json` | jsx react-jsx |
| `apps/storybook/package.json` | monaco peers |
| `apps/storybook/stories/MonacoEditor.stories.tsx` | live story |
| `packages/components/src/monaco-editor/*` | typed options + markers helper |
| `packages/components/src/select/*` | aria-describedby |
| `packages/components/src/a11y/companion.a11y.test.tsx` | panel axe |
| `packages/components/src/ide-toolbar/*` | conditional actions |
| `examples/companion-ide/**` | Vite IDE example |
| `.github/workflows/ci.yml` | CI |
| `.github/workflows/release.yml` | Changesets |
| `.github/workflows/storybook.yml` | Pages |
| `.changeset/*.md` | ship changeset |

---

### Task 1: Commit Storybook JSX automatic runtime fix

**Files:**
- Modify: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/tsconfig.json`

**Interfaces:**
- Consumes: none
- Produces: Storybook stories compile with `react/jsx-runtime` (no `React is not defined`)

- [ ] **Step 1: Ensure main.ts has viteFinal**

`apps/storybook/.storybook/main.ts` must contain:

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      esbuild: {
        jsx: 'automatic',
      },
    });
  },
};

export default config;
```

- [ ] **Step 2: Ensure tsconfig.json exists**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "noEmit": true,
    "rootDir": ".",
    "baseUrl": "."
  },
  "include": [".storybook/**/*", "stories/**/*"]
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/.storybook/main.ts apps/storybook/tsconfig.json
git commit -m "$(cat <<'EOF'
fix(storybook): use automatic JSX runtime

EOF
)"
```

---

### Task 2: Reliable component DTS emit

**Files:**
- Modify: `packages/components/tsup.config.ts`
- Create: `packages/components/tsconfig.build.json`
- Modify: `packages/components/package.json` scripts
- Modify: root `package.json` build if needed for heap

**Interfaces:**
- Consumes: existing `src/**` entry map in tsup
- Produces: `dist/<entry>/index.js`, `dist/<entry>/index.css` (when applicable), `dist/<entry>/index.d.ts` for every export

- [ ] **Step 1: Add tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false,
    "allowImportingTsExtensions": false
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.stories.tsx", "node_modules", "dist"]
}
```

If `packages/components/tsconfig.json` does not exist, create one extending `../../tsconfig.base.json` with `"jsx": "react-jsx"`, `"composite": false`, and path settings matching current package.

- [ ] **Step 2: Switch tsup to `dts: false`**

In `packages/components/tsup.config.ts` set `dts: false` (keep ESM + CSS + onSuccess CSS import injection).

- [ ] **Step 3: Update package build script**

In `packages/components/package.json`:

```json
"build": "tsup && tsc -p tsconfig.build.json"
```

If `tsc` emits flat `dist/button/index.d.ts` under folder structure matching entries, verify. If tsc emits `dist/button/index.d.ts` from `src/button/index.tsx`, paths must match `exports` (`./dist/button/index.d.ts`).

If declaration emit nests incorrectly, add a small post-build script `scripts/fix-dts-layout.mjs` only if needed — prefer fixing `rootDir`/`outDir` first.

- [ ] **Step 4: Raise heap for Windows OOM**

In `packages/components/package.json` prefer:

```json
"build": "node --max-old-space-size=8192 ./node_modules/tsup/dist/cli-default.js && node --max-old-space-size=8192 ./node_modules/typescript/bin/tsc -p tsconfig.build.json"
```

Or cross-platform via setting in the script using `cross-env` **only if already a dependency**; otherwise document `NODE_OPTIONS` in root build:

Root `package.json`:

```json
"build": "node --max-old-space-size=8192 ./node_modules/pnpm/bin/pnpm.cjs -r --filter=@meowkit/* run build"
```

Prefer the simplest approach that works on this Windows machine: set `NODE_OPTIONS=--max-old-space-size=8192` in the components build script using PowerShell-safe form is not portable — use `node --max-old-space-size=8192` invoking tsup/tsc binaries.

- [ ] **Step 5: Build and verify DTS exist**

Run:

```bash
npx pnpm@9.15.0 --filter=@meowkit/components build
```

Expected: `packages/components/dist/button/index.d.ts` and `packages/components/dist/monaco-editor/index.d.ts` exist. Count `.d.ts` files for entry folders ≥ number of export entries (56).

- [ ] **Step 6: Commit**

```bash
git add packages/components/tsup.config.ts packages/components/tsconfig.build.json packages/components/package.json packages/components/tsconfig.json
git commit -m "$(cat <<'EOF'
build(components): emit declarations via tsc after tsup

EOF
)"
```

---

### Task 3: Smoke asserts declaration files

**Files:**
- Modify: `scripts/smoke-exports.mjs`

**Interfaces:**
- Consumes: `packages/components/package.json` exports `{ import, types }`
- Produces: smoke failure if any `types` path missing

- [ ] **Step 1: Extend smoke loop**

Inside the existing `for (const key of exportKeys)` loop, after resolving `importPath`, also:

```js
const typesPath = typeof entry === 'string' ? null : entry.types;
if (typeof typesPath !== 'string') {
  throw new Error(`components${key} is missing a types target`);
}
const absTypes = resolve(componentsRoot, typesPath);
if (!existsSync(absTypes)) {
  throw new Error(`missing types ${absTypes}`);
}
```

- [ ] **Step 2: Run smoke**

```bash
npx pnpm@9.15.0 build
npx pnpm@9.15.0 smoke
```

Expected: `smoke ok (56 component entries)` (or current export count).

- [ ] **Step 3: Commit**

```bash
git add scripts/smoke-exports.mjs
git commit -m "$(cat <<'EOF'
test: assert component export declaration files in smoke

EOF
)"
```

---

### Task 4: MIT license + package publish metadata

**Files:**
- Create: `LICENSE`
- Modify: `packages/design-tokens/package.json`
- Modify: `packages/global-styles/package.json`
- Modify: `packages/components/package.json`
- Modify: root `package.json` (optional `license` field)

**Interfaces:**
- Produces: legally clear MIT packages with GitHub repository metadata for `pve-homelab/MeowKit-React-Library`

- [ ] **Step 1: Write LICENSE**

Standard MIT text, copyright `Copyright (c) 2026 MeowKit / pve-homelab`.

- [ ] **Step 2: Patch each public package.json**

Add:

```json
"license": "MIT",
"repository": {
  "type": "git",
  "url": "git+https://github.com/pve-homelab/MeowKit-React-Library.git"
},
"homepage": "https://github.com/pve-homelab/MeowKit-React-Library#readme",
"bugs": {
  "url": "https://github.com/pve-homelab/MeowKit-React-Library/issues"
},
"publishConfig": {
  "access": "public"
}
```

- [ ] **Step 3: Commit**

```bash
git add LICENSE packages/design-tokens/package.json packages/global-styles/package.json packages/components/package.json
git commit -m "$(cat <<'EOF'
chore: add MIT license and package publish metadata

EOF
)"
```

---

### Task 5: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: PR/push CI running install, build, test, typecheck, smoke

- [ ] **Step 1: Create ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, 'feat/**']
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm build
        env:
          NODE_OPTIONS: --max-old-space-size=8192
      - run: pnpm test
      - run: pnpm typecheck
      - run: pnpm smoke
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
ci: add verify workflow for build, test, and smoke

EOF
)"
```

---

### Task 6: Typed Monaco options + markers helper

**Files:**
- Modify: `packages/components/src/monaco-editor/internal.tsx`
- Modify: `packages/components/src/monaco-editor/index.tsx` (re-exports)
- Create: `packages/components/src/monaco-editor/markers.ts`
- Modify: `packages/components/src/monaco-editor/monaco-editor.test.tsx`
- Create: `packages/components/src/monaco-editor/markers.test.ts`

**Interfaces:**
- Consumes: `monaco-editor` `editor` namespace
- Produces:
  - `MonacoEditorProps.options?: editor.IStandaloneEditorConstructionOptions`
  - `export function applyModelMarkers(monaco, editor, markers): void`
  - Marker type alias `MeowKitMarkerData` based on `editor.IMarkerData`

- [ ] **Step 1: Write failing test for options typing / markers helper**

`markers.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { applyModelMarkers } from './markers';

describe('applyModelMarkers', () => {
  it('sets markers on the editor model with owner meowkit', () => {
    const model = { uri: { toString: () => 'file:///main.js' } };
    const editorInstance = { getModel: () => model };
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, editorInstance as never, [
      {
        severity: 8,
        message: 'Expected ;',
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 2,
      },
    ]);
    expect(setModelMarkers).toHaveBeenCalledWith(model, 'meowkit', expect.any(Array));
  });

  it('clears markers when given an empty list', () => {
    const model = {};
    const editorInstance = { getModel: () => model };
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, editorInstance as never, []);
    expect(setModelMarkers).toHaveBeenCalledWith(model, 'meowkit', []);
  });

  it('no-ops when model is missing', () => {
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, { getModel: () => null } as never, []);
    expect(setModelMarkers).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx pnpm@9.15.0 --filter=@meowkit/components exec vitest run src/monaco-editor/markers.test.ts
```

- [ ] **Step 3: Implement markers.ts and tighten options type**

```ts
import type { editor } from 'monaco-editor';

export type MeowKitMarkerData = editor.IMarkerData;

export function applyModelMarkers(
  monaco: typeof import('monaco-editor'),
  editorInstance: editor.IStandaloneCodeEditor,
  markers: MeowKitMarkerData[],
): void {
  const model = editorInstance.getModel();
  if (!model) return;
  monaco.editor.setModelMarkers(model, 'meowkit', markers);
}
```

In `internal.tsx` change:

```ts
options?: editor.IStandaloneEditorConstructionOptions;
```

Re-export `applyModelMarkers` and `MeowKitMarkerData` from `monaco-editor/index.tsx`.

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx pnpm@9.15.0 --filter=@meowkit/components exec vitest run src/monaco-editor
```

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/monaco-editor
git commit -m "$(cat <<'EOF'
feat(monaco-editor): type options and add applyModelMarkers helper

EOF
)"
```

---

### Task 7: Live Monaco Storybook story

**Files:**
- Modify: `apps/storybook/package.json`
- Modify: `apps/storybook/stories/MonacoEditor.stories.tsx`
- Modify: `apps/storybook/.storybook/main.ts` if Vite needs `optimizeDeps` / worker aliases

**Interfaces:**
- Consumes: `@meowkit/components/monaco-editor`
- Produces: Story `Patterns/MonacoEditor/Live` rendering a real editor

- [ ] **Step 1: Add peers to Storybook app**

```bash
npx pnpm@9.15.0 --filter=@meowkit/storybook add monaco-editor@^0.56.0 @monaco-editor/react@^4.7.0
```

- [ ] **Step 2: Replace/extend stories**

Keep a Docs snippet if useful; add:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import MonacoEditor from '@meowkit/components/monaco-editor';
import { useState } from 'react';

const meta: Meta<typeof MonacoEditor> = {
  title: 'Patterns/MonacoEditor',
  component: MonacoEditor,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof MonacoEditor>;

export const Live: Story = {
  render: () => {
    const [value, setValue] = useState('print("hello from MeowKit")\n');
    return (
      <MonacoEditor
        language="python"
        path="main.py"
        height={360}
        value={value}
        onChange={setValue}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
    );
  },
};
```

If Vite worker issues appear, in `viteFinal` add:

```ts
optimizeDeps: { include: ['monaco-editor', '@monaco-editor/react'] },
```

- [ ] **Step 3: Manual verify via Playwright or storybook build**

```bash
npx pnpm@9.15.0 --filter=@meowkit/storybook build-storybook
```

Expected: build succeeds. If storybook already running, load `patterns-monacoeditor--live`.

- [ ] **Step 4: Commit**

```bash
git add apps/storybook/package.json apps/storybook/stories/MonacoEditor.stories.tsx apps/storybook/.storybook/main.ts pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(storybook): add live MonacoEditor story

EOF
)"
```

---

### Task 8: Example Companion IDE app

**Files:**
- Create: `examples/companion-ide/package.json`
- Create: `examples/companion-ide/vite.config.ts`
- Create: `examples/companion-ide/index.html`
- Create: `examples/companion-ide/tsconfig.json`
- Create: `examples/companion-ide/src/main.tsx`
- Create: `examples/companion-ide/src/App.tsx`
- Modify: `pnpm-workspace.yaml` to include `examples/*`
- Modify: `README.md` (brief pointer; full docs in Task 11 OK)

**Interfaces:**
- Consumes: MeowKit layout + Monaco + IDEToolbar + FileExplorerTree + BuildOutputPanel + SerialConsoleView via workspace protocol
- Produces: runnable `pnpm --filter=@meowkit/example-companion-ide dev`

- [ ] **Step 1: Add workspace package**

`pnpm-workspace.yaml` packages array must include `examples/*`.

`examples/companion-ide/package.json`:

```json
{
  "name": "@meowkit/example-companion-ide",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@meowkit/components": "workspace:*",
    "@meowkit/global-styles": "workspace:*",
    "@monaco-editor/react": "^4.7.0",
    "monaco-editor": "^0.56.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.8.2",
    "vite": "^6.2.2"
  }
}
```

- [ ] **Step 2: Implement App shell**

`App.tsx` must compose:

- `MeowKitProvider`
- `AppLayout` with `Sidebar`/`FileExplorerTree` navigation, `IDEToolbar` + `MonacoEditor` content, `BuildOutputPanel` tools, `StatusBar`
- Mock tree nodes and serial log state via `useState`
- Callbacks only (no WebSerial)

Keep the file focused (<250 lines). Extract `mockFiles.ts` if needed.

- [ ] **Step 3: Install and build example**

```bash
npx pnpm@9.15.0 install
npx pnpm@9.15.0 --filter=@meowkit/components build
npx pnpm@9.15.0 --filter=@meowkit/example-companion-ide build
```

Expected: Vite build succeeds.

- [ ] **Step 4: Commit**

```bash
git add examples pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(examples): add companion IDE Vite composition

EOF
)"
```

---

### Task 9: Companion/IDE axe coverage + Select describedby

**Files:**
- Create: `packages/components/src/a11y/companion.a11y.test.tsx`
- Modify: `packages/components/src/select/internal.tsx` (and tests) for `aria-describedby` pass-through like Multiselect
- Modify: `packages/components/src/ide-toolbar/internal.tsx` to skip actions without handlers

**Interfaces:**
- Select: forward `aria-describedby` from props onto the trigger/combobox element
- IDEToolbar: if `onSave` undefined, do not render Save button (same for Build/Flash/Run)

- [ ] **Step 1: Write failing Select test** if not present — assert describedby on trigger

- [ ] **Step 2: Implement Select describedby**

Mirror Multiselect: accept `aria-describedby?: string` on props and set on the focusable trigger.

- [ ] **Step 3: Write companion axe tests**

Mount with Provider + axe for:

- `IDEToolbar` with at least one handler
- `FileExplorerTree` with two nodes
- `SerialConsoleView` connected
- `DeviceManagerPanel` idle with one device

Use same axe helper pattern as `critical.a11y.test.tsx`.

- [ ] **Step 4: IDEToolbar conditional actions**

Only render each action button when its corresponding handler prop is defined.

- [ ] **Step 5: Run tests**

```bash
npx pnpm@9.15.0 --filter=@meowkit/components test
```

- [ ] **Step 6: Commit**

```bash
git add packages/components/src
git commit -m "$(cat <<'EOF'
fix(a11y): companion axe coverage, Select describedby, toolbar actions

EOF
)"
```

---

### Task 10: Release + Storybook Pages workflows + Changeset

**Files:**
- Create: `.github/workflows/release.yml`
- Create: `.github/workflows/storybook.yml`
- Create: `.changeset/phase8-ship.md` (or via changeset CLI)

**Interfaces:**
- Release workflow uses `changesets/action`
- Storybook workflow uploads `apps/storybook/storybook-static` to GitHub Pages

- [ ] **Step 1: release.yml**

```yaml
name: Release
on:
  push:
    branches: [main]
concurrency: ${{ github.workflow }}-${{ github.ref }}
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm build
        env:
          NODE_OPTIONS: --max-old-space-size=8192
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          version: pnpm version-packages
          publish: pnpm exec changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 2: storybook.yml**

Build Storybook after workspace build; deploy `apps/storybook/storybook-static` with `actions/upload-pages-artifact` + `actions/deploy-pages` (or peaceiris/actions-gh-pages). Use official Pages actions.

- [ ] **Step 3: Add changeset**

```md
---
"@meowkit/design-tokens": patch
"@meowkit/global-styles": patch
"@meowkit/components": patch
---

Phase 8 production ship: declarations, CI, Monaco live docs, companion example, a11y polish.
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows .changeset
git commit -m "$(cat <<'EOF'
ci: add release and Storybook Pages workflows

EOF
)"
```

---

### Task 11: CONTRIBUTING + README consumer/IDE docs

**Files:**
- Create: `CONTRIBUTING.md`
- Modify: `README.md`

**Interfaces:**
- Docs must explain: install from workspace, optional Monaco peers, live Storybook, `examples/companion-ide`, CI, Changesets, CSP note for Google Fonts

- [ ] **Step 1: Write CONTRIBUTING.md** covering install, build heap, test, smoke, Storybook, changeset flow

- [ ] **Step 2: Update README** with sections:

- Consume like a Companion App (link example)
- Live Monaco Storybook story id
- Publishing / Changesets / required `NPM_TOKEN`
- Accessibility notes including companion axe file

- [ ] **Step 3: Commit**

```bash
git add CONTRIBUTING.md README.md
git commit -m "$(cat <<'EOF'
docs: contributor guide and Companion IDE consumption notes

EOF
)"
```

---

### Task 12: Final verification gate

**Files:** none (verification only); fix only if gate fails

- [ ] **Step 1: Full verify**

```bash
npx pnpm@9.15.0 install
npx pnpm@9.15.0 build
npx pnpm@9.15.0 test
npx pnpm@9.15.0 typecheck
npx pnpm@9.15.0 smoke
npx pnpm@9.15.0 --filter=@meowkit/example-companion-ide build
npx pnpm@9.15.0 --filter=@meowkit/storybook build-storybook
```

Expected: all green; DTS present; smoke mentions types implicitly by not throwing.

- [ ] **Step 2: Write report**

Create `.superpowers/sdd/phase8-final-report.md` summarizing commits, test counts, known residual risks (npm publish needs token; GH Pages needs repo setting).

- [ ] **Step 3: Commit report only if not gitignored; otherwise leave in `.superpowers/`

If `.superpowers` is gitignored, still write the report for the controller.

---

## Self-review

1. **Spec coverage:** P0–P1 items from Phase 8 design mapped to Tasks 1–12; P2 fonts self-host deferred intentionally.
2. **Placeholders:** none intentional; DTS layout fix script only if tsc layout fails.
3. **Type consistency:** `applyModelMarkers`, `MeowKitMarkerData`, `IStandaloneEditorConstructionOptions` named consistently across Task 6–8.
