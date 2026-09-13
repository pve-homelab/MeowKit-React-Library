import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Multiselect from '../multiselect';
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

  it('wires description id onto a single child via aria-describedby', () => {
    render(
      <FormField label="Device name" htmlFor="device-name" description="Shown on the badge">
        <input id="device-name" />
      </FormField>,
    );
    const input = screen.getByLabelText('Device name');
    const description = screen.getByText('Shown on the badge');
    expect(description).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', description.id);
  });

  it('wires error id onto a single child via aria-describedby', () => {
    render(
      <FormField label="Port" htmlFor="port" errorText="Required">
        <input id="port" />
      </FormField>,
    );
    const input = screen.getByLabelText('Port');
    const error = screen.getByText('Required');
    expect(error).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('wires both description and error ids onto a single child', () => {
    render(
      <FormField label="SSID" htmlFor="ssid" description="2.4 GHz only" errorText="Required">
        <input id="ssid" />
      </FormField>,
    );
    const describedBy = (screen.getByLabelText('SSID').getAttribute('aria-describedby') ?? '').split(/\s+/);
    expect(describedBy).toEqual(
      expect.arrayContaining([
        screen.getByText('2.4 GHz only').id,
        screen.getByText('Required').id,
      ]),
    );
  });

  it('merges existing aria-describedby on the child', () => {
    render(
      <FormField label="Port" htmlFor="port" errorText="Required">
        <input id="port" aria-describedby="hint" />
      </FormField>,
    );
    const describedBy = (screen.getByLabelText('Port').getAttribute('aria-describedby') ?? '').split(/\s+/);
    expect(describedBy).toEqual(expect.arrayContaining(['hint', screen.getByText('Required').id]));
  });

  it('does not inject aria-describedby when there are multiple children', () => {
    render(
      <FormField label="Range" description="Inclusive">
        <input aria-label="Min" />
        <input aria-label="Max" />
      </FormField>,
    );
    expect(screen.getByLabelText('Min')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('Max')).not.toHaveAttribute('aria-describedby');
  });

  it('forwards describedby onto a Multiselect combobox', () => {
    render(
      <FormField label="Boards" description="Pick one or more">
        <Multiselect
          options={[{ value: 'esp32', label: 'ESP32' }]}
          placeholder="Choose boards"
          aria-label="Boards"
        />
      </FormField>,
    );
    expect(screen.getByRole('combobox', { name: 'Boards' })).toHaveAttribute(
      'aria-describedby',
      screen.getByText('Pick one or more').id,
    );
  });
});
