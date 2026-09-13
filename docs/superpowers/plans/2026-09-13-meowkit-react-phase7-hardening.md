# MeowKit React UI Library — Phase 7 Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close remaining library gaps: Multiselect, Changesets release tooling, axe a11y checks on critical stories, and README polish so the branch is publish-ready.

**Architecture:** Same `@meowkit/*` packages. Multiselect follows Select patterns (chips + listbox). Changesets at monorepo root. Axe via Vitest or Storybook test-runner on a critical subset.

**Tech Stack:** Existing stack + `@changesets/cli`, `vitest-axe` or `@axe-core/react` / `jest-axe` compatible with Vitest.

**Prior:** Phases 1–6 complete on `feat/phase1-foundation` (55 exports, 252 tests).

## Global Constraints

Same as prior phases: tokens-only CSS, path imports, standard React events, `npx pnpm@9.15.0`, no device I/O. Commit lockfile on dep changes.

---

### Task 1: Multiselect

**Files:** `packages/components/src/multiselect/*` + story

**Interfaces:**
- `MultiselectProps`: `{ options: { value: string; label: ReactNode; disabled?: boolean }[]; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void; placeholder?: string; disabled?: boolean; invalid?: boolean; tokenLimit?: number }`
- Selected values shown as Tag chips (dismissible); trigger opens listbox (can reuse Radix DropdownMenu or combobox pattern with checkboxes). Prefer accessible listbox with `aria-multiselectable`.
- Use existing Tag + Button for chrome.

- [ ] TDD: select adds value; dismiss tag removes; onChange fires → implement → story → commit  
  Message: `feat(components): add Multiselect`

---

### Task 2: Changesets release tooling

**Files:**
- Create: `.changeset/config.json`
- Modify: root `package.json` scripts (`changeset`, `version-packages`)
- Create: `.changeset/README.md` short usage note
- Optionally add initial empty changeset ignore for private storybook

**Requirements:**
- `npx pnpm@9.15.0 add -Dw @changesets/cli`
- `npx changeset init` (or hand-write config)
- Configure packages: `@meowkit/design-tokens`, `@meowkit/global-styles`, `@meowkit/components` as public; ignore `@meowkit/storybook`
- `access: restricted` or `public` — use `public` for future npm; `baseBranch: main`
- Script: `"changeset": "changeset"`, `"version-packages": "changeset version"`

- [ ] Install + configure → commit `chore: add Changesets for coordinated package versioning`

---

### Task 3: Axe a11y checks on critical components

**Files:**
- Add `vitest-axe` or `jest-axe` + `axe-core` to components package
- Create: `packages/components/src/a11y/critical.a11y.test.tsx` covering Button, Input, Modal (open), Alert, Checkbox, Tabs (render smoke + axe)

**Requirements:**
- Each case renders with MeowKitProvider + global-styles tokens applied (call `applyMode('light')` in beforeEach)
- `expect(await axe(container)).toHaveNoViolations()` (register jest-axe matchers for vitest)
- Keep suite fast; no full Storybook crawl required

- [ ] TDD/implement → commit `test(components): add axe checks for critical primitives`

---

### Task 4: TextField a11y wiring polish

**Files:** modify `form-field` to set `aria-describedby` linking description/error ids to the labeled control when possible (cloneElement or render-prop). Prefer documenting that consumers should pass `aria-describedby` OR implement FormField that injects ids onto a single child via `cloneElement` if the child is a valid element.

**Also:** Multiselect already added — ensure FormField works with it in a story.

- [ ] Tests for describedby → implement → commit `fix(components): wire FormField aria-describedby`

---

### Task 5: README + smoke + screenshot for Multiselect

- Update README inventory (Multiselect, Changesets usage, a11y note)
- Capture `docs/images/multiselect.png`
- `pnpm build && pnpm test && pnpm smoke`
- Commit `docs: document Phase 7 Multiselect and release tooling`

---

## Done criteria

- Multiselect exported + tested + Storybook
- Changesets configured
- Critical axe suite green
- FormField describedby improved
- README + smoke green
