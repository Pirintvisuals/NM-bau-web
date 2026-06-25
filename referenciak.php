<?php
// ----------------------------------------------------------------------------
// Referenciák oldal — a referenciak.html sablonból renderel, de a galériát a
// tulajdonos által kezelt manifesztből (blog/data/references.json) tölti be.
// Az .htaccess a /referenciak.html kérést ide irányítja, így a cím és a
// belső linkek változatlanok maradnak.
// Ha a manifeszt üres/hiányzik, a sablonban lévő statikus galéria marad
// (biztonsági tartalék).
// ----------------------------------------------------------------------------
require_once __DIR__ . '/blog/inc/references.php';

$tpl = __DIR__ . '/referenciak.html';
$html = is_readable($tpl) ? file_get_contents($tpl) : '';
$items = ref_load();

if ($html !== '' && !empty($items)) {
  // 1) Galéria rács cseréje
  $marker = 'id="gallery-grid">';
  $a = strpos($html, $marker);
  if ($a !== false) {
    $a += strlen($marker);
    $b = strpos($html, "\n        </div>", $a);
    if ($b !== false) {
      $html = substr($html, 0, $a) . "\n" . ref_figures_html($items) . "        " . substr($html, $b + 1);
    }
  }
  // 2) Szűrő-chipek darabszámai
  $counts = ref_counts($items);
  foreach ($counts as $filter => $n) {
    $html = preg_replace(
      '/(data-filter="' . preg_quote($filter, '/') . '"[^>]*>[^<]*<span class="gal-chip-n">)\d+(<\/span>)/',
      '${1}' . (int)$n . '${2}',
      $html,
      1
    );
  }
}

header('Content-Type: text/html; charset=utf-8');
echo $html;
