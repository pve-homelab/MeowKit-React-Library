# MeowKit React UI Library — Phase 3 Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cloudscape-like layout primitives and app chrome so Companion can assemble shell UIs (nav + tools + content + status).

**Architecture:** Continue `@meowkit/components` path exports, CSS Modules + tokens, Storybook stories. Compose from Phase 2 atoms. No device I/O.

**Tech Stack:** Same as Phase 2 (React 18, Vitest, tsup, Storybook 8, `npx pnpm@9.15.0`).

**Prior:** Phases 1–2 complete on `feat/phase1-foundation`.

## Global Constraints

Same as Phase 2 plan: `@meowkit/*` package names; `var(--mk-*)` only in component CSS; path imports; standard React events; light/dark + default/lime; forwardRef where wrapping DOM; accessible names for icon-only; commit lockfile on dep changes; no Monaco/Companion product panels in this phase (those are Phases 5–6).

## Conventions

Same file layout as Phase 2. Register every export in `package.json` + `tsup` entry. Story + tests per component. Update smoke (auto-reads exports) happens automatically when exports added — still run smoke after tasks.

---

### Task 1: Box + SpaceBetween

**Files:** `packages/components/src/box/*`, `space-between/*` + stories

**Interfaces:**
- `BoxProps`: `{ children?; padding?: keyof space | 'none'; margin?: ...; color?: 'text' | 'muted' | 'inverse'; fontSize?: 'xs'|'sm'|'md'|'lg'|'xl'; fontWeight?: 'regular'|'medium'|'bold'; className?; as?: keyof JSX.IntrinsicElements }` — maps to token CSS vars
- `SpaceBetweenProps`: `{ children; direction?: 'vertical' | 'horizontal'; size?: 'xs'|'s'|'m'|'l'|'xl' }` — flex gap using space tokens (xs=1, s=2, m=3, l=5, xl=6)

- [ ] TDD → implement → stories → commit `feat(components): add Box and SpaceBetween`

---

### Task 2: Grid + ColumnLayout

**Files:** `grid/*`, `column-layout/*` + stories

**Interfaces:**
- `GridProps`: `{ children; gridDefinition?: { colspan?: number }[]; columns?: number; disableGutters?: boolean }` — CSS grid 12-col or equal columns
- `ColumnLayoutProps`: `{ children; columns?: number; variant?: 'default' | 'text-grid' }` — responsive column flex/grid

- [ ] TDD → implement → stories → commit `feat(components): add Grid and ColumnLayout`

---

### Task 3: Container, Header, Footer

**Files:** `container/*`, `header/*`, `footer/*` + stories

**Interfaces:**
- `HeaderProps`: `{ variant?: 'h1'|'h2'|'h3'|'h4'; children; description?; actions?; counter? }`
- `FooterProps`: `{ children }`
- `ContainerProps`: `{ header?; footer?; children; disableContentPaddings?; variant?: 'default' | 'stacked' }` — surface panel with border/radius tokens

- [ ] TDD → implement → stories → commit `feat(components): add Container, Header, Footer`

---

### Task 4: Sidebar, Toolbar, StatusBar

**Files:** `sidebar/*`, `toolbar/*`, `status-bar/*` + stories

**Interfaces:**
- `SidebarProps`: `{ children; header?; width?: number | string; collapsible?; collapsed?; onCollapseChange? }`
- `ToolbarProps`: `{ children; left?; right? }` — horizontal chrome bar
- `StatusBarProps`: `{ children; left?; right? }` — bottom status strip

- [ ] TDD → implement → stories → commit `feat(components): add Sidebar, Toolbar, StatusBar`

---

### Task 5: Breadcrumb + Pagination

**Files:** `breadcrumb/*`, `pagination/*` + stories

**Interfaces:**
- `BreadcrumbProps`: `{ items: { text: ReactNode; href?: string; onClick?: () => void }[] }`
- `PaginationProps`: `{ currentPageIndex: number; pagesCount: number; onChange: (pageIndex: number) => void; ariaLabels?: { next?; previous?; page? } }`

- [ ] TDD → implement → stories → commit `feat(components): add Breadcrumb and Pagination`

---

### Task 6: AppLayout

**Files:** `app-layout/*` + story demonstrating nav + tools + content + status

**Interfaces:**
- `AppLayoutProps`: `{ navigation?; navigationOpen?; onNavigationChange?; tools?; toolsOpen?; onToolsChange?; content; contentHeader?; notifications?; statusBar?; stickyNotifications? }`
- Cloudscape-inspired shell: optional left nav drawer, optional right tools, main content, optional status bar. Use existing Drawer/Sidebar patterns internally where helpful but keep AppLayout self-contained.

- [ ] TDD: renders content; toggles navigation callback → implement → story → commit `feat(components): add AppLayout`

---

### Task 7: Icon starter set

**Files:** `icon/*` + stories

**Interfaces:**
- `IconProps`: `{ name: IconName; size?: 'sm'|'md'|'lg'; className?; 'aria-hidden'?: boolean | 'aria-label'?: string }`
- `IconName` union: at least `add`, `close`, `check`, `chevron-down`, `chevron-right`, `search`, `settings`, `folder`, `file`, `usb`, `battery`, `apps`, `warning`, `error`, `info`, `success`
- SVG `currentColor`; tree-shakeable map

- [ ] TDD → implement → stories → commit `feat(components): add Icon starter set`

---

### Task 8: README + screenshot refresh

- Update README inventory for Phase 3 components
- Capture 2+ new screenshots (AppLayout shell, Container+Header) into `docs/images/`
- `pnpm build && pnpm test && pnpm smoke`
- Commit `docs: document Phase 3 layout components with screenshots`

---

## Phase 3 done criteria

- Layout primitives + AppLayout + Icon starter exported and tested
- Storybook coverage
- README updated with screenshots
- build/test/smoke green

## Follow-ups

Phase 4: Table, FileExplorerTree, CodeView, EmptyState, KeyValuePairs  
Phase 5: Monaco  
Phase 6: Companion panels  
Phase 7: Changesets / axe CI
