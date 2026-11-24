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
    if (!/^\/f\d+/.test(location.pathname)) return;
    var native = document.querySelector('#wrap .page-header');
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
        if (i === links.length - 1) a.setAttribute('aria-current', 'page');
        li.appendChild(a);
        ol.appendChild(li);
      });
      nav.appendChild(ol);
      head.appendChild(nav);
    }

    /* Titre et boutons d'action */
    var row = el('div', 'sg-pagehead__row');
    var title = el('h1', 'sg-pagehead__title');
    title.textContent = h1.textContent.trim();
    row.appendChild(title);
    var actions = el('div', 'sg-pagehead__actions');
    Array.prototype.slice.call(native.querySelectorAll(':scope > a.btn')).forEach(function (b) {
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
