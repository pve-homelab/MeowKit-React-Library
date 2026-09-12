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
