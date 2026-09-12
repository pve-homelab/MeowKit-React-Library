import { mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { getCssVars } from '../packages/design-tokens/dist/index.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = resolve(root, 'docs/images');
const componentsDist = resolve(root, 'packages/components/dist');

function readCss(entry) {
  return readFileSync(resolve(componentsDist, entry, 'index.css'), 'utf8');
}

function hashedClass(css, localName) {
  const escaped = localName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`\\.(${escaped}\\d*)(?![\\w-])`));
  if (!match) {
    throw new Error(`CSS class not found: ${localName}`);
  }
  return match[1];
}

function rootVars(mode, accent) {
  return Object.entries(getCssVars(mode, accent))
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
}

function pageHtml(body, cssSheets, extraCss = '') {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      :root { ${rootVars('light', 'default')} }
      html, body { margin: 0; min-height: 100%; background: var(--mk-color-background); color: var(--mk-color-text); font-family: var(--mk-font-family-sans); }
      .preview { box-sizing: border-box; padding: 32px; min-height: 100vh; }
      .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
      .stack { display: flex; flex-direction: column; gap: 16px; max-width: 560px; }
      .field { width: 320px; }
      ${cssSheets.join('\n')}
      ${extraCss}
    </style>
  </head>
  <body>
    <div class="preview">${body}</div>
  </body>
</html>`;
}

const buttonCss = readCss('button');
const inputCss = readCss('input');
const modalCss = readCss('modal');
const alertCss = readCss('alert');
const badgeCss = readCss('badge');
const tagCss = readCss('tag');
const linkCss = readCss('link');
const spinnerCss = readCss('spinner');
const progressCss = readCss('progress-bar');

const button = {
  root: hashedClass(buttonCss, 'styles_root'),
  primary: hashedClass(buttonCss, 'styles_primary'),
  secondary: hashedClass(buttonCss, 'styles_secondary'),
  ghost: hashedClass(buttonCss, 'styles_ghost'),
  destructive: hashedClass(buttonCss, 'styles_destructive'),
};
const input = {
  field: hashedClass(inputCss, 'field_chrome_field'),
  extra: hashedClass(inputCss, 'styles_field'),
};
const modal = {
  overlay: hashedClass(modalCss, 'styles_overlay'),
  content: hashedClass(modalCss, 'styles_content'),
  md: hashedClass(modalCss, 'styles_md'),
  header: hashedClass(modalCss, 'styles_header'),
  body: hashedClass(modalCss, 'styles_body'),
  footer: hashedClass(modalCss, 'styles_footer'),
};
const alert = {
  root: hashedClass(alertCss, 'styles_root'),
  info: hashedClass(alertCss, 'styles_info'),
  success: hashedClass(alertCss, 'styles_success'),
  warning: hashedClass(alertCss, 'styles_warning'),
  error: hashedClass(alertCss, 'styles_error'),
  body: hashedClass(alertCss, 'styles_body'),
  header: hashedClass(alertCss, 'styles_header'),
  content: hashedClass(alertCss, 'styles_content'),
};
const badge = {
  root: hashedClass(badgeCss, 'styles_root'),
  default: hashedClass(badgeCss, 'styles_default'),
  accent: hashedClass(badgeCss, 'styles_accent'),
  success: hashedClass(badgeCss, 'styles_success'),
};
const tag = {
  root: hashedClass(tagCss, 'styles_root'),
  label: hashedClass(tagCss, 'styles_label'),
};
const link = {
  root: hashedClass(linkCss, 'styles_root'),
  primary: hashedClass(linkCss, 'styles_primary'),
};
const spinner = {
  root: hashedClass(spinnerCss, 'styles_root'),
  md: hashedClass(spinnerCss, 'styles_md'),
  circle: hashedClass(spinnerCss, 'styles_circle'),
};
const progress = {
  root: hashedClass(progressCss, 'styles_root'),
  label: hashedClass(progressCss, 'styles_label'),
  track: hashedClass(progressCss, 'styles_track'),
  fill: hashedClass(progressCss, 'styles_fill'),
};

const shots = [
  {
    file: 'button.png',
    size: { width: 720, height: 120 },
    html: pageHtml(
      `<div class="row">
        <button type="button" class="${button.root} ${button.primary}">Continue</button>
        <button type="button" class="${button.root} ${button.secondary}">Cancel</button>
        <button type="button" class="${button.root} ${button.ghost}">Learn more</button>
        <button type="button" class="${button.root} ${button.destructive}">Delete</button>
      </div>`,
      [buttonCss],
    ),
  },
  {
    file: 'input.png',
    size: { width: 720, height: 180 },
    html: pageHtml(
      `<div class="stack">
        <input class="${input.field} ${input.extra} field" placeholder="Enter a name" value="COM3" />
        <input class="${input.field} ${input.extra} field" placeholder="Search devices" />
      </div>`,
      [inputCss],
    ),
  },
  {
    file: 'modal.png',
    size: { width: 800, height: 360 },
    html: pageHtml(
      `<div class="${modal.overlay}"></div>
      <div class="${modal.content} ${modal.md}" role="dialog" aria-labelledby="modal-title">
        <h2 id="modal-title" class="${modal.header}">Erase flash</h2>
        <div class="${modal.body}">This cannot be undone. The device memory will be wiped.</div>
        <div class="${modal.footer}">
          <button type="button" class="${button.root} ${button.secondary}">Cancel</button>
          <button type="button" class="${button.root} ${button.destructive}">Erase</button>
        </div>
      </div>`,
      [buttonCss, modalCss],
      `.${modal.overlay}, .${modal.content} { position: absolute; }
       .preview { position: relative; }`,
    ),
  },
  {
    file: 'alert.png',
    size: { width: 720, height: 280 },
    html: pageHtml(
      `<div class="stack">
        <div role="status" class="${alert.root} ${alert.info}">
          <div class="${alert.body}">
            <div class="${alert.header}">Device connected</div>
            <div class="${alert.content}">Serial port COM3 is ready.</div>
          </div>
        </div>
        <div role="status" class="${alert.root} ${alert.success}">
          <div class="${alert.body}">
            <div class="${alert.header}">Flash complete</div>
            <div class="${alert.content}">Firmware written successfully.</div>
          </div>
        </div>
        <div role="alert" class="${alert.root} ${alert.warning}">
          <div class="${alert.body}">
            <div class="${alert.header}">Low battery</div>
            <div class="${alert.content}">Charge the device before flashing.</div>
          </div>
        </div>
      </div>`,
      [alertCss],
    ),
  },
  {
    file: 'chrome.png',
    size: { width: 720, height: 180 },
    html: pageHtml(
      `<div class="stack">
        <div class="row">
          <span class="${badge.root} ${badge.default}">New</span>
          <span class="${badge.root} ${badge.accent}">Lime</span>
          <span class="${badge.root} ${badge.success}">Ready</span>
          <span class="${tag.root}"><span class="${tag.label}">serial</span></span>
          <a class="${link.root} ${link.primary}" href="https://meowkit.cc">Read the docs</a>
          <span class="${spinner.root} ${spinner.md}"><span class="${spinner.circle}"></span></span>
        </div>
        <div class="${progress.root}" style="--mk-progress-value: 64%">
          <div class="${progress.label}">Flashing firmware</div>
          <div class="${progress.track}"><div class="${progress.fill}"></div></div>
        </div>
      </div>`,
      [badgeCss, tagCss, linkCss, spinnerCss, progressCss],
    ),
  },
];

mkdirSync(imagesDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  for (const shot of shots) {
    await page.setViewportSize(shot.size);
    await page.setContent(shot.html, { waitUntil: 'load' });
    const target = resolve(imagesDir, shot.file);
    await page.screenshot({ path: target, type: 'png' });
    const bytes = statSync(target).size;
    if (bytes < 2_048) {
      throw new Error(`${shot.file} looks empty (${bytes} bytes)`);
    }
    console.log(`wrote docs/images/${shot.file} (${bytes} bytes)`);
  }
} finally {
  await browser.close();
}
