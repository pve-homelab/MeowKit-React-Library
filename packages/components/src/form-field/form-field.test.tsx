import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormField from './index';

describe('FormField', () => {
  it('associates label with control via htmlFor', () => {
    render(
      <FormField label="Device name" htmlFor="device-name">
        <input id="device-name" />
      </FormField>,
    );
    expect(screen.getByLabelText('Device name')).toBeInTheDocument();
  });

  it('shows error text', () => {
    render(
      <FormField label="Port" errorText="Required" htmlFor="port">
        <input id="port" />
      </FormField>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
