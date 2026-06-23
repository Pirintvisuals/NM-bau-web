const fs = require('fs');
const path = require('path');

// Clean build: remove any stale output (e.g. deleted pages) before copying.
// Note: recursive fs.rmSync silently no-ops on OneDrive-synced trees on Windows,
// so we empty the directory entry-by-entry, which is reliable.
function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (fs.lstatSync(p).isDirectory()) {
      emptyDir(p);
      fs.rmdirSync(p);
    } else {
      fs.unlinkSync(p);
    }
  }
}
emptyDir('dist');
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync(path.join('dist', 'assets'), { recursive: true });

// HTML pages
const pages = [
  'index.html',
  'szolgaltatasok.html',
  'furdoszoba-felujitas.html',
  'ingatlan-felujitas.html',
  'referenciak.html',
  'rolunk.html',
  'ingyenes-felmeres.html',
  'adatkezeles.html',
];
for (const file of pages) {
  fs.copyFileSync(file, path.join('dist', file));
}

// SEO / crawler files
for (const file of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join('dist', file));
}

// Shared assets
fs.copyFileSync('furdoszoba-felujitas-sopron.jpg', path.join('dist', 'furdoszoba-felujitas-sopron.jpg'));
fs.copyFileSync('new logo.png', path.join('dist', 'new logo.png'));
fs.copyFileSync(path.join('assets', 'site.css'), path.join('dist', 'assets', 'site.css'));
fs.copyFileSync(path.join('assets', 'site.js'), path.join('dist', 'assets', 'site.js'));
fs.copyFileSync(path.join('assets', 'i18n.js'), path.join('dist', 'assets', 'i18n.js'));
fs.copyFileSync(path.join('assets', 'favicon.svg'), path.join('dist', 'assets', 'favicon.svg'));

// Project photos (assets/img). Copy the web JPEGs, but skip the _thumbs preview dir.
const imgSrc = path.join('assets', 'img');
const imgOut = path.join('dist', 'assets', 'img');
if (fs.existsSync(imgSrc)) {
  fs.mkdirSync(imgOut, { recursive: true });
  for (const entry of fs.readdirSync(imgSrc)) {
    if (entry.startsWith('_')) continue; // _thumbs/, _manifest.json
    const from = path.join(imgSrc, entry);
    if (fs.statSync(from).isFile()) fs.copyFileSync(from, path.join(imgOut, entry));
  }
}
