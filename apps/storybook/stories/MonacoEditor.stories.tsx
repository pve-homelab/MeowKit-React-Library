import type { Meta, StoryObj } from '@storybook/react';
import CodeView from '@meowkit/components/code-view';

const usage = `import MonacoEditor from '@meowkit/components/monaco-editor';

<MonacoEditor
  language="javascript"
  path="main.js"
  height={320}
  defaultValue="const ready = true;"
  onChange={(value) => console.log(value)}
/>`;

const meta: Meta = {
  title: 'Patterns/MonacoEditor',
  parameters: {
    docs: {
      description: {
        component:
          'Optional peer wrapper around `@monaco-editor/react`. Install `monaco-editor` and `@monaco-editor/react` to render a live editor. On mount it registers the MeowKit theme for the current Provider mode/accent.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DocsOnly: Story = {
  render: () => (
    <CodeView language="tsx" content={usage} />
  ),
};
