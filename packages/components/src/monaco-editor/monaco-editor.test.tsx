import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MeowKitProvider } from '../provider';
import MonacoEditor from './index';

type MockMonaco = {
  editor: {
    defineTheme: ReturnType<typeof vi.fn>;
    setTheme: ReturnType<typeof vi.fn>;
  };
};

const mocks = vi.hoisted(() => ({
  lastProps: undefined as Record<string, unknown> | undefined,
  lastMonaco: undefined as MockMonaco | undefined,
}));

vi.mock('@monaco-editor/react', () => ({
  default: function MockEditor(props: Record<string, unknown>) {
    mocks.lastProps = props;

    useEffect(() => {
      const monaco: MockMonaco = {
        editor: {
          defineTheme: vi.fn(),
          setTheme: vi.fn(),
        },
      };
      mocks.lastMonaco = monaco;
      const beforeMount = props.beforeMount as ((monaco: MockMonaco) => void) | undefined;
      const onMount = props.onMount as ((editor: object, monaco: MockMonaco) => void) | undefined;
      beforeMount?.(monaco);
      onMount?.({ kind: 'editor' }, monaco);
    }, [props]);

    return (
      <textarea
        data-testid="monaco-editor"
        data-language={String(props.language ?? '')}
        data-path={String(props.path ?? '')}
        data-theme={String(props.theme ?? '')}
        data-height={String(props.height ?? '')}
        defaultValue={String(props.value ?? props.defaultValue ?? '')}
        onChange={(event) => {
          const onChange = props.onChange as ((value: string) => void) | undefined;
          onChange?.(event.target.value);
        }}
      />
    );
  },
}));

function renderEditor(ui: ReactNode, provider?: { mode?: 'light' | 'dark'; accent?: 'default' | 'lime' }) {
  if (!provider) {
    return render(ui);
  }
  return render(
    <MeowKitProvider mode={provider.mode} accent={provider.accent}>
      {ui}
    </MeowKitProvider>,
  );
}

async function mountedMonaco() {
  await waitFor(() => {
    expect(mocks.lastMonaco).toBeDefined();
  });
  return mocks.lastMonaco as MockMonaco;
}

describe('MonacoEditor', () => {
  it('forwards value, language, path, height, and options to the editor', async () => {
    const options = { readOnly: true };
    renderEditor(
      <MonacoEditor
        value="const x = 1;"
        language="javascript"
        path="main.js"
        height={240}
        options={options}
      />,
    );

    expect(screen.getByTestId('monaco-editor')).toHaveValue('const x = 1;');
    expect(mocks.lastProps?.value).toBe('const x = 1;');
    expect(mocks.lastProps?.language).toBe('javascript');
    expect(mocks.lastProps?.path).toBe('main.js');
    expect(mocks.lastProps?.height).toBe(240);
    expect(mocks.lastProps?.options).toBe(options);
    await mountedMonaco();
  });

  it('registers and applies the default MeowKit theme on mount', async () => {
    renderEditor(<MonacoEditor defaultValue="ready" />);

    const monaco = await mountedMonaco();
    expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
      'meowkit-light-default',
      expect.objectContaining({ base: 'vs', inherit: true }),
    );
    expect(monaco.editor.setTheme).toHaveBeenCalledWith('meowkit-light-default');
    expect(mocks.lastProps?.theme).toBe('meowkit-light-default');
  });

  it('registers the Provider mode and accent theme on mount', async () => {
    renderEditor(<MonacoEditor value="" />, { mode: 'dark', accent: 'lime' });

    const monaco = await mountedMonaco();
    expect(monaco.editor.defineTheme).toHaveBeenCalledWith(
      'meowkit-dark-lime',
      expect.objectContaining({ base: 'vs-dark' }),
    );
    expect(monaco.editor.setTheme).toHaveBeenCalledWith('meowkit-dark-lime');
    expect(mocks.lastProps?.theme).toBe('meowkit-dark-lime');
  });

  it('forwards onChange values from the editor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderEditor(<MonacoEditor defaultValue="a" onChange={onChange} />);

    await user.clear(screen.getByTestId('monaco-editor'));
    await user.type(screen.getByTestId('monaco-editor'), 'b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('calls onMount after the MeowKit theme is registered', async () => {
    const onMount = vi.fn();
    renderEditor(<MonacoEditor onMount={onMount} />);

    const monaco = await mountedMonaco();
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onMount.mock.calls[0]?.[1]).toBe(monaco);
    const defineOrder = monaco.editor.defineTheme.mock.invocationCallOrder[0];
    const mountOrder = onMount.mock.invocationCallOrder[0];
    expect(defineOrder).toBeLessThan(mountOrder as number);
  });
});
