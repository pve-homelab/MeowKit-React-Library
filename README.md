# MeowKit React Library

Official MeowKit React UI library (Phase 1 foundation + Phase 2 primitives + Phase 3 layout + Phase 4 patterns + Phase 5 Monaco + Phase 6 Companion panels).

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

`pnpm smoke` asserts compiled `dist` exports for every `@meowkit/components` public entry and that Button CSS is emitted. It does not rebuild — run `pnpm build` first.

## Monaco editor (optional peers)

`@meowkit/components/monaco-theme` and `@meowkit/components/monaco-editor` treat Monaco as optional. Install both peers when you use those entries:

```bash
npx pnpm@9.15.0 add monaco-editor @monaco-editor/react
```

| Peer | Used by |
| --- | --- |
| `monaco-editor` | Theme registration and the editor wrapper |
| `@monaco-editor/react` | `MonacoEditor` wrapper only |

`registerMeowKitMonacoTheme(monaco, { mode, accent })` maps MeowKit tokens to a Monaco theme named `meowkit-<mode>-<accent>`. `MonacoEditor` registers and applies that theme on mount from the current `MeowKitProvider` mode/accent. Storybook’s Monaco story is docs-only so Storybook does not bundle the editor.

Companion/IDE panels (`IDEToolbar`, `BuildOutputPanel`, `SerialConsoleView`, `StorageManagerView`, `DeviceManagerPanel`, `FirmwareFlashingPanel`, `AppMarketplaceGrid`) are presentational. They expose callbacks only — the library does not call WebSerial, WebUSB, or flash APIs.

## Components

Path imports from `@meowkit/components/<name>`. Storybook titles live under `Primitives/*`, `Layout/*`, and `Patterns/*`.

| Import | Component | Storybook |
| --- | --- | --- |
| `@meowkit/components/button` | Button | `Primitives/Button` |
| `@meowkit/components/provider` | MeowKitProvider | Story decorator |
| `@meowkit/components/form-field` | FormField | `Primitives/FormField` |
| `@meowkit/components/input` | Input | `Primitives/Input` |
| `@meowkit/components/textarea` | Textarea | `Primitives/Textarea` |
| `@meowkit/components/search-input` | SearchInput | `Primitives/SearchInput` |
| `@meowkit/components/number-input` | NumberInput | `Primitives/NumberInput` |
| `@meowkit/components/file-input` | FileInput | `Primitives/FileInput` |
| `@meowkit/components/checkbox` | Checkbox | `Primitives/Checkbox` |
| `@meowkit/components/switch` | Switch | `Primitives/Switch` |
| `@meowkit/components/radio-group` | RadioGroup | `Primitives/RadioGroup` |
| `@meowkit/components/slider` | Slider | `Primitives/Slider` |
| `@meowkit/components/select` | Select | `Primitives/Select` |
| `@meowkit/components/button-dropdown` | ButtonDropdown | `Primitives/ButtonDropdown` |
| `@meowkit/components/tabs` | Tabs | `Primitives/Tabs` |
| `@meowkit/components/segmented-control` | SegmentedControl | `Primitives/SegmentedControl` |
| `@meowkit/components/badge` | Badge | `Primitives/Badge` |
| `@meowkit/components/tag` | Tag | `Primitives/Tag` |
| `@meowkit/components/link` | Link | `Primitives/Link` |
| `@meowkit/components/spinner` | Spinner | `Primitives/Spinner` |
| `@meowkit/components/progress-bar` | ProgressBar | `Primitives/ProgressBar` |
| `@meowkit/components/alert` | Alert | `Primitives/Alert` |
| `@meowkit/components/modal` | Modal | `Primitives/Modal` |
| `@meowkit/components/drawer` | Drawer | `Primitives/Drawer` |
| `@meowkit/components/popover` | Popover | `Primitives/Popover` |
| `@meowkit/components/tooltip` | Tooltip | `Primitives/Tooltip` |
| `@meowkit/components/flashbar` | Flashbar | `Primitives/Flashbar` |
| `@meowkit/components/box` | Box | `Layout/Box` |
| `@meowkit/components/space-between` | SpaceBetween | `Layout/SpaceBetween` |
| `@meowkit/components/grid` | Grid | `Layout/Grid` |
| `@meowkit/components/column-layout` | ColumnLayout | `Layout/ColumnLayout` |
| `@meowkit/components/container` | Container | `Layout/Container` |
| `@meowkit/components/header` | Header | `Layout/Header` |
| `@meowkit/components/footer` | Footer | `Layout/Footer` |
| `@meowkit/components/sidebar` | Sidebar | `Layout/Sidebar` |
| `@meowkit/components/toolbar` | Toolbar | `Layout/Toolbar` |
| `@meowkit/components/status-bar` | StatusBar | `Layout/StatusBar` |
| `@meowkit/components/breadcrumb` | Breadcrumb | `Layout/Breadcrumb` |
| `@meowkit/components/pagination` | Pagination | `Layout/Pagination` |
| `@meowkit/components/app-layout` | AppLayout | `Layout/AppLayout` |
| `@meowkit/components/icon` | Icon | `Primitives/Icon` |
| `@meowkit/components/empty-state` | EmptyState | `Patterns/EmptyState` |
| `@meowkit/components/key-value-pairs` | KeyValuePairs | `Patterns/KeyValuePairs` |
| `@meowkit/components/code-view` | CodeView | `Patterns/CodeView` |
| `@meowkit/components/table` | Table | `Patterns/Table` |
| `@meowkit/components/file-explorer-tree` | FileExplorerTree | `Patterns/FileExplorerTree` |
| `@meowkit/components/monaco-theme` | `registerMeowKitMonacoTheme` | — |
| `@meowkit/components/monaco-editor` | MonacoEditor | `Patterns/MonacoEditor` |
| `@meowkit/components/ide-toolbar` | IDEToolbar | `Patterns/IDEToolbar` |
| `@meowkit/components/build-output-panel` | BuildOutputPanel | `Patterns/BuildOutputPanel` |
| `@meowkit/components/serial-console-view` | SerialConsoleView | `Patterns/SerialConsoleView` |
| `@meowkit/components/storage-manager-view` | StorageManagerView | `Patterns/StorageManagerView` |
| `@meowkit/components/device-manager-panel` | DeviceManagerPanel | `Patterns/DeviceManagerPanel` |
| `@meowkit/components/firmware-flashing-panel` | FirmwareFlashingPanel | `Patterns/FirmwareFlashingPanel` |
| `@meowkit/components/app-marketplace-grid` | AppMarketplaceGrid | `Patterns/AppMarketplaceGrid` |

Multiselect is deferred to a later phase (Companion does not need multi chip select yet).

Refresh README images after `pnpm build` with `node scripts/capture-screenshots.mjs` (Playwright + compiled MeowKit CSS).

## Screenshots

Button, Input, Modal, Alert, app chrome atoms (Badge, Tag, Link, Spinner, ProgressBar), AppLayout shell, Container+Header, Table, FileExplorerTree, FirmwareFlashingPanel, AppMarketplaceGrid, and IDEToolbar captured from compiled library CSS.

![Button](docs/images/button.png)

![Input](docs/images/input.png)

![Modal](docs/images/modal.png)

![Alert](docs/images/alert.png)

![App chrome](docs/images/chrome.png)

![AppLayout](docs/images/app-layout.png)

![Container](docs/images/container.png)

![Table](docs/images/table.png)

![FileExplorerTree](docs/images/file-explorer-tree.png)

![FirmwareFlashingPanel](docs/images/firmware-flashing-panel.png)

![AppMarketplaceGrid](docs/images/app-marketplace-grid.png)

![IDEToolbar](docs/images/ide-toolbar.png)
