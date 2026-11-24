/* ==========================================================================
   SNJ — Barre latérale + thème clair/sombre
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript
   Placement : "Sur toutes les pages".
   Dépend de :
   - head-snippet.html (pose data-theme avant l'affichage, charge le CSS du thème)
   - src/css/components/10-sidebar.css (servi par jsDelivr)
   Icônes : Material Symbols Outlined UNIQUEMENT (même bibliothèque que AwesomeBB).
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     CONFIGURATION — liens de navigation (modifiable sans toucher au reste)
     icon : nom d'une icône Material Symbols (https://fonts.google.com/icons)
     svg  : clé de l'objet SVG ci-dessous (logos de marque uniquement)
     hideOnMobile : masqué dans la barre du bas sur mobile
     ---------------------------------------------------------------------- */
  var NAV = [
    { label: 'Accueil', icon: 'home', href: '/' },
    { label: 'Membres', icon: 'group', href: '/memberlist', hideOnMobile: true },
    { label: 'Discord', svg: 'discord', href: 'https://discord.com/invite/bnK7vyGjXV', external: true },
    { label: 'Annexe', icon: 'menu_book', href: 'https://snj-base-de-donnees.vercel.app/', external: true },
    { label: 'Carte', icon: 'map', href: '/t16-iii-carte' }
  ];

  /* Fichiers du thème servis par jsDelivr (version figée = SHA du commit) */
  var ASSETS = 'https://cdn.jsdelivr.net/gh/papiforce/snj-theme@68fdca1129bc685eeec7a8fe1b4b07e452920dcd/assets/';
  var LOGO = ASSETS + 'snj-logo.webp';

  /* Logos de marque absents de Material Symbols : SVG de Simple Icons (licence CC0) */
  var SVG = {
    discord: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'
  };

  var THEME_KEY = 'snj-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  /* ----------------------------------------------------------------------
     Thème clair/sombre
     ---------------------------------------------------------------------- */
  /* Le choix est gardé à deux endroits : localStorage et un cookie de secours,
     pour survivre aux navigateurs où l'un des deux est indisponible ou vidé. */
  function storedTheme() {
    var t = null;
    try { t = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (t === 'light' || t === 'dark') return t;
    var m = document.cookie.match(/(?:^|;\s*)snj-theme=(light|dark)/);
    return m ? m[1] : null;
  }

  function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    document.cookie = THEME_KEY + '=' + theme + '; path=/; max-age=31536000; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
  }

  function systemTheme() {
    return media && media.matches ? 'light' : 'dark';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('sg-theme-toggle');
    if (!btn) return;
    var label = theme === 'dark' ? 'Thème clair' : 'Thème sombre';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-label', label);
    btn.querySelector('.material-symbols-outlined').textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  function toggleTheme() {
    var theme = currentTheme() === 'dark' ? 'light' : 'dark';
    saveTheme(theme);
    applyTheme(theme);
  }

  /* Réapplique le choix enregistré : retour arrière (page restaurée depuis le cache
     du navigateur, sans relancer les scripts) et changement fait dans un autre onglet. */
  function syncTheme() {
    applyTheme(storedTheme() || systemTheme());
  }

  window.addEventListener('pageshow', syncTheme);
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key === THEME_KEY) syncTheme();
  });

  if (media) {
    var onSystemChange = function (e) {
      if (!storedTheme()) applyTheme(e.matches ? 'light' : 'dark');
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */
  function icon(name) {
    var i = document.createElement('span');
    i.className = 'material-symbols-outlined';
    i.setAttribute('aria-hidden', 'true');
    i.textContent = name;
    return i;
  }

  function svgIcon(name) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'sg-sb-svg');
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', SVG[name]);
    svg.appendChild(path);
    return svg;
  }

  function item(opts) {
    var el = document.createElement(opts.href ? 'a' : 'button');
    el.className = 'sg-sb-item';
    if (opts.href) {
      el.href = opts.href;
      if (opts.external) {
        el.target = '_blank';
        el.rel = 'noopener';
      }
    } else {
      el.type = 'button';
    }
    if (opts.id) el.id = opts.id;
    el.setAttribute('aria-label', opts.label);
    el.setAttribute('data-label', opts.label);
    el.appendChild(opts.svg ? svgIcon(opts.svg) : icon(opts.icon));
    if (opts.hideOnMobile) el.className += ' sg-sb-hide-mobile';
    if (opts.badge) {
      var b = document.createElement('span');
      b.className = 'sg-sb-badge';
      el.appendChild(b);
    }
    if (opts.onClick) el.addEventListener('click', opts.onClick);
    return el;
  }

  function isCurrent(href) {
    var a = document.createElement('a');
    a.href = href;
    if (a.host !== location.host) return false;
    if (a.pathname === '/') return location.pathname === '/' || location.pathname === '/forum';
    return location.pathname.indexOf(a.pathname) === 0;
  }

  /* Reprend un lien du menu natif d'AwesomeBB (déconnexion, admin…) */
  function nativeLink(iconName) {
    var links = document.querySelectorAll('#main-user-menu a, #main-menu a');
    for (var i = 0; i < links.length; i++) {
      var ic = links[i].querySelector('i, .material-symbols-outlined');
      if (ic && ic.textContent.trim() === iconName) return links[i].getAttribute('href');
    }
    return null;
  }

  function avatarSrc() {
    var ud = window._userdata || {};
    if (!ud.avatar) return null;
    var tmp = document.createElement('div');
    tmp.innerHTML = ud.avatar;
    var img = tmp.querySelector('img');
    return img ? img.getAttribute('src') : null;
  }

  /* Recopie le compteur de notifications natif dans la pastille */
  function syncBadge(nativeEl, badge) {
    if (!nativeEl || !badge) return;
    var update = function () {
      var m = (nativeEl.textContent || '').match(/\d+/);
      badge.textContent = m && m[0] !== '0' ? m[0] : '';
    };
    update();
    if (window.MutationObserver) {
      new MutationObserver(update).observe(nativeEl, { childList: true, subtree: true, characterData: true });
    }
  }

  /* ----------------------------------------------------------------------
     Construction de la barre
     ---------------------------------------------------------------------- */
  function mount() {
    if (document.getElementById('sg-sidebar')) return;

    /* Si le CSS du thème n'a pas chargé, on garde l'en-tête natif. */
    var cssReady = getComputedStyle(root).getPropertyValue('--sg-sidebar-w').trim() !== '';
    if (!cssReady) return;

    var ud = window._userdata || {};
    var logged = String(ud.session_logged_in) === '1';

    var bar = document.createElement('aside');
    bar.id = 'sg-sidebar';
    bar.setAttribute('aria-label', 'Navigation principale');

    /* Emblème ou avatar */
    var brand = document.createElement('a');
    brand.className = 'sg-sb-brand';
    var src = logged ? avatarSrc() : null;
    if (logged) {
      brand.href = '/u' + ud.user_id;
      brand.setAttribute('aria-label', 'Mon profil');
      brand.setAttribute('data-label', ud.username ? 'Profil de ' + ud.username : 'Mon profil');
    } else {
      brand.href = '/';
      brand.setAttribute('aria-label', 'Sengoku no Jidai');
      brand.setAttribute('data-label', 'Sengoku no Jidai');
    }
    var img = document.createElement('img');
    img.alt = '';
    if (src) {
      img.src = src;
    } else {
      img.src = LOGO;
      brand.className += ' sg-sb-brand--logo';
    }
    brand.appendChild(img);
    bar.appendChild(brand);

    /* Navigation */
    var nav = document.createElement('nav');
    nav.className = 'sg-sb-group';
    nav.setAttribute('aria-label', 'Forum');
    NAV.forEach(function (l) {
      var el = item(l);
      if (!l.external && isCurrent(l.href)) el.setAttribute('aria-current', 'page');
      nav.appendChild(el);
    });
    bar.appendChild(nav);

    /* Compte + thème */
    var bottom = document.createElement('div');
    bottom.className = 'sg-sb-group sg-sb-bottom';

    if (logged) {
      var nativeNotif = document.getElementById('header-notif');
      var notifMenu = document.getElementById('notif-menu');
      var dimmer = document.getElementById('dimmer');
      var notifOpen = function () {
        return !!notifMenu && !notifMenu.classList.contains('hidden');
      };
      var notif = item({
        label: 'Notifications',
        icon: 'notifications',
        badge: true,
        onClick: function (e) {
          e.preventDefault();
          e.stopPropagation();
          /* AwesomeBB ferme le panneau mais laisse le voile sombre si on reclique
             sur l'icône : on ferme donc via le voile, comme un clic à côté. */
          if (notifOpen() && dimmer) dimmer.click();
          else if (nativeNotif) nativeNotif.click();
          notif.setAttribute('aria-expanded', notifOpen() ? 'true' : 'false');
        }
      });
      notif.setAttribute('aria-expanded', 'false');
      if (dimmer) {
        dimmer.addEventListener('click', function () {
          notif.setAttribute('aria-expanded', 'false');
        });
      }
      bottom.appendChild(notif);
      syncBadge(nativeNotif, notif.querySelector('.sg-sb-badge'));

      var admin = nativeLink('dashboard');
      if (admin) bottom.appendChild(item({ label: "Panneau d'administration", icon: 'dashboard', href: admin }));

      var logout = nativeLink('power_settings_new');
      if (logout) bottom.appendChild(item({ label: 'Déconnexion', icon: 'logout', href: logout }));
    } else {
      bottom.appendChild(item({ label: 'Connexion', icon: 'login', href: '/login' }));
      bottom.appendChild(item({ label: 'Inscription', icon: 'person_add', href: '/register' }));
    }

    bottom.appendChild(item({ id: 'sg-theme-toggle', label: 'Thème', icon: 'light_mode', onClick: toggleTheme }));
    bar.appendChild(bottom);

    document.body.insertBefore(bar, document.body.firstChild);

    /* La bannière ramène à l'accueil */
    var banner = document.getElementById('header-banner');
    if (banner && !banner.querySelector('.sg-banner-link')) {
      var home = document.createElement('a');
      home.className = 'sg-banner-link';
      home.href = '/';
      home.setAttribute('aria-label', 'Sengoku no Jidai, accueil');
      banner.appendChild(home);
    }
    footer();
    pageHead();
    subforums();
    topics();
    topicPage();
    perms();
    applyTheme(storedTheme() || currentTheme());
  }

  /* --------------------------------------------------------------------
     En-tête de page (pages des forums) : fil d'Ariane, titre avec ses boutons
     d'action à droite, puis description. Remplace .page-header et la barre
     « Plus ! / Marquer tous les sujets comme lus » ; le bouton fixe
     « Poster un nouveau sujet » en bas d'écran est masqué par le CSS.
     Les liens et boutons d'origine sont déplacés, pas copiés.
     -------------------------------------------------------------------- */
  var CATEGORIES = {
    'Gestion': { slug: 'gestion', tone: 'gestion' },
    'Hi no Kuni': { slug: 'hi-no-kuni', tone: 'hi' },
    'Mizu no Kuni': { slug: 'mizu-no-kuni', tone: 'mizu' },
    'Kaze no Kuni': { slug: 'kaze-no-kuni', tone: 'kaze' },
    'Kaminari no Kuni': { slug: 'kaminari-no-kuni', tone: 'kaminari' },
    'Tsuchi no Kuni': { slug: 'tsuchi-no-kuni', tone: 'tsuchi' },
    'Shōkoku': { slug: 'shokoku', tone: 'autres' },
    'Reste du Sekai': { slug: 'shokoku', tone: 'autres' }
  };

  function pageHead() {
    if (document.querySelector('.sg-pagehead')) return;
    var isTopic = /^\/t\d+/.test(location.pathname);
    if (!isTopic && !/^\/f\d+/.test(location.pathname)) return;
    /* Page de forum : .page-header ; page de sujet : .topic-header (même pattern, le sujet en dernier niveau du fil) */
    var native = document.querySelector(isTopic ? '#topic .topic-header' : '#wrap .page-header');
    var h1 = native && native.querySelector('h1');
    if (!h1) return;

    var el = function (tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; };
    var head = el('section', 'sg-pagehead');
    head.setAttribute('aria-label', 'En-tête du forum');

    /* Fil d'Ariane : liens d'origine, la catégorie ouvre son onglet sur l'accueil */
    var crumbs = native.querySelector('#breadcrumbs');
    var links = crumbs ? Array.prototype.slice.call(crumbs.querySelectorAll('a')) : [];
    var category = links[1] ? links[1].textContent.trim() : '';
    var meta = CATEGORIES[category];
    if (meta) head.classList.add('sg-tone-' + meta.tone);
    if (links.length) {
      var nav = el('nav', 'sg-crumbs');
      nav.setAttribute('aria-label', "Fil d'Ariane");
      var ol = el('ol', 'sg-crumbs__list');
      links.forEach(function (a, i) {
        var li = el('li', 'sg-crumbs__item');
        a.className = 'sg-crumbs__link';
        if (i === 1 && meta) a.setAttribute('href', '/?onglet=' + meta.slug);
        if (i === links.length - 1 && !isTopic) a.setAttribute('aria-current', 'page');
        li.appendChild(a);
        ol.appendChild(li);
      });
      if (isTopic) {
        var cur = el('li', 'sg-crumbs__item');
        var here = el('span', 'sg-crumbs__link sg-crumbs__here');
        here.setAttribute('aria-current', 'page');
        here.textContent = (h1.querySelector('a') || h1).textContent.trim();
        cur.appendChild(here);
        ol.appendChild(cur);
      }
      nav.appendChild(ol);
      head.appendChild(nav);
    }

    /* Titre et boutons d'action */
    var row = el('div', 'sg-pagehead__row');
    var title = el('h1', 'sg-pagehead__title');
    title.textContent = (h1.querySelector('a') || h1).textContent.trim();
    /* Sujet : titre sur une ligne, coupé en ellipse (titre complet en infobulle) ; la cloche native
       des notifications du sujet et « Poster un nouveau sujet » restent dans l'en-tête natif, masqué */
    if (isTopic) {
      var full = title.textContent;
      title.textContent = '';
      title.appendChild(uiEl('span', 'sg-pagehead__text', full));
      title.classList.add('sg-pagehead__title--line');
      title.setAttribute('title', full);
    }
    row.appendChild(title);
    var actions = el('div', 'sg-pagehead__actions');
    Array.prototype.slice.call(native.querySelectorAll(':scope > a.btn')).forEach(function (b) {
      if (isTopic && /mode=newtopic/.test(b.getAttribute('href') || '')) return;
      b.className = 'sg-action';
      actions.appendChild(b);
    });
    if (actions.children.length) row.appendChild(actions);
    head.appendChild(row);

    /* Description (sans la balise .sg-meta ni le bouton déplier/replier) */
    var desc = native.querySelector('.page-desc-content');
    /* Kanji propre au forum (balise .sg-meta de sa description), en filigrane comme sur ses cartes de l'accueil */
    var kanjiMeta = native.querySelector('.sg-meta[data-kanji]');
    if (kanjiMeta && kanjiMeta.getAttribute('data-kanji')) {
      var kanji = el('span', 'sg-pagehead__kanji');
      kanji.setAttribute('aria-hidden', 'true');
      kanji.textContent = kanjiMeta.getAttribute('data-kanji');
      head.insertBefore(kanji, head.firstChild);
    }
    if (desc) {
      var text = el('div', 'sg-pagehead__desc');
      Array.prototype.slice.call(desc.childNodes).forEach(function (n) { text.appendChild(n); });
      Array.prototype.slice.call(text.querySelectorAll('.sg-meta')).forEach(function (m) { m.remove(); });
      if (text.textContent.trim()) head.appendChild(text);
    }

    native.parentNode.insertBefore(head, native);
    document.body.classList.add('sg-pagehead-on');
    if (isTopic) {
      document.body.classList.add('sg-topicpage');
      topicDescription(head, row);
    }
  }

  /* Description d'un sujet : absente de la page du sujet, elle est lue dans la liste des sujets
     de son forum (première page), puis gardée pour la session (sessionStorage « snj-tdesc »). */
  function topicDescription(head, row) {
    var tid = (location.pathname.match(/^\/t(\d+)/) || [])[1];
    var forums = Array.prototype.slice.call(head.querySelectorAll('.sg-crumbs a[href^="/f"]'));
    var forum = forums.length ? forums[forums.length - 1].getAttribute('href') : '';
    if (!tid || !forum) return;
    var KEY = 'snj-tdesc';
    var cache = {};
    try { cache = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) {}
    var show = function (text) {
      if (!text || head.querySelector('.sg-pagehead__desc')) return;
      var d = uiEl('div', 'sg-pagehead__desc', text);
      row.parentNode.insertBefore(d, row.nextSibling);
    };
    if (cache[tid] !== undefined) { show(cache[tid]); return; }
    fetch(forum, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var link = doc.querySelector('.posts-description a[href^="/t' + tid + '-"], a.topictitle[href^="/t' + tid + '-"]');
        var item = link && (link.closest('.posts-section') || link.closest('li') || link.closest('tr'));
        var desc = item && item.querySelector('.topic-description');
        var text = desc ? desc.textContent.replace(/\s+/g, ' ').trim() : '';
        cache[tid] = text;
        try { sessionStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {}
        show(text);
      })
      .catch(function () {});
  }

  /* --------------------------------------------------------------------
     Sous-forums : cartes « ema » (絵馬, tablette votive au sommet en toit),
     grille de 2 colonnes. Pattern réutilisable partout où le forum liste des
     sous-forums ; distinct des cartes de forum de l'accueil (image en fond,
     kanji, dangerosité). Données lues dans la liste native, masquée ensuite.
     -------------------------------------------------------------------- */
  function subforums() {
    if (document.querySelector('.sg-subforums')) return;
    if (!/^\/f\d+/.test(location.pathname)) return;
    var native = document.querySelector('#wrap > .forum.type-table-forum');
    var rows = native ? Array.prototype.slice.call(native.querySelectorAll('.forum-section')) : [];
    if (!rows.length) return;

    var el = function (tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    };
    var ico = function (name) { var i = el('span', 'material-symbols-outlined', name); i.setAttribute('aria-hidden', 'true'); return i; };
    var num = function (node) { return node ? parseInt(node.textContent.replace(/[^\d]/g, ''), 10) || 0 : 0; };
    var plural = function (n, one, many) { return n + ' ' + (n > 1 ? many : one); };

    var section = el('section', 'sg-subforums');
    var head = document.querySelector('.sg-pagehead');
    if (head) (head.className.match(/sg-tone-[a-z]+/) || []).forEach(function (c) { section.classList.add(c); });
    section.setAttribute('aria-label', 'Sous-forums');
    var grid = el('ul', 'sg-subforums__grid');

    rows.forEach(function (row) {
      var link = row.querySelector('.forum-description h3 a');
      if (!link) return;
      var desc = row.querySelector('.forum-description p');
      var meta = row.querySelector('.sg-meta');
      var img = (meta && meta.getAttribute('data-image')) || (desc && desc.querySelector('img') ? desc.querySelector('img').getAttribute('src') : '');
      var text = '';
      if (desc) {
        var copy = desc.cloneNode(true);
        Array.prototype.slice.call(copy.querySelectorAll('img, .sg-meta')).forEach(function (n) { n.remove(); });
        text = copy.textContent.replace(/\s+/g, ' ').trim();
      }
      var topics = num(row.querySelector('.forum-statistics-topics'));
      var posts = num(row.querySelector('.forum-statistics-posts'));
      var unread = row.classList.contains('forum_new');

      var card = el('li', 'sg-ema' + (unread ? ' is-new' : ''));
      var cover = el('a', 'sg-ema__cover');
      cover.href = link.getAttribute('href');
      cover.setAttribute('tabindex', '-1');
      cover.setAttribute('aria-hidden', 'true');
      if (img) cover.style.setProperty('--ema-img', "url('" + img.replace(/'/g, '%27') + "')");
      else cover.classList.add('is-empty');
      cover.appendChild(el('span', 'sg-ema__cord'));
      if (unread) cover.appendChild(el('span', 'sg-ema__new', 'Nouveau'));
      card.appendChild(cover);

      var body = el('div', 'sg-ema__body');
      var title = el('h3', 'sg-ema__title');
      var a = el('a', 'sg-ema__link', link.textContent.trim());
      a.href = link.getAttribute('href');
      title.appendChild(a);
      body.appendChild(title);
      if (text) body.appendChild(el('p', 'sg-ema__desc', text));

      var stats = el('p', 'sg-ema__stats');
      stats.appendChild(ico('chat_bubble'));
      stats.appendChild(el('span', null, plural(topics, 'sujet', 'sujets')));
      stats.appendChild(ico('forum'));
      stats.appendChild(el('span', null, plural(posts, 'message', 'messages')));
      body.appendChild(stats);

      /* Sous-sous-forums éventuels */
      var children = Array.prototype.slice.call(row.querySelectorAll('.forum-description a.gensmall[href^="/f"]'));
      if (children.length) {
        var chips = el('ul', 'sg-ema__children');
        children.forEach(function (c) {
          var li = el('li');
          var ca = el('a', 'sg-ema__child', c.textContent.trim());
          ca.href = c.getAttribute('href');
          li.appendChild(ca);
          chips.appendChild(li);
        });
        body.appendChild(chips);
      }
      card.appendChild(body);

      /* Dernier message */
      var last = row.querySelector('.forum-lastpost');
      var lastTopic = last && last.querySelector('a.topic-title');
      var foot = el('div', 'sg-ema__last');
      if (lastTopic) {
        var avatarImg = last.querySelector('.avatar-default img');
        var av = el('span', 'sg-ema__avatar');
        if (avatarImg) {
          var im = el('img');
          im.src = avatarImg.getAttribute('src');
          im.alt = '';
          im.loading = 'lazy';
          av.appendChild(im);
        } else av.appendChild(ico('person'));
        foot.appendChild(av);
        var info = el('div', 'sg-ema__lastinfo');
        var lt = el('a', 'sg-ema__lasttopic', lastTopic.getAttribute('title') || lastTopic.textContent.trim());
        var jump = last.querySelector('a.last-post-icon');
        lt.href = jump ? jump.getAttribute('href') : lastTopic.getAttribute('href');
        info.appendChild(lt);
        var by = el('span', 'sg-ema__lastby');
        var author = last.querySelector('.forum-lastpost-author a[href^="/u"]');
        if (author) {
          var au = el('a', 'sg-ema__author');
          au.href = author.getAttribute('href');
          var colored = author.querySelector('span[style]');
          var name = el('span', colored ? colored.className : '', author.textContent.trim());
          if (colored) name.setAttribute('style', colored.getAttribute('style'));
          au.appendChild(name);
          by.appendChild(au);
        }
        var time = last.querySelector('.forum-lastpost-time');
        if (time) by.appendChild(el('span', 'sg-ema__time', time.textContent.replace(/access_time/, '').trim()));
        info.appendChild(by);
        foot.appendChild(info);
      } else {
        foot.classList.add('is-empty');
        foot.appendChild(ico('edit_note'));
        foot.appendChild(el('span', null, 'Aucun message pour l’instant'));
      }
      card.appendChild(foot);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    native.parentNode.insertBefore(section, native);
    document.body.classList.add('sg-subforums-on');
  }

  /* --------------------------------------------------------------------
     Briques partagées par les pages de forum et de sujet
     -------------------------------------------------------------------- */
  function uiEl(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function uiIco(name) {
    var i = uiEl('span', 'material-symbols-outlined', name);
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  /* Menu « Actions » (trois points verticaux) : items = [adresse ou fonction, icône, libellé], null = séparateur.
     Utilisé sur les pages de forum (topics) et de sujet (topicPage). */
  function actionsMenu(items, menuId) {
    var el = uiEl, ico = uiIco;
    var wrapM = el('div', 'sg-menu');
    var toggle = el('button', 'sg-menu__toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-haspopup', 'menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', menuId);
    toggle.appendChild(el('span', null, 'Actions'));
    toggle.appendChild(ico('more_vert'));
    var menu = el('ul', 'sg-menu__list');
    menu.id = menuId;
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    items.forEach(function (it) {
      if (it === null) { var sep = el('li', 'sg-menu__sep'); sep.setAttribute('role', 'separator'); menu.appendChild(sep); return; }
      var li = el('li');
      li.setAttribute('role', 'none');
      var item = el('a', 'sg-menu__item');
      if (typeof it[0] === 'function') {
        var run = it[0];
        item.href = '#';
        item.addEventListener('click', function (ev) { ev.preventDefault(); close(false); run(); });
      } else item.href = it[0];
      item.setAttribute('role', 'menuitem');
      item.tabIndex = -1;
      item.appendChild(ico(it[1]));
      item.appendChild(el('span', null, it[2]));
      li.appendChild(item);
      menu.appendChild(li);
    });
    wrapM.appendChild(toggle);
    wrapM.appendChild(menu);

    var entries = function () { return Array.prototype.slice.call(menu.querySelectorAll('.sg-menu__item')); };
    var open = function (focusIndex) {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      wrapM.classList.add('is-open');
      if (focusIndex !== undefined) { var e = entries(); (e[focusIndex < 0 ? e.length - 1 : focusIndex] || e[0]).focus(); }
    };
    var close = function (refocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      wrapM.classList.remove('is-open');
      if (refocus) toggle.focus();
    };
    toggle.addEventListener('click', function () { if (menu.hidden) open(); else close(); });
    toggle.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(0); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); open(-1); }
    });
    menu.addEventListener('keydown', function (ev) {
      var e = entries(), i = e.indexOf(document.activeElement);
      if (ev.key === 'ArrowDown') { ev.preventDefault(); e[(i + 1) % e.length].focus(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); e[(i - 1 + e.length) % e.length].focus(); }
      else if (ev.key === 'Home') { ev.preventDefault(); e[0].focus(); }
      else if (ev.key === 'End') { ev.preventDefault(); e[e.length - 1].focus(); }
      else if (ev.key === 'Escape') { ev.preventDefault(); close(true); }
      else if (ev.key === 'Tab') close(false);
    });
    document.addEventListener('click', function (ev) { if (!wrapM.contains(ev.target)) close(false); });
    return wrapM;
  }

  /* Liste déroulante personnalisée (remplace l'affichage natif d'un <select>, qui reste dans le
     formulaire, masqué, et reçoit la valeur choisie suivie d'un événement « change »).
     options : { search: true } → champ de saisie qui filtre la liste (motif combobox ARIA) ;
     { tree: true } → options de la jumpbox : séparateurs « | » purgés, profondeur lue dans les « | ». */
  var comboCount = 0;
  function combo(select, opts) {
    var el = uiEl, ico = uiIco;
    opts = opts || {};
    var uid = 'sg-combo-' + (++comboCount);
    var norm = function (t) { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
    var placeholder = '';
    var data = [];
    Array.prototype.slice.call(select.options).forEach(function (o) {
      var raw = o.textContent.replace(/ /g, ' ');
      if (opts.tree) {
        if (o.value === '-1') { if (!placeholder && raw.trim() && !/^[|\s]*$/.test(raw)) placeholder = raw.trim(); return; }
        var m = raw.match(/^([|\s]*)--\s*(.*)$/);
        var depth = m ? (m[1].match(/\|/g) || []).length - 1 : 0;
        data.push({ value: o.value, label: (m ? m[2] : raw).trim(), depth: Math.max(0, depth), cat: /^c\d/.test(o.value) });
      } else {
        data.push({ value: o.value, label: raw.trim(), depth: 0, cat: false });
      }
    });
    /* Parents de chaque entrée, pour garder l'arborescence visible pendant le filtrage */
    var stack = [];
    data.forEach(function (d, i) {
      stack.length = d.depth;
      d.parents = stack.slice();
      stack[d.depth] = i;
    });

    var box = el('div', 'sg-combo' + (opts.search ? ' sg-combo--search' : ''));
    var list = el('ul', 'sg-combo__list');
    list.id = uid + '-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    var field;
    var current = select.value;
    /* Jumpbox : le forum affiché est coché (sa valeur native est « -1 ») */
    if (opts.tree && opts.currentValue && !data.some(function (d) { return d.value === current; })) current = opts.currentValue;
    var labelOf = function (v) { for (var i = 0; i < data.length; i++) if (data[i].value === v) return data[i].label; return ''; };

    if (opts.search) {
      var wrapF = el('div', 'sg-combo__control');
      wrapF.appendChild(ico('search'));
      field = el('input', 'sg-combo__input');
      field.type = 'text';
      field.autocomplete = 'off';
      field.spellcheck = false;
      field.placeholder = placeholder || 'Rechercher…';
      field.setAttribute('aria-autocomplete', 'list');
      wrapF.appendChild(field);
      var chev = el('span', 'sg-combo__chevron material-symbols-outlined', 'expand_more');
      chev.setAttribute('aria-hidden', 'true');
      wrapF.appendChild(chev);
      box.appendChild(wrapF);
      /* Toute la surface du champ ouvre la liste (icône, chevron, marges comprises).
         Le focus ouvre déjà la liste : on ne bascule donc que si elle était ouverte avant le clic. */
      wrapF.addEventListener('mousedown', function (ev) {
        if (ev.target === field) return;
        ev.preventDefault();
        var wasOpen = !list.hidden;
        if (document.activeElement !== field) field.focus();
        if (wasOpen) close(); else open();
      });
    } else {
      field = el('button', 'sg-combo__control');
      field.type = 'button';
      var val = el('span', 'sg-combo__value', labelOf(current) || placeholder);
      field.appendChild(val);
      var chev2 = el('span', 'sg-combo__chevron material-symbols-outlined', 'expand_more');
      chev2.setAttribute('aria-hidden', 'true');
      field.appendChild(chev2);
      box.appendChild(field);
      field.addEventListener('click', function () { toggle(); });
    }
    field.id = uid;
    field.setAttribute('role', 'combobox');
    field.setAttribute('aria-expanded', 'false');
    field.setAttribute('aria-controls', list.id);
    field.setAttribute('aria-haspopup', 'listbox');

    var items = data.map(function (d, i) {
      var li = el('li', 'sg-combo__opt' + (d.cat ? ' is-cat' : '') + (d.depth > 1 ? ' is-deep' : ''));
      li.id = uid + '-o' + i;
      li.setAttribute('role', 'option');
      li.style.setProperty('--depth', d.depth);
      li.appendChild(el('span', 'sg-combo__label', d.label));
      var ok = ico('check');
      ok.className += ' sg-combo__check';
      li.appendChild(ok);
      li.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      li.addEventListener('click', function () { choose(i); });
      li.addEventListener('mousemove', function () { setActive(i); });
      list.appendChild(li);
      return li;
    });
    var empty = el('li', 'sg-combo__empty', 'Aucun résultat');
    empty.setAttribute('role', 'presentation');
    empty.hidden = true;
    list.appendChild(empty);
    box.appendChild(list);
    select.classList.add('sg-combo__native');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');
    box.appendChild(select);

    var active = -1;
    var visible = function () { return items.map(function (li, i) { return li.hidden ? -1 : i; }).filter(function (i) { return i >= 0; }); };
    var setActive = function (i) {
      if (active >= 0) items[active].classList.remove('is-active');
      active = i;
      if (i >= 0) {
        items[i].classList.add('is-active');
        field.setAttribute('aria-activedescendant', items[i].id);
        var li = items[i], top = li.offsetTop, bottom = top + li.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top - 6;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 6;
      } else field.removeAttribute('aria-activedescendant');
    };
    var mark = function () {
      items.forEach(function (li, i) {
        var on = data[i].value === current;
        li.setAttribute('aria-selected', on ? 'true' : 'false');
        li.classList.toggle('is-selected', on);
      });
    };
    var filter = function (q) {
      q = norm(q.trim());
      var show = data.map(function () { return !q; });
      if (q) data.forEach(function (d, i) {
        if (norm(d.label).indexOf(q) >= 0) { show[i] = true; d.parents.forEach(function (p) { if (p !== undefined) show[p] = true; }); }
      });
      items.forEach(function (li, i) { li.hidden = !show[i]; li.classList.toggle('is-context', !!q && show[i] && norm(data[i].label).indexOf(q) < 0); });
      empty.hidden = show.some(Boolean);
      var v = visible().filter(function (i) { return !items[i].classList.contains('is-context'); });
      setActive(v.length ? v[0] : -1);
    };
    var open = function () {
      if (!list.hidden) return;
      list.hidden = false;
      box.classList.add('is-open');
      field.setAttribute('aria-expanded', 'true');
      mark();
      if (opts.search) filter(field.value);
      var sel = -1;
      data.forEach(function (d, i) { if (d.value === current && !items[i].hidden) sel = i; });
      setActive(sel >= 0 ? sel : (visible()[0] !== undefined ? visible()[0] : -1));
    };
    var close = function () {
      if (list.hidden) return;
      list.hidden = true;
      box.classList.remove('is-open');
      field.setAttribute('aria-expanded', 'false');
      setActive(-1);
      if (opts.search) { field.value = ''; items.forEach(function (li) { li.hidden = false; li.classList.remove('is-context'); }); empty.hidden = true; }
    };
    var toggle = function () { if (list.hidden) open(); else close(); };
    var choose = function (i) {
      current = data[i].value;
      mark();
      if (!opts.search) field.querySelector('.sg-combo__value').textContent = data[i].label;
      close();
      if (opts.search) field.value = '';
      select.value = current;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };
    var move = function (step) {
      var v = visible();
      if (!v.length) return;
      var k = v.indexOf(active);
      if (step === 'home') k = 0;
      else if (step === 'end') k = v.length - 1;
      else k = k < 0 ? (step > 0 ? 0 : v.length - 1) : Math.min(v.length - 1, Math.max(0, k + step));
      setActive(v[k]);
    };
    field.addEventListener('keydown', function (ev) {
      var k = ev.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        ev.preventDefault();
        if (list.hidden) open(); else move(k === 'ArrowDown' ? 1 : -1);
      } else if ((k === 'Home' || k === 'End') && !list.hidden && !opts.search) {
        ev.preventDefault(); move(k === 'Home' ? 'home' : 'end');
      } else if (k === 'PageDown' || k === 'PageUp') {
        if (!list.hidden) { ev.preventDefault(); move(k === 'PageDown' ? 8 : -8); }
      } else if (k === 'Enter' || (k === ' ' && !opts.search)) {
        ev.preventDefault();
        if (list.hidden) open(); else if (active >= 0) choose(active);
      } else if (k === 'Escape') {
        if (!list.hidden) { ev.preventDefault(); ev.stopPropagation(); close(); }
      } else if (k === 'Tab') close();
    });
    if (opts.search) {
      field.addEventListener('input', function () { open(); filter(field.value); });
      field.addEventListener('focus', function () { open(); });
      field.addEventListener('click', function () { open(); });
    }
    document.addEventListener('mousedown', function (ev) { if (!box.contains(ev.target)) close(); });
    return { box: box, field: field };
  }

  /* « Sauter vers » : formulaire natif jumpbox déplacé, liste personnalisée à saisie (combo). Renvoie le formulaire. */
  function jumpBox(currentValue) {
    var el = uiEl, ico = uiIco;
    var jumpForm = document.querySelector('form[name="jumpbox"]');
    var jumpSelect = jumpForm && jumpForm.querySelector('select');
    if (!jumpForm || !jumpSelect || jumpForm.classList.contains('sg-jump')) return null;
    var keep = Array.prototype.slice.call(jumpForm.querySelectorAll('input[type="hidden"]'));
    while (jumpForm.firstChild) jumpForm.removeChild(jumpForm.firstChild);
    jumpForm.className = 'sg-jump';
    keep.forEach(function (h) { jumpForm.appendChild(h); });
    var jumpCombo = combo(jumpSelect, { search: true, tree: true, currentValue: currentValue });
    var jl = el('label', 'sg-jump__label');
    jl.setAttribute('for', jumpCombo.field.id);
    jl.appendChild(ico('alt_route'));
    jl.appendChild(el('span', null, 'Sauter vers'));
    jumpForm.appendChild(jl);
    jumpForm.appendChild(jumpCombo.box);
    return jumpForm;
  }

  /* --------------------------------------------------------------------
     Sujets : cartes à motif yagasuri (矢絣, empennes de flèches), grille de 2 colonnes.
     Pattern réservé aux SUJETS, partout où ils sont listés : pas d'image, le motif
     yagasuri en fond à la couleur de la catégorie. Statut en pastilles (annonce,
     épinglé, verrouillé, nouveau), titre, description, auteur, compteurs et dernier
     message. Au-dessus de la grille, « Poster un nouveau sujet » à gauche et le menu
     « Actions » à droite (nouveaux messages, sans réponse, marquer comme lus, suivi du forum,
     sujets suivis) ; dessous, « Trier » et « Sauter vers » (formulaires natifs déplacés, listes
     déroulantes personnalisées). Le bloc « Modérateurs » est remplacé par le séparateur de fin.
     -------------------------------------------------------------------- */
  function topics() {
    if (document.querySelector('.sg-topics')) return;
    if (!/^\/f\d+/.test(location.pathname)) return;
    var blocks = Array.prototype.slice.call(document.querySelectorAll('#wrap > .posts'));
    if (!blocks.length) return;

    var el = function (tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    };
    var ico = function (name) { var i = el('span', 'material-symbols-outlined', name); i.setAttribute('aria-hidden', 'true'); return i; };
    var num = function (node) { return node ? parseInt(node.textContent.replace(/[^\d]/g, ''), 10) || 0 : 0; };
    var plural = function (n, one, many) { return n + ' ' + (n > 1 ? many : one); };
    /* Pseudo coloré : on garde la couleur du groupe telle que Forumactif l'écrit */
    var person = function (a, cls) {
      var out = el('a', cls);
      out.href = a.getAttribute('href');
      var colored = a.querySelector('span[style]');
      var name = el('span', colored ? colored.className : '', a.textContent.trim());
      if (colored) name.setAttribute('style', colored.getAttribute('style'));
      out.appendChild(name);
      return out;
    };

    var section = el('section', 'sg-topics');
    var head = document.querySelector('.sg-pagehead');
    if (head) (head.className.match(/sg-tone-[a-z]+/) || []).forEach(function (c) { section.classList.add(c); });
    section.setAttribute('aria-label', 'Sujets');
    var grid = el('ul', 'sg-topics__grid');

    blocks.forEach(function (block) {
      Array.prototype.slice.call(block.querySelectorAll('.posts-section')).forEach(function (row) {
        var link = row.querySelector('.posts-description h3 a');
        if (!link) return;
        var icon = row.querySelector('.posts-icon');
        var cls = icon ? icon.className : '';
        var flags = [];
        if (/folder_global/.test(cls)) flags.push(['public', 'Annonce globale', 'announce']);
        else if (/folder_announce/.test(cls)) flags.push(['campaign', 'Annonce', 'announce']);
        if (/folder_sticky/.test(cls)) flags.push(['push_pin', 'Épinglé', 'sticky']);
        if (/locked/.test(cls)) flags.push(['lock', 'Verrouillé', 'locked']);
        var unread = /post_new|folder_new/.test(cls);

        var card = el('li', 'sg-topic' + (unread ? ' is-new' : '') + (flags.length ? ' is-' + flags[0][2] : ''));
        var top = el('div', 'sg-topic__flags');
        flags.forEach(function (f) {
          var chip = el('span', 'sg-topic__flag sg-topic__flag--' + f[2]);
          chip.appendChild(ico(f[0]));
          chip.appendChild(el('span', null, f[1]));
          top.appendChild(chip);
        });
        if (unread) top.appendChild(el('span', 'sg-topic__new', 'Nouveau'));
        if (top.children.length) card.appendChild(top);

        var title = el('h3', 'sg-topic__title');
        var a = el('a', 'sg-topic__link', link.textContent.trim());
        a.href = link.getAttribute('href');
        title.appendChild(a);
        card.appendChild(title);

        var desc = row.querySelector('.topic-description');
        if (desc && desc.textContent.trim()) card.appendChild(el('p', 'sg-topic__desc', desc.textContent.trim()));

        var author = row.querySelector('.posts-description p a[href^="/u"]');
        if (author) {
          var by = el('p', 'sg-topic__by');
          by.appendChild(document.createTextNode('par '));
          by.appendChild(person(author, 'sg-topic__author'));
          card.appendChild(by);
        }

        /* Pages du sujet, s'il en a plusieurs */
        var pages = Array.prototype.slice.call(row.querySelectorAll('.posts-description .pagination a, .posts-description a[href*="-p"]'))
          .filter(function (p) { return /^\d+$/.test(p.textContent.trim()); });
        if (pages.length) {
          var pl = el('p', 'sg-topic__pages');
          pl.appendChild(ico('auto_stories'));
          pages.forEach(function (p) {
            var pa = el('a', 'sg-topic__page', p.textContent.trim());
            pa.href = p.getAttribute('href');
            pl.appendChild(pa);
          });
          card.appendChild(pl);
        }

        var foot = el('div', 'sg-topic__foot');
        var stats = el('p', 'sg-topic__stats');
        var replies = num(row.querySelector('.posts-statistics-replies'));
        var views = num(row.querySelector('.posts-statistics-views'));
        stats.appendChild(ico('forum'));
        stats.appendChild(el('span', null, plural(replies, 'réponse', 'réponses')));
        stats.appendChild(ico('visibility'));
        stats.appendChild(el('span', null, plural(views, 'vue', 'vues')));
        foot.appendChild(stats);

        var last = row.querySelector('.posts-lastpost');
        var lastTime = last && last.querySelector('a.posts-lastpost-time');
        if (last && lastTime) {
          var lp = el('div', 'sg-topic__last');
          var avatarImg = last.querySelector('.avatar-default img');
          var av = el('span', 'sg-topic__avatar');
          if (avatarImg) {
            var im = el('img');
            im.src = avatarImg.getAttribute('src');
            im.alt = '';
            im.loading = 'lazy';
            av.appendChild(im);
          } else av.appendChild(ico('person'));
          lp.appendChild(av);
          var info = el('div', 'sg-topic__lastinfo');
          var lastAuthor = last.querySelector('.posts-lastpost-author a[href^="/u"]');
          if (lastAuthor) info.appendChild(person(lastAuthor, 'sg-topic__lastauthor'));
          var t = el('a', 'sg-topic__time', lastTime.textContent.replace(/access_time/, '').trim());
          t.href = lastTime.getAttribute('href');
          t.setAttribute('title', 'Voir le dernier message');
          info.appendChild(t);
          lp.appendChild(info);
          foot.appendChild(lp);
        }
        card.appendChild(foot);
        grid.appendChild(card);
      });
    });

    if (!grid.children.length) {
      var empty = el('p', 'sg-topics__empty');
      empty.appendChild(ico('forum'));
      empty.appendChild(el('span', null, 'Aucun sujet pour l’instant.'));
      section.appendChild(empty);
    } else section.appendChild(grid);

    /* Bouton « Poster un nouveau sujet » au-dessus de la grille, à gauche. Celui d'origine reste
       à droite du titre de la page (en-tête) : celui-ci reprend seulement son adresse */
    var post = document.querySelector('.sg-pagehead__actions a[href*="mode=newtopic"]') ||
      document.querySelector('#wrap a[href*="mode=newtopic"]');
    var bar = null;
    if (post) {
      bar = el('div', 'sg-topics__bar');
      var btn = el('a', 'sg-action');
      btn.href = post.getAttribute('href');
      btn.appendChild(ico('edit_square'));
      btn.appendChild(el('span', null, 'Poster un nouveau sujet'));
      bar.appendChild(btn);
    }

    /* Bouton « Actions » (trois points) à l'extrême droite : menu des recherches du forum et du suivi.
       On reprend les adresses des liens natifs (recherches limitées au forum en priorité). */
    var find = function (re) {
      return Array.prototype.slice.call(document.querySelectorAll('a[href]')).filter(function (x) {
        return !x.closest('.sg-menu') && re.test(x.getAttribute('href'));
      })[0];
    };
    var fid = (location.pathname.match(/^\/f(\d+)/) || [])[1];
    var search = function (id) {
      return find(new RegExp('search_id=' + id + '&search_where=f' + fid + '(?!\\d)')) || find(new RegExp('search_id=' + id + '(?![a-z])'));
    };
    var watch = find(/[?&](un)?watch=forum/);
    var watched = watch && /[?&]unwatch=forum/.test(watch.getAttribute('href'));
    var items = [
      [search('newposts'), 'new_releases', 'Nouveaux messages depuis ma dernière visite'],
      [search('unanswered'), 'mark_chat_unread', 'Messages sans réponse'],
      [find(/[?&]mark=topics/), 'mark_chat_read', 'Marquer tous les sujets comme lus'],
      null,
      [watch, watched ? 'notifications_off' : 'notifications_active', watched ? 'Ne plus suivre les sujets de ce forum' : 'Suivre les sujets de ce forum'],
      [search('watchsearch'), 'bookmarks', 'Mes sujets suivis']
    ].filter(function (it) { return it === null || it[0]; });
    while (items.length && items[0] === null) items.shift();
    while (items.length && items[items.length - 1] === null) items.pop();

    if (items.length) {
      bar = bar || el('div', 'sg-topics__bar');
      bar.appendChild(actionsMenu(items.map(function (it) { return it && [it[0].getAttribute('href'), it[1], it[2]]; }), 'sg-topics-menu'));
    }

    /* Deuxième ligne : « Trier » (le formulaire natif est déplacé dans une fenêtre) puis « Sauter vers »
       (le formulaire natif jumpbox est déplacé et restylé). La barre native sous les sujets
       (Surveiller, Marquer comme lus, Trier) est masquée par le CSS : ses liens sont dans « Actions ». */
    var tools = el('div', 'sg-topics__tools');
    var popover = function (wrapEl, toggleEl, panelEl, onOpen) {
      var close = function (refocus) {
        if (panelEl.hidden) return;
        panelEl.hidden = true;
        toggleEl.setAttribute('aria-expanded', 'false');
        wrapEl.classList.remove('is-open');
        if (refocus) toggleEl.focus();
      };
      toggleEl.addEventListener('click', function () {
        if (!panelEl.hidden) { close(false); return; }
        panelEl.hidden = false;
        toggleEl.setAttribute('aria-expanded', 'true');
        wrapEl.classList.add('is-open');
        if (onOpen) onOpen();
      });
      panelEl.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.preventDefault(); close(true); } });
      document.addEventListener('click', function (ev) { if (!wrapEl.contains(ev.target)) close(false); });
    };

    var sortForm = document.querySelector('#sort-box form');
    var sortSelect = sortForm && sortForm.querySelector('select[name="sort_method"]');
    if (sortForm && sortSelect) {
      var sortWrap = el('div', 'sg-sort');
      var sortBtn = el('button', 'sg-tool');
      sortBtn.type = 'button';
      sortBtn.setAttribute('aria-haspopup', 'dialog');
      sortBtn.setAttribute('aria-expanded', 'false');
      sortBtn.setAttribute('aria-controls', 'sg-sort-panel');
      sortBtn.appendChild(ico('sort'));
      sortBtn.appendChild(el('span', null, 'Trier'));
      sortBtn.appendChild(ico('expand_more'));
      var panel = el('div', 'sg-sort__panel');
      panel.id = 'sg-sort-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Trier les sujets');
      panel.hidden = true;

      var radios = Array.prototype.slice.call(sortForm.querySelectorAll('input[name="sort_order"]'));
      var submit = sortForm.querySelector('input[type="submit"]');
      var hidden = Array.prototype.slice.call(sortForm.querySelectorAll('input[type="hidden"]'));
      while (sortForm.firstChild) sortForm.removeChild(sortForm.firstChild);
      sortForm.className = 'sg-sort__form';
      hidden.forEach(function (h) { sortForm.appendChild(h); });

      var f1 = el('div', 'sg-field');
      var l1 = el('label', 'sg-field__label', 'Trier par');
      var sortCombo = combo(sortSelect);
      l1.setAttribute('for', sortCombo.field.id);
      f1.appendChild(l1);
      f1.appendChild(sortCombo.box);
      sortForm.appendChild(f1);

      if (radios.length) {
        /* <div role="group"> plutôt que <fieldset> : la <legend> échappe à l'espacement de la grille */
        var f2 = el('div', 'sg-field');
        f2.setAttribute('role', 'group');
        f2.setAttribute('aria-labelledby', 'sg-sort-order-label');
        var lg = el('span', 'sg-field__label', 'Ordre');
        lg.id = 'sg-sort-order-label';
        f2.appendChild(lg);
        var seg = el('div', 'sg-seg');
        radios.forEach(function (r) {
          var lab = el('label', 'sg-seg__opt');
          var up = r.value === '1';
          lab.appendChild(r);
          var face = el('span', 'sg-seg__face');
          face.appendChild(ico(up ? 'arrow_upward' : 'arrow_downward'));
          face.appendChild(el('span', null, up ? 'Croissant' : 'Décroissant'));
          lab.appendChild(face);
          seg.appendChild(lab);
        });
        f2.appendChild(seg);
        sortForm.appendChild(f2);
      }

      var go = el('button', 'sg-action sg-sort__submit');
      go.type = 'submit';
      if (submit && submit.name) { go.name = submit.name; go.value = submit.value; }
      go.appendChild(ico('check'));
      go.appendChild(el('span', null, 'Appliquer'));
      sortForm.appendChild(go);

      panel.appendChild(sortForm);
      sortWrap.appendChild(sortBtn);
      sortWrap.appendChild(panel);
      popover(sortWrap, sortBtn, panel);
      tools.appendChild(sortWrap);
    }

    var jumpForm = jumpBox(fid ? 'f' + fid : '');
    if (jumpForm) tools.appendChild(jumpForm);

    if (tools.children.length) {
      bar = bar || el('div', 'sg-topics__bar');
      bar.appendChild(tools);
    }

    if (bar) section.insertBefore(bar, section.firstChild);

    /* Bloc « Modérateurs » remplacé par le séparateur de fin (inversé, sans logo) */
    var mods = Array.prototype.slice.call(document.querySelectorAll('#wrap > .block')).filter(function (b) {
      return /Modérateurs/.test(b.textContent);
    })[0];
    if (mods && !document.querySelector('.sg-divider--topics')) {
      var div = el('div', 'sg-divider sg-divider--end sg-divider--topics');
      div.setAttribute('role', 'separator');
      var rule = el('span', 'sg-divider__rule');
      rule.setAttribute('aria-hidden', 'true');
      rule.appendChild(el('span', 'sg-divider__line'));
      rule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
      rule.appendChild(el('span', 'sg-divider__line'));
      div.appendChild(rule);
      mods.parentNode.insertBefore(div, mods);
      mods.style.display = 'none';
    }

    blocks[0].parentNode.insertBefore(section, blocks[0]);
    document.body.classList.add('sg-topics-on');
  }

  /* --------------------------------------------------------------------
     Page d'un sujet (/tN-…) : en-tête commun (pageHead), puis
       1. barre : menu « Actions » à droite (favoris, suivi du sujet, copier le lien) ;
       2. messages « fumi » (文, la lettre) : carte en deux colonnes, profil de l'auteur à gauche
          (portrait, pseudo et liseré à la couleur de son groupe, rang, fiche, contacts en icônes),
          lettre à droite (numéro du message, date, boutons, contenu, J'aime, signature) ;
       3. réponse rapide restylée (l'éditeur natif est conservé) ;
       4. séparateur de fin, « Sauter vers » et outils de modération, puis les permissions (perms).
     Les éléments natifs sont déplacés ou restylés, jamais recopiés (les scripts de Forumactif
     — citation, J'aime, éditeur — continuent de fonctionner).
     -------------------------------------------------------------------- */
  function topicPage() {
    if (!/^\/t\d+/.test(location.pathname)) return;
    var topic = document.getElementById('topic');
    if (!topic || topic.classList.contains('sg-topic-on')) return;
    var el = uiEl, ico = uiIco;
    var head = document.querySelector('.sg-pagehead');
    var tone = head && (head.className.match(/sg-tone-[a-z]+/) || [])[0];
    if (tone) topic.classList.add(tone);
    var find = function (re, scope) {
      return Array.prototype.slice.call((scope || document).querySelectorAll('a[href]')).filter(function (x) {
        return !x.closest('.sg-menu') && re.test(x.getAttribute('href'));
      })[0];
    };

    /* 1. Barre du sujet : menu « Actions » à droite */
    var bar = el('div', 'sg-tbar');
    var watch = find(/[?&](un)?watch=topic/, topic);
    var watched = watch && /unwatch=topic/.test(watch.getAttribute('href'));
    var items = [
      [find(/add_favourite/), 'bookmark_add', 'Ajouter à mes favoris'],
      [watch, watched ? 'notifications_off' : 'notifications_active', watched ? 'Ne plus suivre ce sujet' : 'Suivre ce sujet'],
      null,
      [function () { copyLink(location.origin + location.pathname); }, 'link', 'Copier le lien du sujet']
    ].filter(function (it) { return it === null || it[0]; }).map(function (it) {
      return it && [typeof it[0] === 'function' ? it[0] : it[0].getAttribute('href'), it[1], it[2]];
    });
    while (items.length && items[0] === null) items.shift();
    while (items.length && items[items.length - 1] === null) items.pop();
    for (var k = items.length - 1; k > 0; k--) if (items[k] === null && items[k - 1] === null) items.splice(k, 1);
    if (items.length) bar.appendChild(actionsMenu(items, 'sg-topic-menu'));
    var firstPost = topic.querySelector('.post-wrap');
    if (bar.children.length && firstPost) firstPost.parentNode.insertBefore(bar, firstPost);

    /* 2. Messages « fumi » */
    var offset = parseInt((location.pathname.match(/^\/t\d+p(\d+)-/) || [])[1] || '0', 10);
    var LABELS = { 'btn-quote': 'Citer', 'btn-edit': 'Modifier', 'btn-delete': 'Supprimer', 'btn-ip': 'Adresse IP', 'btn-report': 'Signaler' };
    var posts = Array.prototype.slice.call(topic.querySelectorAll('.post-wrap'));
    posts.forEach(function (post, i) {
      post.classList.add('sg-post');
      var hd = post.querySelector('.post-header');
      var permalink = hd && hd.querySelector('.post-heading-wrap a[href]');
      var date = hd && hd.querySelector('.post-date');
      if (hd) {
        var meta = el('div', 'sg-post__meta');
        var num = el('a', 'sg-post__num', '#' + (offset + i + 1));
        num.href = permalink ? permalink.getAttribute('href') : '#' + post.id;
        num.setAttribute('title', 'Lien vers ce message');
        meta.appendChild(num);
        if (date) {
          var d = el('span', 'sg-post__date');
          d.appendChild(ico('schedule'));
          d.appendChild(el('span', null, date.textContent.trim()));
          meta.appendChild(d);
        }
        hd.insertBefore(meta, hd.firstChild);
        Array.prototype.slice.call(hd.querySelectorAll('.post-buttons li')).forEach(function (li) {
          var a = li.querySelector('a');
          var label = LABELS[(li.className.match(/btn-[a-z]+/) || [])[0]];
          if (a && label) { a.setAttribute('title', label); a.setAttribute('aria-label', label); }
        });
      }

      var aside = post.querySelector('.post-aside');
      if (aside) {
        /* Contacts : icônes Material Symbols à la place des images de Forumactif */
        var links = Array.prototype.slice.call(aside.querySelectorAll('.post-author-contact a[href]'));
        if (links.length) {
          var contact = el('div', 'sg-post__contact');
          links.forEach(function (a) {
            var href = a.getAttribute('href') || '';
            var spec = /privmsg/.test(href) ? ['mail', 'Message privé'] : /mode=email/.test(href) ? ['alternate_email', 'E-mail']
              : /^\/u\d+/.test(href) ? ['person', 'Profil'] : /^https?:/.test(href) ? ['language', 'Site web'] : ['link', a.title || 'Lien'];
            var b = el('a', 'sg-post__contact-link');
            b.href = href;
            if (a.target) b.target = a.target;
            b.setAttribute('title', spec[1]);
            b.setAttribute('aria-label', spec[1]);
            b.appendChild(ico(spec[0]));
            contact.appendChild(b);
          });
          aside.appendChild(contact);
        }
      }
    });

    /* J'aime : un cœur (vide, plein quand le message est aimé : Forumactif passe le bouton de .fa_like à .fa_liked) ;
       « Je n'aime pas » est masqué par le CSS */
    Array.prototype.slice.call(topic.querySelectorAll('.sg-post .fa_like, .sg-post .fa_liked')).forEach(function (b) {
      var i = b.querySelector('.material-symbols-outlined');
      if (i) i.textContent = 'favorite';
      var label = b.querySelector(':scope > span:last-child');
      if (label && !label.classList.contains('rep-cat')) label.classList.add('sg-visually-hidden');
      b.setAttribute('title', 'J’aime');
      b.setAttribute('aria-label', 'J’aime');
    });

    /* Rôle au-dessus du portrait : Staffeux ou Modérateur (groupes du forum), sinon le rang Forumactif */
    postRoles(posts);

    /* Couleur de l'auteur (celle de son groupe, après les règles de 08-groups.css) : liseré et cadre du portrait */
    var paintAuthors = function () {
      posts.forEach(function (post) {
        var n = post.querySelector('.post-author-name [style*="color"]') || post.querySelector('.post-author-name a');
        if (n) post.style.setProperty('--author', getComputedStyle(n).color);
      });
    };
    paintAuthors();
    if (window.MutationObserver) {
      new MutationObserver(function () { requestAnimationFrame(paintAuthors); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    /* 3. Réponse rapide : un intitulé */
    var qr = topic.querySelector('.quick-reply');
    if (qr && !qr.querySelector('.sg-qr__title')) {
      var qt = el('h2', 'sg-qr__title');
      qt.appendChild(ico('history_edu'));
      qt.appendChild(el('span', null, 'Répondre'));
      qr.insertBefore(qt, qr.firstChild);
    }

    /* 4. Bas de page : séparateur de fin, « Sauter vers » et modération */
    var anchor = topic.querySelector('.topic-actions.bottom') || topic.querySelector('form[name="jumpbox"]');
    if (anchor) {
      var foot = el('div', 'sg-tfoot');
      var div = el('div', 'sg-divider sg-divider--end');
      div.setAttribute('role', 'separator');
      var rule = el('span', 'sg-divider__rule');
      rule.setAttribute('aria-hidden', 'true');
      rule.appendChild(el('span', 'sg-divider__line'));
      rule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
      rule.appendChild(el('span', 'sg-divider__line'));
      div.appendChild(rule);
      foot.appendChild(div);
      var row = el('div', 'sg-tfoot__row');
      var crumbsLinks = Array.prototype.slice.call(document.querySelectorAll('.sg-pagehead .sg-crumbs a[href^="/f"]'));
      var fidM = crumbsLinks.length ? (crumbsLinks[crumbsLinks.length - 1].getAttribute('href').match(/^\/f(\d+)/) || [])[1] : '';
      var jf = jumpBox(fidM ? 'f' + fidM : '');
      if (jf) row.appendChild(jf);
      var admin = topic.querySelector('.topic-admin');
      if (admin && admin.querySelector('a, button, input')) {
        var mod = el('div', 'sg-modtools');
        mod.setAttribute('role', 'group');
        mod.setAttribute('aria-label', 'Modération');
        var ml = el('span', 'sg-modtools__label');
        ml.appendChild(ico('gavel'));
        ml.appendChild(el('span', null, 'Modération'));
        mod.appendChild(ml);
        mod.appendChild(admin);
        row.appendChild(mod);
      }
      if (row.children.length) foot.appendChild(row);
      anchor.parentNode.insertBefore(foot, anchor);
    }

    topic.classList.add('sg-topic-on');
    document.body.classList.add('sg-topicpage-on');
  }

  /* Magatama du logo de Sengoku no Jidai (formes pleines) : marque du staff, comme dans les statistiques */
  var MAGATAMA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 21 56 56" fill="currentColor" aria-hidden="true">' +
    '<path d="M73.3 51.0Q72.5 50.3 70.6 49.4Q68.8 48.4 66.4 48.3Q64.1 48.2 61.9 49.1Q59.7 49.9 58.2 51.2Q56.7 52.6 55.6 54.4Q54.6 56.2 54.2 58.1Q53.9 60.0 54.2 61.6Q54.6 63.2 55.5 64.7Q56.4 66.3 57.4 67.5Q58.5 68.8 58.5 69.1Q58.6 69.5 57.3 71.1Q56.0 72.7 54.6 73.7Q53.2 74.7 53.3 75.1Q53.3 75.6 56.3 75.6Q59.3 75.7 62.4 74.8Q65.5 74.0 67.9 72.7Q70.3 71.3 72.0 69.6Q73.8 67.9 74.6 66.6Q75.3 65.4 75.9 64.0Q76.6 62.5 76.7 60.2Q76.9 57.8 76.7 56.8Q76.6 55.8 76.1 54.7Q75.6 53.6 74.8 52.6Q74.1 51.7 73.3 51.0Z"/>' +
    '<path d="M31.1 43.2Q30.8 43.1 30.4 43.4Q29.9 43.8 28.9 45.1Q27.9 46.4 26.5 49.3Q25.1 52.2 24.6 54.6Q24.1 57.0 24.3 60.0Q24.4 62.9 25.3 65.2Q26.1 67.4 27.0 68.7Q27.9 70.0 28.8 70.8Q29.7 71.7 30.7 72.3Q31.8 73.0 32.9 73.4Q34.0 73.8 36.3 73.8Q38.5 73.8 40.6 72.9Q42.6 72.0 43.8 71.0Q44.9 70.0 45.5 69.0Q46.2 68.1 46.7 67.0Q47.1 66.0 47.3 64.6Q47.5 63.2 47.3 61.0Q47.1 58.9 46.1 56.9Q45.1 54.9 43.5 53.6Q42.0 52.2 40.1 51.6Q38.2 51.0 35.4 50.9Q32.6 50.9 32.3 50.4Q32.0 50.0 31.7 48.5Q31.4 47.1 31.4 45.2Q31.4 43.3 31.1 43.2Z"/>' +
    '<path d="M37.2 30.3Q36.7 31.6 36.7 34.1Q36.7 36.6 37.5 38.4Q38.3 40.2 39.8 41.8Q41.4 43.4 43.6 44.4Q45.8 45.3 48.3 45.4Q50.9 45.4 52.5 44.8Q54.0 44.2 55.4 42.9Q56.8 41.6 58.0 39.3Q59.2 37.1 59.7 36.6Q60.3 36.0 61.9 36.4Q63.6 36.7 65.3 37.6Q67.0 38.5 67.2 38.5Q67.5 38.5 67.6 38.3Q67.7 38.1 66.7 35.8Q65.7 33.5 63.8 31.1Q61.9 28.7 59.8 27.0Q57.6 25.3 55.1 24.3Q52.7 23.3 51.3 23.2Q49.9 23.0 48.0 23.0Q46.1 23.1 44.1 23.8Q42.1 24.4 41.1 25.1Q40.2 25.8 39.4 26.6Q38.6 27.5 38.1 28.2Q37.6 29.0 37.2 30.3Z"/>' +
    '</svg>';

  /* Rôles du staff : membres des groupes Staffeux et Modérateurs (pages /groups puis /gN-…),
     gardés 15 minutes pour la session (sessionStorage « snj-roles » : { uid: 'staff' | 'mod' }) */
  function staffRoles(cb) {
    var KEY = 'snj-roles';
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < 15 * 60000) { cb(c.d); return; }
    } catch (e) {}
    var get = function (url) {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    };
    get('/groups').then(function (doc) {
      var seen = {};
      var groups = Array.prototype.slice.call(doc.querySelectorAll('a[href^="/g"]')).map(function (a) { return a.getAttribute('href'); })
        .filter(function (href) { var ok = /^\/g\d+-(staffeux|moderateurs)/.test(href) && !seen[href]; seen[href] = true; return ok; });
      return Promise.all(groups.map(function (href) {
        var role = /staffeux/.test(href) ? 'staff' : 'mod';
        return get(href).then(function (g) {
          return Array.prototype.slice.call(g.querySelectorAll('tr a[href]')).map(function (a) {
            var m = (a.getAttribute('href') || '').match(/^\/u(\d+)$/);
            return m ? [m[1], role] : null;
          }).filter(Boolean);
        }).catch(function () { return []; });
      }));
    }).then(function (lists) {
      var roles = {};
      lists.forEach(function (l) { l.forEach(function (p) { if (roles[p[0]] !== 'staff') roles[p[0]] = p[1]; }); });
      try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: roles })); } catch (e) {}
      cb(roles);
    }).catch(function () { cb({}); });
  }

  function postRoles(posts) {
    staffRoles(function (roles) {
      posts.forEach(function (post) {
        var aside = post.querySelector('.post-aside');
        if (!aside || aside.querySelector('.sg-role')) return;
        var a = post.querySelector('.post-author-name a[href]');
        var uid = a && ((a.getAttribute('href') || '').match(/^\/u(\d+)/) || [])[1];
        var role = uid && roles[uid];
        var rankEl = post.querySelector('.post-author-title');
        var rank = rankEl ? rankEl.textContent.replace(/\s+/g, ' ').trim() : '';
        var label = role === 'staff' ? 'Staffeux' : role === 'mod' ? 'Modérateur' : rank;
        if (!label) return;
        var band = uiEl('div', 'sg-role' + (role ? ' sg-role--staff' : ''));
        if (role) {
          var mark = uiEl('span', 'sg-role__mark');
          mark.innerHTML = MAGATAMA_SVG;
          band.appendChild(mark);
        }
        band.appendChild(uiEl('span', 'sg-role__label', label));
        aside.insertBefore(band, aside.firstChild);
      });
    });
  }

  /* Copie d'un lien dans le presse-papiers, avec un message discret en bas d'écran */
  function copyLink(text) {
    /* D'abord une copie synchrone (champ temporaire + execCommand), fiable pendant le clic et sans
       permission ; l'API Clipboard seulement en repli (elle peut rester en attente d'une permission). */
    var ta = uiEl('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    if (ok) { toast('Lien copié dans le presse-papiers'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('Lien copié dans le presse-papiers'); }, function () { toast('Copie impossible : ' + text); });
    } else toast('Copie impossible : ' + text);
  }

  function toast(message) {
    var t = document.querySelector('.sg-toast');
    if (!t) {
      t = uiEl('div', 'sg-toast');
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add('is-on');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }

  /* --------------------------------------------------------------------
     Permissions : laissez-passer « tegata » (手形, le sauf-conduit qu'on montrait
     aux barrières sous les shoguns). Pattern réservé aux PERMISSIONS, partout où
     Forumactif les affiche (bloc .block « Permission de ce forum ») : une étiquette
     aux coins coupés par droit, icône de l'action, libellé court, cachet « Autorisé »
     (Asagi) ou « Non autorisé » (cadenas, étiquette estompée au trait pointillé).
     Le lien « modérer ce forum » est repris : toute l'étiquette est cliquable.
     Dessous, le fil d'Ariane de l'en-tête est repris (copie du <nav> .sg-crumbs).
     -------------------------------------------------------------------- */
  function perms() {
    if (document.querySelector('.sg-perms')) return;
    var block = Array.prototype.slice.call(document.querySelectorAll('#wrap .block')).filter(function (b) {
      var head = b.querySelector('.block-header');
      return head && /Permission/i.test(head.textContent);
    })[0];
    var content = block && block.querySelector('.block-content');
    if (!content) return;

    var el = function (tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    };
    var ico = function (name) { var i = el('span', 'material-symbols-outlined', name); i.setAttribute('aria-hidden', 'true'); return i; };
    /* Libellés courts et icônes des droits connus ; sinon la phrase de Forumactif, raccourcie */
    var KNOWN = [
      [/nouveaux sujets/i, 'edit_square', 'Créer des sujets'],
      [/répondre/i, 'reply', 'Répondre aux sujets'],
      [/modérer/i, 'gavel', 'Modérer ce forum'],
      [/éditer|modifier/i, 'edit', 'Modifier ses messages'],
      [/supprimer/i, 'delete', 'Supprimer ses messages'],
      [/voter|sondage/i, 'how_to_vote', 'Voter aux sondages'],
      [/fichier|joindre|pièce/i, 'attach_file', 'Joindre des fichiers'],
      [/événement|calendrier/i, 'event', 'Ajouter des événements']
    ];

    /* Une ligne par droit : le contenu est découpé sur les <br> */
    var lines = content.innerHTML.split(/<br\s*\/?>/i).map(function (html) {
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var text = tmp.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return null;
      var no = /ne\s+pouvez\s+pas/i.test(text);
      var link = tmp.querySelector('a[href]');
      var known = KNOWN.filter(function (k) { return k[0].test(text); })[0];
      var label = known ? known[2] : (function (t) {
        t = t.replace(/^vous\s+(ne\s+)?pouvez(\s+pas)?\s+/i, '').replace(/\s+dans ce forum\.?$/i, '');
        return t.charAt(0).toUpperCase() + t.slice(1);
      })(text);
      return { yes: !no, icon: known ? known[1] : 'task_alt', label: label, href: !no && link ? link.getAttribute('href') : '', full: text };
    }).filter(Boolean);
    if (!lines.length) return;

    var section = el('section', 'sg-perms');
    var head = document.querySelector('.sg-pagehead');
    if (head) (head.className.match(/sg-tone-[a-z]+/) || []).forEach(function (c) { section.classList.add(c); });
    var title = el('h2', 'sg-perms__title');
    title.id = 'sg-perms-title';
    title.appendChild(ico('verified_user'));
    title.appendChild(el('span', null, 'Droits dans ce forum'));
    section.setAttribute('aria-labelledby', title.id);
    section.appendChild(title);

    var list = el('ul', 'sg-perms__list');
    lines.forEach(function (p) {
      var li = el('li', 'sg-pass' + (p.yes ? ' is-yes' : ' is-no'));
      var card = el(p.href ? 'a' : 'div', 'sg-pass__card');
      if (p.href) card.href = p.href;
      card.setAttribute('title', p.full);
      var icon = el('span', 'sg-pass__icon');
      icon.appendChild(ico(p.icon));
      card.appendChild(icon);
      var body = el('span', 'sg-pass__body');
      body.appendChild(el('span', 'sg-pass__label', p.label));
      var seal = el('span', 'sg-pass__seal');
      seal.appendChild(ico(p.yes ? 'check' : 'lock'));
      seal.appendChild(el('span', null, p.yes ? 'Autorisé' : 'Non autorisé'));
      body.appendChild(seal);
      card.appendChild(body);
      if (p.href) card.appendChild(ico('arrow_forward'));
      li.appendChild(card);
      list.appendChild(li);
    });
    section.appendChild(list);

    /* Fil d'Ariane repris en bas de page */
    var crumbs = document.querySelector('.sg-pagehead .sg-crumbs');
    if (crumbs) {
      var copy = crumbs.cloneNode(true);
      copy.classList.add('sg-crumbs--end');
      copy.setAttribute('aria-label', 'Fil d’Ariane (bas de page)');
      section.appendChild(copy);
    }

    block.parentNode.insertBefore(section, block);
    block.style.display = 'none';
    document.body.classList.add('sg-perms-on');
  }

  /* --------------------------------------------------------------------
     Pied de page : liens de Forumactif centrés (sans Accueil ni Panneau
     d'administration), puis « Sengoku no Jidai » au trait sur toute la largeur.
     Les liens d'origine sont déplacés, pas copiés (le lien Cookies garde son action).
     Les statistiques natives du pied de page (doublon de stats.js) sont masquées par le CSS.
     -------------------------------------------------------------------- */
  function footer() {
    var pf = document.getElementById('page-footer');
    if (!pf || pf.querySelector('.sg-footer')) return;

    var list = document.createElement('ul');
    list.className = 'sg-footer__links';
    Array.prototype.slice.call(pf.querySelectorAll('a[href]')).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var li = a.closest('li');
      if (href === '#top' || /^\/admin\//.test(href) || (li && li.classList.contains('footer-home'))) return;
      if (/\/phpbb$/.test(href)) a.textContent = '© phpBB';
      a.className = 'sg-footer__link';
      var item = document.createElement('li');
      item.appendChild(a);
      list.appendChild(item);
    });

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'sg-footer__wordmark');
    svg.setAttribute('viewBox', '0 0 1000 140');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    var text = document.createElementNS(ns, 'text');
    text.setAttribute('x', '0');
    text.setAttribute('y', '100');
    text.textContent = 'Sengoku no Jidai';
    svg.appendChild(text);

    var box = document.createElement('div');
    box.className = 'sg-footer';
    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Liens du forum');
    nav.appendChild(list);
    box.appendChild(nav);
    box.appendChild(svg);
    pf.appendChild(box);
    document.body.classList.add('sg-footer-on');

    /* Le mot occupe toute la largeur : cadre ajusté au texte une fois la police chargée */
    var fit = function () {
      try {
        var b = text.getBBox();
        if (b.width) svg.setAttribute('viewBox', [b.x - 2, b.y - 2, b.width + 4, b.height + 4].join(' '));
      } catch (e) {}
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
