<?php
require_once dirname(__DIR__) . '/inc/functions.php';
start_blog_session();

$action = $_POST['action'] ?? ($_GET['action'] ?? '');
$error = '';

// ----------------------------------------------------------------------------
// 1) Első indítás: jelszó beállítása
// ----------------------------------------------------------------------------
if (!password_is_set()) {
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'setpw') {
    $pw = $_POST['password'] ?? '';
    $pw2 = $_POST['password2'] ?? '';
    if (mb_strlen($pw) < 8) {
      $error = 'A jelszó legyen legalább 8 karakter.';
    } elseif ($pw !== $pw2) {
      $error = 'A két jelszó nem egyezik.';
    } else {
      set_password($pw);
      do_login();
      header('Location: index.php');
      exit;
    }
  }
  admin_head('Jelszó beállítása');
  ?>
  <div class="card">
    <h1>Üdv az NM Bau blogban!</h1>
    <p class="muted">Első alkalommal állíts be egy jelszót. Ezzel fogsz belépni, amikor blogot írsz.</p>
    <?php if ($error): ?><p class="err"><?= e($error) ?></p><?php endif; ?>
    <form method="post">
      <input type="hidden" name="action" value="setpw">
      <label>Új jelszó (min. 8 karakter)
        <input type="password" name="password" required autofocus>
      </label>
      <label>Jelszó megint
        <input type="password" name="password2" required>
      </label>
      <button type="submit" class="btn-primary">Jelszó mentése</button>
    </form>
  </div>
  <?php
  admin_foot();
  exit;
}

// ----------------------------------------------------------------------------
// 2) Belépés
// ----------------------------------------------------------------------------
if (!is_logged_in()) {
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    if (check_password($_POST['password'] ?? '')) {
      do_login();
      header('Location: index.php');
      exit;
    }
    $error = 'Hibás jelszó.';
  }
  admin_head('Belépés');
  ?>
  <div class="card">
    <h1>Belépés</h1>
    <p class="muted">Add meg a jelszavad a blog szerkesztéséhez.</p>
    <?php if ($error): ?><p class="err"><?= e($error) ?></p><?php endif; ?>
    <form method="post">
      <input type="hidden" name="action" value="login">
      <label>Jelszó
        <input type="password" name="password" required autofocus>
      </label>
      <button type="submit" class="btn-primary">Belépés</button>
    </form>
  </div>
  <?php
  admin_foot();
  exit;
}

// ----------------------------------------------------------------------------
// Innen: be vagyunk lépve
// ----------------------------------------------------------------------------

// Kilépés
if ($action === 'logout') {
  do_logout();
  header('Location: index.php');
  exit;
}

// Mentés
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'save') {
  if (!csrf_check($_POST['csrf'] ?? '')) {
    http_response_code(400);
    exit('Érvénytelen kérés. Töltsd újra az oldalt.');
  }
  $title = trim($_POST['title'] ?? '');
  if ($title === '') {
    $error = 'A címet kötelező megadni.';
  } else {
    $editSlug = trim($_POST['slug'] ?? '');
    $isEdit = $editSlug !== '';
    $slug = $isEdit ? basename($editSlug) : unique_slug($title);
    $existing = $isEdit ? get_post($slug) : null;

    $cover = $existing['cover'] ?? '';
    if (!empty($_FILES['cover']['name'])) {
      $uploaded = save_uploaded_image($_FILES['cover']);
      if ($uploaded) $cover = $uploaded;
    }
    if (!empty($_POST['remove_cover'])) $cover = '';

    save_post([
      'slug'    => $slug,
      'title'   => $title,
      'date'    => $_POST['date'] ?: date('Y-m-d'),
      'excerpt' => trim($_POST['excerpt'] ?? ''),
      'cover'   => $cover,
      'html'    => $_POST['body'] ?? '',
      'draft'   => !empty($_POST['draft']),
      'created' => $existing['created'] ?? date('c'),
      'updated' => date('c'),
    ]);
    header('Location: index.php?saved=1');
    exit;
  }
}

// Törlés
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'delete') {
  if (!csrf_check($_POST['csrf'] ?? '')) { http_response_code(400); exit('Érvénytelen kérés.'); }
  delete_post($_POST['slug'] ?? '');
  header('Location: index.php?deleted=1');
  exit;
}

// ----------------------------------------------------------------------------
// Szerkesztő (új / meglévő)
// ----------------------------------------------------------------------------
if ($action === 'new' || $action === 'edit') {
  $post = ['slug' => '', 'title' => '', 'date' => date('Y-m-d'), 'excerpt' => '', 'cover' => '', 'html' => '', 'draft' => false];
  if ($action === 'edit') {
    $found = get_post($_GET['slug'] ?? '');
    if (!$found) { header('Location: index.php'); exit; }
    $post = array_merge($post, $found);
  }
  admin_head($action === 'new' ? 'Új bejegyzés' : 'Bejegyzés szerkesztése', true);
  ?>
  <div class="editor">
    <div class="editor-top">
      <a href="index.php" class="back">← Vissza</a>
      <span class="muted small">A „Közzététel” után pár másodperccel él a weboldalon.</span>
    </div>
    <?php if ($error): ?><p class="err"><?= e($error) ?></p><?php endif; ?>
    <form method="post" enctype="multipart/form-data">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <input type="hidden" name="slug" value="<?= e($post['slug']) ?>">
      <input type="hidden" name="body" id="body">

      <label class="big">Cím
        <input type="text" name="title" value="<?= e($post['title']) ?>" placeholder="A bejegyzés címe" required>
      </label>

      <div class="row">
        <label>Dátum
          <input type="date" name="date" value="<?= e(substr($post['date'], 0, 10)) ?>">
        </label>
        <label class="check">
          <input type="checkbox" name="draft" value="1" <?= !empty($post['draft']) ? 'checked' : '' ?>>
          Piszkozat (még NE jelenjen meg a weboldalon)
        </label>
      </div>

      <label>Borítókép
        <?php if (!empty($post['cover'])): ?>
          <span class="cover-preview"><img src="<?= e($post['cover']) ?>" alt=""></span>
          <label class="check small"><input type="checkbox" name="remove_cover" value="1"> Borítókép eltávolítása</label>
        <?php endif; ?>
        <input type="file" name="cover" accept="image/*">
        <span class="muted small">A bejegyzés tetején és a listában jelenik meg.</span>
      </label>

      <label>Rövid összefoglaló
        <textarea name="excerpt" rows="2" placeholder="1–2 mondat, ami a blog listában megjelenik"><?= e($post['excerpt']) ?></textarea>
      </label>

      <label>Tartalom</label>
      <textarea id="editor"><?= $post['html'] /* trusted */ ?></textarea>

      <div class="actions">
        <button type="submit" class="btn-primary" onclick="tinymce.triggerSave();document.getElementById('body').value=tinymce.get('editor').getContent();">Közzététel</button>
      </div>
    </form>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js"></script>
  <script>
    tinymce.init({
      selector: '#editor',
      height: 520,
      menubar: false,
      branding: false,
      promotion: false,
      plugins: 'link lists image autoresize',
      toolbar: 'undo redo | blocks | bold italic | bullist numlist | link image | removeformat',
      block_formats: 'Bekezdés=p; Címsor=h2; Alcím=h3; Idézet=blockquote',
      images_upload_url: 'upload.php',
      automatic_uploads: true,
      relative_urls: false,
      remove_script_host: true,
      document_base_url: '/blog/',
      content_style: 'body{font-family:DM Sans,system-ui,sans-serif;font-size:17px;line-height:1.7}'
    });
    // Biztosítjuk, hogy a tartalom a rejtett mezőbe kerüljön mentés előtt.
    document.querySelector('form').addEventListener('submit', function () {
      tinymce.triggerSave();
      document.getElementById('body').value = tinymce.get('editor').getContent();
    });
  </script>
  <?php
  admin_foot();
  exit;
}

// ----------------------------------------------------------------------------
// Vezérlőpult (lista)
// ----------------------------------------------------------------------------
$posts = load_posts(true);
admin_head('Bejegyzések');
?>
<div class="dash">
  <div class="dash-top">
    <h1>Blog bejegyzések</h1>
    <div>
      <a href="index.php?action=new" class="btn-primary">+ Új bejegyzés</a>
      <a href="references.php" class="btn-ghost">Referencia-galéria</a>
      <a href="/blog/" target="_blank" class="btn-ghost">Blog megtekintése</a>
      <a href="index.php?action=logout" class="btn-ghost">Kilépés</a>
    </div>
  </div>

  <?php if (isset($_GET['saved'])): ?><p class="ok">Mentve. ✓</p><?php endif; ?>
  <?php if (isset($_GET['deleted'])): ?><p class="ok">Törölve.</p><?php endif; ?>

  <?php if (empty($posts)): ?>
    <p class="muted">Még nincs bejegyzés. Kattints a „+ Új bejegyzés” gombra.</p>
  <?php else: ?>
    <ul class="post-list">
      <?php foreach ($posts as $p): ?>
        <li>
          <div class="pl-main">
            <span class="pl-title"><?= e($p['title']) ?></span>
            <span class="pl-meta"><?= e(hu_date($p['date'] ?? '')) ?><?= !empty($p['draft']) ? ' · <em>piszkozat</em>' : '' ?></span>
          </div>
          <div class="pl-actions">
            <a href="index.php?action=edit&slug=<?= rawurlencode($p['slug']) ?>" class="btn-ghost">Szerkesztés</a>
            <a href="/blog/<?= rawurlencode($p['slug']) ?>" target="_blank" class="btn-ghost">Megnyitás</a>
            <form method="post" onsubmit="return confirm('Biztosan törlöd ezt a bejegyzést?');">
              <input type="hidden" name="action" value="delete">
              <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
              <input type="hidden" name="slug" value="<?= e($p['slug']) ?>">
              <button type="submit" class="btn-danger">Törlés</button>
            </form>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</div>
<?php
admin_foot();

// ----------------------------------------------------------------------------
// Admin layout (egyszerű, letisztult)
// ----------------------------------------------------------------------------
function admin_head($title, $wide = false) {
  ?><!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title><?= e($title) ?> — NM Bau Blog</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#1C1917;--card:#262220;--line:#3a3531;--text:#F5F0E8;--muted:#a39c92;--accent:#D4A017;--accent2:#B8860B;--danger:#c0563f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;line-height:1.5}
  .wrap{max-width:<?= $wide ? '880px' : '460px' ?>;margin:0 auto;padding:3rem 1.25rem 5rem}
  h1{font-family:'Playfair Display',serif;font-weight:600;font-size:1.9rem;margin:0 0 .4rem}
  .muted{color:var(--muted)} .small{font-size:.85rem} .ok{color:#7fc08a} .err{color:#e88a72;margin:.4rem 0}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:2rem}
  label{display:block;margin:1.1rem 0 .35rem;font-weight:500;font-size:.95rem}
  label.big{font-size:1rem}
  input[type=text],input[type=password],input[type=date],textarea{width:100%;background:#1f1c1a;border:1px solid var(--line);border-radius:9px;color:var(--text);padding:.75rem .85rem;font:inherit}
  input:focus,textarea:focus{outline:none;border-color:var(--accent)}
  textarea{resize:vertical}
  .check{display:flex;align-items:center;gap:.5rem;font-weight:400;margin-top:1.1rem}
  .check input{width:auto}
  button,.btn-primary,.btn-ghost,.btn-danger{cursor:pointer;font:inherit;font-weight:600;border-radius:9px;padding:.7rem 1.3rem;text-decoration:none;display:inline-block;border:1px solid transparent}
  .btn-primary{background:var(--accent2);color:#1C1917;border:none}
  .btn-primary:hover{background:var(--accent)}
  .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--line)}
  .btn-ghost:hover{border-color:var(--accent)}
  .btn-danger{background:transparent;color:var(--danger);border:1px solid var(--danger);padding:.55rem 1rem;font-size:.9rem}
  .btn-danger:hover{background:var(--danger);color:#fff}
  form .btn-primary{margin-top:1.4rem}
  .row{display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-end}
  .row > label{flex:1;min-width:180px}
  .cover-preview img{max-width:240px;border-radius:9px;border:1px solid var(--line);margin:.4rem 0;display:block}
  .editor-top,.dash-top{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
  .dash-top > div{display:flex;gap:.6rem;flex-wrap:wrap}
  .back{color:var(--muted);text-decoration:none}.back:hover{color:var(--accent)}
  .actions{margin-top:1.5rem}
  .post-list{list-style:none;padding:0;margin:1.5rem 0 0}
  .post-list li{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;background:var(--card);border:1px solid var(--line);border-radius:11px;padding:1rem 1.25rem;margin-bottom:.75rem}
  .pl-title{font-weight:600;display:block}
  .pl-meta{color:var(--muted);font-size:.85rem}
  .pl-actions{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
  .pl-actions form{margin:0}
</style>
</head>
<body>
<div class="wrap">
<?php
}

function admin_foot() {
  echo "</div></body></html>";
}
