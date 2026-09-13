import type { Meta, StoryObj } from '@storybook/react';
import Table, { type TableProps } from '@meowkit/components/table';
import { useState } from 'react';

type Device = { id: string; name: string; port: string };

const items: Device[] = [
  { id: '1', name: 'Alpha', port: 'COM3' },
  { id: '2', name: 'Gamma', port: 'COM5' },
  { id: '3', name: 'Beta', port: 'COM4' },
];

const columnDefinitions: TableProps<Device>['columnDefinitions'] = [
  { id: 'name', header: 'Name', cell: (item) => item.name, sortingField: 'name' },
  { id: 'port', header: 'Port', cell: (item) => item.port, sortingField: 'port', width: 120 },
];

const meta: Meta<typeof Table> = {
  title: 'Patterns/Table',
  component: Table,
  args: {
    items,
    columnDefinitions,
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

function SortableTable(args: TableProps<Device>) {
  const [sortingColumn, setSortingColumn] = useState(args.sortingColumn ?? 'name');
  const [sortingDescending, setSortingDescending] = useState(args.sortingDescending ?? false);
  const field = sortingColumn === 'port' ? 'port' : 'name';
  const sorted = [...args.items].sort((left, right) => {
    const comparison = left[field].localeCompare(right[field]);
    return sortingDescending ? -comparison : comparison;
  });

  return (
    <Table
      {...args}
      items={sorted}
      sortingColumn={sortingColumn}
      sortingDescending={sortingDescending}
      onSortingChange={(state) => {
        setSortingColumn(state.sortingColumn);
        setSortingDescending(state.sortingDescending);
      }}
    />
  );
}

export const Default: Story = {};
export const Empty: Story = {
  args: {
    items: [],
    empty: 'No devices',
  },
};
export const Loading: Story = {
  args: {
    items: [],
    loading: true,
  },
};
export const Embedded: Story = {
  args: {
    variant: 'embedded',
  },
};
export const Sortable: Story = {
  args: {
    sortingColumn: 'name',
    sortingDescending: false,
  },
  render: (args) => <SortableTable {...(args as TableProps<Device>)} />,
};
