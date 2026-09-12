# MeowKit React UI Library — Phase 2 Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `@meowkit/components` from Button-only into a Cloudscape-like primitive set (forms, feedback, overlays, tabs, chrome atoms) with Storybook coverage, so Companion can compose real screens.

**Architecture:** Same Phase 1 packaging: path imports, CSS Modules + `var(--mk-*)`, `forwardRef`, controllable/uncontrolled where idiomatic. Radix primitives for Select, Menu, Tabs, Dialog, Popover, Tooltip, Switch. Toast host lands in `MeowKitProvider`. Follow existing `src/<name>/{index.tsx,internal.tsx,styles.module.css,*.test.tsx}` layout and tsup multi-entry + CSS side-effect injection.

**Tech Stack:** React 18, TypeScript, Vitest + Testing Library, tsup, CSS Modules, `@radix-ui/react-*`, Storybook 8, pnpm via `npx pnpm@9.15.0` on Windows.

**Prior work:** Phase 1 complete on branch `feat/phase1-foundation` (tokens, global-styles, Button, Provider, Storybook). Spec: `docs/superpowers/specs/2026-09-13-meowkit-react-ui-library-design.md`.

**Later plans (not this doc):** Phase 3 Layout (AppLayout…), Phase 4 Patterns (Table, FileExplorerTree), Phase 5 Monaco, Phase 6 Companion panels, Phase 7 Changesets/a11y CI.

## Global Constraints

- Package names remain `@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components` only (Storybook app stays private `@meowkit/storybook`).
- Component CSS: only `var(--mk-*)` — never raw brand hex.
- Path imports: `@meowkit/components/<name>`.
- Standard React events (no `event.detail`).
- Modes `light`|`dark`; accents `default`|`lime`.
- `forwardRef` on interactive elements that wrap DOM nodes.
- Icon-only / unlabeled icon controls require accessible names.
- Use `npx pnpm@9.15.0` for all pnpm commands on this host.
- Commit `pnpm-lock.yaml` whenever deps change.
- Do not implement WebSerial/WebUSB/flash backends or Monaco in Phase 2.
- Keep imports at file top (no inline imports).

## Conventions every component follows

1. Files: `packages/components/src/<component>/{index.tsx,internal.tsx,styles.module.css,<component>.test.tsx}` (+ Storybook `apps/storybook/stories/<Component>.stories.tsx`).
2. Public API: default export + named export; props interface `<Name>Props`.
3. Register every new entry in `packages/components/package.json` `exports` and `tsup.config.ts` `entry`.
4. Update `tsup` `onSuccess` to inject `import "./index.css"` for **every** entry that emits CSS (generalize beyond button-only).
5. Tests: RTL + user-event; assert roles/labels/behavior.
6. After each component task: `npx pnpm@9.15.0 --filter=@meowkit/components test` and `build` green.

## File map (new)

| Path | Responsibility |
|------|----------------|
| `packages/components/src/form-field/*` | Label + description + error wrapper |
| `packages/components/src/input/*` | Text input |
| `packages/components/src/textarea/*` | Multiline text |
| `packages/components/src/search-input/*` | Search field |
| `packages/components/src/number-input/*` | Numeric input |
| `packages/components/src/file-input/*` | File picker |
| `packages/components/src/checkbox/*` | Checkbox |
| `packages/components/src/radio-group/*` | Radio group |
| `packages/components/src/switch/*` | Switch (Radix) |
| `packages/components/src/slider/*` | Range slider |
| `packages/components/src/select/*` | Select (Radix) |
| `packages/components/src/button-dropdown/*` | Menu button (Radix DropdownMenu) |
| `packages/components/src/tabs/*` | Tabs (Radix) |
| `packages/components/src/segmented-control/*` | Segmented control |
| `packages/components/src/badge/*`, `tag/*`, `link/*`, `spinner/*`, `progress-bar/*` | Chrome atoms |
| `packages/components/src/alert/*` | Inline alert |
| `packages/components/src/modal/*` | Modal dialog (Radix) |
| `packages/components/src/drawer/*` | Side drawer |
| `packages/components/src/popover/*`, `tooltip/*` | Overlays (Radix) |
| `packages/components/src/flashbar/*` | Toast/flashbar + hook |
| Update `provider` | Mount flashbar host |
| `scripts/smoke-exports.mjs` | Assert new path exports |
| `README.md` | Component list + Storybook screenshot section |

---

### Task 1: Build plumbing + Radix deps + FormField

**Files:**
- Modify: `packages/components/package.json`
- Modify: `packages/components/tsup.config.ts`
- Create: `packages/components/src/form-field/{index.tsx,internal.tsx,styles.module.css,form-field.test.tsx}`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: existing Button/Provider patterns
- Produces:
  - deps: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-slider` (add as needed; install all listed now)
  - `FormFieldProps`: `{ label?: ReactNode; description?: ReactNode; errorText?: ReactNode; children: ReactNode; htmlFor?: string; className?: string }`
  - Export `@meowkit/components/form-field`
  - `tsup` `onSuccess` injects CSS import for **all** `dist/*/index.js` that have sibling `index.css`

- [ ] **Step 1: Install Radix deps**

```bash
npx pnpm@9.15.0 --filter=@meowkit/components add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-slider
```

- [ ] **Step 2: Write FormField failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormField from './index';

describe('FormField', () => {
  it('associates label with control via htmlFor', () => {
    render(
      <FormField label="Device name" htmlFor="device-name">
        <input id="device-name" />
      </FormField>,
    );
    expect(screen.getByLabelText('Device name')).toBeInTheDocument();
  });

  it('shows error text', () => {
    render(
      <FormField label="Port" errorText="Required" htmlFor="port">
        <input id="port" />
      </FormField>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement FormField + generalize tsup CSS injection**

FormField: stack label (`font-weight: medium`), description (`color: var(--mk-color-text-muted)`), children, error (`color: var(--mk-color-error)`). Use CSS Modules + tokens only.

`tsup.config.ts` `onSuccess`:

```ts
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

async function onSuccess() {
  const dist = 'dist';
  for (const name of readdirSync(dist, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const jsPath = join(dist, name.name, 'index.js');
    const cssPath = join(dist, name.name, 'index.css');
    if (!existsSync(jsPath) || !existsSync(cssPath)) continue;
    const js = readFileSync(jsPath, 'utf8');
    if (!js.includes('./index.css')) {
      writeFileSync(jsPath, `import "./index.css";\n${js}`);
    }
  }
}
```

Add `form-field/index` to tsup entry + package exports.

- [ ] **Step 4: Test, build, commit**

```bash
npx pnpm@9.15.0 --filter=@meowkit/components test
npx pnpm@9.15.0 --filter=@meowkit/components build
git add packages/components pnpm-lock.yaml
git commit -m "feat(components): add FormField and Radix dependencies"
```

---

### Task 2: Input, Textarea, SearchInput, NumberInput

**Files:** create `input`, `textarea`, `search-input`, `number-input` modules as above; stories for each; update exports/tsup.

**Interfaces:**
- `InputProps` extends `InputHTMLAttributes<HTMLInputElement>` minus conflicting; add `invalid?: boolean`; `forwardRef<HTMLInputElement>`
- `TextareaProps` similarly for textarea
- `SearchInputProps`: Input-like with `type="search"` default; optional `onClear?: () => void`
- `NumberInputProps`: `value?: number | ''`; `onChange?: (value: number | '') => void`; also support uncontrolled; steppable via native `type="number"`
- All support `disabled`, `className`, `aria-invalid` when `invalid`

- [ ] **Step 1: Failing tests** (one file per component)

Input: types text, fires onChange; respects disabled.  
Textarea: multiline onChange.  
SearchInput: role searchbox or textbox with type search.  
NumberInput: controlled value updates via typing.

- [ ] **Step 2: Implement with shared field chrome styles**

Shared visual language: border `var(--mk-color-border)`, radius `var(--mk-radius-md)`, padding `var(--mk-space-2) var(--mk-space-3)`, focus ring `var(--mk-color-focus-ring)`, invalid border `var(--mk-color-error)`.

- [ ] **Step 3: Stories + build/test/commit**

```bash
git commit -m "feat(components): add Input, Textarea, SearchInput, NumberInput"
```

---

### Task 3: FileInput

**Files:** `packages/components/src/file-input/*` + story

**Interfaces:**
- `FileInputProps`: `accept?: string`; `multiple?: boolean`; `disabled?: boolean`; `onChange?: (files: FileList | null) => void`; `buttonText?: string` (default `"Choose file"`); `forwardRef` to hidden input
- Visible Button triggers click on hidden `<input type="file">`; show selected file name(s) as text

- [ ] TDD → implement → Storybook → commit  
  Message: `feat(components): add FileInput`

---

### Task 4: Checkbox, Switch, RadioGroup

**Files:** `checkbox`, `switch`, `radio-group` + stories

**Interfaces:**
- `CheckboxProps`: controllable `checked`/`defaultChecked`/`onChange(checked: boolean)`; `indeterminate?: boolean`; `disabled?`; label via `children`
- `SwitchProps`: Radix Switch; `checked`/`onCheckedChange`; `disabled?`; accessible name required
- `RadioGroupProps`: `{ value?: string; defaultValue?: string; onChange?: (value: string) => void; items: { value: string; label: ReactNode; disabled?: boolean }[]; name?: string; disabled?: boolean }`
- Use native radios grouped with `role="radiogroup"` or Radix if preferred — native is fine for RadioGroup

- [ ] TDD (toggle checkbox; switch; select radio) → implement → stories → commit  
  Message: `feat(components): add Checkbox, Switch, and RadioGroup`

---

### Task 5: Slider

**Files:** `slider/*` + story

**Interfaces:**
- Wrap `@radix-ui/react-slider`
- `SliderProps`: `value?: number[]`; `defaultValue?: number[]`; `onChange?: (value: number[]) => void`; `min?`; `max?`; `step?`; `disabled?`; `aria-label` required when no visible label

- [ ] TDD → implement → story → commit  
  Message: `feat(components): add Slider`

---

### Task 6: Select

**Files:** `select/*` + story

**Interfaces:**
- Wrap `@radix-ui/react-select`
- `SelectProps`: `{ options: { value: string; label: ReactNode; disabled?: boolean }[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; placeholder?: string; disabled?: boolean; invalid?: boolean }`
- Keyboard/open behavior from Radix; styled with tokens

- [ ] TDD: open listbox, choose option, onChange fires → implement → story → commit  
  Message: `feat(components): add Select`

---

### Task 7: ButtonDropdown (Menu)

**Files:** `button-dropdown/*` + story

**Interfaces:**
- `@radix-ui/react-dropdown-menu`
- `ButtonDropdownProps`: `{ items: { id: string; text: ReactNode; disabled?: boolean; destructive?: boolean }[]; onItemClick?: (id: string) => void; variant?: ButtonVariant; children: ReactNode; disabled?: boolean }`
- Trigger is MeowKit `Button`

- [ ] TDD: open menu, click item → implement → story → commit  
  Message: `feat(components): add ButtonDropdown`

---

### Task 8: Tabs + SegmentedControl

**Files:** `tabs/*`, `segmented-control/*` + stories

**Interfaces:**
- `TabsProps`: `{ tabs: { id: string; label: ReactNode; content: ReactNode; disabled?: boolean }[]; activeTabId?: string; defaultActiveTabId?: string; onChange?: (id: string) => void }` using Radix Tabs
- `SegmentedControlProps`: `{ options: { value: string; label: ReactNode; disabled?: boolean }[]; value?: string; defaultValue?: string; onChange?: (value: string) => void }` — radiogroup of toggle buttons styled as segments

- [ ] TDD → implement → stories → commit  
  Message: `feat(components): add Tabs and SegmentedControl`

---

### Task 9: Badge, Tag, Link, Spinner, ProgressBar

**Files:** five modules + stories

**Interfaces:**
- `BadgeProps`: `{ children; color?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info' }`
- `TagProps`: `{ children; onDismiss?: () => void; dismissLabel?: string }`
- `LinkProps`: extends `AnchorHTMLAttributes`; `variant?: 'primary' | 'secondary'`
- `SpinnerProps`: `{ size?: 'sm' | 'md' | 'lg'; 'aria-label'?: string }` default label `"Loading"`
- `ProgressBarProps`: `{ value: number; max?: number; label?: ReactNode; description?: ReactNode }` — `role="progressbar"` with aria-valuenow

- [ ] TDD smoke per component → implement → stories → commit  
  Message: `feat(components): add Badge, Tag, Link, Spinner, ProgressBar`

---

### Task 10: Alert

**Files:** `alert/*` + story

**Interfaces:**
- `AlertProps`: `{ type?: 'info' | 'success' | 'warning' | 'error'; header?: ReactNode; children?: ReactNode; dismissible?: boolean; onDismiss?: () => void; action?: ReactNode }`
- `role="alert"` for error/warning; status region otherwise

- [ ] TDD → implement → story → commit  
  Message: `feat(components): add Alert`

---

### Task 11: Modal

**Files:** `modal/*` + story

**Interfaces:**
- Radix Dialog
- `ModalProps`: `{ visible: boolean; onDismiss: () => void; header?: ReactNode; children?: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg' }`
- Focus trap + Escape dismiss from Radix; overlay uses `var(--mk-color-overlay)`

- [ ] TDD: open shows dialog; dismiss calls onDismiss → implement → story → commit  
  Message: `feat(components): add Modal`

---

### Task 12: Drawer

**Files:** `drawer/*` + story

**Interfaces:**
- `DrawerProps`: `{ visible: boolean; onDismiss: () => void; header?: ReactNode; children?: ReactNode; position?: 'left' | 'right' }`
- Can use Radix Dialog positioned as panel, or custom with focus trap — prefer Radix Dialog with side panel styles

- [ ] TDD → implement → story → commit  
  Message: `feat(components): add Drawer`

---

### Task 13: Popover + Tooltip

**Files:** `popover/*`, `tooltip/*` + stories

**Interfaces:**
- Radix Popover / Tooltip
- `PopoverProps`: `{ children: ReactNode /* trigger */; content: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }`
- `TooltipProps`: `{ children: ReactNode; content: ReactNode; side?: 'top' | 'right' | 'bottom' | 'left' }`
- Provider: wrap Tooltip.Provider once inside MeowKitProvider OR document consumers wrap — prefer add `TooltipProvider` inside `MeowKitProvider`

- [ ] TDD → implement → update Provider → stories → commit  
  Message: `feat(components): add Popover and Tooltip`

---

### Task 14: Flashbar (toasts) + Provider host

**Files:** `flashbar/*`; modify `provider/*`; story

**Interfaces:**
- `FlashbarItem`: `{ id: string; type?: Alert['type']; content: ReactNode; header?: ReactNode; dismissible?: boolean }`
- `FlashbarProps`: `{ items: FlashbarItem[]; onDismiss?: (id: string) => void }`
- `useFlashbar()` optional imperative API: `{ items, add(item), dismiss(id), clear() }` via context in Provider
- Provider mounts a portal region `position: fixed; z-index: var(--mk-z-toast)` for flashbar when using imperative API; declarative `<Flashbar>` also supported

- [ ] TDD: add item appears; dismiss removes → implement → stories → commit  
  Message: `feat(components): add Flashbar toast system`

---

### Task 15: Smoke exports + README screenshots section

**Files:**
- Modify: `scripts/smoke-exports.mjs`
- Modify: `README.md`
- Create: `docs/images/` screenshots (capture from Storybook static or running storybook)

**Interfaces:**
- Smoke dynamically imports (relative dist) for: button, provider, form-field, input, textarea, select, modal, alert, tabs, flashbar (at minimum every Phase 2 public entry)
- README: table of components with Storybook path; **Screenshots** section with images for Button, Input, Modal, App chrome atoms (at least 4 PNGs)
- How to capture: run `npx pnpm@9.15.0 build && npx pnpm@9.15.0 --filter=@meowkit/storybook build-storybook`, then use Playwright/puppeteer OR manual screenshot tool to save PNGs under `docs/images/`. If headless capture is hard on Windows, use Storybook test-runner or a small `scripts/capture-screenshots.mjs` with `playwright`. Prefer automated Playwright script committed under `scripts/`.

- [ ] **Step 1: Extend smoke** for new entries  
- [ ] **Step 2: Capture screenshots into `docs/images/` and embed in README**  
- [ ] **Step 3: `pnpm build && pnpm test && pnpm smoke`**  
- [ ] **Step 4: Commit**

```bash
git commit -m "docs: expand README with Phase 2 components and screenshots"
```

---

## Phase 2 done criteria

- [ ] All Task 1–14 components exported via path imports and covered by unit tests  
- [ ] Storybook stories exist for each public component  
- [ ] `pnpm build`, `pnpm test`, `pnpm smoke` green  
- [ ] README lists components and includes visual screenshots  
- [ ] No raw hex in `packages/components/**/*.css`  

## Plan self-review

| Spec §5.1 item | Task |
|----------------|------|
| Button | Phase 1 (done) |
| Inputs family | Tasks 2–3 |
| Checkbox/Radio/Switch/Slider | Tasks 4–5 |
| Select / ButtonDropdown | Tasks 6–7 |
| Tabs / SegmentedControl | Task 8 |
| Badge/Tag/Link/Spinner/Progress | Task 9 |
| Alert / Modal / Drawer / Popover / Tooltip / Flashbar | Tasks 10–14 |
| FormField (support) | Task 1 |
| Multiselect | Deferred to Phase 2.1 if time — not blocking Phase 2 done criteria; note in README as upcoming |

Multiselect explicitly deferred (YAGNI until Companion needs multi chip select). Icon package deferred to Phase 3/4 with layout.
