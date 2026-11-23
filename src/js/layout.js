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
     ---------------------------------------------------------------------- */
  var NAV = [
    { label: 'Accueil', icon: 'home', href: '/' },
    { label: 'Derniers messages', icon: 'history', href: '/latest' },
    { label: 'Membres', icon: 'group', href: '/memberlist' },
    { label: 'Rechercher', icon: 'search', href: '/search' },
    { label: 'Annexe', icon: 'menu_book', href: 'https://snj-base-de-donnees.vercel.app/', external: true }
    /* { label: 'Discord', icon: 'forum', href: 'https://discord.gg/…', external: true } */
  ];

  var THEME_KEY = 'snj-theme';
  var root = document.documentElement;

  /* ----------------------------------------------------------------------
     Thème clair/sombre
     ---------------------------------------------------------------------- */
  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
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
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    applyTheme(theme);
  }

  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
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
    el.appendChild(icon(opts.icon));
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
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      brand.appendChild(img);
    } else {
      var k = document.createElement('span');
      k.className = 'sg-sb-kanji';
      k.setAttribute('aria-hidden', 'true');
      k.textContent = '戦';
      brand.appendChild(k);
    }
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
      var notif = item({
        label: 'Notifications',
        icon: 'notifications',
        badge: true,
        onClick: function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (nativeNotif) nativeNotif.click();
        }
      });
      bottom.appendChild(notif);
      syncBadge(nativeNotif, notif.querySelector('.sg-sb-badge'));

      bottom.appendChild(item({ label: 'Messagerie', icon: 'mail', href: '/privmsg?folder=inbox' }));

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
    applyTheme(currentTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
