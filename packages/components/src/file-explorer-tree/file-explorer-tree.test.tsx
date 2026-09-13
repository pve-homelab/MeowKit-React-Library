import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FileExplorerTree from './index';
import type { FileExplorerNode } from './index';

const nodes: FileExplorerNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'index', name: 'index.ts', type: 'file' },
      { id: 'utils', name: 'utils.ts', type: 'file' },
    ],
  },
  { id: 'readme', name: 'README.md', type: 'file' },
];

describe('FileExplorerTree', () => {
  it('renders root folder and file names', () => {
    render(<FileExplorerTree nodes={nodes} />);

    const tree = screen.getByRole('tree');
    expect(within(tree).getByRole('treeitem', { name: 'src' })).toBeInTheDocument();
    expect(within(tree).getByRole('treeitem', { name: 'README.md' })).toBeInTheDocument();
  });

  it('hides folder children until the folder is expanded', () => {
    render(<FileExplorerTree nodes={nodes} />);

    expect(screen.queryByRole('treeitem', { name: 'index.ts' })).not.toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows children when a folder is in defaultExpandedIds', () => {
    render(<FileExplorerTree nodes={nodes} defaultExpandedIds={['src']} />);

    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'utils.ts' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('marks the selected node', () => {
    render(<FileExplorerTree nodes={nodes} selectedId="readme" />);

    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelect when a node is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FileExplorerTree nodes={nodes} onSelect={onSelect} />);

    await user.click(screen.getByRole('treeitem', { name: 'README.md' }));
    expect(onSelect).toHaveBeenCalledWith('readme');
  });

  it('expands a folder on click and reports expanded ids', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<FileExplorerTree nodes={nodes} onExpandedChange={onExpandedChange} />);

    await user.click(screen.getByRole('treeitem', { name: 'src' }));
    expect(onExpandedChange).toHaveBeenCalledWith(['src']);
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toBeInTheDocument();
  });

  it('selects the focused node with Enter and Space', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FileExplorerTree nodes={nodes} onSelect={onSelect} />);

    const readme = screen.getByRole('treeitem', { name: 'README.md' });
    readme.focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('readme');

    const src = screen.getByRole('treeitem', { name: 'src' });
    src.focus();
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenCalledWith('src');
  });

  it('expands and collapses folders with arrow keys', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<FileExplorerTree nodes={nodes} onExpandedChange={onExpandedChange} />);

    const src = screen.getByRole('treeitem', { name: 'src' });
    src.focus();
    await user.keyboard('{ArrowRight}');
    expect(onExpandedChange).toHaveBeenCalledWith(['src']);
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toBeInTheDocument();

    src.focus();
    await user.keyboard('{ArrowLeft}');
    expect(onExpandedChange).toHaveBeenLastCalledWith([]);
    expect(src).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('treeitem', { name: 'index.ts' })).not.toBeInTheDocument();
  });

  it('uses folder and file icons', () => {
    const { container } = render(
      <FileExplorerTree nodes={nodes} defaultExpandedIds={['src']} />,
    );

    expect(container.querySelector('svg[data-icon="folder"]')).toBeInTheDocument();
    expect(container.querySelectorAll('svg[data-icon="file"]').length).toBe(3);
  });

  it('honors controlled expandedIds without expanding from defaultExpandedIds', () => {
    render(
      <FileExplorerTree nodes={nodes} expandedIds={[]} defaultExpandedIds={['src']} />,
    );

    expect(screen.queryByRole('treeitem', { name: 'index.ts' })).not.toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-expanded', 'false');
  });
});
