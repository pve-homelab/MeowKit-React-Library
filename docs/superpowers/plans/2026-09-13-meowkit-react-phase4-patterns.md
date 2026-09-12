# MeowKit React UI Library — Phase 4 Patterns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add data/file pattern components (Table, FileExplorerTree, CodeView, EmptyState, KeyValuePairs) for Companion/IDE-style screens.

**Architecture:** Same component conventions as Phases 2–3. Presentational only.

**Tech Stack:** Same as prior phases.

## Global Constraints

Same as Phase 2/3: tokens-only CSS, path imports, standard React events, a11y names, `npx pnpm@9.15.0`, no device I/O / Monaco / Companion product panels here.

---

### Task 1: EmptyState + KeyValuePairs

**Interfaces:**
- `EmptyStateProps`: `{ title: ReactNode; description?: ReactNode; action?: ReactNode; icon?: ReactNode }`
- `KeyValuePairsProps`: `{ items: { label: ReactNode; value: ReactNode }[]; columns?: number }`

- [ ] TDD → stories → exports → commit `feat(components): add EmptyState and KeyValuePairs`

---

### Task 2: CodeView

**Interfaces:**
- `CodeViewProps`: `{ content: string; language?: string; lineNumbers?: boolean; className? }` — monospace pre/code using `--mk-font-family-mono`; optional line number gutter. No full highlighter required (plain text OK; language prop reserved).

- [ ] TDD → story → commit `feat(components): add CodeView`

---

### Task 3: Table (basic)

**Interfaces:**
- `TableProps<T>`: `{ items: T[]; columnDefinitions: { id: string; header: ReactNode; cell: (item: T) => ReactNode; sortingField?: string; width?: number | string }[]; sortingColumn?: string; sortingDescending?: boolean; onSortingChange?: (state: { sortingColumn: string; sortingDescending: boolean }) => void; empty?: ReactNode; loading?: boolean; variant?: 'container' | 'embedded' }`
- Client-side sort optional when sortingField set and onSortingChange provided (controlled sort preferred — parent sorts items).

- [ ] TDD → story → commit `feat(components): add Table`

---

### Task 4: FileExplorerTree

**Interfaces:**
- `FileExplorerNode`: `{ id: string; name: string; type: 'file' | 'folder'; children?: FileExplorerNode[] }`
- `FileExplorerTreeProps`: `{ nodes: FileExplorerNode[]; selectedId?: string; expandedIds?: string[]; defaultExpandedIds?: string[]; onSelect?: (id: string) => void; onExpandedChange?: (ids: string[]) => void }`
- Use Icon folder/file. Keyboard: Enter/Space select; Arrow expand/collapse folders.

- [ ] TDD → story → commit `feat(components): add FileExplorerTree`

---

### Task 5: README + screenshots

- Document Phase 4 components; capture Table + FileExplorer screenshots; build/test/smoke; commit `docs: document Phase 4 pattern components`

---

## Done criteria

All five pattern components exported, tested, Storybooked; README updated; smoke green.
