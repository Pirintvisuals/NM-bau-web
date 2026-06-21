// One-off: generate static HTML previews of the blog (index + a post) so the
// design can be viewed in a browser without PHP. The live blog (blog/*.php)
// produces this exact markup. Safe to delete after viewing.
const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
function slice(start, end) {
  const a = indexHtml.indexOf(start);
  const b = indexHtml.indexOf(end, a);
  return indexHtml.slice(a, b).trim();
}
let nav = slice('<nav id="nav">', '<!-- ===================== HERO');
let footer = slice('<footer id="footer">', '<script src="assets/site.js"></script>');
// In the preview, point the Blog link + nav at the preview files.
nav = nav.replace(/href="blog\/"/g, 'href="blog-preview.html"');

const STYLES = `<style>
    .blog-wrap { max-width: 820px; margin: 0 auto; padding: calc(var(--nav-h) + 3.5rem) var(--pad-x) 5rem; }
    .blog-hero { max-width: 1240px; margin: 0 auto; padding: calc(var(--nav-h) + 3.5rem) var(--pad-x) 1rem; }
    .blog-back { display: inline-flex; align-items: center; gap: .5rem; color: #6b6258; font-family: var(--font-sans); font-size: .9rem; text-decoration: none; margin-bottom: 2rem; }
    .blog-back:hover { color: var(--accent); }
    .blog-eyebrow { font-family: var(--font-sans); text-transform: uppercase; letter-spacing: .18em; font-size: .72rem; color: var(--accent); margin: 0 0 1rem; }
    .blog-title { font-family: var(--font-serif); font-weight: 600; line-height: 1.08; font-size: clamp(2.1rem, 5vw, 3.4rem); color: var(--text); margin: 0 0 1rem; }
    .blog-meta { font-family: var(--font-sans); color: #8A857B; font-size: .92rem; margin: 0 0 2rem; }
    .blog-cover { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 14px; border: 1px solid var(--border); margin: 1.5rem auto 0; display: block; max-width: 1240px; }
    .blog-body { font-family: var(--font-sans); color: #2c2823; font-size: 1.12rem; line-height: 1.85; }
    .blog-body h2 { font-family: var(--font-serif); font-weight: 600; font-size: 1.7rem; color: var(--text); margin: 2.6rem 0 1rem; }
    .blog-body h3 { font-family: var(--font-serif); font-weight: 600; font-size: 1.35rem; color: var(--text); margin: 2rem 0 .75rem; }
    .blog-body p { margin: 0 0 1.35rem; }
    .blog-body ul, .blog-body ol { margin: 0 0 1.35rem 1.25rem; }
    .blog-body li { margin: .4rem 0; }
    .blog-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
    .blog-body img { max-width: 100%; height: auto; border-radius: 12px; border: 1px solid var(--border); margin: 1.5rem 0; }
    .blog-body blockquote { border-left: 3px solid var(--accent); margin: 1.5rem 0; padding: .4rem 0 .4rem 1.4rem; font-family: var(--font-serif); font-style: italic; font-size: 1.25rem; color: var(--text); }
    .blog-index { max-width: 1240px; margin: 0 auto; padding: calc(var(--nav-h) + 4rem) var(--pad-x) 5rem; }
    .blog-index-head { text-align: center; margin: 0 auto 3.5rem; max-width: 640px; }
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
    .blog-card { display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; text-decoration: none; transition: transform .25s ease, box-shadow .25s ease; }
    .blog-card:hover { transform: translateY(-4px); box-shadow: 0 18px 50px rgba(28,25,23,0.10); }
    .blog-card-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; background: var(--bg-cream); }
    .blog-card-body { padding: 1.5rem 1.6rem 1.8rem; display: flex; flex-direction: column; flex: 1; }
    .blog-card-date { font-family: var(--font-sans); font-size: .78rem; text-transform: uppercase; letter-spacing: .12em; color: var(--accent); margin: 0 0 .6rem; }
    .blog-card-title { font-family: var(--font-serif); font-weight: 600; font-size: 1.4rem; line-height: 1.2; color: var(--text); margin: 0 0 .7rem; }
    .blog-card-excerpt { font-family: var(--font-sans); color: #6b6258; font-size: .98rem; line-height: 1.6; margin: 0; }
  </style>`;

function head(title) {
  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Montserrat:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/site.css">
  ${STYLES}
</head>
<body>
${nav}`;
}

const posts = [
  { slug: 'kis-furdoszoba-5-tipp', title: '5 trükk, amivel egy kis fürdőszoba is tágasnak hat', date: '2026. 06. 18.', cover: 'assets/img/img-2839.jpg', excerpt: 'A jó tervezéssel néhány négyzetméter is lehet látványos és kényelmes. Megmutatjuk, mire figyelünk.' },
  { slug: 'burkolat-valasztas', title: 'Burkolatválasztás: matt vagy fényes? Nagy vagy kis lap?', date: '2026. 06. 10.', cover: 'assets/img/img-3809.jpg', excerpt: 'A burkolat meghatározza a fürdőszoba hangulatát és a tisztíthatóságát is. Segítünk dönteni.' },
  { slug: 'udvozlunk-a-blogon', title: 'Üdvözlünk az NM Bau blogon', date: '2026. 06. 21.', cover: 'assets/img/img-2781.jpg', excerpt: 'Mostantól itt osztunk meg tippeket, kulisszák mögötti történeteket és tanácsokat a felújításhoz.' },
];

// ---- index preview ----
const cards = posts.map((p) => `      <a class="blog-card" href="blog-post-preview.html">
        <img class="blog-card-img" src="${p.cover}" alt="${p.title}" loading="lazy">
        <div class="blog-card-body">
          <p class="blog-card-date">${p.date}</p>
          <h2 class="blog-card-title">${p.title}</h2>
          <p class="blog-card-excerpt">${p.excerpt}</p>
        </div>
      </a>`).join('\n');

const indexPreview = `${head('Blog — NM Bau (előnézet)')}
  <div class="blog-index">
    <div class="blog-index-head">
      <p class="blog-eyebrow">NM Bau Blog</p>
      <h1 class="blog-title">Tippek és történetek a felújításhoz</h1>
    </div>
    <div class="blog-grid">
${cards}
    </div>
  </div>
${footer}
  <script src="assets/site.js"></script>
</body>
</html>`;
fs.writeFileSync('blog-preview.html', indexPreview);

// ---- single post preview ----
const postPreview = `${head('5 trükk, amivel egy kis fürdőszoba is tágasnak hat — NM Bau (előnézet)')}
  <article class="blog-hero">
    <a href="blog-preview.html" class="blog-back"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Vissza a bloghoz</a>
    <p class="blog-eyebrow">NM Bau Blog</p>
    <h1 class="blog-title">5 trükk, amivel egy kis fürdőszoba is tágasnak hat</h1>
    <p class="blog-meta">2026. 06. 18.</p>
    <img class="blog-cover" src="assets/img/img-2839.jpg" alt="Felújított fürdőszoba Sopronban">
  </article>
  <div class="blog-wrap">
    <div class="blog-body">
      <p>Sokan azt hiszik, hogy egy kis fürdőszobából nem lehet sokat kihozni. A tapasztalatunk épp az ellenkezője: jó tervezéssel néhány négyzetméter is lehet tágas, világos és kényelmes. Íme öt megoldás, amit a soproni projektjeinkben rendszeresen alkalmazunk.</p>
      <h2>1. Nagy méretű burkolólapok</h2>
      <p>A kevesebb fuga nyugodtabb, egységesebb felületet ad — ettől a tér azonnal nagyobbnak tűnik. Ráadásul könnyebb is tisztán tartani.</p>
      <h2>2. Falra szerelt szaniterek</h2>
      <p>A fali WC és a lebegő mosdó alól kilátszik a padló, ami vizuálisan megnöveli a teret. Tisztításnál is hálás megoldás.</p>
      <blockquote>A jó fürdőszoba nem a méretről szól, hanem az arányokról és a részletek precizitásáról.</blockquote>
      <h2>3. Tükör, ami dolgozik</h2>
      <p>Egy nagy, jól elhelyezett tükör megduplázza a fényt és a látható teret. Beépített világítással még otthonosabb a hatás.</p>
      <h2>4. Beépített tárolás</h2>
      <p>A falsíkba simuló szekrények rendet tartanak anélkül, hogy helyet vennének el. A káosz az, ami igazán kicsivé tesz egy teret.</p>
      <h2>5. Átgondolt világítás</h2>
      <p>Réteges világítással — mennyezeti, tükör-, és hangulatfény — a fürdőszoba bármilyen napszakban barátságos marad.</p>
      <p>Felújítást tervezel? <a href="ingyenes-felmeres.html">Kérj ingyenes felmérést</a>, és személyesen átbeszéljük, hogyan hozhatjuk ki a maximumot a teredből.</p>
    </div>
  </div>
${footer}
  <script src="assets/site.js"></script>
</body>
</html>`;
fs.writeFileSync('blog-post-preview.html', postPreview);

console.log('Wrote blog-preview.html and blog-post-preview.html');
