/* Good Hope Wellness — small enhancements. Every page works without this file. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(function () { root.classList.add('ready'); }, 60);

  /* header: hide on scroll down, show on scroll up */
  var header = document.querySelector('.site-header');
  var last = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    var menuOpen = document.querySelector('.mobile-nav.open');
    if (header && !menuOpen) header.classList.toggle('is-hidden', y > 420 && y > last);
    last = y;
  }, { passive: true });

  /* mobile menu */
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-nav');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) btn.click();
    });
  }

  /* reveal on scroll */
  var items = [].slice.call(document.querySelectorAll('.rise'));
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* resources directory: category filter + search */
  var dir = document.querySelector('[data-directory]');
  if (dir) {
    var input = dir.querySelector('input[type="search"]');
    var filters = [].slice.call(dir.querySelectorAll('.filter'));
    var groups = [].slice.call(dir.querySelectorAll('.group'));
    var count = dir.querySelector('.count');
    var empty = dir.querySelector('.empty');
    var cat = 'all';
    function apply() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      groups.forEach(function (g) {
        var inCat = cat === 'all' || g.getAttribute('data-cat') === cat;
        var n = 0;
        [].forEach.call(g.querySelectorAll('.res'), function (r) {
          var ok = inCat && (!q || r.getAttribute('data-text').indexOf(q) !== -1);
          r.hidden = !ok;
          if (ok) n++;
        });
        g.hidden = n === 0;
        shown += n;
      });
      if (count) count.textContent = shown + (shown === 1 ? ' listing' : ' listings');
      if (empty) empty.hidden = shown !== 0;
    }
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        cat = f.getAttribute('data-cat');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
        apply();
      });
    });
    input.addEventListener('input', apply);
    /* deep links like resources/#therapists pre-select that category */
    var h = (location.hash || '').slice(1);
    var pre = filters.filter(function (f) { return f.getAttribute('data-cat') === h; })[0];
    if (pre) pre.click(); else apply();
  }
})();
