// Build a self-contained, no-PHP showcase of the full write -> publish loop.
// Uses the browser's localStorage so a post written in the editor instantly
// appears on the public blog — ideal for a live sales demo.
const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
function slice(start, end) {
  const a = indexHtml.indexOf(start);
  const b = indexHtml.indexOf(end, a);
  return indexHtml.slice(a, b).trim();
}
let nav = slice('<nav id="nav">', '<!-- ===================== HERO');
let footer = slice('<footer id="footer">', '<script src="assets/site.js"></script>');
nav = nav.replace(/href="blog\/"/g, 'href="showcase-blog.html"');

const BLOG_STYLES = `<style>
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
    .blog-empty { text-align: center; font-family: var(--font-sans); color: #8A857B; padding: 3rem 0; }
    .demo-bar { position: sticky; top: 0; z-index: 200; background: #B8860B; color: #1C1917; font-family: var(--font-sans); font-weight: 600; font-size: .9rem; text-align: center; padding: .55rem 1rem; }
    .demo-bar a { color: #1C1917; }
  </style>`;

// Shared data layer: seed posts + localStorage. Same in every showcase page.
const DATA_JS = `
<script>
  const NMBAU_KEY = 'nmbau_demo_posts';
  const NMBAU_SEED = [
    { id:'seed-1', title:'5 trükk, amivel egy kis fürdőszoba is tágasnak hat', date:'2026-06-18', cover:'assets/img/img-2839.jpg',
      excerpt:'A jó tervezéssel néhány négyzetméter is lehet látványos és kényelmes. Megmutatjuk, mire figyelünk.',
      html:'<h2>Kezdjük a lényeggel</h2><p>Sokan azt hiszik, hogy egy kis fürdőszobából nem lehet sokat kihozni. A tapasztalatunk épp az ellenkezője: jó tervezéssel néhány négyzetméter is lehet tágas és világos.</p><ul><li><strong>Nagy méretű burkolólapok</strong> — kevesebb fuga, nyugodtabb felület</li><li><strong>Falra szerelt szaniterek</strong> — kilátszik a padló, így tágasabb a hatás</li><li><strong>Nagy tükör</strong>, beépített világítással</li></ul><blockquote>A jó fürdőszoba nem a méretről szól, hanem az arányokról.</blockquote><p>Felújítást tervezel? <a href="ingyenes-felmeres.html">Kérj ingyenes felmérést.</a></p>' },
    { id:'seed-2', title:'Burkolatválasztás: matt vagy fényes? Nagy vagy kis lap?', date:'2026-06-10', cover:'assets/img/img-3809.jpg',
      excerpt:'A burkolat meghatározza a fürdőszoba hangulatát és a tisztíthatóságát is. Segítünk dönteni.',
      html:'<p>A burkolat az egyik legfontosabb döntés egy felújításnál. Íme a fő szempontok, amiket az ügyfeleinkkel átveszünk.</p><h2>Matt vagy fényes?</h2><p>A fényes lap visszaveri a fényt, így világosabbá teszi a teret, de jobban látszik rajta a vízkő. A matt elegánsabb és visszafogottabb.</p>' },
    { id:'seed-3', title:'Üdvözlünk az NM Bau blogon', date:'2026-06-21', cover:'assets/img/img-2781.jpg',
      excerpt:'Mostantól itt osztunk meg tippeket, kulisszák mögötti történeteket és tanácsokat a felújításhoz.',
      html:'<p>Örülünk, hogy itt vagy! Ezen az oldalon mostantól rendszeresen megosztjuk a tapasztalatainkat.</p>' }
  ];
  function nmbauGetPosts() {
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(NMBAU_KEY) || '[]'); } catch (e) {}
    const all = stored.concat(NMBAU_SEED).filter(function(p){ return !p.draft; });
    all.sort((a,b) => (b.date||'').localeCompare(a.date||''));
    return all;
  }
  function nmbauHuDate(d) {
    if (!d) return '';
    const p = d.split('-'); return p.length===3 ? p[0]+'. '+p[1]+'. '+p[2]+'.' : d;
  }
</script>`;

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
  ${BLOG_STYLES}
</head>
<body>
<div class="demo-bar">BEMUTATÓ — valódi írás → közzététel kör. Amit a szerkesztőben írsz, itt azonnal megjelenik. (<a href="showcase-admin.html">Szerkesztő</a> · <a href="showcase-blog.html">Blog</a> · <a href="#" onclick="localStorage.removeItem('nmbau_demo_posts');location.reload();return false;">Visszaállítás</a>)</div>`;
}

// ---- public blog list ----
fs.writeFileSync('showcase-blog.html', `${head('Blog — NM Bau (bemutató)')}
${nav}
  <div class="blog-index">
    <div class="blog-index-head">
      <p class="blog-eyebrow">NM Bau Blog</p>
      <h1 class="blog-title">Tippek és történetek a felújításhoz</h1>
    </div>
    <div class="blog-grid" id="grid"></div>
  </div>
${footer}
  <script src="assets/site.js"></script>
${DATA_JS}
  <script>
    const grid = document.getElementById('grid');
    const posts = nmbauGetPosts();
    grid.innerHTML = posts.map(function(p){
      const cover = p.cover ? '<img class="blog-card-img" src="'+p.cover+'" alt="">' : '<div class="blog-card-img"></div>';
      return '<a class="blog-card" href="showcase-post.html?id='+encodeURIComponent(p.id)+'">'+cover+
        '<div class="blog-card-body"><p class="blog-card-date">'+nmbauHuDate(p.date)+'</p>'+
        '<h2 class="blog-card-title">'+p.title+'</h2>'+
        (p.excerpt ? '<p class="blog-card-excerpt">'+p.excerpt+'</p>' : '')+'</div></a>';
    }).join('');
  </script>
</body>
</html>`);

// ---- public single post ----
fs.writeFileSync('showcase-post.html', `${head('Bejegyzés — NM Bau (bemutató)')}
${nav}
  <article class="blog-hero" id="hero"></article>
  <div class="blog-wrap"><div class="blog-body" id="body"></div></div>
${footer}
  <script src="assets/site.js"></script>
${DATA_JS}
  <script>
    const id = new URLSearchParams(location.search).get('id');
    const post = nmbauGetPosts().find(function(p){ return p.id === id; });
    const hero = document.getElementById('hero');
    const body = document.getElementById('body');
    if (!post) {
      hero.innerHTML = '<p class="blog-eyebrow">404</p><h1 class="blog-title">A bejegyzés nem található</h1>';
      body.innerHTML = '<p><a href="showcase-blog.html">Vissza a bloghoz</a></p>';
    } else {
      hero.innerHTML = '<a href="showcase-blog.html" class="blog-back">&larr; Vissza a bloghoz</a>'+
        '<p class="blog-eyebrow">NM Bau Blog</p>'+
        '<h1 class="blog-title">'+post.title+'</h1>'+
        '<p class="blog-meta">'+nmbauHuDate(post.date)+'</p>'+
        (post.cover ? '<img class="blog-cover" src="'+post.cover+'" alt="">' : '');
      body.innerHTML = post.html || '';
      document.title = post.title + ' — NM Bau';
    }
  </script>
</body>
</html>`);

console.log('Wrote showcase-blog.html and showcase-post.html');
