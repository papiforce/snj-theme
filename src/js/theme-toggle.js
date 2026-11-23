/* ==========================================================================
   SNJ — Bouton clair/sombre
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript
   Placement : "Sur toutes les pages".
   Dépend de head-snippet.html (qui pose data-theme avant l'affichage).
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'snj-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('sg-theme-toggle');
    if (!btn) return;
    var next = theme === 'dark' ? 'clair' : 'sombre';
    btn.setAttribute('aria-label', 'Passer en thème ' + next);
    btn.setAttribute('title', 'Passer en thème ' + next);
    btn.firstChild.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  function toggle() {
    var theme = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    apply(theme);
  }

  function mount() {
    if (document.getElementById('sg-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'sg-theme-toggle';
    btn.type = 'button';
    var icon = document.createElement('i');
    icon.className = 'material-symbols-outlined';
    btn.appendChild(icon);
    btn.addEventListener('click', toggle);

    var anchor = document.getElementById('header-notif') || document.getElementById('header-user');
    var header = document.querySelector('body > header');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(btn, anchor);
    } else if (header) {
      header.appendChild(btn);
    } else {
      return;
    }
    apply(current());
  }

  /* Tant que le membre n'a rien choisi, on suit l'appareil en direct. */
  if (media) {
    var onChange = function (e) {
      if (!stored()) apply(e.matches ? 'light' : 'dark');
    };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
