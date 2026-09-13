import { describe, expect, it, vi } from 'vitest';
import { applyModelMarkers } from './markers';

describe('applyModelMarkers', () => {
  it('sets markers on the editor model with owner meowkit', () => {
    const model = { uri: { toString: () => 'file:///main.js' } };
    const editorInstance = { getModel: () => model };
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, editorInstance as never, [
      {
        severity: 8,
        message: 'Expected ;',
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 2,
      },
    ]);
    expect(setModelMarkers).toHaveBeenCalledWith(model, 'meowkit', expect.any(Array));
  });

  it('clears markers when given an empty list', () => {
    const model = {};
    const editorInstance = { getModel: () => model };
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, editorInstance as never, []);
    expect(setModelMarkers).toHaveBeenCalledWith(model, 'meowkit', []);
  });

  it('no-ops when model is missing', () => {
    const setModelMarkers = vi.fn();
    const monaco = { editor: { setModelMarkers } };
    applyModelMarkers(monaco as never, { getModel: () => null } as never, []);
    expect(setModelMarkers).not.toHaveBeenCalled();
  });
});
