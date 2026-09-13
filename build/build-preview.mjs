/* =========================================================
   Builds docs/preview.html

   The preview is a single, self-contained file: the project
   stylesheet is inlined and the wordmark is embedded, so it
   opens straight from the file system and can be emailed or
   dropped on any static host. Run it after editing
   src/index.css so the preview never drifts from the app.

       node build/build-preview.mjs
   ========================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycbx4SdMZrXXj8AFwI-POmBUikaPKY_ZQpZJCjoeb77cDtponCTpgTIg4Klj30Nh3VSU2/exec';

const css = readFileSync(resolve(root, 'src/index.css'), 'utf8')
  .split('\n')
  .filter((line) => !line.trim().startsWith('@tailwind'))
  .join('\n')
  .trim();

const logo = readFileSync(resolve(root, 'public/young-timbers-logo.png')).toString('base64');
const favicon = readFileSync(resolve(root, 'public/favicon.svg')).toString('base64');

const html = readFileSync(resolve(here, 'preview.template.html'), 'utf8')
  .replace('__CSS__', () => css)
  .replace('__LOGO__', () => `data:image/png;base64,${logo}`)
  .replace('__FAVICON__', () => `data:image/svg+xml;base64,${favicon}`)
  .replace('__ENDPOINT__', () => ENDPOINT);

writeFileSync(resolve(root, 'docs/preview.html'), html);
console.log(`docs/preview.html written (${(html.length / 1024).toFixed(0)} kB)`);
