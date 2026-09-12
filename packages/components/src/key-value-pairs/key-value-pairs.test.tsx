import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KeyValuePairs from './index';

describe('KeyValuePairs', () => {
  it('renders labels and values', () => {
    render(
      <KeyValuePairs
        items={[
          { label: 'Name', value: 'Companion' },
          { label: 'Status', value: 'Connected' },
        ]}
      />,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Companion')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('defaults to a single column', () => {
    const { container } = render(
      <KeyValuePairs items={[{ label: 'Port', value: 'COM3' }]} />,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/columns1/);
  });

  it('applies the requested column count', () => {
    const { container } = render(
      <KeyValuePairs columns={3} items={[{ label: 'Port', value: 'COM3' }]} />,
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/columns3/);
  });
});
