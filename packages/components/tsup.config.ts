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
    'file-input/index': 'src/file-input/index.tsx',
    'checkbox/index': 'src/checkbox/index.tsx',
    'switch/index': 'src/switch/index.tsx',
    'radio-group/index': 'src/radio-group/index.tsx',
    'slider/index': 'src/slider/index.tsx',
    'select/index': 'src/select/index.tsx',
    'button-dropdown/index': 'src/button-dropdown/index.tsx',
    'tabs/index': 'src/tabs/index.tsx',
    'segmented-control/index': 'src/segmented-control/index.tsx',
    'badge/index': 'src/badge/index.tsx',
    'tag/index': 'src/tag/index.tsx',
    'link/index': 'src/link/index.tsx',
    'spinner/index': 'src/spinner/index.tsx',
    'progress-bar/index': 'src/progress-bar/index.tsx',
    'alert/index': 'src/alert/index.tsx',
    'modal/index': 'src/modal/index.tsx',
    'drawer/index': 'src/drawer/index.tsx',
    'popover/index': 'src/popover/index.tsx',
    'tooltip/index': 'src/tooltip/index.tsx',
    'flashbar/index': 'src/flashbar/index.tsx',
    'box/index': 'src/box/index.tsx',
    'space-between/index': 'src/space-between/index.tsx',
    'grid/index': 'src/grid/index.tsx',
    'column-layout/index': 'src/column-layout/index.tsx',
    'container/index': 'src/container/index.tsx',
    'header/index': 'src/header/index.tsx',
    'footer/index': 'src/footer/index.tsx',
    'sidebar/index': 'src/sidebar/index.tsx',
    'toolbar/index': 'src/toolbar/index.tsx',
    'status-bar/index': 'src/status-bar/index.tsx',
    'breadcrumb/index': 'src/breadcrumb/index.tsx',
    'pagination/index': 'src/pagination/index.tsx',
    'app-layout/index': 'src/app-layout/index.tsx',
    'icon/index': 'src/icon/index.tsx',
    'empty-state/index': 'src/empty-state/index.tsx',
    'key-value-pairs/index': 'src/key-value-pairs/index.tsx',
    'code-view/index': 'src/code-view/index.tsx',
    'table/index': 'src/table/index.tsx',
    'file-explorer-tree/index': 'src/file-explorer-tree/index.tsx',
    'provider/index': 'src/provider/index.tsx',
    'monaco-theme/index': 'src/monaco-theme/index.ts',
    'monaco-editor/index': 'src/monaco-editor/index.tsx',
    'ide-toolbar/index': 'src/ide-toolbar/index.tsx',
    'build-output-panel/index': 'src/build-output-panel/index.tsx',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'monaco-editor', '@monaco-editor/react'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  loader: {
    '.css': 'local-css',
  },
  onSuccess,
});
