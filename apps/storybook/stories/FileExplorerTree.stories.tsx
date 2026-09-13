import type { Meta, StoryObj } from '@storybook/react';
import FileExplorerTree, {
  type FileExplorerNode,
  type FileExplorerTreeProps,
} from '@meowkit/components/file-explorer-tree';
import { useState } from 'react';

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
  {
    id: 'docs',
    name: 'docs',
    type: 'folder',
    children: [{ id: 'guide', name: 'guide.md', type: 'file' }],
  },
  { id: 'readme', name: 'README.md', type: 'file' },
];

const meta: Meta<typeof FileExplorerTree> = {
  title: 'Patterns/FileExplorerTree',
  component: FileExplorerTree,
  args: {
    nodes,
  },
};

export default meta;
type Story = StoryObj<typeof FileExplorerTree>;

function InteractiveTree(args: FileExplorerTreeProps) {
  const [selectedId, setSelectedId] = useState(args.selectedId);
  const [expandedIds, setExpandedIds] = useState(args.expandedIds ?? args.defaultExpandedIds ?? []);

  return (
    <FileExplorerTree
      {...args}
      selectedId={selectedId}
      expandedIds={expandedIds}
      onSelect={setSelectedId}
      onExpandedChange={setExpandedIds}
    />
  );
}

export const Default: Story = {};
export const Expanded: Story = {
  args: {
    defaultExpandedIds: ['src', 'docs'],
  },
};
export const Selected: Story = {
  args: {
    defaultExpandedIds: ['src'],
    selectedId: 'index',
  },
};
export const Interactive: Story = {
  args: {
    defaultExpandedIds: ['src'],
    selectedId: 'readme',
  },
  render: (args) => <InteractiveTree {...args} />,
};
