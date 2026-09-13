import AppLayout from '@meowkit/components/app-layout';
import BuildOutputPanel, {
  type BuildOutputStatus,
} from '@meowkit/components/build-output-panel';
import FileExplorerTree from '@meowkit/components/file-explorer-tree';
import IDEToolbar from '@meowkit/components/ide-toolbar';
import MonacoEditor from '@meowkit/components/monaco-editor';
import { MeowKitProvider } from '@meowkit/components/provider';
import SerialConsoleView from '@meowkit/components/serial-console-view';
import Sidebar from '@meowkit/components/sidebar';
import StatusBar from '@meowkit/components/status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  defaultExpandedIds,
  defaultSelectedId,
  fileTree,
  initialBuildLines,
  initialSerialLines,
  mockFiles,
  nextSerialId,
} from './mockFiles';

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  automaticLayout: true,
} as const;

export default function App() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [expandedIds, setExpandedIds] = useState(defaultExpandedIds);
  const [selectedId, setSelectedId] = useState(defaultSelectedId);
  const [editorValues, setEditorValues] = useState(() =>
    Object.fromEntries(
      Object.entries(mockFiles).map(([id, file]) => [id, file.content]),
    ),
  );
  const [buildLines, setBuildLines] = useState(initialBuildLines);
  const [buildStatus, setBuildStatus] = useState<BuildOutputStatus>('idle');
  const [serialLines, setSerialLines] = useState(initialSerialLines);
  const [serialConnected, setSerialConnected] = useState(true);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const activeFile = mockFiles[selectedId];
  const editorValue = editorValues[selectedId] ?? '';

  const handleEditorChange = useCallback(
    (value: string) => {
      setEditorValues((current) => ({ ...current, [selectedId]: value }));
    },
    [selectedId],
  );

  const handleSave = useCallback(() => {
    setSavedAt(new Date().toLocaleTimeString());
    setBuildLines((lines) => [...lines, `Saved ${activeFile?.path ?? 'workspace'}.`]);
  }, [activeFile?.path]);

  const handleBuild = useCallback(() => {
    setBusy(true);
    setBuildStatus('busy');
    setBuildLines(['Compiling sketch...']);

    window.setTimeout(() => {
      setBusy(false);
      setBuildStatus('success');
      setBuildLines([
        'Compiling sketch...',
        'Sketch uses 1234 bytes (4%) of program storage space.',
        'Done.',
      ]);
    }, 900);
  }, []);

  const handleFlash = useCallback(() => {
    setBusy(true);
    setBuildStatus('busy');
    setBuildLines(['Flashing firmware...']);

    window.setTimeout(() => {
      setBusy(false);
      setBuildStatus('success');
      setBuildLines(['Flashing firmware...', 'Flash complete.']);
      setSerialLines((lines) => [
        ...lines,
        {
          id: nextSerialId(),
          text: 'Device reset after flash',
          stream: 'system',
        },
      ]);
    }, 1200);
  }, []);

  const handleRun = useCallback(() => {
    setSerialLines((lines) => [
      ...lines,
      { id: nextSerialId(), text: '>>> run()', stream: 'stdout' },
      { id: nextSerialId(), text: 'Program started', stream: 'system' },
    ]);
  }, []);

  const handleSerialSend = useCallback((line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    setSerialLines((lines) => [
      ...lines,
      { id: nextSerialId(), text: `>>> ${trimmed}`, stream: 'stdout' },
      {
        id: nextSerialId(),
        text: trimmed.startsWith('print(') ? 'hello' : `echo: ${trimmed}`,
        stream: 'stdout',
      },
    ]);
  }, []);

  const handleClearBuild = useCallback(() => {
    setBuildLines([]);
    setBuildStatus('idle');
  }, []);

  const handleClearSerial = useCallback(() => {
    setSerialLines([]);
  }, []);

  const toggleSerial = useCallback(() => {
    setSerialConnected((connected) => {
      const next = !connected;
      setSerialLines((lines) => [
        ...lines,
        {
          id: nextSerialId(),
          text: next ? 'Mock port opened' : 'Mock port closed',
          stream: 'system',
        },
      ]);
      return next;
    });
  }, []);

  const statusLeft = useMemo(() => {
    const fileLabel = activeFile?.path ?? 'No file selected';
    return savedAt ? `${fileLabel} · saved ${savedAt}` : fileLabel;
  }, [activeFile?.path, savedAt]);

  return (
    <MeowKitProvider mode="light" accent="default">
      <div style={{ height: '100vh' }}>
        <AppLayout
          navigationOpen={navigationOpen}
          onNavigationChange={setNavigationOpen}
          toolsOpen={toolsOpen}
          onToolsChange={setToolsOpen}
          navigation={
            <Sidebar header="Project">
              <FileExplorerTree
                nodes={fileTree}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={setSelectedId}
                onExpandedChange={setExpandedIds}
              />
            </Sidebar>
          }
          contentHeader={
            <IDEToolbar
              busy={busy}
              left="MeowKit Companion"
              right={serialConnected ? 'COM3 · 115200' : 'Port closed'}
              onSave={handleSave}
              onBuild={handleBuild}
              onFlash={handleFlash}
              onRun={handleRun}
            >
              {activeFile?.label ?? 'Untitled'}
            </IDEToolbar>
          }
          content={
            activeFile ? (
              <MonacoEditor
                key={selectedId}
                value={editorValue}
                onChange={handleEditorChange}
                language={activeFile.language}
                path={activeFile.path}
                height="100%"
                options={editorOptions}
              />
            ) : (
              <p>Select a file from the project tree.</p>
            )
          }
          tools={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                height: '100%',
                minHeight: 0,
              }}
            >
              <BuildOutputPanel
                lines={buildLines}
                status={buildStatus}
                onClear={buildLines.length > 0 ? handleClearBuild : undefined}
              />
              <SerialConsoleView
                lines={serialLines}
                connected={serialConnected}
                disabled={!serialConnected}
                onSend={handleSerialSend}
                onClear={serialLines.length > 0 ? handleClearSerial : undefined}
              />
            </div>
          }
          statusBar={
            <StatusBar
              left={statusLeft}
              right={
                <button type="button" onClick={toggleSerial}>
                  {serialConnected ? 'Disconnect' : 'Connect'}
                </button>
              }
            >
              {busy ? 'Working…' : 'Ready'}
            </StatusBar>
          }
        />
      </div>
    </MeowKitProvider>
  );
}
