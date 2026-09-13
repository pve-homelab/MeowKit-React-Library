import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useContext, useEffect, useRef } from 'react';
import { registerMeowKitMonacoTheme } from '../monaco-theme';
import { MeowKitContext } from '../provider/context';
import styles from './styles.module.css';

export interface MonacoEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  language?: string;
  path?: string;
  height?: string | number;
  options?: editor.IStandaloneEditorConstructionOptions;
  onMount?: (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => void;
}

export function InternalMonacoEditor({
  value,
  defaultValue,
  onChange,
  language,
  path,
  height = 320,
  options,
  onMount,
}: MonacoEditorProps) {
  const ctx = useContext(MeowKitContext);
  const mode = ctx?.mode ?? 'light';
  const accent = ctx?.accent ?? 'default';
  const themeName = `meowkit-${mode}-${accent}`;
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) {
      return;
    }
    const name = registerMeowKitMonacoTheme(monaco, { mode, accent });
    monaco.editor.setTheme(name);
  }, [mode, accent]);

  return (
    <div className={styles.root} data-mk-component="monaco-editor">
      <Editor
        value={value}
        defaultValue={defaultValue}
        language={language}
        path={path}
        height={height}
        options={options}
        theme={themeName}
        beforeMount={(monaco) => {
          monacoRef.current = monaco;
          registerMeowKitMonacoTheme(monaco, { mode, accent });
        }}
        onChange={(next) => {
          onChange?.(next ?? '');
        }}
        onMount={(editorInstance, monaco) => {
          monacoRef.current = monaco;
          const name = registerMeowKitMonacoTheme(monaco, { mode, accent });
          monaco.editor.setTheme(name);
          onMount?.(editorInstance, monaco);
        }}
      />
    </div>
  );
}
