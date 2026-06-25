<?php
// ----------------------------------------------------------------------------
// NM Bau blog — közös függvények (tárolás, belépés, megjelenítés)
// ----------------------------------------------------------------------------
require_once __DIR__ . '/config.php';

define('BLOG_DIR', dirname(__DIR__));          // .../blog
define('SITE_ROOT', dirname(BLOG_DIR));        // a weboldal gyökere
define('DATA_DIR', BLOG_DIR . '/data');
define('POSTS_DIR', DATA_DIR . '/posts');
define('UPLOADS_DIR', BLOG_DIR . '/uploads');
define('PASSWORD_FILE', DATA_DIR . '/password.php');

// Szükséges mappák biztosítása (első futáskor létrejönnek).
foreach ([DATA_DIR, POSTS_DIR, UPLOADS_DIR] as $d) {
  if (!is_dir($d)) @mkdir($d, 0755, true);
}

// ---------- segédfüggvények ----------
function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function hu_date($value) {
  if (!$value) return '';
  $ts = strtotime($value);
  if (!$ts) return (string)$value;
  return date('Y. m. d.', $ts);
}

function slugify($text) {
  $map = [
    'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o','ú'=>'u','ü'=>'u','ű'=>'u',
    'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ö'=>'o','Ő'=>'o','Ú'=>'u','Ü'=>'u','Ű'=>'u',
  ];
  $text = strtr($text, $map);
  $text = mb_strtolower($text, 'UTF-8');
  $text = preg_replace('/[^a-z0-9]+/', '-', $text);
  $text = trim($text, '-');
  return $text !== '' ? $text : 'bejegyzes-' . date('YmdHis');
}

// ---------- bejegyzések tárolása (egyszerű JSON fájlok) ----------
function load_posts($includeDrafts = false) {
  $posts = [];
  foreach (glob(POSTS_DIR . '/*.json') as $file) {
    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) continue;
    if (!$includeDrafts && !empty($data['draft'])) continue;
    $posts[] = $data;
  }
  usort($posts, function ($a, $b) {
    $da = strtotime($a['date'] ?? $a['created'] ?? '');
    $db = strtotime($b['date'] ?? $b['created'] ?? '');
    return $db <=> $da;
  });
  return $posts;
}

function get_post($slug) {
  $slug = basename($slug);
  $file = POSTS_DIR . '/' . $slug . '.json';
  if (!is_file($file)) return null;
  return json_decode(file_get_contents($file), true);
}

function save_post($data) {
  $slug = basename($data['slug']);
  file_put_contents(
    POSTS_DIR . '/' . $slug . '.json',
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
  );
}

function delete_post($slug) {
  $file = POSTS_DIR . '/' . basename($slug) . '.json';
  if (is_file($file)) unlink($file);
}

function unique_slug($title, $currentSlug = '') {
  $base = slugify($title);
  $slug = $base;
  $i = 2;
  while (is_file(POSTS_DIR . '/' . $slug . '.json') && $slug !== $currentSlug) {
    $slug = $base . '-' . $i;
    $i++;
  }
  return $slug;
}

// ---------- belépés ----------
function start_blog_session() {
  if (session_status() === PHP_SESSION_NONE) {
    session_name('nmbau_blog');
    session_start();
  }
}

function password_is_set() { return is_file(PASSWORD_FILE); }

function set_password($plain) {
  $hash = password_hash($plain, PASSWORD_DEFAULT);
  file_put_contents(PASSWORD_FILE, "<?php\nreturn " . var_export($hash, true) . ";\n");
}

function check_password($plain) {
  if (!password_is_set()) return false;
  $hash = include PASSWORD_FILE;
  return is_string($hash) && password_verify($plain, $hash);
}

function is_logged_in() {
  start_blog_session();
  return !empty($_SESSION['nmbau_blog_auth']);
}

function do_login() { start_blog_session(); $_SESSION['nmbau_blog_auth'] = true; }
function do_logout() { start_blog_session(); $_SESSION = []; session_destroy(); }

function csrf_token() {
  start_blog_session();
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
  return $_SESSION['csrf'];
}
function csrf_check($token) {
  start_blog_session();
  return !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], (string)$token);
}

// ---------- képfeltöltés ----------
// Visszaad egy webes elérési utat (/blog/uploads/...), vagy null-t hiba esetén.
function save_uploaded_image($file) {
  if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) return null;
  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return null;
  if (($file['size'] ?? 0) > 12 * 1024 * 1024) return null; // max 12 MB

  $info = @getimagesize($file['tmp_name']);
  if ($info === false) return null; // nem kép
  $allowed = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG  => 'png',
    IMAGETYPE_GIF  => 'gif',
    IMAGETYPE_WEBP => 'webp',
  ];
  if (!isset($allowed[$info[2]])) return null;
  $ext = $allowed[$info[2]];

  if (!is_dir(UPLOADS_DIR)) @mkdir(UPLOADS_DIR, 0755, true);
  $name = date('Ymd') . '-' . bin2hex(random_bytes(5)) . '.' . $ext;
  $dest = UPLOADS_DIR . '/' . $name;
  if (!move_uploaded_file($file['tmp_name'], $dest)) return null;
  return '/blog/uploads/' . $name;
}

// ---------- a weboldal arculatának (nav + footer) átvétele ----------
function blog_fix_paths($h) {
  // saját mappás eszközök -> gyökérből abszolút
  $h = preg_replace('#\b(href|src)="assets/#', '$1="/assets/', $h);
  // a Blog link a /blog/ mappára mutasson
  $h = str_replace(['href="blog/"', 'href="blog.html"'], 'href="/blog/"', $h);
  // többi .html oldal -> gyökérből abszolút (a # horgony megengedett)
  $h = preg_replace(
    '#\bhref="(?!https?:|/|\#|tel:|mailto:|blog)([^"]+\.html(?:\#[^"]*)?)"#',
    'href="/$1"',
    $h
  );
  return $h;
}

function slice_between($html, $start, $end) {
  $a = strpos($html, $start);
  if ($a === false) return '';
  $b = strpos($html, $end, $a);
  if ($b === false) return '';
  return trim(substr($html, $a, $b - $a));
}

function site_chrome() {
  static $cache = null;
  if ($cache !== null) return $cache;

  $navFallback = '<nav id="nav"><div class="nav-inner"><a href="/" class="nav-logo"><span class="brand"><span class="brand-wordmark"><span class="brand-name">NM BAU</span><span class="brand-tag">Sopron &middot; Burgenland</span></span></span></a><ul class="nav-links"><li><a href="/szolgaltatasok.html">Szolgáltatások</a></li><li><a href="/referenciak.html">Referenciák</a></li><li><a href="/blog/">Blog</a></li><li><a href="/rolunk.html">Rólunk</a></li><li><a href="/ingyenes-felmeres.html">Kapcsolat</a></li></ul><a href="/ingyenes-felmeres.html" class="btn btn-primary nav-cta">Azonnali árajánlat</a></div></nav>';
  $footerFallback = '<footer id="footer"><div class="container"><div class="footer-bottom"><span class="ft-copy">© ' . date('Y') . ' NM Bau. Minden jog fenntartva.</span></div></div></footer>';

  $file = SITE_ROOT . '/index.html';
  if (!is_readable($file)) { return $cache = [$navFallback, $footerFallback]; }

  $html = file_get_contents($file);
  $nav = slice_between($html, '<nav id="nav">', '<!-- ===================== HERO');
  $footer = slice_between($html, '<footer id="footer">', '<script src="assets/site.js"></script>');
  if ($nav === '') $nav = $navFallback;
  if ($footer === '') $footer = $footerFallback;

  return $cache = [blog_fix_paths($nav), blog_fix_paths($footer)];
}

// ---------- nyilvános oldal megjelenítése ----------
function blog_styles() {
  return <<<CSS
  <style>
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
  </style>
CSS;
}

function render_public_head($title, $desc, $canonical, $ogImage = '') {
  $styles = blog_styles();
  $og = $ogImage ? '<meta property="og:image" content="' . e($ogImage) . '">' : '';
  echo '<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . e($title) . '</title>
  <meta name="description" content="' . e($desc) . '">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Montserrat:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="canonical" href="' . e($canonical) . '">
  <meta name="theme-color" content="#FAFAF7">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NM Bau">
  <meta property="og:locale" content="hu_HU">
  <meta property="og:title" content="' . e($title) . '">
  <meta property="og:description" content="' . e($desc) . '">
  <meta property="og:url" content="' . e($canonical) . '">
  ' . $og . '
' . $styles . '
</head>
<body>
';
  [$nav] = site_chrome();
  echo $nav . "\n";
}

function render_public_footer() {
  [, $footer] = site_chrome();
  echo $footer . "\n";
  echo '<script src="/assets/site.js"></script>' . "\n";
  echo "</body>\n</html>";
}
