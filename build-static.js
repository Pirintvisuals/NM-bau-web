const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('hero.jpg', 'dist/hero.jpg');
fs.copyFileSync('new logo.png', 'dist/new logo.png');
