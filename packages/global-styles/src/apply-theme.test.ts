import { beforeEach, describe, expect, it } from 'vitest';
import { applyAccent, applyMode, getAccent, getMode } from './apply-theme';

describe('apply theme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-mk-mode');
    document.documentElement.removeAttribute('data-mk-accent');
    document.documentElement.removeAttribute('style');
  });

  it('applyMode sets data attribute and CSS vars', () => {
    applyMode('dark');
    expect(getMode()).toBe('dark');
    expect(document.documentElement.getAttribute('data-mk-mode')).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--mk-color-background')).toBe(
      '#121412',
    );
  });

  it('applyAccent lime updates primary while preserving mode', () => {
    applyMode('light');
    applyAccent('lime');
    expect(getAccent()).toBe('lime');
    expect(document.documentElement.style.getPropertyValue('--mk-color-primary')).toBe('#BBE700');
  });
});
