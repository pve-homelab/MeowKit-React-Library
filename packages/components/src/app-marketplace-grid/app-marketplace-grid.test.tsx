import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AppMarketplaceGrid from './index';

const apps = [
  {
    id: 'blink',
    name: 'Blink',
    description: 'Flash the onboard LED',
    icon: '💡',
    installed: false,
  },
  {
    id: 'serial',
    name: 'Serial Monitor',
    description: 'Read device output',
    installed: true,
  },
];

describe('AppMarketplaceGrid', () => {
  it('renders app names', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByText('Blink')).toBeInTheDocument();
    expect(screen.getByText('Serial Monitor')).toBeInTheDocument();
  });

  it('renders descriptions when provided', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByText('Flash the onboard LED')).toBeInTheDocument();
    expect(screen.getByText('Read device output')).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByText('💡')).toBeInTheDocument();
  });

  it('marks installed apps', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByText('Installed')).toBeInTheDocument();
  });

  it('calls onInstall with the app id', async () => {
    const user = userEvent.setup();
    const onInstall = vi.fn();
    render(<AppMarketplaceGrid apps={apps} onInstall={onInstall} />);

    await user.click(screen.getByRole('button', { name: 'Install Blink' }));
    expect(onInstall).toHaveBeenCalledWith('blink');
  });

  it('calls onOpen with the app id', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<AppMarketplaceGrid apps={apps} onOpen={onOpen} />);

    await user.click(screen.getByRole('button', { name: 'Open Serial Monitor' }));
    expect(onOpen).toHaveBeenCalledWith('serial');
  });

  it('does not render install or open without callbacks', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.queryByRole('button', { name: 'Install Blink' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open Serial Monitor' })).not.toBeInTheDocument();
  });

  it('shows install only for apps that are not installed', () => {
    render(<AppMarketplaceGrid apps={apps} onInstall={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Install Blink' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Install Serial Monitor' })).not.toBeInTheDocument();
  });

  it('shows open only for installed apps', () => {
    render(<AppMarketplaceGrid apps={apps} onOpen={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Open Serial Monitor' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open Blink' })).not.toBeInTheDocument();
  });

  it('defaults to three columns', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByRole('list')).toHaveAttribute('data-columns', '3');
  });

  it('applies the columns prop', () => {
    render(<AppMarketplaceGrid apps={apps} columns={2} />);

    expect(screen.getByRole('list')).toHaveAttribute('data-columns', '2');
  });

  it('shows an empty state when there are no apps', () => {
    render(<AppMarketplaceGrid apps={[]} />);

    expect(screen.getByText('No apps')).toBeInTheDocument();
  });

  it('exposes the marketplace grid marker', () => {
    render(<AppMarketplaceGrid apps={apps} />);

    expect(screen.getByRole('list')).toHaveAttribute('data-mk-component', 'app-marketplace-grid');
  });
});
