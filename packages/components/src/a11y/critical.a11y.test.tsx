import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { applyMode } from '@meowkit/global-styles';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it } from 'vitest';
import Alert from '../alert';
import Button from '../button';
import Checkbox from '../checkbox';
import Input from '../input';
import Modal from '../modal';
import { MeowKitProvider } from '../provider';
import Tabs from '../tabs';

function renderCritical(ui: ReactElement) {
  return render(<MeowKitProvider>{ui}</MeowKitProvider>);
}

describe('critical primitives a11y', () => {
  beforeEach(() => {
    applyMode('light');
  });

  it('Button has no axe violations', async () => {
    const { container } = renderCritical(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Input has no axe violations', async () => {
    const { container } = renderCritical(<Input aria-label="Device name" />);
    expect(screen.getByRole('textbox', { name: 'Device name' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Modal (open) has no axe violations', async () => {
    const { baseElement } = renderCritical(
      <Modal visible onDismiss={() => undefined} header="Erase flash">
        This cannot be undone.
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Erase flash' })).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('Alert has no axe violations', async () => {
    const { container } = renderCritical(<Alert type="error">Flash failed</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Flash failed');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Checkbox has no axe violations', async () => {
    const { container } = renderCritical(<Checkbox>Enable serial</Checkbox>);
    expect(screen.getByRole('checkbox', { name: 'Enable serial' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Tabs has no axe violations', async () => {
    const { container } = renderCritical(
      <Tabs
        defaultActiveTabId="overview"
        tabs={[
          { id: 'overview', label: 'Overview', content: 'Overview panel' },
          { id: 'logs', label: 'Logs', content: 'Logs panel' },
        ]}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    expect(await axe(container)).toHaveNoViolations();
  });
});
