<?php
// ============================================================================
// BEMUTATÓ — "Így nézne ki egy új bejegyzés megírása"
// Önálló demó oldal. NINCS belépés, NINCS mentés — csak a szerkesztő élménye.
// Nem része az éles rendszernek; nyugodtan törölhető a bemutató után.
// Megnyitás: http://localhost:8000/blog/admin/demo.php
// ============================================================================
?><!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Új bejegyzés — NM Bau Blog</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#1C1917;--card:#262220;--line:#3a3531;--text:#F5F0E8;--muted:#a39c92;--accent:#D4A017;--accent2:#B8860B;--danger:#c0563f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',system-ui,sans-serif;line-height:1.5}
  .wrap{max-width:880px;margin:0 auto;padding:3rem 1.25rem 5rem}
  h1{font-family:'Playfair Display',serif;font-weight:600;font-size:1.9rem;margin:0 0 .4rem}
  .muted{color:var(--muted)} .small{font-size:.85rem}
  .demo-banner{max-width:880px;margin:0 auto;padding:.7rem 1.25rem;background:var(--accent-muted,rgba(212,160,23,.12));border:1px solid var(--accent);border-radius:0 0 10px 10px;font-size:.88rem;color:var(--accent);text-align:center}
  label{display:block;margin:1.1rem 0 .35rem;font-weight:500;font-size:.95rem}
  label.big{font-size:1rem}
  input[type=text],input[type=date],textarea{width:100%;background:#1f1c1a;border:1px solid var(--line);border-radius:9px;color:var(--text);padding:.75rem .85rem;font:inherit}
  input:focus,textarea:focus{outline:none;border-color:var(--accent)}
  textarea{resize:vertical}
  .check{display:flex;align-items:center;gap:.5rem;font-weight:400;margin-top:1.1rem}
  .check input{width:auto}
  button,.btn-primary,.btn-ghost{cursor:pointer;font:inherit;font-weight:600;border-radius:9px;padding:.7rem 1.3rem;text-decoration:none;display:inline-block;border:1px solid transparent}
  .btn-primary{background:var(--accent2);color:#1C1917;border:none}
  .btn-primary:hover{background:var(--accent)}
  .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--line)}
  .btn-ghost:hover{border-color:var(--accent)}
  .row{display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-end}
  .row > label{flex:1;min-width:180px}
  .editor-top{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
  .back{color:var(--muted);text-decoration:none}.back:hover{color:var(--accent)}
  .actions{margin-top:1.5rem}
  .cover-fake{display:flex;align-items:center;justify-content:center;gap:.6rem;background:#1f1c1a;border:1px dashed var(--line);border-radius:9px;padding:1.4rem;color:var(--muted);cursor:pointer;transition:border-color .2s}
  .cover-fake:hover{border-color:var(--accent);color:var(--text)}
  .cover-fake img{display:none;max-width:260px;border-radius:9px;border:1px solid var(--line)}
  .cover-fake.has-img{display:block;padding:0;border:none;background:none}
  .cover-fake.has-img img{display:block}
  /* Siker overlay */
  .overlay{position:fixed;inset:0;background:rgba(20,18,16,.82);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;z-index:50;opacity:0;transition:opacity .35s}
  .overlay.show{display:flex;opacity:1}
  .success{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:2.6rem 2.4rem;max-width:420px;text-align:center;transform:translateY(12px);transition:transform .35s}
  .overlay.show .success{transform:translateY(0)}
  .checkmark{width:64px;height:64px;border-radius:50%;background:var(--accent2);margin:0 auto 1.2rem;display:flex;align-items:center;justify-content:center}
  .checkmark svg{width:34px;height:34px}
  .success h2{font-family:'Playfair Display',serif;font-weight:600;margin:0 0 .5rem;font-size:1.5rem}
  .success p{color:var(--muted);margin:.3rem 0 1.6rem}
  .success .btn-ghost{margin-top:.2rem}
  .spin{font-size:.85rem;color:var(--muted);margin-top:1rem;display:none}
</style>
</head>
<body>

<div class="demo-banner">● BEMUTATÓ — így néz ki, amikor új bejegyzést írsz. (A „Közzététel” itt csak szemléltet.)</div>

<div class="wrap">
  <div class="editor-top">
    <a href="#" class="back" onclick="return false;">← Vissza a bejegyzésekhez</a>
    <span class="muted small">A „Közzététel” után pár másodperccel él a weboldalon.</span>
  </div>

  <form id="demoform" onsubmit="return false;">
    <label class="big">Cím
      <input type="text" name="title" value="5 dolog, amit egy fürdőszoba-felújítás előtt érdemes tudni" placeholder="A bejegyzés címe">
    </label>

    <div class="row">
      <label>Dátum
        <input type="date" name="date" value="<?= date('Y-m-d') ?>">
      </label>
      <label class="check">
        <input type="checkbox" name="draft" value="1">
        Piszkozat (még NE jelenjen meg a weboldalon)
      </label>
    </div>

    <label>Borítókép
      <div class="cover-fake" id="coverfake" onclick="fakeUpload()">
        <span id="coverlabel">＋ Kattints ide a borítókép feltöltéséhez</span>
        <img id="coverimg" alt="Borítókép előnézet">
      </div>
      <span class="muted small">A bejegyzés tetején és a listában jelenik meg.</span>
    </label>

    <label>Rövid összefoglaló
      <textarea name="excerpt" rows="2" placeholder="1–2 mondat, ami a blog listában megjelenik">Mielőtt belevágsz a felújításba, néhány döntést érdemes előre átgondolni — ezzel időt, pénzt és bosszúságot spórolsz.</textarea>
    </label>

    <label>Tartalom</label>
    <textarea id="editor">&lt;p&gt;Egy fürdőszoba-felújítás izgalmas, de könnyű melléfogni, ha az ember elsieti a tervezést. Az alábbi öt pontot minden ügyfelünkkel átbeszéljük az első helyszíni szemlén.&lt;/p&gt;
&lt;h2&gt;1. A vízszigetelés nem opció&lt;/h2&gt;
&lt;p&gt;A legdrágább hibák szinte mindig a rosszul elkészített szigetelésből erednek. Nálunk ez sosem kérdés — a burkolat alá kerülő rétegek ugyanolyan gondosan készülnek, mint amit a végén látsz.&lt;/p&gt;
&lt;h2&gt;2. Előbb a vezetékek, utána a csempe&lt;/h2&gt;
&lt;p&gt;A víz- és villanyszerelést a burkolás előtt véglegesítjük, hogy később ne kelljen falat bontani egy elfeledett konnektor miatt.&lt;/p&gt;
&lt;blockquote&gt;A precíz munka a mi védjegyünk — és ez a részletekben dől el.&lt;/blockquote&gt;
&lt;h2&gt;3. Anyagválasztás személyesen&lt;/h2&gt;
&lt;p&gt;Segítünk kiválasztani a burkolatot, a szanitereket és a csaptelepeket úgy, hogy illjenek egymáshoz és a büdzséhez is.&lt;/p&gt;
&lt;p&gt;Kérdésed van? &lt;a href=&quot;/kapcsolat.html&quot;&gt;Írj nekünk&lt;/a&gt;, és kötöttségmentesen felmérjük a fürdőszobádat.&lt;/p&gt;</textarea>

    <div class="actions">
      <button type="button" class="btn-primary" onclick="publish()">Közzététel</button>
    </div>
  </form>
</div>

<!-- Siker overlay -->
<div class="overlay" id="overlay">
  <div class="success">
    <div class="checkmark">
      <svg viewBox="0 0 24 24" fill="none" stroke="#1C1917" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    </div>
    <h2>Közzétéve! ✓</h2>
    <p>A bejegyzés mostantól él a <strong>www.nmbau.hu/blog</strong> oldalon. Nem kellett hozzá fejlesztő — te magad tetted közzé.</p>
    <button class="btn-ghost" onclick="closeOverlay()">Új bejegyzés írása</button>
    <div class="spin" id="spin">Közzététel folyamatban…</div>
  </div>
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
    automatic_uploads: false,
    content_style: 'body{font-family:DM Sans,system-ui,sans-serif;font-size:17px;line-height:1.7}'
  });

  // Borítókép "feltöltés" — valódi fájlválasztó, de csak előnézetet mutat (demó).
  function fakeUpload(){
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function(){
      if(!inp.files || !inp.files[0]) return;
      var url = URL.createObjectURL(inp.files[0]);
      document.getElementById('coverimg').src = url;
      document.getElementById('coverlabel').style.display = 'none';
      document.getElementById('coverfake').classList.add('has-img');
    };
    inp.click();
  }

  function publish(){
    var ov = document.getElementById('overlay');
    var spin = document.getElementById('spin');
    spin.style.display = 'block';
    ov.classList.add('show');
    setTimeout(function(){ spin.style.display = 'none'; }, 1100);
  }
  function closeOverlay(){
    document.getElementById('overlay').classList.remove('show');
  }
</script>
</body>
</html>
