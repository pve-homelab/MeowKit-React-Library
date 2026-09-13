import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Table from './index';

type Device = { id: string; name: string; port: string };

const items: Device[] = [
  { id: '1', name: 'Alpha', port: 'COM3' },
  { id: '2', name: 'Beta', port: 'COM4' },
];

const columnDefinitions = [
  { id: 'name', header: 'Name', cell: (item: Device) => item.name, sortingField: 'name' },
  { id: 'port', header: 'Port', cell: (item: Device) => item.port, width: 120 },
];

describe('Table', () => {
  it('renders column headers and row cells in item order', () => {
    render(<Table items={items} columnDefinitions={columnDefinitions} />);

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Port' })).toBeInTheDocument();

    const [, firstRow, secondRow] = within(table).getAllByRole('row');
    if (!firstRow || !secondRow) {
      throw new Error('expected two data rows');
    }
    expect(within(firstRow).getByRole('cell', { name: 'Alpha' })).toBeInTheDocument();
    expect(within(firstRow).getByRole('cell', { name: 'COM3' })).toBeInTheDocument();
    expect(within(secondRow).getByRole('cell', { name: 'Beta' })).toBeInTheDocument();
    expect(within(secondRow).getByRole('cell', { name: 'COM4' })).toBeInTheDocument();
  });

  it('renders empty content when there are no items', () => {
    render(
      <Table items={[]} columnDefinitions={columnDefinitions} empty={<p>No devices</p>} />,
    );
    expect(screen.getByText('No devices')).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Alpha' })).not.toBeInTheDocument();
  });

  it('announces loading without showing empty content', () => {
    render(
      <Table
        items={[]}
        columnDefinitions={columnDefinitions}
        loading
        empty={<p>No devices</p>}
      />,
    );
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.queryByText('No devices')).not.toBeInTheDocument();
  });

  it('calls onSortingChange and keeps parent item order (controlled)', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(
      <Table
        items={items}
        columnDefinitions={columnDefinitions}
        onSortingChange={onSortingChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortingChange).toHaveBeenCalledWith({
      sortingColumn: 'name',
      sortingDescending: false,
    });

    const [, firstRow, secondRow] = screen.getAllByRole('row');
    if (!firstRow || !secondRow) {
      throw new Error('expected two data rows');
    }
    expect(within(firstRow).getByRole('cell', { name: 'Alpha' })).toBeInTheDocument();
    expect(within(secondRow).getByRole('cell', { name: 'Beta' })).toBeInTheDocument();
  });

  it('toggles descending when the active sortable column is clicked again', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(
      <Table
        items={items}
        columnDefinitions={columnDefinitions}
        sortingColumn="name"
        sortingDescending={false}
        onSortingChange={onSortingChange}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortingChange).toHaveBeenCalledWith({
      sortingColumn: 'name',
      sortingDescending: true,
    });
  });

  it('does not make columns sortable without sortingField', () => {
    render(
      <Table items={items} columnDefinitions={columnDefinitions} onSortingChange={() => {}} />,
    );
    expect(screen.queryByRole('button', { name: 'Port' })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Port' })).not.toHaveAttribute('aria-sort');
  });

  it('applies container and embedded variants', () => {
    const { rerender, container } = render(
      <Table items={items} columnDefinitions={columnDefinitions} variant="container" />,
    );
    expect(container.firstChild).toHaveAttribute('data-variant', 'container');

    rerender(<Table items={items} columnDefinitions={columnDefinitions} variant="embedded" />);
    expect(container.firstChild).toHaveAttribute('data-variant', 'embedded');
  });
});
