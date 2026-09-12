import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Icon, { ICON_NAMES, iconMap } from './index';
import type { IconName } from './index';

const starterNames: IconName[] = [
  'add',
  'close',
  'check',
  'chevron-down',
  'chevron-right',
  'search',
  'settings',
  'folder',
  'file',
  'usb',
  'battery',
  'apps',
  'warning',
  'error',
  'info',
  'success',
];

describe('Icon', () => {
  it('renders an SVG for the requested name', () => {
    const { container } = render(<Icon name="add" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-icon', 'add');
  });

  it('uses currentColor so the glyph inherits text color', () => {
    const { container } = render(<Icon name="check" />);
    const painted = container.querySelector('[stroke="currentColor"], [fill="currentColor"]');
    expect(painted).not.toBeNull();
  });

  it('defaults to the md size class', () => {
    const { container } = render(<Icon name="search" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/md/);
  });

  it('applies the size class', () => {
    const { container } = render(<Icon name="search" size="lg" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/lg/);
  });

  it('applies className', () => {
    const { container } = render(<Icon name="close" className="extra" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/extra/);
  });

  it('is decorative by default', () => {
    const { container } = render(<Icon name="add" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes an accessible name when aria-label is set', () => {
    render(<Icon name="settings" aria-label="Settings" />);
    expect(screen.getByRole('img', { name: 'Settings' })).toBeInTheDocument();
  });

  it('honors an explicit aria-hidden value', () => {
    const { container } = render(<Icon name="add" aria-hidden={false} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders every starter icon name', () => {
    for (const name of starterNames) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector(`svg[data-icon="${name}"]`)).toBeInTheDocument();
      unmount();
    }
  });

  it('exposes a map covering every IconName', () => {
    expect(ICON_NAMES).toEqual(starterNames);
    for (const name of starterNames) {
      expect(typeof iconMap[name]).toBe('function');
    }
  });
});
