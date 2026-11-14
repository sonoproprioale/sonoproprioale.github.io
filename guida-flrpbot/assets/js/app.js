/* ==========================================================
   Guida Florence RP Bot
   ========================================================== */
(function () {
  'use strict';

  var fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  document.head.appendChild(fa);

  var ROOT = document.body.dataset.root || './';

  var host = window.location.hostname;
  var LOCAL = window.location.protocol === 'file:' || host === '' || host === 'localhost' ||
              host === '127.0.0.1' || host === '[::1]' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  function cleanHref(href) {
    if (LOCAL || !href || href.charAt(0) === '#' || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.indexOf('//') === 0) return href;
    return href.replace(/\.html(?=$|[#?])/, '');
  }
  var CURRENT = document.body.dataset.page || '';
  var G = window.GUIDE;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function slugify(s) {
    return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  var flat = [];
  G.groups.forEach(function (g) {
    (function walk(items) {
      items.forEach(function (i) {
        flat.push({ t: i.t, p: i.p, ready: i.ready, group: g.title });
        if (i.children) walk(i.children);
      });
    })(g.items);
  });

  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    var b = document.getElementById('themeBtn');
    if (b) {
      b.textContent = t === 'dark' ? '☀️' : '🌙';
      b.setAttribute('aria-label', t === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    }
  }

  function hasCurrent(i) {
    return i.p === CURRENT || (i.children || []).some(hasCurrent);
  }
  function loadOpen() {
    try { return JSON.parse(localStorage.getItem('navOpen') || '[]'); } catch (e) { return []; }
  }
  function saveOpen(list) {
    try { localStorage.setItem('navOpen', JSON.stringify(list)); } catch (e) {}
  }
  var openSet = loadOpen();

  function buildList(items) {
    var ul = el('ul');
    items.forEach(function (i) {
      var li = el('li');
      var row = el('div', { 'class': 'nav-row' });
      var a = el('a', { href: ROOT + i.p });
      if (i.i) a.appendChild(el('i', { 'class': 'fa-solid ' + i.i + ' nav-ic', 'aria-hidden': 'true' }));
      a.appendChild(document.createTextNode(i.t));
      if (!i.ready) { a.className = 'todo'; }
      if (i.p === CURRENT) a.setAttribute('aria-current', 'page');
      row.appendChild(a);
      li.appendChild(row);

      if (i.children) {
        li.classList.add('has-children');
        var open = hasCurrent(i) || openSet.indexOf(i.p) !== -1;
        li.classList.toggle('open', open);

        var btn = el('button', {
          'class': 'caret', type: 'button',
          'aria-expanded': String(open),
          'aria-label': 'Espandi o comprimi ' + i.t
        });
        btn.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';

        var toggle = function () {
          var isOpen = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(isOpen));
          var list = loadOpen().filter(function (p) { return p !== i.p; });
          if (isOpen) list.push(i.p);
          saveOpen(list);
        };
        btn.addEventListener('click', toggle);
        // se sei già su questa pagina, il click sul titolo apre/chiude il menu
        a.addEventListener('click', function (e) {
          if (i.p === CURRENT) { e.preventDefault(); toggle(); }
        });

        row.appendChild(btn);
        li.appendChild(buildList(i.children));
      }
      ul.appendChild(li);
    });
    return ul;
  }

  function buildSidebar() {
    var nav = el('nav', { 'class': 'sidebar', 'aria-label': 'Navigazione guida', id: 'sidebar' });
    G.groups.forEach(function (g) {
      var h = el('div', { 'class': 'group-title' });
      h.textContent = g.title;
      nav.appendChild(h);
      nav.appendChild(buildList(g.items));
    });
    return nav;
  }

  function buildHeader() {
    var header = el('header', { 'class': 'site-header' });
    header.innerHTML =
      '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Apri il menu" aria-controls="sidebar">☰</button>' +
      '<a class="brand" href="' + ROOT + 'generale/informazioni.html"><span class="brand-mark">☁</span><span>' + G.title + '</span></a>' +
      '<div class="header-spacer"></div>' +
      '<div class="search"><input id="searchInput" type="search" placeholder="Cerca nella guida  ( / )" autocomplete="off" aria-label="Cerca nella guida">' +
      '<div class="search-results" id="searchResults" role="listbox"></div></div>' +
      '<button class="icon-btn" id="themeBtn"></button>';
    return header;
  }
  function wireSearch() {
    var input = document.getElementById('searchInput');
    var box = document.getElementById('searchResults');
    var idx = -1;

    function render(q) {
      var n = norm(q.trim());
      if (!n) { box.classList.remove('open'); box.innerHTML = ''; return; }
      var hits = flat.filter(function (i) { return norm(i.t).indexOf(n) !== -1; });
      box.innerHTML = '';
      if (!hits.length) {
        box.appendChild(el('div', { 'class': 'empty' }, 'Nessun risultato'));
      } else {
        hits.slice(0, 8).forEach(function (h) {
          var a = el('a', { href: cleanHref(ROOT + h.p) });
          a.innerHTML = '<span></span><small></small>';
          a.firstChild.textContent = h.t;
          a.lastChild.textContent = h.group;
          box.appendChild(a);
        });
      }
      idx = -1;
      box.classList.add('open');
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      var links = box.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!links.length) return;
        idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, k) { l.classList.toggle('active', k === idx); });
      } else if (e.key === 'Enter' && links.length) {
        window.location.href = (links[idx] || links[0]).getAttribute('href');
      } else if (e.key === 'Escape') {
        input.blur(); box.classList.remove('open');
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search')) box.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
    });
  }

  function buildToc(article) {
    var heads = article.querySelectorAll('h2, h3, h4');
    var toc = el('aside', { 'class': 'toc', 'aria-label': 'In questa pagina' });
    if (!heads.length) return toc;
    toc.appendChild(el('p', { 'class': 'toc-title' }, 'In questa pagina'));
    var ul = el('ul');
    var used = {};
    var links = [];
    heads.forEach(function (h) {
      if (h.closest('.update-body') && h.tagName === 'H2' && article.querySelectorAll('.update').length > 12) return;
      var id = h.id || slugify(h.textContent);
      while (used[id]) id += '-2';
      used[id] = true;
      h.id = id;
      var a = el('a', { 'class': 'anchor', href: '#' + id, 'aria-label': 'Link a questa sezione' }, '#');
      h.insertBefore(a, h.firstChild);
      var li = el('li', { 'class': 'lvl-' + h.tagName.charAt(1) });
      var link = el('a', { href: '#' + id });
      link.textContent = h.textContent.replace(/^#/, '');
      li.appendChild(link);
      ul.appendChild(li);
      links.push({ link: link, head: h });
    });
    toc.appendChild(ul);

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.link.classList.toggle('active', l.head === en.target); });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      links.forEach(function (l) { obs.observe(l.head); });
    }
    return toc;
  }

  function buildPager() {
    var i = flat.findIndex(function (x) { return x.p === CURRENT; });
    if (i === -1) return null;
    var wrap = el('nav', { 'class': 'pager', 'aria-label': 'Pagine' });
    if (flat[i - 1]) {
      var p = el('a', { 'class': 'prev', href: ROOT + flat[i - 1].p });
      p.innerHTML = '<small>Precedente</small><span></span>';
      p.lastChild.textContent = flat[i - 1].t;
      wrap.appendChild(p);
    }
    if (flat[i + 1]) {
      var n = el('a', { 'class': 'next', href: ROOT + flat[i + 1].p });
      n.innerHTML = '<small>Successiva</small><span></span>';
      n.lastChild.textContent = flat[i + 1].t;
      wrap.appendChild(n);
    }
    return wrap;
  }

  function wireChangelog() {
    var host = document.getElementById('changelogFilters');
    if (!host) return;
    var updates = document.querySelectorAll('.update');
    var tags = {};
    updates.forEach(function (u) {
      (u.dataset.tags || '').split(/\s+/).filter(Boolean).forEach(function (t) { tags[t] = true; });
    });
    var active = null;
    function mk(label, value) {
      var b = el('button', { 'class': 'chip', type: 'button', 'aria-pressed': 'false' });
      b.textContent = label;
      b.addEventListener('click', function () {
        active = value;
        host.querySelectorAll('.chip').forEach(function (c) {
          c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
        });
        updates.forEach(function (u) {
          var has = !value || (u.dataset.tags || '').split(/\s+/).indexOf(value) !== -1;
          u.classList.toggle('hidden', !has);
        });
      });
      return b;
    }
    var all = mk('Tutti', null);
    all.setAttribute('aria-pressed', 'true');
    host.appendChild(all);
    Object.keys(tags).sort().forEach(function (t) { host.appendChild(mk(t, t)); });
  }

  function init() {
    var article = document.querySelector('article.doc');
    if (!article) return;

    var header = buildHeader();
    var layout = el('div', { 'class': 'layout' });
    var sidebar = buildSidebar();
    var wrap = el('main', { 'class': 'content-wrap', id: 'content' });

    article.parentNode.insertBefore(header, article);
    article.parentNode.insertBefore(layout, article);
    wrap.appendChild(article);
    var pager = buildPager();
    if (pager) wrap.appendChild(pager);
    layout.appendChild(sidebar);
    layout.appendChild(wrap);
    layout.appendChild(buildToc(article));

    var theme = document.documentElement.dataset.theme || 'light';
    setTheme(theme);
    document.getElementById('themeBtn').addEventListener('click', function () {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
    document.getElementById('menuBtn').addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a')) document.body.classList.remove('menu-open');
    });

    var cur = sidebar.querySelector('[aria-current="page"]');
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'center' });

    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      var c = cleanHref(h);
      if (c !== h) a.setAttribute('href', c);
    });

    wireSearch();
    wireChangelog();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();