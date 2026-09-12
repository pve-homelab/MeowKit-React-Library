import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCssVars } from '@meowkit/design-tokens';
import { describe, expect, it } from 'vitest';

const srcDir = dirname(fileURLToPath(import.meta.url));

describe('tokens-default.css', () => {
  it('ships light+default CSS vars on :root', () => {
    const css = readFileSync(join(srcDir, 'tokens-default.css'), 'utf8');
    const vars = getCssVars('light', 'default');

    expect(css).toContain(':root');
    expect(css).toContain(`--mk-color-primary: ${vars['--mk-color-primary']}`);
    expect(css).toContain(`--mk-color-background: ${vars['--mk-color-background']}`);
    expect(css).toContain(`--mk-space-4: ${vars['--mk-space-4']}`);
  });
});
