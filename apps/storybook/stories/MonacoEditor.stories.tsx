import type { Meta, StoryObj } from '@storybook/react';
import MonacoEditor from '@meowkit/components/monaco-editor';
import CodeView from '@meowkit/components/code-view';
import { useState } from 'react';

const usage = `import MonacoEditor from '@meowkit/components/monaco-editor';

<MonacoEditor
  language="javascript"
  path="main.js"
  height={320}
  defaultValue="const ready = true;"
  onChange={(value) => console.log(value)}
/>`;

const meta: Meta<typeof MonacoEditor> = {
  title: 'Patterns/MonacoEditor',
  component: MonacoEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Optional peer wrapper around `@monaco-editor/react`. Install `monaco-editor` and `@monaco-editor/react` to render a live editor. On mount it registers the MeowKit theme for the current Provider mode/accent.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MonacoEditor>;

export const Live: Story = {
  render: () => {
    const [value, setValue] = useState('print("hello from MeowKit")\n');
    return (
      <MonacoEditor
        language="python"
        path="main.py"
        height={360}
        value={value}
        onChange={setValue}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
    );
  },
};

export const DocsOnly: Story = {
  render: () => (
    <CodeView language="tsx" content={usage} />
  ),
};
