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

function cssSection(css, sourcePath) {
  const marker = `/* ${sourcePath} */`;
  const start = css.indexOf(marker);
  if (start === -1) {
    return css;
  }
  const next = css.indexOf('\n/* src/', start + marker.length);
  return next === -1 ? css.slice(start) : css.slice(start, next);
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
const appLayoutCss = readCss('app-layout');
const containerCss = readCss('container');
const headerCss = readCss('header');
const statusBarCss = readCss('status-bar');
const tableCss = readCss('table');
const fileExplorerBundleCss = readCss('file-explorer-tree');
const fileExplorerCss = cssSection(fileExplorerBundleCss, 'src/file-explorer-tree/styles.module.css');
const iconCss = readCss('icon');

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
const appLayout = {
  root: hashedClass(appLayoutCss, 'styles_root'),
  chrome: hashedClass(appLayoutCss, 'styles_chrome'),
  toolsToggle: hashedClass(appLayoutCss, 'styles_toolsToggle'),
  toggle: hashedClass(appLayoutCss, 'styles_toggle'),
  body: hashedClass(appLayoutCss, 'styles_body'),
  navigation: hashedClass(appLayoutCss, 'styles_navigation'),
  tools: hashedClass(appLayoutCss, 'styles_tools'),
  main: hashedClass(appLayoutCss, 'styles_main'),
  contentHeader: hashedClass(appLayoutCss, 'styles_contentHeader'),
  content: hashedClass(appLayoutCss, 'styles_content'),
  statusBar: hashedClass(appLayoutCss, 'styles_statusBar'),
};
const container = {
  root: hashedClass(containerCss, 'styles_root'),
  default: hashedClass(containerCss, 'styles_default'),
  header: hashedClass(containerCss, 'styles_header'),
  content: hashedClass(containerCss, 'styles_content'),
  contentPadded: hashedClass(containerCss, 'styles_contentPadded'),
};
const header = {
  root: hashedClass(headerCss, 'styles_root'),
  main: hashedClass(headerCss, 'styles_main'),
  heading: hashedClass(headerCss, 'styles_heading'),
  headingH1: hashedClass(headerCss, 'styles_headingH1'),
  headingH2: hashedClass(headerCss, 'styles_headingH2'),
  counter: hashedClass(headerCss, 'styles_counter'),
  actions: hashedClass(headerCss, 'styles_actions'),
  description: hashedClass(headerCss, 'styles_description'),
};
const statusBar = {
  root: hashedClass(statusBarCss, 'styles_root'),
  left: hashedClass(statusBarCss, 'styles_left'),
  main: hashedClass(statusBarCss, 'styles_main'),
  right: hashedClass(statusBarCss, 'styles_right'),
};
const table = {
  root: hashedClass(tableCss, 'styles_root'),
  container: hashedClass(tableCss, 'styles_container'),
  table: hashedClass(tableCss, 'styles_table'),
  header: hashedClass(tableCss, 'styles_header'),
  sortButton: hashedClass(tableCss, 'styles_sortButton'),
  cell: hashedClass(tableCss, 'styles_cell'),
};
const fileExplorer = {
  root: hashedClass(fileExplorerCss, 'styles_root'),
  item: hashedClass(fileExplorerCss, 'styles_item'),
  row: hashedClass(fileExplorerCss, 'styles_row'),
  selected: hashedClass(fileExplorerCss, 'styles_selected'),
  chevron: hashedClass(fileExplorerCss, 'styles_chevron'),
  name: hashedClass(fileExplorerCss, 'styles_name'),
  group: hashedClass(fileExplorerCss, 'styles_group'),
};
const icon = {
  root: hashedClass(iconCss, 'styles_root'),
  sm: hashedClass(iconCss, 'styles_sm'),
};

function iconMarkup(name, paths) {
  return `<span class="${icon.root} ${icon.sm}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="${name}" aria-hidden="true">${paths}</svg></span>`;
}

const icons = {
  chevronDown: iconMarkup('chevron-down', '<path d="M6 9l6 6 6-6" />'),
  chevronRight: iconMarkup('chevron-right', '<path d="M9 6l6 6-6 6" />'),
  folder: iconMarkup('folder', '<path d="M3 7h6l2 2h10v10H3z" />'),
  file: iconMarkup('file', '<path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" />'),
};

function treeItem({ name, level, selected = false, expanded, childrenHtml = '' }) {
  const isFolder = expanded !== undefined;
  const ariaExpanded = isFolder ? ` aria-expanded="${expanded}"` : '';
  const selectedClass = selected ? ` ${fileExplorer.selected}` : '';
  const chevron = isFolder ? (expanded ? icons.chevronDown : icons.chevronRight) : '';
  const typeIcon = isFolder ? icons.folder : icons.file;
  const group = childrenHtml
    ? `<div role="group" class="${fileExplorer.group}">${childrenHtml}</div>`
    : '';
  return `<div role="treeitem" aria-label="${name}" aria-selected="${selected}"${ariaExpanded} aria-level="${level}" class="${fileExplorer.item}${selectedClass}" style="--mk-tree-level: ${level}">
        <span class="${fileExplorer.row}">
          <span class="${fileExplorer.chevron}">${chevron}</span>
          ${typeIcon}
          <span class="${fileExplorer.name}">${name}</span>
        </span>
        ${group}
      </div>`;
}

const containerPanel = `
      <div class="${container.root} ${container.default}">
        <div class="${container.header}">
          <div class="${header.root}">
            <div class="${header.main}">
              <h2 class="${header.heading} ${header.headingH2}">
                Devices
                <span class="${header.counter}">(3)</span>
              </h2>
              <div class="${header.actions}">
                <button type="button" class="${button.root} ${button.primary}">Edit</button>
              </div>
            </div>
            <div class="${header.description}">Connected serial ports and flash targets.</div>
          </div>
        </div>
        <div class="${container.content} ${container.contentPadded}">
          Primary content sits inside a bordered surface panel.
        </div>
      </div>`;

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
  {
    file: 'app-layout.png',
    size: { width: 1100, height: 560 },
    html: pageHtml(
      `<div class="${appLayout.root}">
        <div class="${appLayout.chrome}">
          <button type="button" class="${appLayout.toggle}" aria-expanded="true" aria-label="Close navigation">‹</button>
          <button type="button" class="${appLayout.toggle} ${appLayout.toolsToggle}" aria-expanded="true" aria-label="Close tools">›</button>
        </div>
        <div class="${appLayout.body}">
          <aside class="${appLayout.navigation}" aria-label="Navigation" data-open="true">
            <div class="panel">
              <strong>Workspace</strong>
              <div>Devices</div>
              <div>Settings</div>
            </div>
          </aside>
          <main class="${appLayout.main}">
            <div class="${appLayout.contentHeader}">
              <div class="${header.root}">
                <div class="${header.main}">
                  <h1 class="${header.heading} ${header.headingH1}">Companion</h1>
                </div>
                <div class="${header.description}">Cloudscape-inspired application shell</div>
              </div>
            </div>
            <div class="${appLayout.content}">${containerPanel}</div>
          </main>
          <aside class="${appLayout.tools}" aria-label="Tools" data-open="true">
            <div class="panel">Inspector, logs, and device details.</div>
          </aside>
        </div>
        <div class="${appLayout.statusBar}">
          <div role="status" class="${statusBar.root}">
            <div class="${statusBar.left}">COM3</div>
            <div class="${statusBar.main}">Ready</div>
            <div class="${statusBar.right}">Connected</div>
          </div>
        </div>
      </div>`,
      [buttonCss, appLayoutCss, containerCss, headerCss, statusBarCss],
      `.preview { padding: 0; min-height: 100vh; }
       .${appLayout.root} { height: 100vh; }
       .panel { padding: 16px; }`,
    ),
  },
  {
    file: 'container.png',
    size: { width: 800, height: 280 },
    html: pageHtml(containerPanel, [buttonCss, containerCss, headerCss]),
  },
  {
    file: 'table.png',
    size: { width: 800, height: 260 },
    html: pageHtml(
      `<div class="${table.root} ${table.container}" data-variant="container">
        <table class="${table.table}">
          <thead>
            <tr>
              <th scope="col" class="${table.header}" aria-sort="ascending">
                <button type="button" class="${table.sortButton}">Name</button>
              </th>
              <th scope="col" class="${table.header}" aria-sort="none" style="width:120px">
                <button type="button" class="${table.sortButton}">Port</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="${table.cell}">Alpha</td>
              <td class="${table.cell}" style="width:120px">COM3</td>
            </tr>
            <tr>
              <td class="${table.cell}">Beta</td>
              <td class="${table.cell}" style="width:120px">COM4</td>
            </tr>
            <tr>
              <td class="${table.cell}">Gamma</td>
              <td class="${table.cell}" style="width:120px">COM5</td>
            </tr>
          </tbody>
        </table>
      </div>`,
      [tableCss],
    ),
  },
  {
    file: 'file-explorer-tree.png',
    size: { width: 480, height: 320 },
    html: pageHtml(
      `<div role="tree" class="${fileExplorer.root}">
        ${treeItem({
          name: 'src',
          level: 1,
          expanded: true,
          childrenHtml: `${treeItem({ name: 'index.ts', level: 2, selected: true })}${treeItem({ name: 'utils.ts', level: 2 })}`,
        })}
        ${treeItem({ name: 'docs', level: 1, expanded: false })}
        ${treeItem({ name: 'README.md', level: 1 })}
      </div>`,
      [iconCss, fileExplorerCss],
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
