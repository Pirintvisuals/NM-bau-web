/* ==========================================================
   NM BAU – shared JS for sub-pages with forms
   (kapcsolat.html, ingyenes-felmeres.html)
   Handles: sticky nav, mobile menu, scroll-reveal,
   photo upload (preview + remove, drag & drop), form submit.
   NOTE: forms are visual-only for now – submit shows a
   client-side confirmation. PHASE 2 wires them to a backend.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Sticky nav: hide on scroll-down ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var lastY = window.scrollY || 0;
    var navTicking = false;
    var updateNav = function () {
      navTicking = false;
      var y = window.scrollY < 0 ? 0 : window.scrollY;   // clamp overscroll
      nav.classList.toggle('scrolled', y > 50);
      var delta = y - lastY;
      // Ignore small deltas so the mobile address-bar collapse/expand
      // (which fires jittery scroll events) can't flip the nav up/down.
      if (Math.abs(delta) > 8) {
        if (y > 140 && delta > 0) nav.classList.add('nav-hidden');    // scrolling down
        else nav.classList.remove('nav-hidden');                      // scrolling up
        lastY = y;
      } else if (y <= 140) {
        nav.classList.remove('nav-hidden');
      }
    };
    window.addEventListener('scroll', function () {
      if (!navTicking) { navTicking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('nav-burger');
  var mobileNav = document.getElementById('nav-mobile');
  if (burger && mobileNav) {
    var open = false;
    var toggleMobile = function (force) {
      open = force !== undefined ? force : !open;
      mobileNav.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    };
    burger.addEventListener('click', function (e) { e.stopPropagation(); toggleMobile(); });
    mobileNav.addEventListener('click', function (e) { e.stopPropagation(); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggleMobile(false); });
    });
    // Close the dropdown on outside tap, scroll, or Escape.
    document.addEventListener('click', function () { if (open) toggleMobile(false); });
    window.addEventListener('scroll', function () { if (open) toggleMobile(false); }, { passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggleMobile(false); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Review carousel ----------
     Desktop: clone cards for a seamless auto-scrolling marquee.
     Touch / small screens: no clones, no auto-scroll — the user swipes
     through the reviews with their finger (native horizontal scroll). */
  var tmAutoScroll = !window.matchMedia('(max-width: 880px)').matches;
  document.querySelectorAll('[data-tm-track]').forEach(function (track) {
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length || !tmAutoScroll) return;
    originals.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    // Only animate once the duplicate set is in place (keeps no-JS static + tidy).
    track.classList.add('is-ready');
  });

  /* ---------- Photo upload (preview, remove, drag & drop) ---------- */
  var MAX_FILES = 5;
  var MAX_SIZE = 12 * 1024 * 1024; // 12 MB per file

  document.querySelectorAll('input[type="file"]').forEach(function (input) {
    var zone = input.closest('.f-upload');
    var group = input.closest('.f-group');
    var previews = group ? group.querySelector('.f-previews') : null;
    if (!previews) return;

    // Keep our own list so we can add/remove and resync the input's FileList.
    var files = [];

    var syncInput = function () {
      var dt = new DataTransfer();
      files.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
    };

    var render = function () {
      previews.innerHTML = '';
      files.forEach(function (file, idx) {
        var cell = document.createElement('div');
        cell.className = 'f-preview';

        if (file.type && file.type.indexOf('image/') === 0) {
          var img = document.createElement('img');
          img.alt = file.name;
          img.src = URL.createObjectURL(file);
          img.onload = function () { URL.revokeObjectURL(img.src); };
          cell.appendChild(img);
        } else {
          var doc = document.createElement('div');
          doc.className = 'f-preview-doc';
          doc.textContent = file.name;
          cell.appendChild(doc);
        }

        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'f-preview-remove';
        rm.setAttribute('aria-label', 'Kép eltávolítása: ' + file.name);
        rm.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        rm.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          files.splice(idx, 1);
          syncInput();
          render();
        });
        cell.appendChild(rm);
        previews.appendChild(cell);
      });
    };

    var addFiles = function (list) {
      Array.prototype.forEach.call(list, function (file) {
        if (files.length >= MAX_FILES) return;
        if (file.size > MAX_SIZE) return;
        // de-dupe by name + size
        var dup = files.some(function (f) { return f.name === file.name && f.size === file.size; });
        if (!dup) files.push(file);
      });
      syncInput();
      render();
    };

    input.addEventListener('change', function () {
      // The browser put freshly picked files on input.files – merge then resync.
      addFiles(input.files);
    });

    if (zone) {
      ['dragenter', 'dragover'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('dragover'); });
      });
      zone.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
      });
    }
  });

  /* ---------- Form submit (visual confirmation) ---------- */
  document.querySelectorAll('form[data-success]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Minimal required-field check (native validity).
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = document.getElementById(form.getAttribute('data-success'));
      form.style.display = 'none';
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- Trust-bar counter animation ---------- */
  var trustNums = document.querySelectorAll('.trust-num[data-count]');
  if ('IntersectionObserver' in window && trustNums.length && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        var isDecimal = String(target).indexOf('.') !== -1;
        var startT = performance.now();
        var step = function (now) {
          var p = Math.min((now - startT) / 1400, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          var val = target * ease;
          el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });
    trustNums.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Process timeline (accordion + animated spine) ---------- */
  (function () {
    var timeline = document.getElementById('process-timeline');
    if (!timeline) return;
    var items = Array.prototype.slice.call(timeline.querySelectorAll('.pt-item'));
    var fill = document.getElementById('pt-fill');
    var TOTAL = items.length;

    var updateFill = function (activeIdx) {
      if (!fill) return;
      fill.style.height = (((activeIdx + 0.5) / TOTAL) * 100) + '%';
    };
    var openItem = function (idx) {
      items.forEach(function (item, i) {
        var btn = item.querySelector('.pt-btn');
        var body = item.querySelector('.pt-body');
        var on = (i === idx);
        item.classList.toggle('active', on);
        btn.setAttribute('aria-expanded', String(on));
        body.classList.toggle('open', on);
      });
      updateFill(idx);
    };
    items.forEach(function (item, i) {
      item.querySelector('.pt-btn').addEventListener('click', function () {
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.pt-btn').setAttribute('aria-expanded', 'false');
          item.querySelector('.pt-body').classList.remove('open');
          if (fill) fill.style.height = ((i / TOTAL) * 100) + '%';
        } else {
          openItem(i);
        }
      });
    });
    if ('IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        tio.disconnect();
        timeline.classList.add('draw');
        setTimeout(function () { updateFill(0); }, 50);
      }, { threshold: 0.1 });
      tio.observe(timeline);
    } else {
      timeline.classList.add('draw');
      updateFill(0);
    }
  })();

  /* ---------- Before / After slider(s) ---------- */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var dragging = false;
    var setPos = function (clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      slider.style.setProperty('--pos', pct + '%');
    };
    var start = function (e) { dragging = true; slider.classList.add('dragging'); setPos((e.touches ? e.touches[0] : e).clientX); };
    var move = function (e) { if (!dragging) return; setPos((e.touches ? e.touches[0] : e).clientX); };
    var end = function () { dragging = false; slider.classList.remove('dragging'); };
    slider.addEventListener('mousedown', start);
    slider.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    // keyboard support on grip
    var grip = slider.querySelector('.ba-grip');
    if (grip) {
      grip.setAttribute('tabindex', '0');
      grip.setAttribute('role', 'slider');
      grip.setAttribute('aria-label', 'Előtte / utána csúszka');
      grip.addEventListener('keydown', function (e) {
        var cur = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft') { slider.style.setProperty('--pos', Math.max(2, cur - 4) + '%'); e.preventDefault(); }
        if (e.key === 'ArrowRight') { slider.style.setProperty('--pos', Math.min(98, cur + 4) + '%'); e.preventDefault(); }
      });
    }
  });

  /* ---------- Anatomy hotspots ---------- */
  (function () {
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hs-dot'));
    if (!dots.length) return;
    var closeAll = function (except) {
      dots.forEach(function (d) { if (d !== except) { d.classList.remove('active'); d.setAttribute('aria-expanded', 'false'); } });
    };
    dots.forEach(function (dot) {
      dot.setAttribute('aria-expanded', 'false');
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dot.classList.toggle('active');
        dot.setAttribute('aria-expanded', String(open));
        if (open) closeAll(dot);
      });
    });
    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  })();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      a.classList.toggle('open', open);
      q.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Hero rotating word (single element, fade swap) ---------- */
  (function () {
    var host = document.querySelector('.rotate-word');
    if (!host) return;
    var words = (host.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (words.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var idx = 0;
    host.textContent = words[0];
    setInterval(function () {
      host.style.opacity = '0';
      host.style.transform = 'translateY(0.32em)';
      setTimeout(function () {
        idx = (idx + 1) % words.length;
        host.textContent = words[idx];
        host.style.opacity = '1';
        host.style.transform = 'none';
      }, 400);
    }, 3000);
  })();

  /* ---------- Sticky quote bar (retired) ----------
     The floating chat launcher now owns the bottom-right corner and the
     "always-available CTA" role, so the old quote-bar pill is hidden in CSS
     to avoid two overlapping floating elements. JS left inert on purpose. */

})();

/* ==========================================================
   NM BAU – Árajánló asszisztens (embedded chat widget)
   Loads the external quoting widget, repoints the primary
   "árajánlat" CTAs to open the chat, and proactively nudges
   it open at the first high-intent moment. The full on-site
   survey form stays reachable via the footer, the mobile menu
   and the hero's secondary link.
   ========================================================== */
(function () {
  'use strict';

  var WIDGET_ORIGIN = 'https://nm-bau-quoting-agent.vercel.app';
  var FORM_PAGE = 'ingyenes-felmeres.html';
  var onFormPage = location.pathname.indexOf(FORM_PAGE) !== -1;

  // widget.js reads this global when it boots.
  window.NMBAU_CONFIG = {
    apiUrl: WIDGET_ORIGIN + '/api/faq-agent',
    assetsUrl: WIDGET_ORIGIN
  };

  // Inject the widget (async). The floating launcher + intro bubble then
  // appear on every page that loads this file.
  var ws = document.createElement('script');
  ws.src = WIDGET_ORIGIN + '/widget.js';
  ws.async = true;
  document.body.appendChild(ws);

  // Drive the widget's launcher button (it exposes no public JS API). If the
  // widget hasn't mounted yet, poll briefly; if it never appears (offline or
  // blocked), fall back to the form page so a CTA is never dead.
  function openChat(fallbackHref) {
    var launcher = document.querySelector('.faq-chat-launcher');
    if (launcher) {
      if (!launcher.classList.contains('active')) launcher.click();
      return;
    }
    var tries = 0;
    var iv = setInterval(function () {
      var l = document.querySelector('.faq-chat-launcher');
      if (l) {
        clearInterval(iv);
        if (!l.classList.contains('active')) l.click();
      } else if (++tries > 33) { // ~5s
        clearInterval(iv);
        if (fallbackHref) window.location.href = fallbackHref;
      }
    }, 150);
  }
  window.nmbauOpenChat = openChat; // reusable hook for any inline trigger

  // Only the nav-bar CTA ("Azonnali felmeres") and anything explicitly tagged
  // [data-open-chat] open the assistant. Every other CTA ("Ingyenes ajanlat")
  // is a plain link to the full form page.
  var CHAT_CTA = 'a.nav-cta, [data-open-chat]';
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest(CHAT_CTA) : null;
    if (!a) return;
    e.preventDefault();
    openChat(a.getAttribute('href') || FORM_PAGE);
  });

  // ---- Proactive auto-open: open the assistant immediately on load.
  //      Only on the home page – internal pages never auto-pop. Still gated
  //      once per session, skipped on the form page (already the full survey),
  //      and skipped on phones – the takeover panel is intrusive on a small
  //      screen, so there the assistant only opens when the visitor taps a CTA. ----
  var path = location.pathname.replace(/\/+$/, '');
  var onHomePage = path === '' || /\/index\.html$/.test(path);
  var isPhone = window.matchMedia('(max-width: 768px)').matches;
  if (onHomePage && !onFormPage && !isPhone) {
    var KEY = 'nmbau_chat_nudged';
    var autoDone = false;
    try { autoDone = sessionStorage.getItem(KEY) === '1'; } catch (err) {}

    if (!autoDone) {
      var launcherNow = document.querySelector('.faq-chat-launcher');
      if (launcherNow && launcherNow.classList.contains('active')) {
        autoDone = true; // already open – nothing to do
      } else {
        autoDone = true;
        try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
        // openChat() polls for the launcher until the widget mounts, then opens it.
        openChat();
      }
    }
  }

})();

/* ===== Scroll progress bar + back-to-top (sticky page furniture) ===== */
(function () {
  var doc = document.documentElement;

  // Progress bar
  var prog = document.createElement('div');
  prog.className = 'scroll-progress';
  var fill = document.createElement('div');
  fill.className = 'scroll-progress-fill';
  prog.appendChild(fill);
  document.body.appendChild(prog);

  // Back-to-top button
  var top = document.createElement('button');
  top.className = 'to-top';
  top.type = 'button';
  top.setAttribute('aria-label', 'Vissza az elejére');
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  top.addEventListener('click', function () {
    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
  document.body.appendChild(top);

  var ticking = false;
  function update() {
    ticking = false;
    var st = window.pageYOffset || doc.scrollTop || 0;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    fill.style.transform = 'scaleX(' + Math.min(1, Math.max(0, st / max)) + ')';
    top.classList.toggle('show', st > 600);
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ===== Reference gallery category filter ===== */
(function () {
  var filter = document.querySelector('.gal-filter');
  var grid = document.getElementById('gallery-grid');
  if (!filter || !grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll('.gal-item'));
  filter.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.gal-chip') : null;
    if (!btn) return;
    var cat = btn.getAttribute('data-filter');
    filter.querySelectorAll('.gal-chip').forEach(function (c) {
      var on = c === btn;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    items.forEach(function (it) {
      it.classList.toggle('is-hidden', cat !== 'all' && it.getAttribute('data-cat') !== cat);
    });
  });
})();

/* ===== Gallery lightbox (click a reference photo to enlarge) ===== */
(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Inject styles once.
  var css = '\
    #lightbox{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;background:rgba(18,16,13,.92);opacity:0;transition:opacity .25s}\
    #lightbox.is-open{display:flex;opacity:1}\
    #lightbox .lb-img{max-width:92vw;max-height:86vh;border-radius:6px;box-shadow:0 24px 80px rgba(0,0,0,.55);transition:opacity .18s}\
    #lightbox .lb-cap{position:absolute;left:0;right:0;bottom:max(1rem,env(safe-area-inset-bottom));text-align:center;color:#f5f0e8;font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:none}\
    #lightbox button{position:absolute;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.18);color:#fff;cursor:pointer;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s}\
    #lightbox button:hover{background:rgba(0,0,0,.6);border-color:#fff}\
    #lightbox button svg{width:24px;height:24px}\
    #lightbox .lb-close{top:max(1rem,env(safe-area-inset-top));right:1rem;width:46px;height:46px}\
    #lightbox .lb-prev{left:1rem;top:50%;transform:translateY(-50%)}\
    #lightbox .lb-next{right:1rem;top:50%;transform:translateY(-50%)}\
    @media (max-width:560px){#lightbox .lb-prev{left:.4rem}#lightbox .lb-next{right:.4rem}#lightbox button{width:44px;height:44px}}\
    @media (prefers-reduced-motion:reduce){#lightbox,#lightbox .lb-img{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // Build overlay.
  var box = document.createElement('div');
  box.id = 'lightbox';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '\
    <button class="lb-close" aria-label="Bezárás"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>\
    <button class="lb-prev" aria-label="Előző kép"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>\
    <img class="lb-img" alt="">\
    <button class="lb-next" aria-label="Következő kép"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>\
    <div class="lb-cap"></div>';
  document.body.appendChild(box);

  var lbImg = box.querySelector('.lb-img');
  var lbCap = box.querySelector('.lb-cap');
  var idx = 0;

  function visibleItems() {
    return Array.prototype.slice.call(grid.querySelectorAll('.gal-item'))
      .filter(function (it) { return !it.classList.contains('is-hidden'); });
  }

  function show(i) {
    var its = visibleItems();
    if (!its.length) return;
    idx = (i + its.length) % its.length;
    var img = its[idx].querySelector('img');
    var cap = its[idx].querySelector('.gal-cap');
    lbImg.style.opacity = '0';
    var full = img.getAttribute('src');
    var pre = new Image();
    pre.onload = function () { lbImg.src = full; lbImg.alt = img.alt || ''; lbImg.style.opacity = '1'; };
    pre.src = full;
    lbCap.textContent = cap ? cap.textContent : (img.alt || '');
  }

  function open(i) {
    show(i);
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var fig = e.target && e.target.closest ? e.target.closest('.gal-item') : null;
    if (!fig) return;
    var its = visibleItems();
    var at = its.indexOf(fig);
    if (at !== -1) open(at);
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  // Make the tiles feel clickable.
  grid.style.cursor = 'zoom-in';
})();

/* ==========================================================
   NM BAU – Süti / adatkezelési sáv (cookie consent bar)
   Injected on every page that loads this file. The site uses
   only strictly-necessary browser storage (no analytics or
   ad cookies), so this is an informational acknowledgement
   with a link to the full Adatkezelési tájékoztató. The choice
   is remembered in localStorage so it shows only once.
   ========================================================== */
(function () {
  'use strict';
  var KEY = 'nmbau_cookie_consent';
  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}

  function build() {
    if (document.getElementById('cookie-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.id = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Süti tájékoztató');
    bar.innerHTML =
      '<p class="cookie-bar-text">Ez a weboldal a működéséhez szükséges böngészőtárolót (sütiket) használ, ' +
      'és egy árajánló asszisztenst, amely az Ön üzeneteit feldolgozza. Elemző- és reklámsütit nem alkalmazunk. ' +
      'Részletek az <a href="adatkezeles.html">Adatkezelési tájékoztatóban</a>.</p>' +
      '<div class="cookie-bar-actions">' +
      '<a class="cookie-bar-link" href="adatkezeles.html">Részletek</a>' +
      '<button class="btn btn-primary cookie-bar-accept" type="button">Rendben</button>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('is-in'); });

    bar.querySelector('.cookie-bar-accept').addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      bar.classList.remove('is-in');
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 350);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
