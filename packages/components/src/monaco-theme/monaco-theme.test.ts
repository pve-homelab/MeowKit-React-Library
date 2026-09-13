import { getColorTokens, getCssVars } from '@meowkit/design-tokens';
import { describe, expect, it, vi } from 'vitest';
import { registerMeowKitMonacoTheme } from './index';

type ThemeRule = {
  token: string;
  foreground?: string;
  fontStyle?: string;
};

type ThemeData = {
  base: string;
  inherit: boolean;
  rules: ThemeRule[];
  colors: Record<string, string>;
};

function createMonacoMock() {
  return {
    editor: {
      defineTheme: vi.fn(),
    },
  };
}

function registeredTheme(monaco: ReturnType<typeof createMonacoMock>): ThemeData {
  expect(monaco.editor.defineTheme).toHaveBeenCalledTimes(1);
  const [, theme] = monaco.editor.defineTheme.mock.calls[0] ?? [];
  return theme as ThemeData;
}

function ruleFor(theme: ThemeData, token: string): ThemeRule {
  const rule = theme.rules.find((entry) => entry.token === token);
  expect(rule, `missing token rule: ${token}`).toBeDefined();
  return rule as ThemeRule;
}

function toRuleForeground(color: string): string {
  if (color.startsWith('#')) {
    return color.slice(1).toUpperCase();
  }
  const match = color.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/);
  if (!match) {
    return color.toUpperCase();
  }
  const r = Number(match[1]).toString(16).padStart(2, '0');
  const g = Number(match[2]).toString(16).padStart(2, '0');
  const b = Number(match[3]).toString(16).padStart(2, '0');
  const alpha = match[4] === undefined ? '' : Math.round(Number(match[4]) * 255).toString(16).padStart(2, '0');
  return `${r}${g}${b}${alpha}`.toUpperCase();
}

describe('registerMeowKitMonacoTheme', () => {
  it('registers meowkit-light-default by default and returns that name', () => {
    const monaco = createMonacoMock();
    const name = registerMeowKitMonacoTheme(monaco as never);

    expect(name).toBe('meowkit-light-default');
    expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
      'meowkit-light-default',
      expect.objectContaining({ base: 'vs', inherit: true }),
    );
  });

  it('returns a meowkit-{mode}-{accent} name and uses the dark editor base', () => {
    const monaco = createMonacoMock();
    const name = registerMeowKitMonacoTheme(monaco as never, { mode: 'dark', accent: 'lime' });

    expect(name).toBe('meowkit-dark-lime');
    expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
      'meowkit-dark-lime',
      expect.objectContaining({ base: 'vs-dark' }),
    );
  });

  it('maps getColorTokens / getCssVars onto syntax rules and editor chrome', () => {
    const monaco = createMonacoMock();
    registerMeowKitMonacoTheme(monaco as never, { mode: 'light', accent: 'default' });

    const tokens = getColorTokens('light', 'default');
    const vars = getCssVars('light', 'default');
    const theme = registeredTheme(monaco);

    expect(ruleFor(theme, 'keyword').foreground).toBe(toRuleForeground(tokens.primary));
    expect(ruleFor(theme, 'string').foreground).toBe(toRuleForeground(tokens.success));
    expect(ruleFor(theme, 'comment').foreground).toBe(toRuleForeground(tokens.textMuted));
    expect(ruleFor(theme, 'number').foreground).toBe(toRuleForeground(tokens.warning));
    expect(ruleFor(theme, 'function').foreground).toBe(toRuleForeground(tokens.info));
    expect(ruleFor(theme, 'type').foreground).toBe(toRuleForeground(tokens.accent));

    expect(theme.colors['editor.background']).toBe(vars['--mk-color-background']);
    expect(theme.colors['editor.foreground']).toBe(vars['--mk-color-text']);
    expect(theme.colors['editor.selectionBackground']).toBe(vars['--mk-color-surface-muted']);
    expect(theme.colors['editor.lineHighlightBackground']).toBe(vars['--mk-color-surface-muted']);
    expect(theme.colors['editorCursor.foreground']).toBe(vars['--mk-color-accent']);
    expect(theme.colors['editorGutter.background']).toBe(vars['--mk-color-surface']);
  });
});
