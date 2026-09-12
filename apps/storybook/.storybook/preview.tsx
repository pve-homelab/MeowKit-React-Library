import type { Preview } from '@storybook/react';
import { MeowKitProvider } from '@meowkit/components/provider';
import '@meowkit/global-styles';
import React from 'react';

const preview: Preview = {
  globalTypes: {
    mode: {
      name: 'Mode',
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    accent: {
      name: 'Accent',
      description: 'Accent theme',
      defaultValue: 'default',
      toolbar: {
        items: [
          { value: 'default', title: 'Default' },
          { value: 'lime', title: 'Lime' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <MeowKitProvider
        mode={context.globals.mode}
        accent={context.globals.accent}
      >
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </MeowKitProvider>
    ),
  ],
};

export default preview;
