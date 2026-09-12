import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Requires `pnpm build` first. This script does not compile packages.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = resolve(root, 'packages/components');
const buttonCssPath = resolve(componentsRoot, 'dist/button/index.css');
const buttonJsPath = resolve(componentsRoot, 'dist/button/index.js');

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

const vars = getCssVars('light', 'lime');
if (vars['--mk-color-primary'] !== '#BBE700') {
  throw new Error('design-tokens export failed');
}
if (typeof applyMode !== 'function') {
  throw new Error('global-styles export failed');
}

function isRenderableExport(value) {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && ('$$typeof' in value || 'render' in value))
  );
}

function hasRenderableExport(mod) {
  return [mod.default, ...Object.values(mod)].some(isRenderableExport);
}

const pkg = JSON.parse(readFileSync(resolve(componentsRoot, 'package.json'), 'utf8'));
const exportKeys = Object.keys(pkg.exports ?? {});
if (exportKeys.length === 0) {
  throw new Error('packages/components/package.json has no exports');
}

for (const key of exportKeys) {
  const entry = pkg.exports[key];
  const importPath = typeof entry === 'string' ? entry : entry.import;
  if (typeof importPath !== 'string') {
    throw new Error(`components${key} is missing an import target`);
  }

  const abs = resolve(componentsRoot, importPath);
  if (!existsSync(abs)) {
    throw new Error(`missing ${abs}`);
  }

  const mod = await import(pathToFileURL(abs).href);
  if (!hasRenderableExport(mod)) {
    throw new Error(`components${key} export failed`);
  }
}

console.log(`smoke ok (${exportKeys.length} component entries)`);
