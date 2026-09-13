# MeowKit React UI Library — Phase 5 Monaco + Phase 6 Companion Panels

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Monaco theme/editor wrapper and presentational Companion/IDE panels so the library covers the remaining design-spec product surfaces.

**Architecture:** Monaco as optional peer; panels are presentational with callbacks (no WebSerial/WebUSB). Theme registration syncs with mode/accent via Provider or explicit calls.

**Tech Stack:** `monaco-editor` peer; optional `@monaco-editor/react`; existing MeowKit components for panel chrome.

## Global Constraints

Same as prior phases. Peer `monaco-editor` only for editor entries. Panels must not call device APIs.

---

### Task 1: Monaco theme registration

**Files:** `packages/components/src/monaco-theme/{index.ts,theme.ts,monaco-theme.test.ts}`

**Interfaces:**
- `registerMeowKitMonacoTheme(monaco: typeof import('monaco-editor'), options?: { mode?: Mode; accent?: Accent }): string` — returns theme name e.g. `meowkit-light-default`
- Colors from `getCssVars` / `getColorTokens` mapped to Monaco rules (keywords, strings, comments, numbers, functions, types) + editor chrome (background, foreground, selection, lineHighlight, cursor, gutter)
- Export `@meowkit/components/monaco-theme`
- PeerDep `monaco-editor` in package.json; tests can mock monaco API

- [ ] TDD → implement → commit `feat(components): add MeowKit Monaco theme registration`

---

### Task 2: MonacoEditor wrapper

**Files:** `packages/components/src/monaco-editor/*` + story (may skip live Monaco in Storybook if heavy — mock or docs-only story OK; prefer `@monaco-editor/react` when peer available)

**Interfaces:**
- `MonacoEditorProps`: `{ value?: string; defaultValue?: string; onChange?: (value: string) => void; language?: string; path?: string; height?: string | number; options?: object; onMount?: (editor, monaco) => void }`
- On mount: register MeowKit theme for current mode/accent and apply it
- Peer deps: `monaco-editor`, `@monaco-editor/react` (optional peer)

- [ ] TDD (mock editor) → implement → story → commit `feat(components): add MonacoEditor wrapper`

---

### Task 3: IDEToolbar + BuildOutputPanel

**Interfaces:**
- `IDEToolbarProps`: `{ onSave?; onBuild?; onFlash?; onRun?; busy?; left?; right?; children? }` — Toolbar composition with primary actions
- `BuildOutputPanelProps`: `{ lines: string[]; status?: 'idle'|'busy'|'success'|'error'; onClear? }` — CodeView-like log

- [ ] TDD → stories → commit `feat(components): add IDEToolbar and BuildOutputPanel`

---

### Task 4: SerialConsoleView + StorageManagerView

**Interfaces:**
- `SerialConsoleViewProps`: `{ lines: { id: string; text: string; stream?: 'stdout'|'stderr'|'system' }[]; onSend: (line: string) => void; onClear?; connected?: boolean; disabled? }`
- `StorageManagerViewProps`: `{ entries: { id: string; name: string; type: 'file'|'folder'; size?: number }[]; path: string; onNavigate: (id: string) => void; onUpload?; onDelete?; onRefresh?; status? }`

- [ ] TDD → stories → commit `feat(components): add SerialConsoleView and StorageManagerView`

---

### Task 5: DeviceManagerPanel + FirmwareFlashingPanel

**Interfaces:**
- `DeviceManagerPanelProps`: `{ devices: { id: string; name: string; status: 'connected'|'disconnected'|'busy' }[]; selectedId?; onSelect?; onConnect?; onDisconnect?; onRefresh?; status?; errorMessage? }`
- `FirmwareFlashingPanelProps`: `{ deviceName?; progress?: number; status: 'idle'|'busy'|'success'|'error'; errorMessage?; onConnect; onFlash; onCancel?; confirmErase?: boolean; onConfirmEraseChange? }` — use Modal for erase confirm if needed

- [ ] TDD → stories → commit `feat(components): add DeviceManager and FirmwareFlashing panels`

---

### Task 6: AppMarketplaceGrid

**Interfaces:**
- `AppMarketplaceGridProps`: `{ apps: { id: string; name: string; description?; icon?; installed?: boolean }[]; onInstall?; onOpen?; columns?: number }` — grid of cards using Container/Button; device launcher analogue

- [ ] TDD → story → commit `feat(components): add AppMarketplaceGrid`

---

### Task 7: README + smoke + screenshots

- [x] Document Monaco peers and Companion panels
- [x] Capture 2+ screenshots (IDEToolbar/BuildOutput or Firmware panel)
- [x] build/test/smoke
- [x] Commit `docs: document Monaco and Companion panel components`

---

## Done criteria

Monaco theme + editor wrapper; all Companion panels from spec §5.5 presentational APIs; Storybook; README; smoke green.
