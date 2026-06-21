<?php
require_once __DIR__ . '/inc/functions.php';
$posts = load_posts(false);
render_public_head(
  'Blog — NM Bau',
  'Tippek, tanácsok és kulisszák mögötti történetek a fürdőszoba- és ingatlanfelújításról az NM Bau csapatától.',
  SITE_URL . '/blog/',
  SITE_URL . '/assets/img/img-2781.jpg'
);
?>
<div class="blog-index">
  <div class="blog-index-head">
    <p class="blog-eyebrow">NM Bau Blog</p>
    <h1 class="blog-title">Tippek és történetek a felújításhoz</h1>
  </div>

  <?php if (empty($posts)): ?>
    <p class="blog-empty">Hamarosan érkeznek az első bejegyzések.</p>
  <?php else: ?>
    <div class="blog-grid">
      <?php foreach ($posts as $p): ?>
      <a class="blog-card" href="/blog/<?= rawurlencode($p['slug']) ?>">
        <?php if (!empty($p['cover'])): ?>
          <img class="blog-card-img" src="<?= e($p['cover']) ?>" alt="<?= e($p['title']) ?>" loading="lazy">
        <?php else: ?>
          <div class="blog-card-img"></div>
        <?php endif; ?>
        <div class="blog-card-body">
          <p class="blog-card-date"><?= e(hu_date($p['date'] ?? '')) ?></p>
          <h2 class="blog-card-title"><?= e($p['title']) ?></h2>
          <?php if (!empty($p['excerpt'])): ?>
            <p class="blog-card-excerpt"><?= e($p['excerpt']) ?></p>
          <?php endif; ?>
        </div>
      </a>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
<?php render_public_footer(); ?>
