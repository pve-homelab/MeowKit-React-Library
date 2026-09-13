import { getColorTokens, getCssVars, type Accent, type Mode } from '@meowkit/design-tokens';

export type MeowKitMonacoThemeOptions = {
  mode?: Mode;
  accent?: Accent;
};

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
  const alpha =
    match[4] === undefined ? '' : Math.round(Number(match[4]) * 255).toString(16).padStart(2, '0');
  return `${r}${g}${b}${alpha}`.toUpperCase();
}

function editorBase(mode: Mode): 'vs' | 'vs-dark' {
  switch (mode) {
    case 'light':
      return 'vs';
    case 'dark':
      return 'vs-dark';
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

function cssVar(vars: Record<string, string>, key: string, fallback: string): string {
  return vars[key] ?? fallback;
}

export function registerMeowKitMonacoTheme(
  monaco: typeof import('monaco-editor'),
  options?: MeowKitMonacoThemeOptions,
): string {
  const mode = options?.mode ?? 'light';
  const accent = options?.accent ?? 'default';
  const themeName = `meowkit-${mode}-${accent}`;
  const tokens = getColorTokens(mode, accent);
  const vars = getCssVars(mode, accent);

  monaco.editor.defineTheme(themeName, {
    base: editorBase(mode),
    inherit: true,
    rules: [
      { token: 'keyword', foreground: toRuleForeground(tokens.primary) },
      { token: 'string', foreground: toRuleForeground(tokens.success) },
      { token: 'comment', foreground: toRuleForeground(tokens.textMuted) },
      { token: 'number', foreground: toRuleForeground(tokens.warning) },
      { token: 'function', foreground: toRuleForeground(tokens.info) },
      { token: 'type', foreground: toRuleForeground(tokens.accent) },
    ],
    colors: {
      'editor.background': cssVar(vars, '--mk-color-background', tokens.background),
      'editor.foreground': cssVar(vars, '--mk-color-text', tokens.text),
      'editor.selectionBackground': cssVar(vars, '--mk-color-surface-muted', tokens.surfaceMuted),
      'editor.lineHighlightBackground': cssVar(vars, '--mk-color-surface-muted', tokens.surfaceMuted),
      'editorCursor.foreground': cssVar(vars, '--mk-color-accent', tokens.accent),
      'editorGutter.background': cssVar(vars, '--mk-color-surface', tokens.surface),
    },
  });

  return themeName;
}
