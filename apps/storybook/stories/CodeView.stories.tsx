import type { Meta, StoryObj } from '@storybook/react';
import CodeView from '@meowkit/components/code-view';

const snippet = `void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.println("ready");
  delay(1000);
}`;

const meta: Meta<typeof CodeView> = {
  title: 'Patterns/CodeView',
  component: CodeView,
  args: {
    content: snippet,
    language: 'cpp',
  },
};

export default meta;
type Story = StoryObj<typeof CodeView>;

export const Default: Story = {};
export const WithLineNumbers: Story = {
  args: {
    lineNumbers: true,
  },
};
export const LanguageReserved: Story = {
  args: {
    language: 'javascript',
    content: 'const port = "COM3";\nconsole.log(port);',
  },
};
