# MeowKit React UI Library — Design

**Status:** Current  
**Goal:** Production React component library for the MeowKit Companion App and related surfaces, branded from [meowkit.cc](https://meowkit.cc/) and [mingolucky](https://github.com/mingolucky) repositories, packaged and documented in a Cloudscape-like way.

## 1. Problem & success

Companion and IDE UIs need one shared MeowKit design system: consistent tokens, accessible components, Storybook docs, and product panels (firmware, serial, storage, Monaco) without each app inventing its own chrome.

**v1 is successful when:**

- Brand tokens match extracted store/docs/device colors; light/dark + lime accent work.
- Core primitives + AppLayout are usable via path imports.
- Companion/IDE panels render and integrate via callbacks (no device I/O inside the library).
- Monaco theme + editor wrapper work in the Companion App.
- Storybook documents every public component.

## 2. Decisions

| Topic | Choice |
|-------|--------|
| Styling | Design tokens + CSS Modules per component + `@meowkit/global-styles` |
| Packages | `@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components` |
| Modes | Light + dark; accent `default` \| `lime` |
| Docs | Storybook (stories, props tables, live controls) |
| Product UI | Core + Companion/IDE composites in `@meowkit/components` |
| Behavior primitives | Radix UI / React Aria under the hood; MeowKit look via tokens + CSS Modules |
| Monaco / IDE | In scope (theme + editor wrapper + IDE chrome components) |
| Out of scope for v1 | Shipping a full Companion App binary; implementing WebSerial/WebUSB/flash logic inside the library |

## 3. Architecture

### 3.1 Monorepo layout

```
MeowKit-React-Library/
  packages/
    design-tokens/     → @meowkit/design-tokens
    global-styles/     → @meowkit/global-styles
    components/        → @meowkit/components
  apps/
    storybook/         → docs + playground
  examples/
    companion-ide/     → sample Companion IDE composition
  docs/
    design.md
    images/
```

Tooling: pnpm workspaces; tsup for library builds; TypeScript strict.

### 3.2 Package responsibilities

| Package | Responsibility |
|---------|----------------|
| `@meowkit/design-tokens` | Semantic token definitions (JS/TS + CSS custom property names/values) for color, font, space, radius, shadow, motion, z-index; mode and accent maps |
| `@meowkit/global-styles` | CSS reset, Inter font loading, base typography, inject CSS variables, `applyMode()`, `applyAccent()` |
| `@meowkit/components` | All React components (primitives → layout → patterns → product), MeowKit icons, Monaco theme helpers |

### 3.3 Component layering

1. **Primitives** — Button, inputs, selects, overlays, tabs, feedback (built on Radix/React Aria + CSS Modules).
2. **Layout** — SpaceBetween, Grid, Container, AppLayout, Sidebar, Toolbar, StatusBar.
3. **Patterns** — Table, FileExplorerTree, Toast host, CodeView, EmptyState.
4. **Product** — Companion/IDE panels and Monaco integration.

### 3.4 Import & API conventions

- Prefer path imports: `import Button from '@meowkit/components/button'`.
- Public entry per component (`index.tsx`); implementation may live in `internal.tsx`.
- Standard React events (`onChange` with value or React synthetic events) — not Cloudscape `event.detail`.
- Variants via props (e.g. `variant="primary"`); tokens-first styling; `className` allowed as escape hatch.
- Controllable/uncontrolled where idiomatic (Input, Tabs, Modal open state).
- No raw brand hex in component CSS — only `var(--mk-*)` / token references.

### 3.5 Provider

`MeowKitProvider` at app root:

- Holds mode/accent (synced with `applyMode` / `applyAccent`).
- Hosts toast/flashbar portal.
- Optional `i18nStrings` overrides for built-in copy.

## 4. Brand extraction → tokens

### 4.1 Source signals

| Source | Signals |
|--------|---------|
| meowkit.cc (Shopify) | Inter 400/500/700; white/`#EEF1EA` backgrounds; black foreground; border `#DFDFDF`; black primary buttons / white text; hover `#262626`; motion 62–200ms |
| meowkit-s3-docs | Primary `#BBE700`, light `#D7FF4A`, dark `#8CB800`; light appearance preferred |
| Device UI (docs) | App buttons `#BEE700`, pressed glow `#9DDE00`; circular 70×70 controls |
| Installer | Light UI; black CTAs; radius 12–24px on panels; warning `#B42318` / `#FFF4F2` |

### 4.2 Semantic color roles

- `background`, `surface`, `surfaceMuted`
- `text`, `textMuted`, `textInverse`
- `border`, `borderStrong`
- `primary` / `primaryHover` / `primaryText` (accent-dependent)
- `accent` / `accentHover` (lime family)
- `success`, `warning`, `error`, `info`
- Focus ring, overlay/scrim, shadow elevations

### 4.3 Modes & accents

- **Mode:** `light` \| `dark` — sets `data-mk-mode` on root and swaps CSS variable values.
- **Accent:** `default` (black CTAs, lime as highlight/badge/device chrome) \| `lime` (lime as primary fill for Companion/device-aligned screens).

Both are independent: any mode × accent combination is valid.

### 4.4 Scales

- **Space:** 4px base scale (0, 1=4, 2=8, 3=12, 4=16, 5=24, 6=32, 7=48, …).
- **Radius:** `xs` 4px (shop cards) → `sm` 8 → `md` 12 → `lg` 16 → `xl` 24 (installer panels) → `full`.
- **Typography:** Inter; sizes for body, label, heading, code (monospace stack for SerialConsole / CodeView).
- **Motion:** duration tokens + easing matching store curves.

## 5. Component inventory

### 5.1 Primitives

- Button: `primary` \| `secondary` \| `ghost` \| `destructive` \| `icon`
- Input, Textarea, NumberInput, SearchInput, FileInput
- Checkbox, RadioGroup, Switch, Slider
- Select, Multiselect, Dropdown / Menu, ButtonDropdown
- Tabs, SegmentedControl
- Badge, Tag, Link, Spinner, ProgressBar
- Alert, Flashbar / Toast, Modal, Drawer, Popover, Tooltip

### 5.2 Layout & chrome

- Box, SpaceBetween, Grid, ColumnLayout
- Container / Panel, Header, Footer
- AppLayout (navigation + tools + content + optional split)
- Sidebar, Toolbar, StatusBar
- Breadcrumb, Pagination

### 5.3 Data & files

- Table (basic sort/filter props; collection-hooks-style helpers can follow post-v1)
- FileExplorerTree
- CodeView
- EmptyState, KeyValuePairs

### 5.4 Icons

SVG icon set under `@meowkit/components/icon`, `currentColor`, MeowKit device metaphors (SD, battery, apps, USB, boot) plus standard chrome icons. Icon-only controls require `aria-label`.

### 5.5 Companion / IDE product components

| Component | Role |
|-----------|------|
| FirmwareFlashingPanel | Connect/flash UX; progress; confirm erase |
| DeviceManagerPanel | Connected devices list/actions |
| SerialConsoleView | Terminal-like log + send line |
| StorageManagerView | MSC / SD-style file browsing actions |
| AppMarketplaceGrid | Installable apps grid (device launcher analogue) |
| IDEToolbar | Run/build/flash/save actions |
| BuildOutputPanel | Build/flash log output |
| MonacoEditor | Editor chrome wrapper |
| `registerMeowKitMonacoTheme` / theme exports | Editor colors synced to mode/accent |

## 6. Data flow & Companion integration

### 6.1 App bootstrap

```ts
import '@meowkit/global-styles';
import { applyMode, applyAccent } from '@meowkit/global-styles';
import { MeowKitProvider } from '@meowkit/components/provider';

applyMode('light');      // or 'dark'
applyAccent('default');  // or 'lime'
```

### 6.2 Presentational product panels

Library components **do not** call WebSerial, WebUSB, or filesystem APIs. The Companion App owns I/O and passes:

- State: `device`, `progress`, `lines`, `status`, `errorMessage`, etc.
- Callbacks: `onConnect`, `onFlash`, `onCancel`, `onSend`, `onClear`, …

Async UI uses explicit `status: 'idle' | 'busy' | 'success' | 'error'`.

### 6.3 Monaco

- Peer dependency: `monaco-editor` (and optionally `@monaco-editor/react` for the wrapper).
- Theme registration updates when mode/accent changes.
- Companion supplies value/`onChange`, language, path, and markers/diagnostics.

### 6.4 Errors & destructive actions

- Inline `Alert` and/or toasts for failures.
- Destructive flows (erase device, overwrite) require Modal confirmation.

## 7. Accessibility, testing, delivery

### 7.1 Accessibility

- Overlays, menus, tabs, dialogs via Radix/React Aria (focus trap, keyboard, ARIA).
- Tokenized focus rings; contrast validated for light/dark × accents.
- No icon-only control without accessible name.

### 7.2 Testing

- Vitest + Testing Library for primitives and controllable behavior.
- axe checks on a critical component set.
- Typecheck + export smoke tests for path imports.
- Visual regression optional post-v1.

### 7.3 Build & peers

- ESM + TypeScript declarations; CSS Modules emitted for consumers.
- Peers: `react`, `react-dom`; `monaco-editor` for editor-related entrypoints only.

### 7.4 Versioning

- Changesets for coordinated semver across the three `@meowkit/*` packages (optional until packages are published).
- Storybook static publish (e.g. GitHub Pages).

## 8. Storybook

- One docs/story entry per public component.
- Global toolbar knobs: mode (light/dark), accent (default/lime).
- Props tables + live controls; Companion panels use mock state/handlers in stories.

## 9. Explicit non-goals (v1)

- Implementing firmware flash/serial/storage backends inside this repo.
- Pixel-perfect clone of Shopify theme sections (marketing site chrome ≠ app chrome); brand tokens and patterns are the source of truth for the app library.
- Full Cloudscape component parity (PropertyFilter, Board, etc.) — add when Companion needs them.
- Dark-only or marketing-landing-first design (Companion is product UI).
