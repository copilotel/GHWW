/* Good Hope Wellness — small enhancements. Every page reads fine without this file. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: slides away on the way down, returns on the way up */
  var header = document.querySelector('.site-header');
  var last = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-hidden', y > 480 && y > last);
    last = y;
  }, { passive: true });

  /* menu */
  var menu = document.getElementById('menu');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : openBtn).focus();
  }
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener('click', function (e) { e.preventDefault(); setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }

  /* soft reveal on scroll */
  var items = [].slice.call(document.querySelectorAll('.rise'));
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* resource directory: category filter + search */
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
    var h = (location.hash || '').slice(1);
    var pre = filters.filter(function (f) { return f.getAttribute('data-cat') === h; })[0];
    if (pre) pre.click(); else apply();
  }
})();
