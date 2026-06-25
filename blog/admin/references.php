<?php
// ----------------------------------------------------------------------------
// NM Bau — referencia-galéria kezelő (ugyanazzal a belépéssel, mint a blog)
// ----------------------------------------------------------------------------
require_once dirname(__DIR__) . '/inc/references.php';
start_blog_session();

// Belépés szükséges – a blog admin használja ugyanezt a munkamenetet.
if (!is_logged_in()) { header('Location: index.php'); exit; }

$action = $_POST['action'] ?? '';
$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!csrf_check($_POST['csrf'] ?? '')) { http_response_code(400); exit('Érvénytelen kérés. Töltsd újra az oldalt.'); }
  $items = ref_load();

  if ($action === 'upload') {
    $cat = $_POST['cat'] ?? '';
    if (!ref_cat_valid($cat)) {
      $err = 'Válassz kategóriát a feltöltés előtt.';
    } elseif (empty($_FILES['photos']['name'][0])) {
      $err = 'Nem választottál ki képet.';
    } else {
      $added = 0; $failed = 0;
      $files = $_FILES['photos'];
      $n = count($files['name']);
      for ($i = 0; $i < $n; $i++) {
        if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        $one = [
          'name' => $files['name'][$i], 'type' => $files['type'][$i],
          'tmp_name' => $files['tmp_name'][$i], 'error' => $files['error'][$i], 'size' => $files['size'][$i],
        ];
        $web = ref_save_uploaded($one);
        if ($web) { $items[] = ['id' => ref_new_id(), 'src' => $web, 'cat' => $cat, 'alt' => '']; $added++; }
        else $failed++;
      }
      ref_save($items);
      $msg = $added . ' kép feltöltve.' . ($failed ? " ($failed kép kihagyva – érvénytelen vagy túl nagy.)" : '');
    }
  } elseif ($action === 'delete') {
    if (ref_delete($items, $_POST['id'] ?? '')) { ref_save($items); $msg = 'Kép törölve.'; }
  } elseif ($action === 'move') {
    if (ref_move($items, $_POST['id'] ?? '', $_POST['dir'] ?? '')) { ref_save($items); }
  } elseif ($action === 'setcat') {
    if (ref_set_cat($items, $_POST['id'] ?? '', $_POST['cat'] ?? '')) { ref_save($items); $msg = 'Kategória frissítve.'; }
  }
  // PRG: ne duplikálódjon újratöltéskor
  $q = $err ? ('err=' . rawurlencode($err)) : ('msg=' . rawurlencode($msg));
  header('Location: references.php?' . $q);
  exit;
}

$items = ref_load();
$counts = ref_counts($items);
$cats = ref_cats();
$msg = $_GET['msg'] ?? '';
$err = $_GET['err'] ?? '';
$token = csrf_token();
?><!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Referenciák — NM Bau</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#1C1917;--card:#262220;--line:#3a3531;--text:#F5F0E8;--muted:#a39c92;--accent:#D4A017;--accent2:#B8860B;--danger:#c0563f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;line-height:1.5}
  .wrap{max-width:980px;margin:0 auto;padding:3rem 1.25rem 5rem}
  h1{font-family:'Playfair Display',serif;font-weight:600;font-size:1.9rem;margin:0 0 .4rem}
  h2{font-family:'Playfair Display',serif;font-weight:600;font-size:1.25rem;margin:2.2rem 0 1rem}
  .muted{color:var(--muted)} .small{font-size:.85rem}
  .ok{color:#7fc08a;margin:.4rem 0} .err{color:#e88a72;margin:.4rem 0}
  .top{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:.5rem}
  .top > div{display:flex;gap:.6rem;flex-wrap:wrap}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:1.5rem}
  label{display:block;margin:.2rem 0 .35rem;font-weight:500;font-size:.95rem}
  select,input[type=file]{width:100%;background:#1f1c1a;border:1px solid var(--line);border-radius:9px;color:var(--text);padding:.7rem .8rem;font:inherit}
  select{max-width:280px}
  .row{display:flex;gap:1.2rem;flex-wrap:wrap;align-items:flex-end}
  .row > div{flex:1;min-width:200px}
  button,.btn-primary,.btn-ghost,.btn-danger{cursor:pointer;font:inherit;font-weight:600;border-radius:9px;padding:.6rem 1.15rem;text-decoration:none;display:inline-block;border:1px solid transparent}
  .btn-primary{background:var(--accent2);color:#1C1917;border:none}
  .btn-primary:hover{background:var(--accent)}
  .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--line)}
  .btn-ghost:hover{border-color:var(--accent)}
  .btn-danger{background:transparent;color:var(--danger);border:1px solid var(--danger);padding:.4rem .7rem;font-size:.85rem}
  .btn-danger:hover{background:var(--danger);color:#fff}
  .chips{display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0 0}
  .chip{background:#1f1c1a;border:1px solid var(--line);border-radius:50px;padding:.3rem .8rem;font-size:.82rem;color:var(--muted)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin-top:1rem}
  .tile{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
  .tile img{width:100%;aspect-ratio:4/5;object-fit:cover;background:#000;display:block}
  .tile-b{padding:.6rem .7rem .7rem;display:flex;flex-direction:column;gap:.5rem}
  .tile-b select{width:100%;max-width:none;padding:.4rem .5rem;font-size:.85rem}
  .tile-row{display:flex;gap:.35rem;align-items:center;justify-content:space-between}
  .tile-row form{margin:0}
  .ord{display:flex;gap:.3rem}
  .ord button{padding:.3rem .55rem;font-size:.9rem;line-height:1}
  .num{font-size:.75rem;color:var(--muted)}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <h1>Referencia-galéria</h1>
    <div>
      <a href="index.php" class="btn-ghost">← Blog</a>
      <a href="/referenciak.html" target="_blank" class="btn-ghost">Galéria megtekintése</a>
      <a href="index.php?action=logout" class="btn-ghost">Kilépés</a>
    </div>
  </div>
  <p class="muted small">Tölts fel fotókat a fürdőszoba-referenciákhoz. A képeket a rendszer automatikusan átméretezi és tömöríti. A sorrend a galériában is így jelenik meg.</p>
  <?php if ($msg): ?><p class="ok"><?= e($msg) ?> ✓</p><?php endif; ?>
  <?php if ($err): ?><p class="err"><?= e($err) ?></p><?php endif; ?>

  <div class="card">
    <h2 style="margin-top:0">Új képek feltöltése</h2>
    <form method="post" enctype="multipart/form-data">
      <input type="hidden" name="action" value="upload">
      <input type="hidden" name="csrf" value="<?= e($token) ?>">
      <div class="row">
        <div>
          <label>Kategória</label>
          <select name="cat" required>
            <option value="">– válassz –</option>
            <?php foreach ($cats as $k => $label): ?>
              <option value="<?= e($k) ?>"><?= e($label) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div>
          <label>Képek (több is kijelölhető)</label>
          <input type="file" name="photos[]" accept="image/*" multiple required>
        </div>
        <div style="flex:0 0 auto">
          <button type="submit" class="btn-primary">Feltöltés</button>
        </div>
      </div>
    </form>
    <div class="chips">
      <span class="chip">Összes: <?= (int)$counts['all'] ?></span>
      <?php foreach ($cats as $k => $label): ?>
        <span class="chip"><?= e($label) ?>: <?= (int)$counts[$k] ?></span>
      <?php endforeach; ?>
    </div>
  </div>

  <h2>Galéria (<?= (int)$counts['all'] ?> kép)</h2>
  <?php if (empty($items)): ?>
    <p class="muted">Még nincs kép a manifesztben. Tölts fel néhányat fent.</p>
  <?php else: ?>
    <div class="grid">
      <?php foreach ($items as $idx => $it): $id = e($it['id'] ?? ''); ?>
        <div class="tile">
          <img src="/<?= e($it['src'] ?? '') ?>" alt="">
          <div class="tile-b">
            <span class="num">#<?= $idx + 1 ?></span>
            <form method="post">
              <input type="hidden" name="action" value="setcat">
              <input type="hidden" name="csrf" value="<?= e($token) ?>">
              <input type="hidden" name="id" value="<?= $id ?>">
              <select name="cat" onchange="this.form.submit()">
                <?php foreach ($cats as $k => $label): ?>
                  <option value="<?= e($k) ?>" <?= ($it['cat'] ?? '') === $k ? 'selected' : '' ?>><?= e($label) ?></option>
                <?php endforeach; ?>
              </select>
            </form>
            <div class="tile-row">
              <div class="ord">
                <form method="post"><input type="hidden" name="action" value="move"><input type="hidden" name="csrf" value="<?= e($token) ?>"><input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="dir" value="up"><button class="btn-ghost" title="Előrébb" <?= $idx === 0 ? 'disabled' : '' ?>>↑</button></form>
                <form method="post"><input type="hidden" name="action" value="move"><input type="hidden" name="csrf" value="<?= e($token) ?>"><input type="hidden" name="id" value="<?= $id ?>"><input type="hidden" name="dir" value="down"><button class="btn-ghost" title="Hátrébb" <?= $idx === count($items) - 1 ? 'disabled' : '' ?>>↓</button></form>
              </div>
              <form method="post" onsubmit="return confirm('Biztosan törlöd ezt a képet?');">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="csrf" value="<?= e($token) ?>">
                <input type="hidden" name="id" value="<?= $id ?>">
                <button type="submit" class="btn-danger">Törlés</button>
              </form>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
</body>
</html>
