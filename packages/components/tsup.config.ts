import { readFileSync, writeFileSync } from 'node:fs';

import { defineConfig } from 'tsup';

const buttonJsPath = 'dist/button/index.js';

export default defineConfig({
  entry: {
    'button/index': 'src/button/index.tsx',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  loader: {
    '.css': 'local-css',
  },
  async onSuccess() {
    const js = readFileSync(buttonJsPath, 'utf8');
    if (!js.includes('./index.css')) {
      writeFileSync(buttonJsPath, `import "./index.css";\n${js}`);
    }
  },
});
