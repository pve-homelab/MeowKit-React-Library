import { describe, expect, it } from 'vitest';
import { getCssVars } from './css-vars';

describe('getCssVars', () => {
  it('returns lime accent primary for light+lime', () => {
    const vars = getCssVars('light', 'lime');
    expect(vars['--mk-color-primary']).toBe('#BBE700');
    expect(vars['--mk-color-primary-text']).toBe('#000000');
    expect(vars['--mk-color-background']).toBe('#FFFFFF');
  });

  it('returns black primary for light+default', () => {
    const vars = getCssVars('light', 'default');
    expect(vars['--mk-color-primary']).toBe('#000000');
    expect(vars['--mk-color-primary-text']).toBe('#FFFFFF');
    expect(vars['--mk-color-accent']).toBe('#BBE700');
  });

  it('returns dark background for dark mode', () => {
    const vars = getCssVars('dark', 'default');
    expect(vars['--mk-color-background']).toBe('#121412');
    expect(vars['--mk-color-text']).toBe('#F5F5F5');
  });

  it('includes spacing and radius scales', () => {
    const vars = getCssVars('light', 'default');
    expect(vars['--mk-space-4']).toBe('16px');
    expect(vars['--mk-radius-md']).toBe('12px');
  });
});
