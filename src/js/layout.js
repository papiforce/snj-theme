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
     Pages de confirmation sans redirection forcée : après un envoi (message posté, modifié, profil enregistré…),
     Forumactif affiche une confirmation qui renvoie d'office ailleurs au bout de quelques secondes (balise
     <meta http-equiv="refresh" content="3;url=…"> posée par {META} dans overall_header). La page reste affichée :
     la redirection programmée est annulée une fois la page chargée (window.stop() annule une redirection en
     attente ; appelé après le chargement, il n'interrompt plus rien d'autre). Les liens de la confirmation
     (« Cliquez ici pour… ») restent là pour continuer.
     ---------------------------------------------------------------------- */
  (function noForcedRedirect() {
    var cancel = function () {
      var meta = document.querySelector('meta[http-equiv="refresh" i]');
      if (!meta || !/url\s*=/i.test(meta.getAttribute('content') || '')) return;
      try { window.stop(); } catch (e) {}
      meta.parentNode.removeChild(meta);
    };
    if (document.readyState === 'complete') setTimeout(cancel, 0);
    else window.addEventListener('load', function () { setTimeout(cancel, 0); });
  })();

  /* ----------------------------------------------------------------------
     CONFIGURATION — liens de navigation (modifiable sans toucher au reste)
     icon : nom d'une icône Material Symbols (https://fonts.google.com/icons)
     svg  : clé de l'objet SVG ci-dessous (logos de marque uniquement)
     hideOnMobile : masqué dans la barre du bas sur mobile
     guestHideOnMobile : masqué dans la barre du bas sur mobile pour les visiteurs seulement
     ---------------------------------------------------------------------- */
  var NAV = [
    { label: 'Accueil', icon: 'home', href: '/' },
    { label: 'Membres', icon: 'group', href: '/memberlist', hideOnMobile: true },
    { label: 'Discord', svg: 'discord', href: 'https://discord.com/invite/bnK7vyGjXV', external: true },
    { label: 'Annexe', icon: 'menu_book', href: 'https://snj-base-de-donnees.vercel.app/', external: true },
    { label: 'Carte', icon: 'map', href: '/t16-iii-carte', guestHideOnMobile: true }
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
     Préférences d'affichage des sujets (menu « Préférences » de la page d'un sujet)
     Gardées comme le thème : localStorage + cookie de secours, réappliquées à chaque
     affichage (retour arrière compris) et d'un onglet à l'autre. Attributs sur <html> :
     data-profile="right" (profil à droite du message), data-density="compact".
     ---------------------------------------------------------------------- */
  var PREFS = {
    profile: { key: 'snj-profile', on: 'right', attr: 'data-profile' },
    density: { key: 'snj-density', on: 'compact', attr: 'data-density' }
  };

  function prefOn(name) {
    var p = PREFS[name], v = null;
    try { v = localStorage.getItem(p.key); } catch (e) {}
    if (v === null) {
      var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + p.key + '=([a-z]+)'));
      v = m ? m[1] : null;
    }
    return v === p.on;
  }

  function applyPref(name, on) {
    var p = PREFS[name];
    if (on) root.setAttribute(p.attr, p.on); else root.removeAttribute(p.attr);
  }

  function setPref(name, on) {
    var p = PREFS[name], v = on ? p.on : 'default';
    try { localStorage.setItem(p.key, v); } catch (e) {}
    document.cookie = p.key + '=' + v + '; path=/; max-age=31536000; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
    applyPref(name, on);
  }

  function syncPrefs() {
    Object.keys(PREFS).forEach(function (n) { applyPref(n, prefOn(n)); });
  }

  syncPrefs();
  window.addEventListener('pageshow', syncPrefs);
  window.addEventListener('storage', function (e) {
    if (!e.key || /^snj-(profile|density)$/.test(e.key)) {
      syncPrefs();
      Array.prototype.slice.call(document.querySelectorAll('.sg-menu__item[data-pref]')).forEach(function (it) {
        if (it._sgSync) it._sgSync();
      });
    }
  });

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

  /* Menu du compte, sur l'avatar : pseudo, profil, paramètres du profil, panneau d'administration
     (admins), déconnexion. L'avatar devient un bouton qui ouvre et ferme le menu au clic (Entrée et
     Espace au clavier) ; Échap, un clic à côté ou le focus qui sort le ferment. */
  function accountMenu(brand, ud) {
    var wrap = document.createElement('div');
    wrap.className = 'sg-sb-account';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = brand.className;
    btn.setAttribute('aria-label', 'Mon compte');
    btn.setAttribute('data-label', 'Mon compte');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'sg-account-menu');
    while (brand.firstChild) btn.appendChild(brand.firstChild);
    wrap.appendChild(btn);

    var panel = document.createElement('div');
    panel.className = 'sg-sb-menu';
    panel.id = 'sg-account-menu';
    panel.hidden = true;
    var name = document.createElement('p');
    name.className = 'sg-sb-menu__name';
    name.textContent = ud.username || 'Mon compte';
    name.title = ud.username || '';
    panel.appendChild(name);

    var list = document.createElement('ul');
    list.className = 'sg-sb-menu__list';
    list.setAttribute('aria-label', 'Mon compte');
    var add = function (href, ic, label, cls) {
      if (!href) return;
      var li = document.createElement('li');
      if (cls) li.className = cls;
      var a = document.createElement('a');
      a.className = 'sg-sb-menu__item';
      a.href = href;
      a.appendChild(icon(ic));
      var t = document.createElement('span');
      t.textContent = label;
      a.appendChild(t);
      li.appendChild(a);
      list.appendChild(li);
    };
    add('/u' + ud.user_id, 'person', 'Mon profil');
    add('/profile?mode=editprofile&page_profil=informations', 'manage_accounts', 'Paramètres du profil');
    add(nativeLink('dashboard'), 'dashboard', "Panneau d'administration");
    add(nativeLink('power_settings_new'), 'logout', 'Déconnexion', 'sg-sb-menu__logout');
    panel.appendChild(list);
    wrap.appendChild(panel);

    var setOpen = function (on) {
      panel.hidden = !on;
      wrap.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { setOpen(panel.hidden); });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) setOpen(false); });
    wrap.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !wrap.contains(e.relatedTarget)) setOpen(false);
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); setOpen(false); btn.focus(); }
    });
    return wrap;
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
    if (logged) bar.appendChild(accountMenu(brand, ud));
    else bar.appendChild(brand);

    /* Navigation */
    var nav = document.createElement('nav');
    nav.className = 'sg-sb-group';
    nav.setAttribute('aria-label', 'Forum');
    NAV.forEach(function (l) {
      var el = item(l);
      if (!logged && l.guestHideOnMobile) el.className += ' sg-sb-hide-mobile';
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

      /* Panneau d'administration et déconnexion : dans le menu de l'avatar (accountMenu) */
    } else {
      bottom.appendChild(item({ label: 'Connexion', icon: 'login', href: '/login' }));
      /* Visiteurs sur mobile : ni Carte ni Inscription dans la barre du bas */
      bottom.appendChild(item({ label: 'Inscription', icon: 'person_add', href: '/register', hideOnMobile: true }));
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
    writePage();
    noticePage();
    errorBlocks();
    pollCards();
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
      /* Couleur du titre choisie à l'écriture (code natif de Forumactif → token de la refonte) */
      var tone = titleToneOf(h1);
      if (tone) title.classList.add('sg-tcolor--' + tone);
    }
    row.appendChild(title);
    var actions = el('div', 'sg-pagehead__actions');
    Array.prototype.slice.call(native.querySelectorAll(':scope > a.btn')).forEach(function (b) {
      if (isTopic && /mode=newtopic/.test(b.getAttribute('href') || '')) return;
      /* « Sujet verrouillé » : Forumactif en fait un lien vers la réponse, mais ce n'est qu'un état. Il devient
         une étiquette sans interaction ; son adresse reste lisible (data-reply-href) pour le bouton du bas */
      var ic = b.querySelector('.material-symbols-outlined');
      if ((ic && ic.textContent.trim() === 'lock') || /verrouill/i.test(b.textContent)) {
        var st = el('span', 'sg-action sg-action--status');
        if (b.getAttribute('href')) st.setAttribute('data-reply-href', b.getAttribute('href'));
        if (b.getAttribute('title')) st.setAttribute('title', b.getAttribute('title'));
        if (b.getAttribute('style')) st.setAttribute('style', b.getAttribute('style'));
        while (b.firstChild) st.appendChild(b.firstChild);
        b.remove();
        actions.appendChild(st);
        return;
      }
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

  /* Menu déroulant (« Actions », « Préférences », actions d'un message).
     items = [adresse ou fonction, icône, libellé] ; null = séparateur ;
     { pref: 'profile' | 'density', icon, label: function (actif) } = interrupteur (menuitemcheckbox), qui
     enregistre la préférence et laisse le menu ouvert.
     opts : { label: 'Actions', icon: 'more_vert', iconFirst: false, iconOnly: false, cls: '', lead: '' (icône avant le
     libellé, en plus de icon après : allure de liste déroulante), toggleCls: '' (classe en plus sur le bouton) }.
     Une entrée [adresse, icône, libellé, 'danger'] est marquée comme destructive (.sg-menu__item--danger).
     Utilisé sur les pages de forum (topics) et de sujet (topicPage). */
  function actionsMenu(items, menuId, opts) {
    var el = uiEl, ico = uiIco;
    opts = opts || {};
    var wrapM = el('div', 'sg-menu' + (opts.cls ? ' ' + opts.cls : ''));
    var toggle = el('button', 'sg-menu__toggle' + (opts.toggleCls ? ' ' + opts.toggleCls : ''));
    toggle.type = 'button';
    toggle.setAttribute('aria-haspopup', 'menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', menuId);
    var tLabel = opts.label || 'Actions', tIcon = ico(opts.icon || 'more_vert');
    if (opts.iconOnly) {
      toggle.setAttribute('aria-label', tLabel);
      toggle.setAttribute('title', tLabel);
      toggle.appendChild(tIcon);
    } else if (opts.lead) {
      toggle.appendChild(ico(opts.lead));
      toggle.appendChild(el('span', null, tLabel));
      toggle.appendChild(tIcon);
    } else if (opts.iconFirst) {
      toggle.appendChild(tIcon);
      toggle.appendChild(el('span', null, tLabel));
    } else {
      toggle.appendChild(el('span', null, tLabel));
      toggle.appendChild(tIcon);
    }
    var menu = el('ul', 'sg-menu__list');
    menu.id = menuId;
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', tLabel);
    menu.hidden = true;
    items.forEach(function (it) {
      if (it === null) { var sep = el('li', 'sg-menu__sep'); sep.setAttribute('role', 'separator'); menu.appendChild(sep); return; }
      var li = el('li');
      li.setAttribute('role', 'none');
      var item = el('a', 'sg-menu__item');
      if (it.pref) {
        /* Interrupteur : libellé qui suit l'état, switch à droite */
        var name = it.pref;
        item.href = '#';
        item.classList.add('sg-menu__item--switch');
        item.setAttribute('role', 'menuitemcheckbox');
        item.setAttribute('data-pref', name);
        item.tabIndex = -1;
        item.appendChild(ico(it.icon));
        var txt = el('span', 'sg-menu__text');
        item.appendChild(txt);
        var sw = el('span', 'sg-switch');
        sw.setAttribute('aria-hidden', 'true');
        sw.appendChild(el('span', 'sg-switch__thumb'));
        item.appendChild(sw);
        var sync = function () {
          var on = prefOn(name);
          item.setAttribute('aria-checked', on ? 'true' : 'false');
          txt.textContent = it.label(on);
        };
        item._sgSync = sync;
        sync();
        item.addEventListener('click', function (ev) {
          ev.preventDefault();
          setPref(name, !prefOn(name));
          sync();
          if (it.onChange) it.onChange(prefOn(name));
        });
        item.addEventListener('keydown', function (ev) {
          if (ev.key === ' ') { ev.preventDefault(); item.click(); }
        });
        li.appendChild(item);
        menu.appendChild(li);
        return;
      }
      if (typeof it[0] === 'function') {
        var run = it[0];
        item.href = '#';
        item.addEventListener('click', function (ev) { ev.preventDefault(); close(false); run(); });
      } else item.href = it[0];
      item.setAttribute('role', 'menuitem');
      if (it[3] === 'danger') item.classList.add('sg-menu__item--danger');
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
    /* Retour arrière : la page restaurée par le navigateur ne doit pas montrer un menu resté ouvert */
    window.addEventListener('pageshow', function (ev) { if (ev.persisted) close(false); });
    return wrapM;
  }

  /* Liste déroulante personnalisée (remplace l'affichage natif d'un <select>, qui reste dans le
     formulaire, masqué, et reçoit la valeur choisie suivie d'un événement « change »).
     options : { search: true } → champ de saisie qui filtre la liste (motif combobox ARIA) ;
     { tree: true } → options de la jumpbox : séparateurs « | » purgés, profondeur lue dans les « | » ;
     { swatch: function (valeur) { return couleur CSS | '' } } → pastille de couleur devant chaque entrée et dans le bouton. */
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
    var swatchOf = function (v) {
      var sw = el('span', 'sg-combo__swatch');
      sw.setAttribute('aria-hidden', 'true');
      var c = opts.swatch(v);
      if (c) sw.style.background = c; else sw.classList.add('is-none');
      return sw;
    };

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
      if (opts.swatch) field.appendChild(swatchOf(current));
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
      if (opts.swatch) li.appendChild(swatchOf(d.value));
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
      if (opts.swatch) { var old = field.querySelector('.sg-combo__swatch'); if (old) field.replaceChild(swatchOf(current), old); }
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
  /* Carte de sujet (motif yagasuri) construite depuis une ligne native de la liste des sujets
     (.posts-section) : pages de forum et « Sujets similaires » de la page d'un sujet */
  function topicCard(row) {
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

    var link = row.querySelector('.posts-description h3 a');
    if (!link) return null;
    var icon = row.querySelector('.posts-icon');
    var cls = icon ? icon.className : '';
    var flags = [];
    if (/folder_global/.test(cls)) flags.push(['public', 'Annonce globale', 'announce']);
    else if (/folder_announce/.test(cls)) flags.push(['campaign', 'Annonce', 'announce']);
    if (/folder_sticky/.test(cls)) flags.push(['push_pin', 'Épinglé', 'sticky']);
    /* Une annonce ou une note verrouillée garde sa classe de type (folder_announce…) :
       le verrou ne se lit alors que dans l'infobulle de l'icône */
    var locked = /locked/.test(cls) || /verrouill/i.test(icon ? icon.getAttribute('title') || '' : '');
    if (locked) flags.push(['lock', 'Verrouillé', 'locked']);
    var unread = /post_new|folder_new/.test(cls);

    var card = el('li', 'sg-topic' + (unread ? ' is-new' : '') + (flags.length ? ' is-' + flags[0][2] : '') +
      (locked && flags[0][2] !== 'locked' ? ' is-locked' : ''));
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
    var tone = titleToneOf(link);
    if (tone) title.classList.add('sg-tcolor--' + tone);
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
    return card;
  }

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
        var card = topicCard(row);
        if (card) grid.appendChild(card);
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
    /* Forum sans sous-forum : la barre est juste sous le titre, le bouton de l'en-tête ferait doublon */
    var hasSubs = document.querySelector('.sg-subforums') ||
      document.querySelector('#wrap > .forum.type-table-forum .forum-section');
    if (bar && !hasSubs) {
      var headBtn = document.querySelector('.sg-pagehead__actions a[href*="mode=newtopic"]');
      if (headBtn) {
        var acts = headBtn.parentNode;
        headBtn.remove();
        if (!acts.children.length) acts.remove();
      }
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
  /* --------------------------------------------------------------------
     Sujets similaires (page d'un sujet) : sous « Répondre au sujet », en cartes de
     sujet (yagasuri), grille de 2 colonnes, sans repli. Forumactif ne donne que les
     titres : chaque carte est lue dans la liste de son forum (page du sujet → forum,
     première page), cache de session « snj-similar » de 5 min. Faute de mieux, la
     carte garde le titre seul.
     -------------------------------------------------------------------- */
  function similarTopics(topic, after) {
    if (topic.querySelector('.sg-similar')) return;
    var open = document.getElementById('ptrafic_open');
    var closed = document.getElementById('ptrafic_close');
    var links = open ? Array.prototype.slice.call(open.querySelectorAll('.block-content a[href^="/t"]')) : [];
    if (!links.length) return;

    var head = document.querySelector('.sg-pagehead');
    var section = uiEl('section', 'sg-topics sg-similar');
    if (head) (head.className.match(/sg-tone-[a-z]+/) || []).forEach(function (c) { section.classList.add(c); });
    section.setAttribute('aria-label', 'Sujets similaires');
    var title = uiEl('h2', 'sg-similar__title');
    title.appendChild(uiIco('library_books'));
    title.appendChild(uiEl('span', null, 'Sujets similaires'));
    section.appendChild(title);
    var grid = uiEl('ul', 'sg-topics__grid');
    section.appendChild(grid);

    var KEY = 'snj-similar';
    var TTL = 5 * 60 * 1000;
    var cache = {};
    try { cache = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) {}
    var save = function () { try { sessionStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} };
    var parse = function (html) { return new DOMParser().parseFromString(html, 'text/html'); };
    var get = function (url) {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; });
    };
    var forums = {};
    var forumPage = function (url) { return forums[url] || (forums[url] = get(url).then(parse)); };

    var fill = function (li, rowHtml, tone) {
      var row = parse('<div>' + rowHtml + '</div>').querySelector('.posts-section');
      var card = row && topicCard(row);
      if (!card) return;
      if (tone) card.classList.add('sg-tone-' + tone);
      li.parentNode.replaceChild(card, li);
    };

    links.forEach(function (a) {
      var href = a.getAttribute('href');
      var tid = (href.match(/^\/t(\d+)/) || [])[1];
      /* Carte provisoire : le titre seul, remplacée dès que les détails arrivent */
      var li = uiEl('li', 'sg-topic is-light');
      var h = uiEl('h3', 'sg-topic__title');
      var ta = uiEl('a', 'sg-topic__link', a.textContent.trim());
      ta.href = href;
      h.appendChild(ta);
      li.appendChild(h);
      grid.appendChild(li);
      if (!tid) return;

      var hit = cache[tid];
      if (hit && Date.now() - hit.t < TTL) {
        if (hit.h) fill(li, hit.h, hit.tone);
        return;
      }
      get(href).then(function (html) {
        var doc = parse(html);
        var crumbs = Array.prototype.slice.call(doc.querySelectorAll('#breadcrumbs a'));
        var meta = crumbs[1] ? CATEGORIES[crumbs[1].textContent.trim()] : null;
        var tone = meta ? meta.tone : '';
        var fl = crumbs.filter(function (c) { return /^\/f\d+/.test(c.getAttribute('href') || ''); });
        if (!fl.length) throw 0;
        return forumPage(fl[fl.length - 1].getAttribute('href')).then(function (fdoc) {
          var link = fdoc.querySelector('.posts-description h3 a[href^="/t' + tid + '-"]');
          var row = link && link.closest('.posts-section');
          cache[tid] = { t: Date.now(), h: row ? row.outerHTML : '', tone: tone };
          save();
          if (row) fill(li, row.outerHTML, tone);
        });
      }).catch(function () {});
    });

    if (open) open.classList.add('sg-hidden');
    if (closed) closed.classList.add('sg-hidden');
    after.parentNode.insertBefore(section, after.nextSibling);
    document.body.classList.add('sg-similar-on');
  }

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
    /* « Préférences » à l'extrême gauche : position du profil et densité, mémorisées comme le thème */
    bar.insertBefore(actionsMenu([
      { pref: 'profile', icon: 'swap_horiz', label: function (on) { return 'Position du profil (' + (on ? 'inversé' : 'défaut') + ')'; } },
      { pref: 'density', icon: 'density_medium', label: function (on) { return 'Densité (' + (on ? 'compact' : 'défaut') + ')'; } }
    ], 'sg-prefs-menu', { label: 'Préférences', icon: 'tune', iconFirst: true, cls: 'sg-menu--start' }), bar.firstChild);
    var firstPost = topic.querySelector('.post-wrap');
    if (firstPost) firstPost.parentNode.insertBefore(bar, firstPost);

    /* 2. Messages « fumi » */
    var BTN = {
      'btn-quote': ['format_quote', 'Citer ce message'],
      'btn-edit': ['edit', 'Modifier le message'],
      'btn-delete': ['delete', 'Supprimer le message'],
      'btn-ip': ['lan', 'Voir l’adresse IP'],
      'btn-report': ['flag', 'Signaler le message']
    };
    var posts = Array.prototype.slice.call(topic.querySelectorAll('.post-wrap'));
    posts.forEach(function (post) {
      post.classList.add('sg-post');
      var hd = post.querySelector('.post-header');
      var body = post.querySelector('.post');
      var content = post.querySelector('.post-content');
      var aside = post.querySelector('.post-aside');

      /* La lettre (en-tête + contenu) devient une carte séparée du profil */
      if (hd && body) {
        var letter = el('div', 'sg-post__letter');
        body.parentNode.insertBefore(letter, body);
        letter.appendChild(hd);
        letter.appendChild(body);
      }

      if (hd) {
        var permalink = hd.querySelector('.post-heading-wrap a[href]');
        var date = hd.querySelector('.post-date');
        var meta = el('div', 'sg-post__meta');
        if (date) {
          var d = el('span', 'sg-post__date');
          d.setAttribute('title', 'Publié');
          d.appendChild(ico('schedule'));
          d.appendChild(el('span', null, date.textContent.trim()));
          meta.appendChild(d);
        }
        /* Dernière modification : mention native « Dernière édition par X le …, édité N fois », retirée du contenu */
        var edited = content && editedInfo(content);
        if (edited) {
          var e = el('span', 'sg-post__date sg-post__date--edit');
          e.setAttribute('title', edited.full);
          e.appendChild(ico('edit_note'));
          e.appendChild(el('span', null, 'Modifié ' + edited.date));
          meta.appendChild(e);
          /* La mention complète, en petit, toujours au bas du message (juste sous le contenu) */
          var note = el('p', 'sg-post__edited');
          note.appendChild(edited.node);
          content.parentNode.insertBefore(note, content.nextSibling);
        }
        hd.insertBefore(meta, hd.firstChild);

        /* À droite : J'aime (cœur) puis le menu des actions du message (trois points) */
        var acts = el('div', 'sg-post__actions');
        var like = post.querySelector('.fa_like_div');
        if (like) acts.appendChild(like);
        var mItems = [];
        Array.prototype.slice.call(hd.querySelectorAll('.post-buttons li')).forEach(function (li) {
          var a = li.querySelector('a[href]');
          var spec = BTN[(li.className.match(/btn-[a-z]+/) || [])[0]];
          if (!a || !spec) return;
          var href = a.getAttribute('href');
          /* Supprimer : confirmation dans une fenêtre sur la page plutôt que sur la page native */
          if (/btn-delete/.test(li.className)) mItems.push([function () { deletePost(href, post); }, spec[0], spec[1], 'danger']);
          else mItems.push([href, spec[0], spec[1]]);
        });
        var link = location.origin + location.pathname + '#' + (permalink ? (permalink.getAttribute('href').split('#')[1] || post.id) : post.id);
        if (mItems.length) mItems.push(null);
        mItems.push([function () { copyLink(link); }, 'link', 'Copier le lien du message']);
        acts.appendChild(actionsMenu(mItems, 'sg-post-menu-' + (post.id || Math.random().toString(36).slice(2)),
          { label: 'Actions du message', icon: 'more_vert', iconOnly: true, cls: 'sg-menu--icon' }));
        hd.appendChild(acts);
      }

      var foot = post.querySelector('.post-footer');
      if (foot && !foot.children.length) foot.classList.add('sg-hidden');

      if (aside) {
        /* Pseudo sans l'infobulle de profil de Forumactif (tooltipster) */
        var nameLink = aside.querySelector('.post-author-name a');
        if (nameLink) {
          try { if (window.jQuery && jQuery.fn.tooltipster && nameLink.classList.contains('tooltipstered')) jQuery(nameLink).tooltipster('destroy'); } catch (err) {}
          var clean = nameLink.cloneNode(true);
          clean.classList.remove('tooltipstered');
          clean.removeAttribute('title');
          nameLink.parentNode.replaceChild(clean, nameLink);
        }

        /* Carte du profil : portrait, pseudo, « Inscrit depuis » et localisation ; le rôle reste au-dessus, hors carte */
        var card = el('div', 'sg-post__card');
        var av = aside.querySelector('.post-author-avatar');
        var author = aside.querySelector('.post-author');
        if (av) card.appendChild(av);
        if (author) card.appendChild(author);
        var facts = authorFacts(aside.querySelector('.post-author-details'));
        if (facts) {
          var rule = el('hr', 'sg-post__rule');
          rule.setAttribute('aria-hidden', 'true');
          card.appendChild(rule);
          card.appendChild(facts);
        }
        aside.appendChild(card);
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

    /* 3. Réponse rapide remplacée par un bouton « Répondre au sujet », centré, qui reprend l'adresse du bouton
       de l'en-tête (formulaire natif masqué ; absent si le sujet est verrouillé ou pour un visiteur) */
    var replyLink = document.querySelector('.sg-pagehead a.sg-action[href*="mode=reply"]') || find(/mode=reply/);
    var lockedReply = document.querySelector('.sg-pagehead .sg-action--status[data-reply-href]');
    var replyHref = replyLink ? replyLink.getAttribute('href') : lockedReply ? lockedReply.getAttribute('data-reply-href') : '';
    if (replyHref && !topic.querySelector('.sg-treply')) {
      var replyBar = el('div', 'sg-treply');
      var rb = el('a', 'sg-action');
      rb.href = replyHref;
      rb.appendChild(ico('reply'));
      rb.appendChild(el('span', null, 'Répondre au sujet'));
      replyBar.appendChild(rb);
      var qr = topic.querySelector('.quick-reply');
      var after = qr || posts[posts.length - 1];
      if (after) after.parentNode.insertBefore(replyBar, qr || after.nextSibling);
    }

    /* Sujets similaires, sous « Répondre au sujet » (ou sous le dernier message) */
    var simAfter = topic.querySelector('.sg-treply') || posts[posts.length - 1];
    if (simAfter) similarTopics(topic, simAfter);

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
      /* Outils de modération : une liste déroulante « Modération » (menu) à la place des icônes natives.
         Libellés et icônes d'après le mode du lien natif ; les actions destructives en dernier, après un filet. */
      var admin = topic.querySelector('.topic-admin');
      var MOD = {
        lock: [1, 'lock', 'Verrouiller le sujet'],
        unlock: [1, 'lock_open', 'Déverrouiller le sujet'],
        move: [2, 'drive_file_move', 'Déplacer le sujet'],
        split: [3, 'call_split', 'Diviser le sujet'],
        merge: [4, 'merge', 'Fusionner avec un autre sujet'],
        trash: null, /* retiré à la demande : la suppression suffit */
        'delete': [7, 'delete', 'Supprimer', 'danger']
      };
      var modItems = admin ? Array.prototype.slice.call(admin.querySelectorAll('a[href]')).map(function (a, i) {
        var href = a.getAttribute('href');
        var mode = /^\/merge/.test(href) ? 'merge' : ((href.match(/[?&]mode=([a-z]+)/) || [])[1] || '');
        if (MOD[mode] === null) return null;
        var spec = MOD[mode];
        var nat = a.querySelector('.material-symbols-outlined, i');
        if (!spec) spec = [5, nat ? nat.textContent.trim() : 'build', a.getAttribute('title') || a.textContent.trim()];
        return { rank: spec[0] * 100 + i, item: [href, spec[1], spec[2], spec[3]] };
      }).filter(Boolean).sort(function (x, y) { return x.rank - y.rank; }) : [];
      if (modItems.length) {
        var list = [];
        modItems.forEach(function (m, i) {
          if (i && m.item[3] === 'danger' && modItems[i - 1].item[3] !== 'danger') list.push(null);
          list.push(m.item);
        });
        row.appendChild(actionsMenu(list, 'sg-mod-menu', {
          label: 'Modération', lead: 'gavel', icon: 'expand_more', toggleCls: 'sg-tool', cls: 'sg-menu--mod'
        }));
        admin.classList.add('sg-hidden');
      }
      if (row.children.length) foot.appendChild(row);
      anchor.parentNode.insertBefore(foot, anchor);
    }

    topic.classList.add('sg-topic-on');
    document.body.classList.add('sg-topicpage-on');
    alignPostHash();
  }

  /* Arrivée par un lien vers un message (#3, #post-3) : le navigateur cale l'en-tête de la lettre tout en haut,
     rôle coupé (et, sur mobile, profil caché au-dessus). On cale le haut du message, avec 24px d'air (sur
     ordinateur, la marge de défilement de l'en-tête suffit déjà). Refait au chargement complet (images, widgets,
     et le saut du navigateur vers l'ancre) tant que le lecteur n'a pas défilé lui-même. */
  function alignPostHash() {
    var touched = false;
    var mark = function () { touched = true; };
    ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, mark, { passive: true, once: true }); });
    var align = function () {
      if (touched) return;
      var id = decodeURIComponent((location.hash || '').slice(1));
      var target = id && document.getElementById(id);
      var post = target && target.closest && target.closest('.sg-post');
      if (!post) return;
      window.scrollTo(0, Math.max(0, post.getBoundingClientRect().top + window.pageYOffset - 24));
    };
    align();
    if (document.readyState !== 'complete') window.addEventListener('load', function () { setTimeout(align, 0); setTimeout(align, 400); });
    window.addEventListener('hashchange', function () { touched = false; align(); });
  }

  /* Couleurs du titre d'un sujet : cinq choix, enregistrés sous les valeurs natives de Forumactif (code couleur),
     affichés avec les tokens de la refonte (classes .sg-tcolor--…, 08-groups.css) */
  var TITLE_COLORS = [
    ['', 'Défaut', ''],
    ['#FF0000', 'Rouge', 'hi'],
    ['#FF9933', 'Orange', 'kaki'],
    ['#006600', 'Vert', 'kaze'],
    ['#0000FF', 'Hagane', 'hagane']
  ];
  var titleTone = function (hex) {
    hex = (hex || '').toUpperCase();
    for (var i = 0; i < TITLE_COLORS.length; i++) if (TITLE_COLORS[i][0] === hex) return TITLE_COLORS[i][2];
    return '';
  };
  /* Couleur de titre écrite par Forumactif sur un lien de sujet (sur le lien ou une balise dedans) */
  function titleToneOf(node) {
    if (!node) return '';
    var styled = node.matches && node.matches('[style*="color"]') ? node : node.querySelector('[style*="color"]');
    var m = styled && (styled.getAttribute('style') || '').match(/color\s*:\s*(#[0-9a-f]{6})/i);
    return m ? titleTone(m[1]) : '';
  }

  /* Rôle du staff : couleur de son groupe, comme les bannières de la section « Les groupes » de l'accueil
     (Staffeux en sumi et gofun, Modérateurs en Hagane), quel que soit le pays de l'auteur */
  function roleBand(role) {
    var band = uiEl('div', 'sg-role sg-role--staff sg-role--' + (role === 'staff' ? 'g-staff' : 'g-mod'));
    var mark = uiEl('span', 'sg-role__mark');
    mark.innerHTML = MAGATAMA_SVG;
    band.appendChild(mark);
    band.appendChild(uiEl('span', 'sg-role__label', role === 'staff' ? 'Staffeux' : 'Modérateur'));
    return band;
  }

  /* Barre d'outils de l'éditeur (SCEditor) : boutons retirés à la demande de Vinny, icônes d'origine (images)
     remplacées par des Material Symbols (YouTube : logo de Simple Icons, licence CC0, absent de Material Symbols) */
  var TB_REMOVE = ['table', 'size', 'font', 'removeformat', 'more', 'fascroll', 'faupdown', 'farand', 'twemojifa', 'date', 'time', 'pastetext', 'source'];
  var TB_ICONS = {
    bold: 'format_bold', italic: 'format_italic', underline: 'format_underlined', strike: 'format_strikethrough',
    left: 'format_align_left', center: 'format_align_center', right: 'format_align_right', justify: 'format_align_justify',
    bulletlist: 'format_list_bulleted', orderedlist: 'format_list_numbered', horizontalrule: 'horizontal_rule',
    quote: 'format_quote', code: 'code', faspoiler: 'expand_circle_down', fahide: 'visibility_off',
    servimg: 'add_photo_alternate', image: 'image', link: 'link', embed: 'web_asset', youtube: 'svg:youtube',
    headers: 'title', color: 'format_color_text', subscript: 'subscript', superscript: 'superscript'
  };
  var YOUTUBE_SVG = '<svg class="sg-tb__svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
  function editorToolbar(scope) {
    var tries = 0;
    var run = function () {
      var bar = scope.querySelector('.sceditor-toolbar');
      if (!bar || !bar.querySelector('.sceditor-button')) { if (++tries < 40) setTimeout(run, 150); return; }
      if (bar.classList.contains('sg-tb-on')) return;
      Array.prototype.slice.call(bar.querySelectorAll('a.sceditor-button')).forEach(function (a) {
        var name = (a.className.match(/sceditor-button-(\S+)/) || [])[1];
        if (TB_REMOVE.indexOf(name) >= 0) { a.classList.add('sg-tb--off'); return; }
        var icon = TB_ICONS[name];
        if (!icon) return;
        a.classList.add('sg-tb');
        if (icon.indexOf('svg:') === 0) a.insertAdjacentHTML('beforeend', YOUTUBE_SVG);
        else a.appendChild(uiIco(icon));
      });
      var shown = Array.prototype.slice.call(bar.querySelectorAll('.sceditor-group')).filter(function (g) {
        if (!g.querySelector('a.sceditor-button:not(.sg-tb--off)')) { g.classList.add('sg-tb--off'); return false; }
        return true;
      });
      if (shown.length) shown[shown.length - 1].classList.add('sg-tb-last');
      bar.classList.add('sg-tb-on');
      toolbarTips(bar);
      editorPopups(scope);
      lockEditorMode();
    };
    run();
  }

  /* Libellé de chaque icône de la barre d'outils, en infobulle au survol et au focus. La barre défile à
     l'horizontale (elle couperait une infobulle en CSS) : une seule infobulle, posée sur la page, en position fixe. */
  var TB_LABELS = { embed: 'Enrichir un lien', youtube: 'Insérer une vidéo YouTube', headers: 'Format des titres' };
  function toolbarTips(bar) {
    var tip = null;
    var hide = function () { if (tip) tip.classList.remove('is-on'); };
    var show = function (a) {
      if (!tip) { tip = uiEl('div', 'sg-tbtip'); tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
      tip.textContent = a.getAttribute('data-tip');
      tip.classList.add('is-on');
      var r = a.getBoundingClientRect(), w = tip.offsetWidth;
      var left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
      tip.style.left = left + 'px';
      tip.style.top = (r.top - tip.offsetHeight - 8) + 'px';
    };
    Array.prototype.slice.call(bar.querySelectorAll('a.sg-tb')).forEach(function (a) {
      var name = (a.className.match(/sceditor-button-(\S+)/) || [])[1];
      var label = TB_LABELS[name] || (a.getAttribute('title') || '').trim();
      if (!label) return;
      a.setAttribute('data-tip', label);
      a.setAttribute('aria-label', label);
      a.removeAttribute('title');
      a.addEventListener('mouseenter', function () { show(a); });
      a.addEventListener('focus', function () { show(a); });
      a.addEventListener('mouseleave', hide);
      a.addEventListener('blur', hide);
      a.addEventListener('mousedown', hide);
      a.addEventListener('click', hide);
    });
    bar.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* Couleurs du texte : uniquement celles du design system, enregistrées sous leur code « sombre » ; à l'affichage,
     08-groups.css remplace chaque code par son token (la couleur suit le thème) */
  var TEXT_COLORS = [
    ['#9FB0C3', 'Hagane', 'var(--sg-primary)'],
    ['#ECE5D4', 'Sumi et gofun', 'var(--sg-contrast)'],
    ['#6FB3AE', 'Asagi', 'var(--sg-accent-1)'],
    ['#C27390', 'Ume', 'var(--sg-accent-2)'],
    ['#D98A4E', 'Kaki', 'var(--sg-title-kaki)'],
    ['#B5533F', 'Hi no Kuni', 'var(--sg-group-hi)'],
    ['#5A87AD', 'Mizu no Kuni', 'var(--sg-group-mizu)'],
    ['#73A060', 'Kaze no Kuni', 'var(--sg-group-kaze)'],
    ['#CDB04A', 'Kaminari no Kuni', 'var(--sg-group-kaminari)'],
    ['#A0714A', 'Tsuchi no Kuni', 'var(--sg-group-tsuchi)'],
    ['#8A6CAE', 'Shōkoku', 'var(--sg-group-autres)']
  ];
  var HEADER_LABELS = { H2: 'Grand titre', H3: 'Titre', H4: 'Sous-titre' };

  /* Fenêtres des outils de l'éditeur (spoiler, images, lien, vidéo, titres, couleur) : SCEditor les crée à chaque
     ouverture ; elles reçoivent la classe .sg-pop (60-write.css). La fenêtre des couleurs est reconstruite. */
  function editorPopups(scope) {
    var $ = window.jQuery;
    var ta = document.getElementById('text_editor_textarea');
    var inst = $ && ta && $(ta).sceditor && $(ta).sceditor('instance');
    /* Bouton qui a ouvert la fenêtre : il garde l'état de survol tant qu'elle est ouverte */
    var opener = null;
    var bar = scope.querySelector('.sceditor-toolbar');
    if (bar) bar.addEventListener('mousedown', function (e) {
      var a = e.target.closest && e.target.closest('a.sceditor-button');
      if (a) opener = a;
    }, true);
    var clearOpen = function () {
      Array.prototype.slice.call(scope.querySelectorAll('.sg-tb--open')).forEach(function (a) { a.classList.remove('sg-tb--open'); });
    };
    /* La fenêtre reste dans la page : sous son bouton (Servimg, posée sur la page, recouvrait la barre d'outils)
       et décalée vers la gauche si elle déborde à droite */
    var place = function (d) {
      var btn = opener && opener.getBoundingClientRect();
      /* SCEditor repositionne la fenêtre après l'avoir insérée : nos valeurs passent en !important */
      if (d.parentNode === document.body && btn) {
        d.style.setProperty('top', (btn.bottom + window.scrollY) + 'px', 'important');
        d.style.setProperty('left', (btn.left + window.scrollX) + 'px', 'important');
      }
      var r = d.getBoundingClientRect();
      var maxRight = Math.min(window.innerWidth - 8, (scope.getBoundingClientRect().right || window.innerWidth));
      var over = r.right - maxRight;
      if (over > 0) d.style.setProperty('left', (parseFloat(getComputedStyle(d).left) - over) + 'px', 'important');
    };
    var handle = function (d) {
      if (!d.classList || !d.classList.contains('sceditor-dropdown') || d.classList.contains('sg-pop')) return;
      d.classList.add('sg-pop');
      clearOpen();
      if (opener) opener.classList.add('sg-tb--open');
      if (d.classList.contains('sceditor-color-picker') && inst) {
        /* Couleurs de base de Forumactif, lues dans la fenêtre native avant de la vider */
        var natives = Array.prototype.slice.call(d.querySelectorAll('font[color]')).map(function (f) {
          return [f.getAttribute('color'), f.textContent.trim(), f.getAttribute('color')];
        });
        var host = d.firstElementChild || d;
        host.textContent = '';
        var list = uiEl('div', 'sg-cpick');
        var group = function (title, colors) {
          if (!colors.length) return;
          list.appendChild(uiEl('p', 'sg-cpick__title', title));
          var grid = uiEl('div', 'sg-cpick__grid');
          grid.setAttribute('role', 'group');
          grid.setAttribute('aria-label', title);
          colors.forEach(function (c) {
            var b = uiEl('button', 'sg-cpick__sw');
            b.type = 'button';
            b.style.background = c[2];
            b.setAttribute('title', c[1]);
            b.setAttribute('aria-label', c[1]);
            b.addEventListener('mousedown', function (e) { e.preventDefault(); });
            b.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              inst.insertText('[color=' + c[0] + ']', '[/color]');
              if (inst.closeDropDown) inst.closeDropDown(true);
            });
            grid.appendChild(b);
          });
          list.appendChild(grid);
        };
        group('Sengoku no Jidai', TEXT_COLORS);
        group('Défaut', natives);
        host.appendChild(list);
      }
      if (d.classList.contains('sceditor-header-picker')) {
        Array.prototype.slice.call(d.querySelectorAll('.sceditor-header-option')).forEach(function (h) {
          h.removeAttribute('style');
          if (HEADER_LABELS[h.tagName]) h.textContent = HEADER_LABELS[h.tagName];
        });
      }
      setTimeout(function () { place(d); }, 0);
      /* Sa taille peut changer après coup (cadre de Servimg) : elle est replacée à chaque changement */
      if (window.ResizeObserver) new ResizeObserver(function () { place(d); }).observe(d);
      /* Servimg est gardée et seulement masquée (display: none) entre deux ouvertures : l'état du bouton suit */
      if (d.parentNode === document.body) {
        new MutationObserver(function () {
          if (getComputedStyle(d).display === 'none') clearOpen();
          else { clearOpen(); if (opener) opener.classList.add('sg-tb--open'); }
        }).observe(d, { attributes: true, attributeFilter: ['style'] });
      }
    };
    var mo = new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes, handle);
        Array.prototype.forEach.call(m.removedNodes, function (n) {
          if (n.classList && n.classList.contains('sceditor-dropdown') && !document.querySelector('.sceditor-dropdown')) clearOpen();
        });
      });
    });
    var cont = scope.querySelector('.sceditor-container');
    if (cont) mo.observe(cont, { childList: true });
    mo.observe(document.body, { childList: true });
  }

  /* Mode de l'éditeur bloqué sur le mode texte (BBCode), celui qu'utilise Vinny : le bouton « Basculer le mode
     d'édition » est retiré, et un éditeur ouvert en mode visuel (préférence gardée par Forumactif) est rebasculé */
  function lockEditorMode() {
    var $ = window.jQuery;
    var ta = document.getElementById('text_editor_textarea');
    var inst = $ && ta && $(ta).sceditor && $(ta).sceditor('instance');
    if (!inst || !inst.inSourceMode) return;
    if (!inst.inSourceMode()) inst.toggleSourceMode();
  }

  /* --------------------------------------------------------------------
     Page d'écriture d'un message (/post : répondre, citer, nouveau sujet, modifier) : écritoire « suzuri »
     (硯, la pierre à encre). Pattern réservé à l'ÉCRITURE ; il prolonge les messages « fumi » : on écrit
     dans la même lettre que celle qui sera publiée, le portrait et le rôle de l'auteur à gauche.
       1. en-tête (même pattern que les forums et les sujets) : fil d'Ariane lu sur la page du sujet ou du
          forum, verbe en titre (« Répondre au sujet »…), « Dans « … » » en description ;
       2. le formulaire en deux colonnes : auteur collant | lettre (titre, éditeur, réglages, boutons) ;
          réglages en interrupteurs, type du sujet en contrôle segmenté, couleur du titre en liste personnalisée ;
          les autres blocs (sondage, calendrier, SEO, pièces jointes…) en panneaux repliables ;
       3. « Derniers messages du sujet » (revue native) en cartes compactes, coupées au-delà de 240px ;
       4. séparateur de fin et fil d'Ariane repris.
     Le bloc de l'éditeur (#postingbox) n'est JAMAIS déplacé : l'iframe de SCEditor se rechargerait et
     l'éditeur casserait. On construit autour (le formulaire devient la grille).
     -------------------------------------------------------------------- */
  function writePage() {
    if (location.pathname !== '/post') return;
    var form = document.querySelector('form[name="post"]');
    var box = document.getElementById('postingbox');
    if (!form || !box || form.classList.contains('sg-writeform')) return;
    var el = uiEl, ico = uiIco;
    var val = function (name) { var i = form.querySelector('input[name="' + name + '"]'); return i ? i.value : ''; };
    var params = {};
    location.search.replace(/^\?/, '').split('&').forEach(function (kv) {
      var p = kv.split('=');
      if (p[0]) params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
    });
    var mode = val('mode') || params.mode || '';
    var VERB = { reply: 'Répondre au sujet', quote: 'Répondre au sujet', newtopic: 'Nouveau sujet', editpost: 'Modifier le message' };
    var nativeHead = document.querySelector('#wrap > .page-header');
    var verb = VERB[mode] || (nativeHead ? nativeHead.textContent.trim() : 'Écrire un message');
    document.body.classList.add('sg-writepage');

    /* 1. En-tête */
    var head = el('section', 'sg-pagehead sg-pagehead--write');
    head.setAttribute('aria-label', 'En-tête de la page');
    var nav = el('nav', 'sg-crumbs');
    nav.setAttribute('aria-label', "Fil d'Ariane");
    var ol = el('ol', 'sg-crumbs__list');
    nav.appendChild(ol);
    head.appendChild(nav);
    var row = el('div', 'sg-pagehead__row');
    var h1 = el('h1', 'sg-pagehead__title');
    h1.appendChild(el('span', 'sg-pagehead__text', verb));
    row.appendChild(h1);
    head.appendChild(row);
    var crumb = function (href, text, here) {
      var li = el('li', 'sg-crumbs__item');
      var a = el(here ? 'span' : 'a', 'sg-crumbs__link' + (here ? ' sg-crumbs__here' : ''), text);
      if (here) a.setAttribute('aria-current', 'page'); else a.href = href;
      li.appendChild(a);
      ol.appendChild(li);
    };
    if (nativeHead) nativeHead.parentNode.insertBefore(head, nativeHead);
    else form.parentNode.insertBefore(head, form);
    /* Séparateur avec le logo entre la bannière et l'en-tête, comme sur les forums et les sujets (sans les widgets :
       la page reste concentrée sur l'écriture). Logo au trait servi par jsDelivr, en masque (couleur du thème). */
    var topDiv = el('div', 'sg-divider sg-divider--write');
    topDiv.setAttribute('role', 'separator');
    var logo = el('span', 'sg-divider__logo sg-divider__logo--mask');
    logo.setAttribute('aria-hidden', 'true');
    topDiv.appendChild(logo);
    var topRule = el('span', 'sg-divider__rule');
    topRule.setAttribute('aria-hidden', 'true');
    topRule.appendChild(el('span', 'sg-divider__line'));
    topRule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
    topRule.appendChild(el('span', 'sg-divider__line'));
    topDiv.appendChild(topRule);
    head.parentNode.insertBefore(topDiv, head);
    document.body.classList.add('sg-pagehead-on');

    var tone = function (t) {
      ['sg-tone-gestion', 'sg-tone-hi', 'sg-tone-mizu', 'sg-tone-kaze', 'sg-tone-kaminari', 'sg-tone-tsuchi', 'sg-tone-autres']
        .forEach(function (c) { head.classList.remove(c); form.classList.remove(c); });
      if (t) { head.classList.add('sg-tone-' + t); form.classList.add('sg-tone-' + t); }
      /* Les derniers messages du sujet (au pattern « fumi ») prennent aussi la couleur de la catégorie */
      var rv = document.querySelector('.sg-review');
      if (rv) Array.prototype.slice.call(form.classList).filter(function (c) { return /^sg-tone-/.test(c); })
        .concat(rv.className.match(/sg-tone-[a-z]+/g) || []).forEach(function (c) { rv.classList.toggle(c, form.classList.contains(c)); });
    };
    /* Contexte (fil d'Ariane, titre du sujet ou du forum) lu sur la page du sujet ou du forum */
    var t = val('t') || params.t, p = val('p') || params.p, f = val('f') || params.f;
    /* « /t3 » renvoie une erreur 404 : il faut le tiret (« /t3- »), que Forumactif redirige vers l'adresse complète */
    var src = t ? '/t' + t + '-' : p ? '/viewtopic?p=' + p : f ? '/f' + f + '-' : '';
    var fillHead = function (doc, url) {
      var isTopic = /^\/t\d+/.test(url);
      var native = doc && doc.querySelector(isTopic ? '#topic .topic-header' : '#wrap .page-header');
      var links = native ? Array.prototype.slice.call(native.querySelectorAll('#breadcrumbs a')) : [];
      var title = native && native.querySelector('h1');
      var name = title ? (title.querySelector('a') || title).textContent.trim() : '';
      var category = links[1] ? links[1].textContent.trim() : '';
      var meta = CATEGORIES[category];
      tone(meta && meta.tone);
      ol.textContent = '';
      if (links.length) {
        /* Liens d'origine repris tels quels (icône maison comprise), comme dans pageHead */
        links.forEach(function (a, i) {
          var li = el('li', 'sg-crumbs__item');
          var link = document.importNode(a, true);
          link.className = 'sg-crumbs__link';
          if (i === 1 && meta) link.setAttribute('href', '/?onglet=' + meta.slug);
          li.appendChild(link);
          ol.appendChild(li);
        });
      } else crumb('/', 'Accueil');
      /* Le sujet en dernier lien ; pour un forum, son fil se termine déjà par lui */
      if (name && (isTopic || !links.length)) crumb(url, name);
      crumb('', verb, true);
      /* Description en texte simple (le fil d'Ariane mène déjà au sujet ou au forum) */
      if (name && !head.querySelector('.sg-pagehead__desc')) head.appendChild(el('div', 'sg-pagehead__desc', 'Dans « ' + name + ' »'));
      var end = document.querySelector('.sg-crumbs--end');
      if (end) { end.textContent = ''; end.appendChild(ol.cloneNode(true)); }
    };
    crumb('/', 'Accueil');
    crumb('', verb, true);
    if (src) {
      fetch(src, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text().then(function (h) { return [h, new URL(r.url).pathname]; }) : null; })
        .then(function (res) { if (res) fillHead(new DOMParser().parseFromString(res[0], 'text/html'), res[1]); })
        .catch(function () {});
    }

    /* 2. Le formulaire en grille : auteur | lettre */
    form.classList.add('sg-writeform');
    var ud = window._userdata || {};
    var aside = el('aside', 'sg-write__aside');
    aside.setAttribute('aria-label', 'Auteur');
    var card = el('div', 'sg-write__card');
    var srcAv = avatarSrc();
    if (srcAv) {
      var img = el('img', 'sg-write__portrait');
      img.src = srcAv;
      img.alt = '';
      card.appendChild(img);
    }
    if (ud.username) card.appendChild(el('p', 'sg-write__name', ud.username));
    aside.appendChild(card);
    form.insertBefore(aside, form.firstChild);
    if (ud.user_id) {
      staffRoles(function (roles) {
        var role = roles[String(ud.user_id)];
        if (!role || aside.querySelector('.sg-role')) return;
        aside.insertBefore(roleBand(role), aside.firstChild);
      });
    }

    var content = box.querySelector('.block-content') || box;
    var subject = form.querySelector('input[name="subject"]');
    if (subject) {
      subject.classList.add('sg-write__subject');
      subject.placeholder = mode === 'newtopic' ? 'Titre du sujet' : 'Titre du message (facultatif)';
      subject.classList.add('sg-write__field');
      subject.setAttribute('aria-label', mode === 'newtopic' ? 'Titre du sujet' : 'Titre du message');
    }
    var description = form.querySelector('input[name="description"]');
    if (description) {
      description.classList.add('sg-write__desc');
      description.placeholder = 'Description du sujet (facultatif)';
      description.classList.add('sg-write__field');
      description.setAttribute('aria-label', 'Description du sujet');
    }

    /* Réglages : cases natives en interrupteurs, type du sujet en contrôle segmenté, couleur du titre en liste */
    var buttons = content.querySelector('fieldset.form-buttons');
    var opts = el('div', 'sg-write__opts');
    opts.setAttribute('role', 'group');
    opts.setAttribute('aria-label', 'Réglages du message');
    var optBlock = Array.prototype.slice.call(form.querySelectorAll(':scope > .block')).filter(function (b) {
      return b !== box && b.querySelector('input[name="notify"], input[name="disable_bbcode"], input[name="attach_sig"], input[name="topictype"]');
    })[0];
    var SHORT = {
      disable_html: 'Désactiver le HTML',
      disable_bbcode: 'Désactiver le BBCode',
      disable_smilies: 'Désactiver les smileys',
      attach_sig: 'Ajouter ma signature',
      notify: 'M’avertir des réponses'
    };
    var switches = el('div', 'sg-write__switches');
    var types = [];
    if (optBlock) {
      Array.prototype.slice.call(optBlock.querySelectorAll('label')).forEach(function (lab) {
        var input = lab.querySelector('input');
        if (!input) return;
        if (input.type === 'radio' && input.name === 'topictype') { types.push({ input: input, text: lab.textContent.trim() }); return; }
        if (input.type !== 'checkbox') return;
        var row2 = el('label', 'sg-opt');
        row2.appendChild(input);
        row2.appendChild(el('span', 'sg-opt__text', SHORT[input.name] || lab.textContent.trim()));
        var sw = el('span', 'sg-switch');
        sw.setAttribute('aria-hidden', 'true');
        sw.appendChild(el('span', 'sg-switch__thumb'));
        row2.appendChild(sw);
        switches.appendChild(row2);
      });
      optBlock.classList.add('sg-hidden');
    }
    if (types.length) {
      var TYPE = { 0: ['chat_bubble', 'Normal'], 1: ['push_pin', 'Épinglé'], 2: ['campaign', 'Annonce'], 3: ['public', 'Annonce globale'] };
      var tf = el('div', 'sg-field');
      tf.setAttribute('role', 'group');
      tf.setAttribute('aria-label', 'Type du sujet');
      tf.appendChild(el('span', 'sg-field__label', 'Type du sujet'));
      var seg = el('div', 'sg-seg');
      types.forEach(function (o) {
        var lab = el('label', 'sg-seg__opt');
        lab.appendChild(o.input);
        var face = el('span', 'sg-seg__face');
        var spec = TYPE[o.input.value] || ['label', o.text];
        face.appendChild(ico(spec[0]));
        face.appendChild(el('span', null, spec[1]));
        lab.appendChild(face);
        seg.appendChild(lab);
      });
      tf.appendChild(seg);
      opts.appendChild(tf);
    }
    /* Couleur du titre : cinq choix (TITLE_COLORS) avec pastille, sur la même ligne que le titre, à sa droite.
       Une couleur native déjà choisie hors de ces cinq (sujet ancien) est gardée en dernière entrée. */
    var colorSel = form.querySelector('select[name="topic_color"]');
    if (colorSel && subject) {
      var cur = (colorSel.value || '').toUpperCase();
      var legacy = cur && !TITLE_COLORS.some(function (c) { return c[0] === cur; }) ? colorSel.options[colorSel.selectedIndex] : null;
      colorSel.textContent = '';
      TITLE_COLORS.forEach(function (c) {
        var o = new Option(c[1], c[0]);
        if (c[0] === cur) o.selected = true;
        colorSel.appendChild(o);
      });
      if (legacy) { colorSel.appendChild(legacy); legacy.selected = true; }
      var toneVar = function (v) { var k = titleTone(v); return k ? 'var(--sg-title-' + k + ')' : (v || ''); };
      var oldWrap = colorSel.closest('div.select');
      var cc = combo(colorSel, { swatch: function (v) { return v ? toneVar(v) : ''; } });
      cc.field.setAttribute('aria-label', 'Couleur du titre');
      cc.field.setAttribute('title', 'Couleur du titre');
      cc.box.classList.add('sg-write__color');
      if (oldWrap && !oldWrap.querySelector('select')) oldWrap.remove();
      var titleRow = el('div', 'sg-write__titlerow');
      subject.parentNode.insertBefore(titleRow, subject);
      titleRow.appendChild(subject);
      titleRow.appendChild(cc.box);
      /* Le titre prend la couleur choisie (Forumactif y écrirait son code couleur natif) */
      var paintSubject = function () { subject.style.color = toneVar(colorSel.value); };
      colorSel.addEventListener('change', function () { setTimeout(paintSubject, 0); });
      paintSubject();
    }
    if (switches.children.length) opts.insertBefore(switches, opts.firstChild);
    if (opts.children.length) {
      if (buttons) content.insertBefore(opts, buttons); else content.appendChild(opts);
    }

    /* Boutons : « Prévisualiser » (contour) puis « Envoyer » (plein), à droite */
    if (buttons) {
      var actions = el('div', 'sg-write__actions');
      var prev = buttons.querySelector('[name="preview"]');
      var send = buttons.querySelector('[name="post"]');
      if (prev) {
        var pb = el('button', 'sg-action sg-action--ghost');
        pb.type = 'submit';
        pb.name = prev.name;
        pb.value = prev.value || 'Prévisualiser';
        pb.appendChild(ico('visibility'));
        pb.appendChild(el('span', null, 'Prévisualiser'));
        prev.remove();
        actions.appendChild(pb);
      }
      if (send) {
        send.className = 'sg-action';
        send.textContent = '';
        send.appendChild(ico('send'));
        send.appendChild(el('span', null, mode === 'editpost' ? 'Enregistrer' : mode === 'newtopic' ? 'Publier le sujet' : 'Envoyer'));
        actions.appendChild(send);
      }
      buttons.appendChild(actions);
    }

    /* Selects restants (calendrier, pièces jointes…) : listes personnalisées */
    Array.prototype.slice.call(form.querySelectorAll('select')).forEach(function (s) {
      if (s.classList.contains('sg-combo__native') || s.multiple || s.closest('.sceditor-container')) return;
      var parent = s.parentNode, next = s.nextSibling;
      var c = combo(s); /* combo() range la liste native dans sa boîte */
      parent.insertBefore(c.box, next);
    });

    /* Retirés à la demande de Vinny : la raison de la modification, le calendrier et les outils SEO */
    var reason = form.querySelector('input[name="edit_reason"]');
    if (reason) (reason.closest('label') || reason).classList.add('sg-hidden');
    ['calendar-block', 'seo-block'].forEach(function (id) {
      var x = document.getElementById(id);
      if (x) x.classList.add('sg-hidden');
    });

    /* Autres blocs du formulaire (règles, sondage…) : panneaux repliables */
    Array.prototype.slice.call(form.querySelectorAll(':scope > .block')).forEach(function (b, i) {
      if (b === box || b === optBlock || b.id === 'preview') return;
      var bh = b.querySelector(':scope > .block-header');
      if (!bh) return;
      b.classList.add('sg-panel');
      var tg = el('button', 'sg-panel__toggle');
      tg.type = 'button';
      var pid = 'sg-panel-' + i;
      var bc = b.querySelector(':scope > .block-content');
      if (bc) bc.id = bc.id || pid;
      tg.setAttribute('aria-controls', bc ? bc.id : pid);
      var name = bh.cloneNode(true);
      Array.prototype.slice.call(name.querySelectorAll('.forum-hide, div')).forEach(function (x) { x.remove(); });
      tg.appendChild(el('span', 'sg-panel__title', name.textContent.trim()));
      tg.appendChild(ico('expand_more'));
      bh.textContent = '';
      bh.appendChild(tg);
      var openIt = b.id === 'forum_rules';
      var set = function (on) {
        b.classList.toggle('is-open', on);
        tg.setAttribute('aria-expanded', on ? 'true' : 'false');
      };
      set(openIt);
      tg.addEventListener('click', function () { set(!b.classList.contains('is-open')); });
      if (bc && bc.querySelector('input[name="poll_title"]')) { b.classList.add('sg-panel--poll'); pollPanel(bc); }
    });

    /* Aperçu : la lettre telle qu'elle sera publiée */
    var preview = document.getElementById('preview');
    if (preview) {
      preview.classList.add('sg-write__preview');
      var ph = preview.querySelector('.block-header');
      if (ph) { ph.textContent = ''; ph.appendChild(ico('visibility')); ph.appendChild(el('span', null, 'Aperçu')); }
    }

    /* 3. Revue du sujet : les derniers messages au pattern « fumi » de la page du sujet (rôle, portrait, pseudo,
       fiche, lettre ; préférences « Position du profil » et « Densité » appliquées), coupés à 240px avec
       « Lire la suite ». Forumactif ne donne ici que le portrait, le pseudo, la date et le contenu : le profil
       des auteurs (identifiant, rang, fiche) est lu sur la page du sujet. */
    var reviewTitle = document.querySelector('#wrap > .page-title');
    var comments = Array.prototype.slice.call(document.querySelectorAll('#wrap > .block-comment'));
    var after = form;
    if (comments.length) {
      var review = el('section', 'sg-review sg-fumi');
      review.setAttribute('aria-label', 'Derniers messages du sujet');
      /* Repliés par défaut : le titre est un bouton qui annonce le nombre de messages et invite à les afficher */
      var rh = el('h2', 'sg-review__title');
      var rToggle = el('button', 'sg-review__toggle');
      rToggle.type = 'button';
      rToggle.setAttribute('aria-expanded', 'false');
      rToggle.setAttribute('aria-controls', 'sg-review-list');
      rToggle.appendChild(ico('history'));
      rToggle.appendChild(el('span', 'sg-review__label', 'Derniers messages du sujet'));
      rToggle.appendChild(el('span', 'sg-review__count', comments.length + (comments.length > 1 ? ' messages' : ' message')));
      var rHint = el('span', 'sg-review__hint', 'Afficher');
      rToggle.appendChild(rHint);
      var rChev = ico('expand_more');
      rChev.classList.add('sg-review__chev');
      rToggle.appendChild(rChev);
      rh.appendChild(rToggle);
      review.appendChild(rh);
      var rList = el('div', 'sg-review__list');
      rList.id = 'sg-review-list';
      rList.hidden = true;
      review.appendChild(rList);
      var rposts = [];
      comments.forEach(function (c) {
        var bodyC = c.querySelector('.content');
        if (!bodyC) return;
        var details = c.querySelector('.block-comment-details');
        var nameEl = details && details.querySelector('[style*="color"], strong');
        var nameNode = nameEl ? (nameEl.closest('span') || nameEl) : null;
        var dateText = details ? details.textContent.replace(/\s+/g, ' ').replace(/^.*?\sle\s/, '').trim() : '';
        var img = c.querySelector('.avatar-default img');
        /* Les détails natifs (titre, auteur, date) sont parfois dans le contenu : on les en retire */
        var foot = details && details.closest('.block-footer');
        if (foot) foot.remove();

        var post = el('div', 'post-wrap sg-post sg-post--review');
        var aside = el('div', 'post-aside');
        var card = el('div', 'sg-post__card');
        if (img) {
          var avW = el('div', 'post-author-avatar');
          var big = el('div', 'avatar-big');
          img.removeAttribute('style');
          big.appendChild(img);
          avW.appendChild(big);
          card.appendChild(avW);
        }
        var author = el('div', 'post-author');
        var nm = el('div', 'post-author-name');
        /* Pseudo coloré des détails natifs, sinon le nom porté par le portrait (texte alternatif) */
        if (nameNode) nm.appendChild(nameNode);
        else if (img && img.alt) nm.appendChild(el('strong', null, img.alt));
        author.appendChild(nm);
        card.appendChild(author);
        aside.appendChild(card);

        var letter = el('div', 'sg-post__letter');
        var hd = el('div', 'post-header');
        var meta = el('div', 'sg-post__meta');
        if (dateText) {
          var d = el('span', 'sg-post__date');
          d.setAttribute('title', 'Publié');
          d.appendChild(ico('schedule'));
          d.appendChild(el('span', null, dateText));
          meta.appendChild(d);
        }
        hd.appendChild(meta);
        var body = el('div', 'post');
        bodyC.classList.add('post-content');
        body.appendChild(bodyC);
        var edited = editedInfo(bodyC);
        if (edited) {
          var e = el('span', 'sg-post__date sg-post__date--edit');
          e.setAttribute('title', edited.full);
          e.appendChild(ico('edit_note'));
          e.appendChild(el('span', null, 'Modifié ' + edited.date));
          meta.appendChild(e);
          var note = el('p', 'sg-post__edited');
          note.appendChild(edited.node);
          body.appendChild(note);
        }
        letter.appendChild(hd);
        letter.appendChild(body);
        post.appendChild(aside);
        post.appendChild(letter);
        rList.appendChild(post);
        c.remove();
        rposts.push({ post: post, name: nm.textContent.replace(/\s+/g, ' ').trim() });

        var more = el('button', 'sg-rev__more');
        more.type = 'button';
        more.hidden = true;
        more.appendChild(el('span', null, 'Lire la suite'));
        more.appendChild(ico('expand_more'));
        more.setAttribute('aria-expanded', 'false');
        more.addEventListener('click', function () {
          var open = post.classList.toggle('is-expanded');
          more.firstChild.textContent = open ? 'Réduire' : 'Lire la suite';
          more.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        body.insertBefore(more, bodyC.nextSibling);
      });
      /* « Lire la suite » : le message est coupé à la hauteur du profil (la lettre s'arrête au bas du profil),
         240px au moins (et sur mobile, où le profil est au-dessus) ; recalculé quand la fiche arrive */
      var clampReview = function () {
        rposts.forEach(function (r) {
          var post = r.post, content = post.querySelector('.post-content'), more = post.querySelector('.sg-rev__more');
          if (!content || !more || post.classList.contains('is-expanded')) return;
          var aside = post.querySelector('.post-aside'), hd = post.querySelector('.post-header');
          var cols = getComputedStyle(post).gridTemplateColumns.split(' ').length;
          var limit = 240;
          if (cols > 1 && aside && hd) limit = Math.max(240, aside.offsetHeight - hd.offsetHeight - 52);
          post.classList.remove('is-clamped');
          /* Hauteur propre du texte, mesurée sur son contenu : la boîte du message est étirée (flex: 1) à la
             hauteur du profil, et AwesomeBB anime toute propriété changée (transition), d'où une mesure par Range */
          var range = document.createRange();
          range.selectNodeContents(content);
          var cs = getComputedStyle(content);
          var room = limit - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          var clamp = range.getBoundingClientRect().height > room;
          post.style.setProperty('--rev-clamp', limit + 'px');
          post.classList.toggle('is-clamped', clamp);
          more.hidden = !clamp;
        });
      };
      window.addEventListener('resize', function () { if (!rList.hidden) requestAnimationFrame(clampReview); });
      rToggle.addEventListener('click', function () {
        var open = rList.hidden;
        rList.hidden = !open;
        review.classList.toggle('is-open', open);
        rToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        rHint.textContent = open ? 'Masquer' : 'Afficher';
        if (open) requestAnimationFrame(clampReview);
      });
      form.parentNode.insertBefore(review, form.nextSibling);
      if (reviewTitle) reviewTitle.classList.add('sg-hidden');
      after = review;

      /* Couleur de l'auteur (rang sans rôle du staff), relue à chaque changement de thème */
      var paintReview = function () {
        rposts.forEach(function (r) {
          var n = r.post.querySelector('.post-author-name [style*="color"]') || r.post.querySelector('.post-author-name *');
          if (n) r.post.style.setProperty('--author', getComputedStyle(n).color);
        });
      };
      paintReview();
      if (window.MutationObserver) {
        new MutationObserver(function () { requestAnimationFrame(paintReview); })
          .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      }
    }

    /* 4. Séparateur de fin et fil d'Ariane repris */
    var div = el('div', 'sg-divider sg-divider--end');
    div.setAttribute('role', 'separator');
    var rule = el('span', 'sg-divider__rule');
    rule.setAttribute('aria-hidden', 'true');
    rule.appendChild(el('span', 'sg-divider__line'));
    rule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
    rule.appendChild(el('span', 'sg-divider__line'));
    div.appendChild(rule);
    after.parentNode.insertBefore(div, after.nextSibling);
    var endNav = el('nav', 'sg-crumbs sg-crumbs--end');
    endNav.setAttribute('aria-label', "Fil d'Ariane");
    endNav.appendChild(ol.cloneNode(true));
    div.parentNode.insertBefore(endNav, div.nextSibling);

    editorFrameTheme(form);
    editorToolbar(form);
    document.body.classList.add('sg-writepage-on');
  }

  /* Mode visuel de SCEditor : la zone d'écriture est une iframe que le CSS de la page n'atteint pas (fond blanc,
     texte noir, même en thème sombre). On y injecte les couleurs et la police du thème, lues sur la lettre,
     à l'ouverture de l'éditeur, à chaque rechargement de l'iframe et à chaque changement de thème. */
  function editorFrameTheme(scope) {
    var paint = function () {
      var frame = scope.querySelector('.sceditor-container iframe');
      var doc = frame && frame.contentDocument;
      if (!doc || !doc.head) return false;
      var ref = getComputedStyle(scope.querySelector('#postingbox') || scope);
      var link = getComputedStyle(scope).getPropertyValue('--sg-primary').trim() || ref.color;
      var muted = getComputedStyle(scope).getPropertyValue('--sg-text-muted').trim() || ref.color;
      /* Même color-scheme que la page : sinon le navigateur peint un fond opaque (blanc) derrière l'iframe */
      var scheme = getComputedStyle(document.documentElement).colorScheme || 'normal';
      var css = ':root{color-scheme:' + scheme + ';}' +
        'html,body{background:transparent!important;color:' + ref.color + '!important;}' +
        'body{font-family:' + ref.fontFamily + '!important;font-size:16px!important;line-height:1.7;margin:0;padding:16px!important;}' +
        'a{color:' + link + ';}' +
        'blockquote,.quote,.code,pre{border-left:3px solid ' + muted + ';padding:6px 12px;margin:8px 0;opacity:.9;}' +
        'img{max-width:100%;height:auto;}';
      var st = doc.getElementById('sg-frame-theme');
      if (!st) {
        st = doc.createElement('style');
        st.id = 'sg-frame-theme';
        doc.head.appendChild(st);
      }
      st.textContent = css;
      if (!frame._sgBound) {
        frame._sgBound = true;
        frame.addEventListener('load', function () { setTimeout(paint, 0); });
      }
      return true;
    };
    var tries = 0;
    var wait = function () { if (!paint() && ++tries < 40) setTimeout(wait, 150); };
    wait();
    if (window.MutationObserver) {
      /* Après la transition de couleur d'AwesomeBB (* { transition: .16s }) : sinon on lirait l'ancienne couleur */
      new MutationObserver(function () { setTimeout(paint, 260); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    /* Changement de mode (source ↔ visuel) : SCEditor peut réécrire le document de l'iframe */
    scope.addEventListener('click', function (ev) {
      if (ev.target.closest && ev.target.closest('.sceditor-button')) setTimeout(paint, 50);
    });
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
        if (role) { aside.insertBefore(roleBand(role), aside.firstChild); return; }
        if (!rank) return;
        var band = uiEl('div', 'sg-role');
        band.appendChild(uiEl('span', 'sg-role__label', rank));
        aside.insertBefore(band, aside.firstChild);
      });
    });
  }

  /* « Inscrit depuis … » à partir d'une date jj/mm/aaaa : jours (< 1 semaine), semaines (< 1 mois),
     mois (< 1 an), puis années, au singulier ou au pluriel */
  function memberSince(text, now) {
    var m = (text || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return '';
    var start = new Date(+m[3], +m[2] - 1, +m[1]);
    now = now || new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((today - start) / 86400000);
    if (days < 0) return '';
    if (days === 0) return 'Inscrit aujourd’hui';
    var plural = function (n, one, many) { return n + ' ' + (n > 1 ? many : one); };
    var months = (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth() - (today.getDate() < start.getDate() ? 1 : 0);
    var span = days < 7 ? plural(days, 'jour', 'jours')
      : months < 1 ? plural(Math.floor(days / 7), 'semaine', 'semaines')
      : months < 12 ? months + ' mois'
      : plural(Math.floor(months / 12), 'an', 'ans');
    return 'Inscrit depuis ' + span;
  }

  /* Fiche réduite de l'auteur : « Inscrit depuis … » et localisation (icône + lieu), lus dans la fiche native */
  function authorFacts(dl) {
    if (!dl) return null;
    var values = {};
    Array.prototype.slice.call(dl.querySelectorAll('dt')).forEach(function (dt) {
      var dd = dt.nextElementSibling;
      if (!dd || dd.tagName !== 'DD') return;
      var key = dt.textContent.replace(/[\s:]+$/, '').replace(/\s+/g, ' ').trim().toLowerCase();
      values[key] = dd.textContent.replace(/\s+/g, ' ').trim();
    });
    var list = uiEl('ul', 'sg-post__facts');
    var add = function (icon, text, title) {
      if (!text) return;
      var li = uiEl('li', 'sg-post__fact');
      li.appendChild(uiIco(icon));
      li.appendChild(uiEl('span', null, text));
      if (title) li.setAttribute('title', title);
      list.appendChild(li);
    };
    var reg = values['date d\'inscription'] || values['date d’inscription'];
    add('event_available', memberSince(reg), reg ? 'Inscrit le ' + reg : '');
    add('location_on', values.localisation, values.localisation);
    return list.children.length ? list : null;
  }

  /* Mention native de modification (« Dernière édition par X le …, édité N fois ») : sa date, et la mention
     sortie du contenu dans un élément à part (node), que topicPage place au bas du message. Forumactif l'écrit
     tantôt dans une balise, tantôt en texte brut après des <br> : le texte brut est alors enveloppé. */
  function editedInfo(content) {
    var re = /Derni[èe]re [ée]dition par\s+(.+?)\s+le\s+(.+?),\s*[ée]dit[ée]\s+(\d+)\s+fois/i;
    var skip = function (n) { return n.closest && n.closest('blockquote, .codebox, .spoiler'); };
    var node = null;
    Array.prototype.slice.call(content.querySelectorAll('*')).reverse().some(function (n) {
      if (skip(n) || !re.test(n.textContent)) return false;
      node = n;
      return true;
    });
    if (!node) {
      /* Texte brut : le dernier nœud texte qui contient la mention, hors citations */
      var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
      var t, last = null;
      while ((t = walker.nextNode())) if (re.test(t.nodeValue) && !skip(t.parentNode)) last = t;
      if (last) {
        var at = last.nodeValue.search(/Derni[èe]re [ée]dition par/i);
        if (at > 0) last = last.splitText(at);
        node = document.createElement('span');
        last.parentNode.insertBefore(node, last);
        node.appendChild(last);
      }
    }
    if (!node) return null;
    var m = node.textContent.match(re);
    if (!m) return null;
    /* La mention et ses enveloppes devenues vides */
    var box = node.parentNode;
    node.parentNode.removeChild(node);
    while (box && box !== content && !box.textContent.trim() && !box.querySelector('img')) {
      var up = box.parentNode;
      box.remove();
      box = up;
    }
    /* Les <br> laissés en fin de message par la mention */
    while (content.lastChild && (content.lastChild.nodeName === 'BR' || (content.lastChild.nodeType === 3 && !content.lastChild.textContent.trim()))) content.lastChild.remove();
    var date = m[2].trim();
    /* « le Lun 23 Mar 2026 - 10:00 » ; « Aujourd'hui à … » / « Hier à … » restent tels quels */
    var dateText = /^(aujourd|hier)/i.test(date) ? date.charAt(0).toLowerCase() + date.slice(1) : 'le ' + date;
    return { date: dateText, full: m[0].replace(/\s+/g, ' ').trim(), count: +m[3], node: node };
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

  /* Sondage (page d'écriture) : le contenu natif reconstruit au design system, sans contrôle natif à l'écran.
     Les champs d'origine restent dans le formulaire (noms inchangés) : la question est restylée, les choix
     deviennent une liste de champs (ajout, retrait, Entrée pour le suivant, maximum lu dans la consigne) qui
     remplit le textarea natif masqué, la durée un compteur − / + (0 = sans fin), et chaque groupe de boutons
     radio un contrôle segmenté (.sg-seg, les radios natives y sont déplacées et masquées). */
  var POLL_LABELS = [
    [/choix multiple/i, 'Choix multiple'],
    [/annulation/i, 'Annulation du vote'],
    [/ayant particip/i, 'Liste des participants'],
    [/chaque choix/i, 'Votants de chaque choix']
  ];
  function pollPanel(bc) {
    var el = uiEl, ico = uiIco;
    var q = bc.querySelector('input[name="poll_title"]');
    var ta = bc.querySelector('textarea[name="poll_option_text"]');
    var len = bc.querySelector('input[name="poll_length"]');
    var groups = Array.prototype.slice.call(bc.querySelectorAll('.radio-wrap'));
    var max = parseInt((bc.textContent.match(/(\d+)\s*choix au maximum/i) || [])[1], 10) || 10;
    var wrap = el('div', 'sg-poll');
    var field = function (label, hint, forId) {
      var f = el('div', 'sg-poll__field');
      var l = el(forId ? 'label' : 'span', 'sg-poll__label', label);
      if (forId) l.setAttribute('for', forId);
      f.appendChild(l);
      if (hint) f.appendChild(el('span', 'sg-poll__hint', hint));
      wrap.appendChild(f);
      return f;
    };

    if (q) {
      q.id = q.id || 'sg-poll-q';
      q.className = 'sg-write__field sg-poll__input';
      q.placeholder = 'Votre question';
      field('Question', null, q.id).appendChild(q);
    }

    /* Modification d'un sondage existant : Forumactif donne un champ par choix (poll_option_text[N]) avec son
       bouton « Supprimer » (envoi du formulaire) et un champ « Ajouter ce choix » (idem) ; ils sont repris tels
       quels dans la liste : ✕ et + déclenchent leurs boutons natifs (la page se recharge avec le sondage à jour) */
    var olds = Array.prototype.slice.call(bc.querySelectorAll('input[name^="poll_option_text["]'));
    var addIn = bc.querySelector('input[name="add_poll_option_text"]');
    var addBtn = bc.querySelector('[name="add_poll_option"]');
    if (!ta && (olds.length || addIn)) {
      var fe = field('Choix', 'Ajouter ou retirer un choix recharge la page');
      var elist = el('ol', 'sg-poll__choices');
      var mkRow = function (input, n) {
        var li = el('li', 'sg-poll__choice');
        li.appendChild(el('span', 'sg-poll__num', String(n)));
        input.className = 'sg-write__field sg-poll__input';
        input.setAttribute('aria-label', 'Choix ' + n);
        li.appendChild(input);
        elist.appendChild(li);
        return li;
      };
      olds.forEach(function (inp, i) {
        var li = mkRow(inp, i + 1);
        var del = bc.querySelector('[name="' + inp.name.replace('poll_option_text', 'del_poll_option') + '"]');
        var rm = el('button', 'sg-poll__remove');
        rm.type = 'button';
        rm.setAttribute('aria-label', 'Retirer ce choix');
        rm.setAttribute('title', 'Retirer ce choix');
        rm.appendChild(ico('close'));
        if (del) {
          del.classList.add('sg-poll__native');
          li.appendChild(del);
          rm.addEventListener('click', function () { del.click(); });
        } else rm.disabled = true;
        li.appendChild(rm);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
      });
      if (olds.length <= 2) elist.classList.add('is-min');
      if (addIn) {
        var li2 = mkRow(addIn, olds.length + 1);
        li2.classList.add('sg-poll__choice--new');
        addIn.placeholder = 'Nouveau choix';
        var plus = el('button', 'sg-poll__remove sg-poll__plus');
        plus.type = 'button';
        plus.setAttribute('aria-label', 'Ajouter ce choix');
        plus.setAttribute('title', 'Ajouter ce choix');
        plus.appendChild(ico('add'));
        if (addBtn) {
          addBtn.classList.add('sg-poll__native');
          li2.appendChild(addBtn);
          plus.addEventListener('click', function () { if (addIn.value.trim()) addBtn.click(); else addIn.focus(); });
          addIn.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (addIn.value.trim()) addBtn.click();
          });
        }
        li2.appendChild(plus);
      }
      fe.appendChild(elist);
    }

    if (ta) {
      var fc = field('Choix', max + ' choix au maximum');
      var list = el('ol', 'sg-poll__choices');
      var add = el('button', 'sg-poll__add');
      add.type = 'button';
      add.appendChild(ico('add'));
      add.appendChild(el('span', null, 'Ajouter un choix'));
      var sync = function () {
        var inputs = Array.prototype.slice.call(list.querySelectorAll('input'));
        ta.value = inputs.map(function (i) { return i.value.trim(); }).filter(Boolean).join('\n');
        inputs.forEach(function (i, n) {
          i.placeholder = 'Choix ' + (n + 1);
          i.parentNode.querySelector('.sg-poll__num').textContent = n + 1;
        });
        list.classList.toggle('is-min', inputs.length <= 2);
        add.disabled = inputs.length >= max;
      };
      var row = function (value, focus) {
        if (list.children.length >= max) return null;
        var li = el('li', 'sg-poll__choice');
        li.appendChild(el('span', 'sg-poll__num'));
        var inp = el('input', 'sg-write__field sg-poll__input');
        inp.type = 'text';
        inp.maxLength = 255;
        inp.value = value || '';
        inp.setAttribute('aria-label', 'Choix');
        inp.addEventListener('input', sync);
        inp.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          e.preventDefault(); /* pas d'envoi du formulaire */
          var nextLi = li.nextElementSibling;
          if (nextLi) nextLi.querySelector('input').focus();
          else row('', true);
        });
        var rm = el('button', 'sg-poll__remove');
        rm.type = 'button';
        rm.setAttribute('aria-label', 'Retirer ce choix');
        rm.setAttribute('title', 'Retirer ce choix');
        rm.appendChild(ico('close'));
        rm.addEventListener('click', function () {
          if (list.children.length <= 2) return;
          var prevInput = (li.previousElementSibling || li.nextElementSibling).querySelector('input');
          li.remove();
          sync();
          prevInput.focus();
        });
        li.appendChild(inp);
        li.appendChild(rm);
        list.appendChild(li);
        sync();
        if (focus) inp.focus();
        return inp;
      };
      var existing = ta.value.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);
      (existing.length ? existing : ['', '']).forEach(function (v) { row(v); });
      if (list.children.length < 2) row('');
      add.addEventListener('click', function () { row('', true); });
      ta.classList.add('sg-poll__native');
      fc.appendChild(list);
      fc.appendChild(add);
      fc.appendChild(ta);
    }

    if (len) {
      var fd = field('Durée', '0 : le sondage ne se termine jamais');
      var step = el('div', 'sg-poll__step');
      var minus = el('button', 'sg-poll__stepbtn');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Un jour de moins');
      minus.appendChild(ico('remove'));
      var plus = el('button', 'sg-poll__stepbtn');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Un jour de plus');
      plus.appendChild(ico('add'));
      var num = el('input', 'sg-poll__days');
      num.type = 'text';
      num.inputMode = 'numeric';
      num.setAttribute('aria-label', 'Durée du sondage, en jours');
      var unit = el('span', 'sg-poll__unit');
      var maxDays = parseInt(len.getAttribute('max'), 10) || 999;
      var setDays = function (v) {
        v = Math.max(0, Math.min(maxDays, parseInt(v, 10) || 0));
        num.value = v;
        len.value = v || '';
        unit.textContent = v === 0 ? 'sans fin' : v === 1 ? 'jour' : 'jours';
        minus.disabled = v === 0;
        plus.disabled = v >= maxDays;
      };
      setDays(len.value);
      minus.addEventListener('click', function () { setDays((parseInt(num.value, 10) || 0) - 1); });
      plus.addEventListener('click', function () { setDays((parseInt(num.value, 10) || 0) + 1); });
      num.addEventListener('input', function () { num.value = num.value.replace(/\D/g, '').slice(0, 3); });
      num.addEventListener('change', function () { setDays(num.value); });
      num.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp') { e.preventDefault(); setDays((parseInt(num.value, 10) || 0) + 1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); setDays((parseInt(num.value, 10) || 0) - 1); }
        if (e.key === 'Enter') { e.preventDefault(); setDays(num.value); }
      });
      len.classList.add('sg-poll__native');
      step.appendChild(minus);
      step.appendChild(num);
      step.appendChild(plus);
      step.appendChild(unit);
      fd.appendChild(step);
      fd.appendChild(len);
    }

    if (groups.length) {
      var grid = el('div', 'sg-poll__settings');
      groups.forEach(function (g) {
        var title = (g.querySelector('.radio-label') || {}).textContent || '';
        title = title.replace(/\s+/g, ' ').trim();
        for (var i = 0; i < POLL_LABELS.length; i++) if (POLL_LABELS[i][0].test(title)) { title = POLL_LABELS[i][1]; break; }
        var f = el('div', 'sg-poll__field');
        f.setAttribute('role', 'radiogroup');
        f.setAttribute('aria-label', title);
        f.appendChild(el('span', 'sg-poll__label', title));
        var seg = el('div', 'sg-seg');
        var radios = Array.prototype.slice.call(g.querySelectorAll('input[type="radio"]'));
        seg.style.gridTemplateColumns = 'repeat(' + radios.length + ', 1fr)';
        radios.forEach(function (r) {
          var text = (r.closest('label') || {}).textContent || r.value;
          text = text.replace(/\s+/g, ' ').trim().replace(/^Quand le sondage est terminé$/i, 'À la fin');
          var lab = el('label', 'sg-seg__opt');
          lab.appendChild(r);
          var face = el('span', 'sg-seg__face');
          face.appendChild(el('span', null, text));
          lab.appendChild(face);
          seg.appendChild(lab);
        });
        f.appendChild(seg);
        grid.appendChild(f);
      });
      wrap.appendChild(grid);
    }

    /* Ce qui reste du bloc natif (libellés, champs non repris) est gardé masqué : tout champ continue d'être envoyé */
    var rest = el('div', 'sg-poll__native');
    while (bc.firstChild) rest.appendChild(bc.firstChild);
    bc.appendChild(wrap);
    bc.appendChild(rest);
  }

  /* --------------------------------------------------------------------
     Sondage affiché (page d'un sujet, et partout où Forumactif le montre) : carte « tōhyō » 投票 (le vote).
     Pattern réservé aux SONDAGES : carte de surface sur motif shippō (communauté : votes), estompé vers la gauche ;
     en tête « Sondage » en petites capitales, la question en Zen Antique, et pour le staff « Clore le sondage »
     (confirmation en fenêtre) ; les choix en lignes sélectionnables (pastille ronde, carrée si choix multiple,
     coche Asagi), « Voter » (désactivé tant que rien n'est choisi) et « Voir les résultats » ; les résultats en
     barres arrondies (Asagi, le choix en tête plus marqué), votes et pourcentage ; les mentions (votes publics,
     fin du sondage) en ligne discrète avec icône. Les champs, boutons et liens natifs sont déplacés.
     -------------------------------------------------------------------- */
  function pollCards() {
    var el = uiEl, ico = uiIco;
    Array.prototype.slice.call(document.querySelectorAll('.block')).forEach(function (b) {
      if (b.classList.contains('sg-pollc') || !b.querySelector(':scope > .block-content > form.poll, :scope > .block-content > dl.poll')) return;
      var bh = b.querySelector(':scope > .block-header');
      var bc = b.querySelector(':scope > .block-content');
      if (!bh || !bc) return;
      b.classList.add('sg-pollc', 'sg-pat', 'sg-pat--shippo');

      /* En-tête : « Sondage », la question, et l'action du staff */
      var spans = Array.prototype.slice.call(bh.querySelectorAll('h2 > span')).filter(function (x) { return !/float/.test(x.getAttribute('style') || ''); });
      var question = (spans[0] || bh).textContent.replace(/\s+/g, ' ').trim();
      var close = bh.querySelector('a[href*="close_vote"]');
      var head = el('div', 'sg-pollc__head');
      var titles = el('div', 'sg-pollc__titles');
      var kick = el('span', 'sg-pollc__kicker');
      kick.appendChild(ico('ballot'));
      kick.appendChild(el('span', null, 'Sondage'));
      titles.appendChild(kick);
      titles.appendChild(el('h2', 'sg-pollc__q', question));
      head.appendChild(titles);
      if (close) {
        var href = close.getAttribute('href');
        var cb = el('button', 'sg-pollc__close');
        cb.type = 'button';
        cb.setAttribute('aria-label', 'Clore le sondage');
        cb.setAttribute('title', 'Clore le sondage');
        cb.appendChild(ico('lock'));
        cb.addEventListener('click', function () {
          confirmModal({
            icon: 'lock', title: 'Clore ce sondage ?',
            text: 'Plus personne ne pourra voter.', confirm: 'Clore le sondage', busy: 'Un instant…', danger: true,
            onConfirm: function () { location.href = href; }
          });
        });
        head.appendChild(cb);
      }
      bh.textContent = '';
      bh.appendChild(head);

      var body = el('div', 'sg-pollc__body');
      var form = bc.querySelector(':scope > form.poll');
      var dl = bc.querySelector(':scope > dl.poll');

      /* Vote : une ligne par choix */
      if (form) {
        var opts = el('div', 'sg-pollc__opts');
        var inputs = [];
        Array.prototype.slice.call(form.querySelectorAll('.radio-wrap, label')).forEach(function (w) {
          var inp = w.querySelector('input[type="radio"], input[type="checkbox"]');
          if (!inp || inputs.indexOf(inp) >= 0) return;
          inputs.push(inp);
          var text = (w.querySelector('label > span:last-child') || w).textContent.replace(/\s+/g, ' ').trim();
          var opt = el('label', 'sg-pollc__opt' + (inp.type === 'checkbox' ? ' is-multi' : ''));
          opt.appendChild(inp);
          var mark = el('span', 'sg-pollc__mark');
          mark.appendChild(ico('check'));
          opt.appendChild(mark);
          opt.appendChild(el('span', 'sg-pollc__label', text));
          opts.appendChild(opt);
        });
        Array.prototype.slice.call(form.querySelectorAll('.radio-wrap')).forEach(function (w) { w.remove(); });
        var acts = el('div', 'sg-pollc__actions');
        var sub = form.querySelector('input[type="submit"]');
        if (sub) {
          var btn = el('button', 'sg-pollc__btn');
          btn.type = 'submit';
          btn.name = sub.name;
          btn.value = sub.value;
          btn.appendChild(ico('how_to_vote'));
          btn.appendChild(el('span', null, 'Voter'));
          sub.remove();
          acts.appendChild(btn);
          var sync = function () { btn.disabled = !inputs.some(function (i) { return i.checked; }); };
          inputs.forEach(function (i) { i.addEventListener('change', sync); });
          sync();
        }
        var resLink = form.querySelector('a[href*="viewresult"]');
        if (resLink) {
          resLink.className = 'sg-pollc__btn sg-pollc__btn--ghost';
          resLink.textContent = '';
          resLink.appendChild(ico('bar_chart'));
          resLink.appendChild(el('span', null, 'Voir les résultats'));
          acts.appendChild(resLink);
        }
        /* espaces insécables entre les boutons natifs */
        Array.prototype.slice.call(form.childNodes).forEach(function (n) { if (n.nodeType === 3) n.remove(); });
        form.insertBefore(opts, form.firstChild);
        form.appendChild(acts);
        body.appendChild(form);
      }

      /* Résultats : barres */
      if (dl) {
        var rows = [], total = '';
        Array.prototype.slice.call(dl.children).forEach(function (n) {
          if (n.tagName === 'DT' && !n.classList.contains('poll-total')) rows.push({ label: n.textContent.trim(), dd: n.nextElementSibling });
          if (n.tagName === 'DD' && n.classList.contains('poll-total')) total = n.textContent.trim();
        });
        var res = el('div', 'sg-pollc__results');
        var best = 0;
        rows.forEach(function (r) {
          r.num = parseInt(((r.dd && r.dd.querySelector('.poll-num')) || {}).textContent, 10) || 0;
          r.pct = parseFloat((((r.dd && r.dd.querySelector('.poll-percent')) || {}).textContent || '0').replace(',', '.')) || 0;
          best = Math.max(best, r.num);
        });
        rows.forEach(function (r) {
          var row = el('div', 'sg-pollc__res' + (best && r.num === best ? ' is-lead' : ''));
          var top = el('div', 'sg-pollc__resline');
          top.appendChild(el('span', 'sg-pollc__label', r.label));
          top.appendChild(el('span', 'sg-pollc__count', r.num + (r.num > 1 ? ' votes' : ' vote') + ' · ' + Math.round(r.pct) + ' %'));
          row.appendChild(top);
          var bar = el('div', 'sg-pollc__bar');
          bar.setAttribute('role', 'img');
          bar.setAttribute('aria-label', r.label + ' : ' + Math.round(r.pct) + ' %');
          var fill = el('span', 'sg-pollc__fill');
          fill.style.width = r.pct + '%';
          bar.appendChild(fill);
          row.appendChild(bar);
          res.appendChild(row);
        });
        body.appendChild(res);
        dl.classList.add('sg-hidden');
        dl.style.display = 'none';
        var back = bc.querySelector(':scope > a.btn');
        var acts2 = el('div', 'sg-pollc__actions');
        if (back) {
          back.className = 'sg-pollc__btn sg-pollc__btn--ghost';
          back.textContent = '';
          back.appendChild(ico('arrow_back'));
          back.appendChild(el('span', null, 'Revenir au vote'));
          acts2.appendChild(back);
        }
        if (total) acts2.appendChild(el('span', 'sg-pollc__total', total + (parseInt(total, 10) > 1 ? ' votes au total' : ' vote au total')));
        body.appendChild(acts2);
      }

      /* Mentions natives (votes publics, fin du sondage…) */
      var meta = el('ul', 'sg-pollc__meta');
      Array.prototype.slice.call(bc.children).forEach(function (n) {
        if (n === form || n === dl || n.tagName !== 'DIV' || !n.textContent.trim()) return;
        var li = el('li');
        var t = n.textContent;
        li.appendChild(ico(/public/i.test(t) ? 'visibility' : /anonym|priv/i.test(t) ? 'visibility_off' : /termin|fin/i.test(t) ? 'schedule' : 'info'));
        var span = el('span');
        while (n.firstChild) span.appendChild(n.firstChild);
        li.appendChild(span);
        meta.appendChild(li);
        n.remove();
      });
      if (meta.children.length) body.appendChild(meta);
      bc.insertBefore(body, bc.firstChild);
    });
  }

  /* Fenêtre de confirmation (modale) au design system : icône, titre en Zen Antique, texte, « Annuler » et
     l'action (en Ume si elle est destructive). Échap, clic sur le voile ou « Annuler » la ferment ; le focus
     reste dans la fenêtre et revient ensuite sur l'élément d'origine. opts = { icon, title, text, confirm,
     busy, danger, onConfirm(ctl) } ; ctl.fail(message) affiche une erreur, ctl.close() ferme. */
  function confirmModal(opts) {
    var prev = document.activeElement;
    var wrap = uiEl('div', 'sg-modal');
    var box = uiEl('div', 'sg-modal__box' + (opts.danger ? ' is-danger' : ''));
    var id = 'sg-modal-' + Math.random().toString(36).slice(2);
    box.setAttribute('role', 'alertdialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', id + '-t');
    box.setAttribute('aria-describedby', id + '-d');
    var ic = uiEl('span', 'sg-modal__icon');
    ic.appendChild(uiIco(opts.icon || 'help'));
    box.appendChild(ic);
    var h = uiEl('h2', 'sg-modal__title', opts.title);
    h.id = id + '-t';
    box.appendChild(h);
    var p = uiEl('p', 'sg-modal__text', opts.text);
    p.id = id + '-d';
    box.appendChild(p);
    var err = uiEl('p', 'sg-modal__error');
    err.hidden = true;
    box.appendChild(err);
    var acts = uiEl('div', 'sg-modal__actions');
    var no = uiEl('button', 'sg-modal__btn sg-modal__btn--ghost', 'Annuler');
    no.type = 'button';
    var yes = uiEl('button', 'sg-modal__btn' + (opts.danger ? ' sg-modal__btn--danger' : ''));
    yes.type = 'button';
    if (opts.danger) yes.appendChild(uiIco(opts.icon || 'delete'));
    var yesLabel = uiEl('span', null, opts.confirm || 'Confirmer');
    yes.appendChild(yesLabel);
    acts.appendChild(no);
    acts.appendChild(yes);
    box.appendChild(acts);
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    document.documentElement.classList.add('sg-modal-open');
    var busy = false;
    var close = function () {
      if (!wrap.parentNode) return;
      wrap.classList.remove('is-on');
      document.removeEventListener('keydown', onKey, true);
      setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 200);
      document.documentElement.classList.remove('sg-modal-open');
      if (prev && prev.focus) try { prev.focus({ preventScroll: true }); } catch (e) {}
    };
    var onKey = function (e) {
      if (e.key === 'Escape' && !busy) { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        e.preventDefault();
        (document.activeElement === no ? yes : no).focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap && !busy) close(); });
    no.addEventListener('click', function () { if (!busy) close(); });
    yes.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      err.hidden = true;
      wrap.classList.add('is-busy');
      yes.disabled = no.disabled = true;
      yesLabel.textContent = opts.busy || 'Un instant…';
      opts.onConfirm({
        close: close,
        fail: function (message) {
          busy = false;
          wrap.classList.remove('is-busy');
          yes.disabled = no.disabled = false;
          yesLabel.textContent = opts.confirm || 'Confirmer';
          err.textContent = message;
          err.hidden = false;
        }
      });
    });
    requestAnimationFrame(function () { wrap.classList.add('is-on'); no.focus(); });
    return { close: close };
  }

  /* Suppression d'un message depuis son menu : confirmation en fenêtre, puis envoi du formulaire natif de
     Forumactif (lu sur la page /post?p=N&mode=delete, envoyé en arrière-plan). Le message disparaît de la page ;
     si le sujet n'a plus de message, on rejoint le forum. En cas de souci, la page native prend le relais. */
  function deletePost(href, post) {
    confirmModal({
      icon: 'delete',
      title: 'Supprimer ce message ?',
      text: 'Le message sera supprimé définitivement. Cette action est irréversible.',
      confirm: 'Supprimer',
      busy: 'Suppression…',
      danger: true,
      onConfirm: function (ctl) {
        var parse = function (html) { return new DOMParser().parseFromString(html, 'text/html'); };
        fetch(href, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
          var form = Array.prototype.slice.call(parse(html).querySelectorAll('form')).filter(function (f) {
            return f.querySelector('input[name="mode"][value="delete"]');
          })[0];
          if (!form) throw new Error('form');
          var data = new URLSearchParams();
          Array.prototype.slice.call(form.querySelectorAll('input[type="hidden"]')).forEach(function (i) { data.append(i.name, i.value); });
          var ok = form.querySelector('[name="confirm"]');
          data.append(ok ? ok.name : 'confirm', ok ? ok.value : '1');
          return fetch(form.getAttribute('action') || '/post', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
          });
        }).then(function (r) { return r.text(); }).then(function (html) {
          var doc = parse(html);
          var still = doc.querySelector('form input[name="mode"][value="delete"]');
          var msg = doc.querySelector('#wrap .block .block-content, .block-content');
          var text = msg ? msg.textContent.replace(/\s+/g, ' ').trim() : '';
          if (still || !/supprim/i.test(text)) { ctl.fail(text || 'La suppression a échoué. Réessaie depuis la page de suppression.'); return; }
          ctl.close();
          var left = document.querySelectorAll('#topic .sg-post').length - 1;
          if (left <= 0) {
            var back = Array.prototype.slice.call(doc.querySelectorAll('a[href]')).map(function (a) { return a.getAttribute('href'); })
              .filter(function (h) { return /^\/f\d+/.test(h) || /\/f\d+-/.test(h); })[0];
            location.href = back || '/';
            return;
          }
          post.classList.add('is-removing');
          setTimeout(function () { if (post.parentNode) post.parentNode.removeChild(post); }, 320);
          toast('Message supprimé');
        }).catch(function () { location.href = href; });
      }
    });
  }

  /* --------------------------------------------------------------------
     Page de confirmation ou d'information : sceau « hanko » 判子 (le sceau qu'on appose pour valider un
     document). Pattern réservé aux pages où Forumactif n'affiche qu'un message (template message_body : un seul
     .block « Informations » dans #wrap) : message enregistré, supprimé, sujet verrouillé, profil mis à jour,
     erreur de droits… Une carte centrée : sceau carré au kanji (済 fait, Asagi ; 否 refusé, Ume ; 報 avis,
     Hagane) qui se pose comme un tampon, titre court en Zen Antique tiré du message, message, puis les liens
     natifs (« Cliquez ici pour… ») déplacés et devenus boutons aux libellés courts. Au-dessus, le séparateur
     avec le logo, comme sur la page d'écriture. La page ne redirige plus (noForcedRedirect).
     -------------------------------------------------------------------- */
  var NOTICE_TONES = {
    done: { kanji: '済', label: 'Fait' },
    error: { kanji: '否', label: 'Refusé' },
    info: { kanji: '報', label: 'Avis' }
  };
  var NOTICE_TITLES = [
    [/message[^.]*(enregistr|envoy|publi)/i, 'Message publié'],
    [/message[^.]*modifi/i, 'Message modifié'],
    [/message[^.]*supprim/i, 'Message supprimé'],
    [/sujet[^.]*supprim/i, 'Sujet supprimé'],
    [/sujet[^.]*déverrouill/i, 'Sujet déverrouillé'],
    [/sujet[^.]*verrouill/i, 'Sujet verrouillé'],
    [/sujet[^.]*déplac/i, 'Sujet déplacé'],
    [/sujet[^.]*(divis|scind)/i, 'Sujet divisé'],
    [/(fusionn)/i, 'Sujets fusionnés'],
    [/profil[^.]*(mis à jour|enregistr|modifi)/i, 'Profil enregistré'],
    [/(message privé|MP)[^.]*envoy/i, 'Message envoyé'],
    [/(vote|sondage)[^.]*(enregistr|pris en compte)/i, 'Vote enregistré'],
    [/(favori)/i, 'Favoris mis à jour'],
    [/(surveill|suivi)/i, 'Suivi mis à jour']
  ];
  var NOTICE_LINKS = [
    [/voir (votre|le|ce|mon) message|voir le message/i, 'Voir le message', 'visibility'],
    [/sujet/i, 'Retour au sujet', 'forum'],
    [/forum/i, 'Retour au forum', 'view_agenda'],
    [/(index|accueil)/i, 'Retour à l’accueil', 'home'],
    [/profil/i, 'Voir mon profil', 'person'],
    [/(message|boîte) priv|messagerie/i, 'Ma messagerie', 'mail']
  ];

  function noticePage() {
    var wrap = document.getElementById('wrap');
    if (!wrap || wrap.querySelector('.sg-notice')) return;
    /* Un seul .block ; les autres enfants ne peuvent être que des scripts, des styles ou des emplacements
       publicitaires de Forumactif (div sans classe), comme sur /modcp */
    var kids = Array.prototype.slice.call(wrap.children).filter(function (c) { return !/^(SCRIPT|STYLE)$/.test(c.tagName); });
    var blocks = kids.filter(function (c) { return c.classList.contains('block'); });
    var others = kids.filter(function (c) { return blocks.indexOf(c) < 0; });
    if (blocks.length !== 1 || others.some(function (c) { return c.className || c.tagName !== 'DIV'; })) return;
    var block = blocks[0];
    var hd = block.querySelector(':scope > .block-header');
    var body = block.querySelector(':scope > .block-content');
    if (!hd || !body || body.querySelector('form, input, textarea, select')) return;

    /* Le message, ligne par ligne (Forumactif sépare par des <br>) : les lignes avec un lien deviennent des boutons */
    var lines = [[]];
    Array.prototype.slice.call(body.childNodes).forEach(function (n) {
      if (n.nodeName === 'BR') lines.push([]);
      else lines[lines.length - 1].push(n);
    });
    var text = [], links = [];
    lines.forEach(function (nodes) {
      var holder = document.createElement('span');
      nodes.forEach(function (n) { holder.appendChild(n.cloneNode(true)); });
      var t = holder.textContent.replace(/\s+/g, ' ').trim();
      if (!t) return;
      var a = null;
      nodes.forEach(function (n) {
        if (a || n.nodeType !== 1) return;
        a = n.tagName === 'A' ? n : n.querySelector('a[href]');
      });
      if (a) links.push({ a: a, text: t });
      else text.push(t);
    });
    var message = text.join(' ');
    var title = hd.textContent.replace(/\s+/g, ' ').trim();
    var all = title + ' ' + message;
    var tone = /(désolé|erreur|impossible|ne pouvez|ne pouvez pas|n'existe|n’existe|interdit|refus|pas autoris|pas la permission|incorrect|invalide|échou)/i.test(all) ? 'error'
      : /(succès|enregistr|supprim|envoy|mis à jour|modifi|verrouill|déplac|ajout|publi|fusionn|divis)/i.test(all) ? 'done' : 'info';
    if (/^(informations?|information|message)$/i.test(title) || !title) {
      title = tone === 'error' ? 'Action impossible' : tone === 'done' ? 'C’est fait' : 'Information';
      for (var i = 0; i < NOTICE_TITLES.length && tone === 'done'; i++) {
        if (NOTICE_TITLES[i][0].test(message)) { title = NOTICE_TITLES[i][1]; break; }
      }
    }

    var card = uiEl('section', 'sg-notice sg-notice--' + tone);
    card.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    card.setAttribute('aria-labelledby', 'sg-notice-title');
    var seal = uiEl('div', 'sg-notice__seal');
    seal.setAttribute('aria-hidden', 'true');
    seal.appendChild(uiEl('span', 'sg-notice__kanji', NOTICE_TONES[tone].kanji));
    card.appendChild(seal);
    var h = uiEl('h1', 'sg-notice__title', title);
    h.id = 'sg-notice-title';
    card.appendChild(h);
    if (message) card.appendChild(uiEl('p', 'sg-notice__text', message));
    if (links.length) {
      var acts = uiEl('div', 'sg-notice__actions');
      links.forEach(function (l, i) {
        var phrase = l.text.replace(/^cliquez\s+(ici\s+)?(pour\s+)?/i, '').replace(/[.!]\s*$/, '');
        var label = phrase.charAt(0).toUpperCase() + phrase.slice(1), icon = 'arrow_forward';
        for (var j = 0; j < NOTICE_LINKS.length; j++) {
          if (NOTICE_LINKS[j][0].test(phrase)) { label = NOTICE_LINKS[j][1]; icon = NOTICE_LINKS[j][2]; break; }
        }
        var a = l.a;
        a.className = 'sg-action' + (i ? ' sg-action--ghost' : '');
        a.textContent = '';
        a.appendChild(uiIco(icon));
        a.appendChild(uiEl('span', null, label));
        a.setAttribute('title', l.text);
        acts.appendChild(a);
      });
      card.appendChild(acts);
    }

    /* Séparateur avec le logo au-dessus, comme sur la page d'écriture */
    var top = uiEl('div', 'sg-divider sg-divider--notice');
    top.setAttribute('role', 'separator');
    var logo = uiEl('span', 'sg-divider__logo sg-divider__logo--mask');
    logo.setAttribute('aria-hidden', 'true');
    top.appendChild(logo);
    var rule = uiEl('span', 'sg-divider__rule');
    rule.setAttribute('aria-hidden', 'true');
    rule.appendChild(uiEl('span', 'sg-divider__line'));
    rule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
    rule.appendChild(uiEl('span', 'sg-divider__line'));
    top.appendChild(rule);

    wrap.insertBefore(top, block);
    wrap.insertBefore(card, block);
    block.classList.add('sg-notice-native');
    document.body.classList.add('sg-noticepage');
    /* La bannière occupe le haut de l'écran : défilement doux jusqu'au message (sans animation si le système le
       demande), une fois la page posée */
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      if (window.scrollY > 40) return; /* le lecteur a déjà défilé */
      top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }, 150);
    document.title = title;
  }

  /* Erreurs de saisie (template error_body : .block.block-error, ex. « Vous devez entrer un message avant de
     poster. ») : encart du design system, de la famille du sceau « hanko » : petit sceau 否 en Ume, message, sur
     un fond teinté d'Ume, sans contour. Sur la page d'écriture, l'encart rejoint la colonne de la lettre, juste
     au-dessus d'elle (le bloc de l'éditeur, lui, n'est pas déplacé). */
  function errorBlocks() {
    Array.prototype.slice.call(document.querySelectorAll('#wrap .block.block-error:not(.sg-alert)')).forEach(function (b) {
      b.classList.add('sg-alert');
      b.setAttribute('role', 'alert');
      var seal = uiEl('span', 'sg-alert__seal');
      seal.setAttribute('aria-hidden', 'true');
      seal.appendChild(uiEl('span', null, '否'));
      b.insertBefore(seal, b.firstChild);
      var box = document.getElementById('postingbox');
      var form = box && box.parentNode && box.parentNode.classList && box.parentNode.classList.contains('sg-writeform') ? box.parentNode : null;
      if (form && !form.contains(b)) form.insertBefore(b, box);
    });
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
