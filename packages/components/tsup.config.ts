import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig } from 'tsup';

async function onSuccess() {
  const dist = 'dist';
  for (const name of readdirSync(dist, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const jsPath = join(dist, name.name, 'index.js');
    const cssPath = join(dist, name.name, 'index.css');
    if (!existsSync(jsPath) || !existsSync(cssPath)) continue;
    const js = readFileSync(jsPath, 'utf8');
    if (!js.includes('./index.css')) {
      writeFileSync(jsPath, `import "./index.css";\n${js}`);
    }
  }
}

export default defineConfig({
  entry: {
    'button/index': 'src/button/index.tsx',
    'form-field/index': 'src/form-field/index.tsx',
    'input/index': 'src/input/index.tsx',
    'textarea/index': 'src/textarea/index.tsx',
    'search-input/index': 'src/search-input/index.tsx',
    'number-input/index': 'src/number-input/index.tsx',
    'provider/index': 'src/provider/index.tsx',
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
  onSuccess,
});
