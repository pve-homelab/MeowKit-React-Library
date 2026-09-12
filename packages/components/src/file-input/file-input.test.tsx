import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import FileInput from './index';

describe('FileInput', () => {
  it('renders a Choose file button by default', () => {
    render(<FileInput />);
    expect(screen.getByRole('button', { name: 'Choose file' })).toBeInTheDocument();
  });

  it('uses custom buttonText', () => {
    render(<FileInput buttonText="Upload firmware" />);
    expect(screen.getByRole('button', { name: 'Upload firmware' })).toBeInTheDocument();
  });

  it('forwards ref to the hidden file input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('file');
  });

  it('passes accept and multiple to the hidden input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileInput ref={ref} accept=".bin" multiple />);
    expect(ref.current).toHaveAttribute('accept', '.bin');
    expect(ref.current).toHaveAttribute('multiple');
  });

  it('clicks the hidden input when the button is clicked', async () => {
    const user = userEvent.setup();
    const click = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<FileInput />);
    await user.click(screen.getByRole('button', { name: 'Choose file' }));
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('does not click the hidden input when disabled', async () => {
    const user = userEvent.setup();
    const click = vi.spyOn(HTMLInputElement.prototype, 'click');
    render(<FileInput disabled />);
    await user.click(screen.getByRole('button', { name: 'Choose file' }));
    expect(click).not.toHaveBeenCalled();
    click.mockRestore();
  });

  it('fires onChange with selected files and shows the file name', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = new File(['firmware'], 'kit.bin', { type: 'application/octet-stream' });
    const ref = createRef<HTMLInputElement>();
    render(<FileInput ref={ref} onChange={onChange} />);
    await user.upload(ref.current!, file);
    expect(onChange).toHaveBeenCalled();
    const firstCall = onChange.mock.calls[0];
    expect(firstCall).toBeDefined();
    const files = firstCall![0] as FileList;
    expect(files).toHaveLength(1);
    expect(files[0]?.name).toBe('kit.bin');
    expect(screen.getByText('kit.bin')).toBeInTheDocument();
  });

  it('shows multiple selected file names', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['a'], 'a.txt', { type: 'text/plain' }),
      new File(['b'], 'b.txt', { type: 'text/plain' }),
    ];
    const ref = createRef<HTMLInputElement>();
    render(<FileInput ref={ref} multiple />);
    await user.upload(ref.current!, files);
    expect(screen.getByText('a.txt, b.txt')).toBeInTheDocument();
  });
});
