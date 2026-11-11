// Oplus Innovation — site behaviour: mobile nav, accessible tabs, footer year
(function () {
  // Mobile navigation
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Tabs (WAI-ARIA pattern: arrow keys move, Enter/Space or click selects)
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    function select(tab) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
      if (history.replaceState) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
    // Deep link: #v3 opens that vertical
    var hash = location.hash.replace('#', '');
    var target = tabs.filter(function (t) { return t.getAttribute('aria-controls') === hash; })[0];
    if (target) { select(target); setTimeout(function () { root.scrollIntoView({ block: 'start' }); }, 0); }
  });

  // "See vertical" links inside sector panels: open that vertical tab and scroll to it
  document.querySelectorAll('[data-goto-vertical]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var tab = document.querySelector('[role="tab"][aria-controls="' + a.getAttribute('href').slice(1) + '"]');
      if (tab) { e.preventDefault(); tab.click(); document.getElementById('verticals').scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
