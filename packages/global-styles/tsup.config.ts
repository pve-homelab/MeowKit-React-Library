import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';

import { defineConfig } from 'tsup';

function splitCssImports(css: string): { imports: string; body: string } {
  const importLines: string[] = [];
  const bodyLines: string[] = [];
  for (const line of css.split(/\r?\n/)) {
    if (/^\s*@import\b/.test(line)) {
      importLines.push(line.trim());
    } else {
      bodyLines.push(line);
    }
  }
  return { imports: importLines.join('\n'), body: bodyLines.join('\n').trim() };
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  loader: {
    '.css': 'copy',
  },
  esbuildOptions(options) {
    options.packages = 'external';
  },
  async onSuccess() {
    const reset = splitCssImports(readFileSync('src/reset.css', 'utf8'));
    const base = splitCssImports(readFileSync('src/base.css', 'utf8'));
    const imports = [reset.imports, base.imports].filter(Boolean).join('\n');
    const body = [reset.body, base.body].filter(Boolean).join('\n\n');
    writeFileSync('dist/index.css', `${imports ? `${imports}\n\n` : ''}${body}\n`);

    const jsPath = 'dist/index.js';
    const js = readFileSync(jsPath, 'utf8').replace(/^import\s+["']\.\/[^"']+\.css["'];\r?\n/gm, '');
    writeFileSync(jsPath, `import "./index.css";\n${js}`);

    for (const file of readdirSync('dist')) {
      if (file.endsWith('.css') && file !== 'index.css') {
        unlinkSync(`dist/${file}`);
      }
    }
  },
});
