/* LuxDocs – Navigation, Menü, Auswahlfenster, Einblendungen, Inhaltsverzeichnis */
(function () {
  var body = document.body;
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');

  // Kopfleiste: über dem Startbild transparent, danach mit Hintergrund
  function onScroll() {
    nav.classList.toggle('solid', !hero || window.scrollY > hero.offsetHeight - 80);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Sprung von einer anderen Seite (z. B. ./#team): erst nach dem Laden der Schriften
  // korrigieren, weil sich das Layout dabei noch verschiebt
  if (location.hash && document.fonts) {
    document.fonts.ready.then(function () {
      var target = document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }

  // Vollbild-Menü
  var menuBtn = nav.querySelector('.nav-left');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('.lbl').textContent = open ? 'Schließen' : 'Menü';
    menu.inert = !open;
    if (open) menu.querySelector('a').focus({ preventScroll: true });
    else if (!document.querySelector('.modal.open')) menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // Auswahlfenster: Buchung (Cihan/Suzel) und WhatsApp
  var lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('open');
    m.inert = false;
    body.classList.add('modal-open');
    m.querySelector('.option').focus({ preventScroll: true });
  }
  function closeModal(m) {
    m.classList.remove('open');
    m.inert = true;
    body.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  window.ldOpenModal = openModal;
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-open')); return; }
    var m = e.target.closest('.modal');
    if (m && (e.target === m || e.target.closest('.modal-close'))) closeModal(m);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openM = document.querySelector('.modal.open');
    if (openM) closeModal(openM);
    else if (body.classList.contains('menu-open')) setMenu(false);
  });

  // Karte: Google Maps erst nach Klick laden
  document.querySelectorAll('.map').forEach(function (map) {
    var btn = map.querySelector('[data-map-load]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = map.getAttribute('data-map-src');
      frame.title = 'Karte: LuxDocs, An der Hasenkaule 10, 50354 Hürth';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      map.querySelector('.map-consent').replaceWith(frame);
    });
  });

  // Inhaltsverzeichnis auf den Rechtsseiten
  var toc = document.querySelector('.toc ol');
  if (toc) {
    // Auf dem Handy startet das Inhaltsverzeichnis zugeklappt
    if (window.matchMedia('(max-width: 900px)').matches) toc.closest('details').open = false;
    var heads = document.querySelectorAll('.prose h2');
    heads.forEach(function (h, i) {
      h.id = h.id || 'abschnitt-' + (i + 1);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      toc.appendChild(li);
    });
    if ('IntersectionObserver' in window) {
      var links = toc.querySelectorAll('a');
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      heads.forEach(function (h) { spy.observe(h); });
    }
  }

  // Sanftes Einblenden beim Scrollen
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
