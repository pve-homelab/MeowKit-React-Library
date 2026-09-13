import type { editor } from 'monaco-editor';

export type MeowKitMarkerData = editor.IMarkerData;

export function applyModelMarkers(
  monaco: typeof import('monaco-editor'),
  editorInstance: editor.IStandaloneCodeEditor,
  markers: MeowKitMarkerData[],
): void {
  const model = editorInstance.getModel();
  if (!model) return;
  monaco.editor.setModelMarkers(model, 'meowkit', markers);
}
