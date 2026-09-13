import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { applyMode } from '@meowkit/global-styles';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it } from 'vitest';
import DeviceManagerPanel from '../device-manager-panel';
import FileExplorerTree from '../file-explorer-tree';
import IDEToolbar from '../ide-toolbar';
import { MeowKitProvider } from '../provider';
import SerialConsoleView from '../serial-console-view';

function renderCompanion(ui: ReactElement) {
  return render(<MeowKitProvider>{ui}</MeowKitProvider>);
}

describe('companion IDE a11y', () => {
  beforeEach(() => {
    applyMode('light');
  });

  it('IDEToolbar has no axe violations', async () => {
    const { container } = renderCompanion(<IDEToolbar onSave={() => undefined} />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('FileExplorerTree has no axe violations', async () => {
    const { container } = renderCompanion(
      <FileExplorerTree
        nodes={[
          { id: 'src', name: 'src', type: 'folder' },
          { id: 'readme', name: 'README.md', type: 'file' },
        ]}
      />,
    );
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SerialConsoleView has no axe violations', async () => {
    const { container } = renderCompanion(
      <SerialConsoleView lines={[{ id: '1', text: 'ready', stream: 'system' }]} onSend={() => undefined} connected />,
    );
    expect(screen.getByLabelText('Serial output')).toHaveTextContent('ready');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('DeviceManagerPanel has no axe violations', async () => {
    const { container } = renderCompanion(
      <DeviceManagerPanel devices={[{ id: 'uno', name: 'Arduino UNO', status: 'disconnected' }]} status="idle" />,
    );
    expect(screen.getByText('Arduino UNO')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
