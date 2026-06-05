const fs = require('fs');
const path = require('path');

fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync(path.join('dist', 'assets'), { recursive: true });

// HTML pages
const pages = [
  'index.html',
  'csomag-alap.html',
  'csomag-komplett.html',
  'csomag-premium.html',
  'kapcsolat.html',
  'ingyenes-felmeres.html',
];
for (const file of pages) {
  fs.copyFileSync(file, path.join('dist', file));
}

// Shared assets
fs.copyFileSync('hero.jpg', path.join('dist', 'hero.jpg'));
fs.copyFileSync('new logo.png', path.join('dist', 'new logo.png'));
fs.copyFileSync(path.join('assets', 'site.css'), path.join('dist', 'assets', 'site.css'));
fs.copyFileSync(path.join('assets', 'site.js'), path.join('dist', 'assets', 'site.js'));
