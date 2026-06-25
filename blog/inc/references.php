<?php
// ----------------------------------------------------------------------------
// NM Bau — referencia-galéria tárolása (tulajdonos által feltölthető)
// A galéria elemei egy JSON manifesztben élnek; a képek az
// assets/img/references/ mappába kerülnek, feltöltéskor automatikusan
// átméretezve és tömörítve. A /referenciak.html oldalt a referenciak.php
// szolgálja ki, ebből a manifesztből renderelve.
// ----------------------------------------------------------------------------
require_once __DIR__ . '/functions.php';

define('REF_MANIFEST',   DATA_DIR . '/references.json');
define('REF_UPLOAD_DIR', SITE_ROOT . '/assets/img/references');
define('REF_UPLOAD_WEB', 'assets/img/references');

// Kategória-kulcs => látható címke (a galéria felirat és szűrő ezt használja).
// A címkék megegyeznek a referenciak.html / i18n szótár kulcsaival, így a
// HU/EN/DE nyelvváltó továbbra is lefordítja őket.
function ref_cats() {
  return [
    'walkin'   => 'Walk-in zuhany',
    'falpanel' => 'Falpaneles kivitelezés',
    'kad'      => 'Kádas fürdő',
    'mosdo'    => 'Mosdó & bútor',
    'wc'       => 'WC',
  ];
}
function ref_cat_label($cat) { $c = ref_cats(); return $c[$cat] ?? $cat; }
function ref_cat_valid($cat) { return array_key_exists($cat, ref_cats()); }

// ---------- manifeszt ----------
function ref_load() {
  if (!is_file(REF_MANIFEST)) return [];
  $d = json_decode((string)file_get_contents(REF_MANIFEST), true);
  return is_array($d) ? array_values($d) : [];
}
function ref_save($items) {
  if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0755, true);
  file_put_contents(
    REF_MANIFEST,
    json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
  );
}
function ref_new_id() { return date('Ymd') . '-' . bin2hex(random_bytes(4)); }

// ---------- számok / megjelenítés ----------
function ref_counts($items) {
  $c = ['all' => count($items)];
  foreach (array_keys(ref_cats()) as $k) $c[$k] = 0;
  foreach ($items as $it) { $cat = $it['cat'] ?? ''; if (isset($c[$cat])) $c[$cat]++; }
  return $c;
}

// A galéria <figure> elemei – pontosan a referenciak.html meglévő szerkezetével,
// hogy a szűrő és a lightbox változatlanul működjön.
function ref_figures_html($items) {
  $out = '';
  foreach ($items as $it) {
    $cat = $it['cat'] ?? 'mosdo';
    if (!ref_cat_valid($cat)) $cat = 'mosdo';
    $src = e($it['src'] ?? '');
    $alt = trim($it['alt'] ?? '');
    if ($alt === '') $alt = ref_cat_label($cat) . ', NM Bau felújítás, Sopron';
    $cap = ref_cat_label($cat) . ' · Sopron';
    $out .= '          <figure class="gal-item" data-cat="' . $cat . '">'
          . '<img loading="lazy" src="' . $src . '" alt="' . e($alt) . '">'
          . '<figcaption class="gal-cap">' . e($cap) . '</figcaption></figure>' . "\n";
  }
  return $out;
}

// ---------- kép feltöltése: átméretezés + tömörítés (GD) ----------
// Visszaad egy gyökérből relatív webes utat (assets/img/references/xxx.jpg),
// vagy null-t hiba esetén.
function ref_save_uploaded($file, $maxDim = 1600, $quality = 82) {
  if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) return null;
  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return null;
  if (($file['size'] ?? 0) > 25 * 1024 * 1024) return null; // 25 MB nyers felső korlát

  $info = @getimagesize($file['tmp_name']);
  if ($info === false) return null;
  [$w, $h, $type] = $info;

  $extByType = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
  if (!isset($extByType[$type])) return null;
  if (!is_dir(REF_UPLOAD_DIR)) @mkdir(REF_UPLOAD_DIR, 0755, true);

  // Ha a GD nem érhető el a szerveren, az eredeti képet mentjük átméretezés
  // nélkül – így a feltöltés akkor is működik (csak nagyobb fájlmérettel).
  $gd = extension_loaded('gd') && function_exists('imagecreatetruecolor');
  if (!$gd) {
    $name = date('Ymd') . '-' . bin2hex(random_bytes(5)) . '.' . $extByType[$type];
    if (!move_uploaded_file($file['tmp_name'], REF_UPLOAD_DIR . '/' . $name)) return null;
    return REF_UPLOAD_WEB . '/' . $name;
  }

  switch ($type) {
    case IMAGETYPE_JPEG: $src = @imagecreatefromjpeg($file['tmp_name']); break;
    case IMAGETYPE_PNG:  $src = @imagecreatefrompng($file['tmp_name']);  break;
    case IMAGETYPE_WEBP: $src = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($file['tmp_name']) : false; break;
    default: return null;
  }
  if (!$src) return null;

  // Telefonos képek tájolásának javítása az EXIF alapján.
  if ($type === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
    $exif = @exif_read_data($file['tmp_name']);
    $o = $exif['Orientation'] ?? 0;
    if ($o == 3) { $src = imagerotate($src, 180, 0); }
    elseif ($o == 6) { $src = imagerotate($src, -90, 0); [$w, $h] = [$h, $w]; }
    elseif ($o == 8) { $src = imagerotate($src, 90, 0);  [$w, $h] = [$h, $w]; }
  }

  $scale = min(1, $maxDim / max($w, $h));
  $nw = max(1, (int)round($w * $scale));
  $nh = max(1, (int)round($h * $scale));

  $dst = imagecreatetruecolor($nw, $nh);
  $white = imagecolorallocate($dst, 255, 255, 255); // áttetszőség -> fehér
  imagefilledrectangle($dst, 0, 0, $nw, $nh, $white);
  imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
  imagedestroy($src);

  if (!is_dir(REF_UPLOAD_DIR)) @mkdir(REF_UPLOAD_DIR, 0755, true);
  $name = date('Ymd') . '-' . bin2hex(random_bytes(5)) . '.jpg';
  $ok = imagejpeg($dst, REF_UPLOAD_DIR . '/' . $name, $quality);
  imagedestroy($dst);
  if (!$ok) return null;

  return REF_UPLOAD_WEB . '/' . $name;
}

// ---------- elemek kezelése ----------
function ref_delete(&$items, $id) {
  foreach ($items as $i => $it) {
    if (($it['id'] ?? '') === $id) {
      // Fizikai fájlt csak a feltöltött (references/ mappás) képeknél törlünk —
      // a régi, máshol is használt képeket nem bántjuk.
      $src = $it['src'] ?? '';
      if (strpos($src, REF_UPLOAD_WEB . '/') === 0) {
        $path = SITE_ROOT . '/' . $src;
        if (is_file($path)) @unlink($path);
      }
      array_splice($items, $i, 1);
      return true;
    }
  }
  return false;
}
function ref_move(&$items, $id, $dir) {
  foreach ($items as $i => $it) {
    if (($it['id'] ?? '') === $id) {
      $j = $dir === 'up' ? $i - 1 : $i + 1;
      if ($j < 0 || $j >= count($items)) return false;
      $tmp = $items[$i]; $items[$i] = $items[$j]; $items[$j] = $tmp;
      return true;
    }
  }
  return false;
}
function ref_set_cat(&$items, $id, $cat) {
  if (!ref_cat_valid($cat)) return false;
  foreach ($items as &$it) {
    if (($it['id'] ?? '') === $id) { $it['cat'] = $cat; return true; }
  }
  return false;
}
