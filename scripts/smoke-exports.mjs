import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Requires `pnpm build` first. This script does not compile packages.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buttonCssPath = resolve(root, 'packages/components/dist/button/index.css');
const buttonJsPath = resolve(root, 'packages/components/dist/button/index.js');

if (!existsSync(buttonCssPath)) {
  throw new Error('missing packages/components/dist/button/index.css');
}

const buttonJs = readFileSync(buttonJsPath, 'utf8');
if (!buttonJs.includes('index.css') && !buttonJs.includes('.css')) {
  throw new Error('packages/components/dist/button/index.js does not import CSS');
}

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.css')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default {}',
      };
    }
    return nextLoad(url, context);
  },
});

const { getCssVars } = await import('../packages/design-tokens/dist/index.js');
const { applyMode } = await import('../packages/global-styles/dist/index.js');
const { default: Button } = await import('../packages/components/dist/button/index.js');

const vars = getCssVars('light', 'lime');
if (vars['--mk-color-primary'] !== '#BBE700') {
  throw new Error('design-tokens export failed');
}
if (typeof applyMode !== 'function') {
  throw new Error('global-styles export failed');
}
if (typeof Button !== 'function' && typeof Button !== 'object') {
  throw new Error('components/button export failed');
}
console.log('smoke ok');

