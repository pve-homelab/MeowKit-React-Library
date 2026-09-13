import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import IDEToolbar from './index';

describe('IDEToolbar', () => {
  it('renders no primary actions when handlers are omitted', () => {
    render(<IDEToolbar />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Build' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Flash' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Run' })).not.toBeInTheDocument();
  });

  it('renders only actions whose handlers are provided', () => {
    render(<IDEToolbar onSave={vi.fn()} onRun={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Build' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Flash' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument();
  });

  it('calls action callbacks when primary buttons are clicked', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onBuild = vi.fn();
    const onFlash = vi.fn();
    const onRun = vi.fn();

    render(<IDEToolbar onSave={onSave} onBuild={onBuild} onFlash={onFlash} onRun={onRun} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Build' }));
    await user.click(screen.getByRole('button', { name: 'Flash' }));
    await user.click(screen.getByRole('button', { name: 'Run' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onBuild).toHaveBeenCalledTimes(1);
    expect(onFlash).toHaveBeenCalledTimes(1);
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it('disables primary actions when busy', () => {
    render(<IDEToolbar busy onSave={vi.fn()} onBuild={vi.fn()} onFlash={vi.fn()} onRun={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Build' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Flash' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled();
  });

  it('renders left, children, and right slots', () => {
    render(
      <IDEToolbar left={<span>Project</span>} right={<span>Board</span>}>
        main.ino
      </IDEToolbar>,
    );

    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('main.ino')).toBeInTheDocument();
    expect(screen.getByText('Board')).toBeInTheDocument();
  });
});
