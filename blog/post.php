<?php
require_once __DIR__ . '/inc/functions.php';

$slug = isset($_GET['slug']) ? basename($_GET['slug']) : '';
$post = $slug ? get_post($slug) : null;

if (!$post || !empty($post['draft'])) {
  http_response_code(404);
  render_public_head('Nem található — NM Bau Blog', 'A keresett bejegyzés nem található.', SITE_URL . '/blog/');
  echo '<div class="blog-wrap"><p class="blog-eyebrow">404</p>'
     . '<h1 class="blog-title">A bejegyzés nem található</h1>'
     . '<div class="blog-body"><p><a href="/blog/">← Vissza a bloghoz</a></p></div></div>';
  render_public_footer();
  exit;
}

$url   = SITE_URL . '/blog/' . rawurlencode($post['slug']);
$desc  = !empty($post['excerpt']) ? $post['excerpt'] : ($post['title'] . ' — NM Bau blog');
$cover = '';
if (!empty($post['cover'])) {
  $cover = preg_match('#^https?:#', $post['cover']) ? $post['cover'] : SITE_URL . $post['cover'];
}
render_public_head($post['title'] . ' — NM Bau', $desc, $url, $cover);
?>
<article class="blog-hero">
  <a href="/blog/" class="blog-back">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    Vissza a bloghoz
  </a>
  <p class="blog-eyebrow">NM Bau Blog</p>
  <h1 class="blog-title"><?= e($post['title']) ?></h1>
  <p class="blog-meta"><?= e(hu_date($post['date'] ?? '')) ?></p>
  <?php if (!empty($post['cover'])): ?>
    <img class="blog-cover" src="<?= e($post['cover']) ?>" alt="<?= e($post['title']) ?>">
  <?php endif; ?>
</article>

<div class="blog-wrap">
  <div class="blog-body">
    <?= $post['html'] ?? '' ?>
  </div>
</div>
<?php render_public_footer(); ?>
