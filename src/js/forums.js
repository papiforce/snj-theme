/* ==========================================================================
   SNJ — Catégories de l'accueil (sélecteur + cartes de forums)
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript
   Placement : "Sur la page d'accueil" (index) uniquement.
   Dépend de : src/css/components/40-zones.css (servi par jsDelivr)

   Lit la liste native des catégories d'AwesomeBB (template index_box), puis
   construit à la place :
   - à gauche, un sélecteur de catégories (collant au défilement) ; sur mobile,
     un menu déroulant personnalisé ;
   - à droite, les forums de la catégorie choisie, en cartes.
   La catégorie active est dans l'adresse (?onglet=hi-no-kuni) et mémorisée dans
   le navigateur (clé snj-onglet). Tant que ce script n'a pas tourné, la liste
   native reste affichée.

   Données d'une carte : description du forum dans le PA, précédée d'une balise
   invisible, par exemple :
   <span class="sg-meta" data-kanji="焔の森" data-image="https://…" data-danger="4"
         data-clan="Hyuga" data-clan-href="https://…/clans/hyuga/" hidden></span>
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     CONFIGURATION — entrées du sélecteur, dans l'ordre d'affichage.
     category : nom exact de la catégorie Forumactif (vide = pas encore créée).
     icon : icône Material Symbols, ou kanji : signe affiché dans la pastille.
     ---------------------------------------------------------------------- */
  var ZONES = [
    { slug: 'gestion', label: 'Gestion', icon: 'badge', color: 'var(--sg-contrast)', on: 'var(--sg-on-contrast)', category: 'Gestion', rp: false },
    { slug: 'hi-no-kuni', label: 'Hi no Kuni', sub: 'Pays du Feu', kanji: '火', color: 'var(--sg-nation-hi)', category: 'Hi no Kuni', rp: true },
    { slug: 'mizu-no-kuni', label: 'Mizu no Kuni', sub: "Pays de l'Eau", kanji: '水', color: 'var(--sg-nation-mizu)', category: 'Mizu no Kuni', rp: true },
    { slug: 'kaze-no-kuni', label: 'Kaze no Kuni', sub: 'Pays du Vent', kanji: '風', color: 'var(--sg-nation-kaze)', category: 'Kaze no Kuni', rp: true },
    { slug: 'kaminari-no-kuni', label: 'Kaminari no Kuni', sub: 'Pays de la Foudre', kanji: '雷', color: 'var(--sg-nation-kaminari)', category: 'Kaminari no Kuni', rp: true },
    { slug: 'tsuchi-no-kuni', label: 'Tsuchi no Kuni', sub: 'Pays de la Terre', kanji: '土', color: 'var(--sg-nation-tsuchi)', category: 'Tsuchi no Kuni', rp: true },
    { slug: 'reste-du-sekai', label: 'Reste du Sekai', kanji: '他', color: 'var(--sg-nation-autres)', category: 'Reste du Sekai', rp: true }
  ];
  var PARAM = 'onglet';
  var STORE = 'snj-onglet';
  var DEFAULT = 'gestion';

  /* Forumactif charge les modules dans le <head> : on attend la page */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init() {
  var index = document.getElementById('index');
  if (!index || document.getElementById('sg-zones')) return;
  /* Le CSS des composants doit être chargé, sinon on laisse la liste native */
  if (!getComputedStyle(document.documentElement).getPropertyValue('--sg-zones').trim()) return;

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') el.setAttribute('style', v);
        else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function icon(name) {
    return h('span', { class: 'material-symbols-outlined', 'aria-hidden': 'true', text: name });
  }

  function text(el) {
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  /* Espaces insécables avant la ponctuation haute (typographie française) */
  function fr(s) {
    return String(s || '').replace(/ ([:;!?»])/g, '\u202f$1').replace(/« /g, '«\u202f');
  }

  function cssUrl(u) {
    return "url('" + String(u).replace(/['"\\()]/g, encodeURIComponent) + "')";
  }

  /* ----------------------------------------------------------------------
     Lecture de la liste native
     ---------------------------------------------------------------------- */
  var blocks = Array.prototype.slice.call(index.querySelectorAll('.forum.type-table-forum'));
  if (!blocks.length) return;

  function readForum(sec) {
    var link = sec.querySelector('.forum-description h3 a');
    var desc = sec.querySelector('.forum-description p');
    var meta = sec.querySelector('.sg-meta');
    var d = meta ? meta.dataset : {};
    var lp = sec.querySelector('.forum-lastpost');
    var topic = lp && lp.querySelector('a.topic-title');
    var author = lp && lp.querySelector('.forum-lastpost-author');
    var authorLink = author && author.querySelector('a');
    var time = lp && lp.querySelector('.forum-lastpost-time a');
    var avatar = lp && lp.querySelector('.avatar-default img');
    var cls = sec.className;
    return {
      name: text(link),
      href: link ? link.getAttribute('href') : '#',
      desc: text(desc),
      kanji: d.kanji || '',
      image: d.image || '',
      danger: d.danger ? Math.max(0, Math.min(5, parseInt(d.danger, 10) || 0)) : null,
      clan: d.clan || '',
      clanHref: d.clanHref || '',
      unread: /(^|\s)(forum|cat)_new(\s|$)/.test(cls) || /_new_/.test(cls),
      subs: Array.prototype.slice.call(sec.querySelectorAll('.forum-description > a.gensmall')).map(function (a) {
        return { name: text(a), href: a.getAttribute('href') };
      }),
      last: topic ? {
        title: topic.getAttribute('title') || text(topic),
        href: (time && time.getAttribute('href')) || topic.getAttribute('href'),
        author: text(authorLink || author),
        authorHref: authorLink ? authorLink.getAttribute('href') : null,
        time: text(time),
        avatar: avatar ? avatar.getAttribute('src') : null
      } : null
    };
  }

  var forumsByCategory = {};
  blocks.forEach(function (b) {
    var name = text(b.querySelector('.forum-header .category-title h2'));
    forumsByCategory[name] = Array.prototype.slice.call(b.querySelectorAll(':scope > .forum-section')).map(readForum);
  });

  /* ----------------------------------------------------------------------
     Cartes
     ---------------------------------------------------------------------- */
  function danger(level) {
    var bars = [];
    for (var i = 1; i <= 5; i++) bars.push(h('span', { class: 'sg-danger__bar' + (i <= level ? ' is-on' : '') }));
    return h('div', { class: 'sg-danger', role: 'img', 'aria-label': 'Dangerosité : ' + level + ' sur 5' }, [
      h('span', { class: 'sg-danger__label', text: 'Dangerosité' }),
      h('span', { class: 'sg-danger__bars', 'aria-hidden': 'true' }, bars)
    ]);
  }

  function lastPost(f) {
    if (!f.last) {
      return h('div', { class: 'sg-zcard__last is-empty' }, [
        h('span', { class: 'sg-zcard__last-text' }, [h('span', { class: 'sg-zcard__last-title', text: 'Aucun message pour l’instant' })])
      ]);
    }
    var l = f.last;
    return h('a', { class: 'sg-zcard__last', href: l.href, 'aria-label': 'Dernier message : ' + l.title + ', par ' + l.author + ', ' + l.time }, [
      h('span', { class: 'sg-zcard__last-text' }, [
        h('span', { class: 'sg-zcard__last-title', text: l.title }),
        h('span', { class: 'sg-zcard__last-meta', text: l.time }),
        h('span', { class: 'sg-zcard__last-author', text: l.author })
      ]),
      l.avatar ? h('img', { class: 'sg-zcard__last-avatar', src: l.avatar, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' })
        : h('span', { class: 'sg-zcard__last-avatar is-empty' }, [icon('person')])
    ]);
  }

  function card(f, zone) {
    var plain = !f.image;
    var panel = h('div', { class: 'sg-zcard__panel' }, [
      f.kanji ? h('span', { class: 'sg-zcard__kanji', 'aria-hidden': 'true', text: f.kanji }) : null,
      h('h3', { class: 'sg-zcard__title' }, [
        h('a', { href: f.href }, [f.name]),
        f.unread ? h('span', { class: 'sg-zcard__new', title: 'Nouveaux messages' }, [h('span', { class: 'sg-visually-hidden', text: 'Nouveaux messages' })]) : null
      ]),
      f.desc ? h('p', { class: 'sg-zcard__desc', text: fr(f.desc) }) : null,
      f.clan && f.clanHref ? h('a', { class: 'sg-zcard__clan', href: f.clanHref, target: '_blank', rel: 'noopener' }, ['Clan ' + f.clan, icon('north_east')]) : null,
      zone.rp && f.danger !== null ? danger(f.danger) : null
    ]);
    var aside = f.subs.length ? h('ul', { class: 'sg-zcard__subs', 'aria-label': 'Sous-forums de ' + f.name }, f.subs.map(function (s) {
      return h('li', null, [h('a', { href: s.href }, [h('span', { text: s.name }), icon('arrow_forward')])]);
    })) : null;

    return h('article', { class: 'sg-zcard' + (plain ? ' sg-zcard--plain sg-pat sg-pat--seigaiha' : '') + (aside ? '' : ' sg-zcard--nosubs') }, [
      plain ? null : h('span', { class: 'sg-zcard__img', style: 'background-image:' + cssUrl(f.image), 'aria-hidden': 'true' }),
      h('div', { class: 'sg-zcard__main' }, [panel, lastPost(f)]),
      aside
    ]);
  }

  function panelFor(zone) {
    var forums = zone.category ? forumsByCategory[zone.category] : null;
    var body;
    if (forums && forums.length) {
      body = forums.map(function (f) { return card(f, zone); });
    } else {
      body = [h('div', { class: 'sg-zones__empty' }, [
        h('span', { class: 'sg-zones__empty-sign', 'aria-hidden': 'true', text: zone.kanji || '' }, zone.kanji ? null : [icon(zone.icon)]),
        h('p', { class: 'sg-zones__empty-title', text: 'Prochainement' }),
        h('p', { class: 'sg-zones__empty-text', text: fr('Les régions de ' + zone.label + ' ouvriront bientôt.') })
      ])];
    }
    return h('div', { class: 'sg-zones__panel', id: 'sg-zone-' + zone.slug, role: 'tabpanel', 'aria-labelledby': 'sg-zone-tab-' + zone.slug, hidden: true, style: zoneStyle(zone) }, body);
  }

  function zoneStyle(zone) {
    return '--zc:' + zone.color + ';' + (zone.on ? '--zc-on:' + zone.on + ';' : '');
  }

  function sign(zone) {
    return zone.kanji ? h('span', { class: 'sg-zone-tab__sign is-kanji', 'aria-hidden': 'true', text: zone.kanji })
      : h('span', { class: 'sg-zone-tab__sign', 'aria-hidden': 'true' }, [icon(zone.icon)]);
  }

  function label(zone) {
    return h('span', { class: 'sg-zone-tab__label' }, [
      h('span', { class: 'sg-zone-tab__name', text: zone.label }),
      zone.sub ? h('span', { class: 'sg-zone-tab__sub', text: zone.sub }) : null
    ]);
  }

  /* ----------------------------------------------------------------------
     Sélecteur (onglets sur ordinateur, menu déroulant sur mobile)
     ---------------------------------------------------------------------- */
  var tabs = ZONES.map(function (z) {
    return h('button', {
      type: 'button', class: 'sg-zone-tab', role: 'tab', id: 'sg-zone-tab-' + z.slug,
      'aria-controls': 'sg-zone-' + z.slug, 'aria-selected': 'false', tabindex: '-1',
      style: zoneStyle(z), onclick: function () { select(z.slug, true); }
    }, [sign(z), label(z)]);
  });
  var nav = h('div', { class: 'sg-zones__nav', role: 'tablist', 'aria-label': 'Catégories du forum', 'aria-orientation': 'vertical' }, tabs);

  nav.addEventListener('keydown', function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var j = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    tabs[j].focus();
    select(ZONES[j].slug, true);
  });

  /* Menu déroulant personnalisé (mobile) */
  var current = h('span', { class: 'sg-zone-select__current' });
  var trigger = h('button', {
    type: 'button', class: 'sg-zone-select__button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false',
    'aria-label': 'Choisir une catégorie', onclick: function () { toggleList(); }
  }, [current, icon('expand_more')]);
  var options = ZONES.map(function (z) {
    return h('li', {
      class: 'sg-zone-option', role: 'option', id: 'sg-zone-opt-' + z.slug, 'aria-selected': 'false',
      tabindex: '-1', style: zoneStyle(z),
      onclick: function () { select(z.slug, true); toggleList(false); trigger.focus(); }
    }, [sign(z), label(z)]);
  });
  var list = h('ul', { class: 'sg-zone-select__list', role: 'listbox', 'aria-label': 'Catégories du forum', hidden: true }, options);
  var picker = h('div', { class: 'sg-zone-select' }, [trigger, list]);

  function toggleList(force) {
    var open = typeof force === 'boolean' ? force : list.hidden;
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    picker.classList.toggle('is-open', open);
    if (open) {
      var sel = list.querySelector('[aria-selected="true"]') || options[0];
      sel.focus();
    }
  }

  list.addEventListener('keydown', function (e) {
    var i = options.indexOf(document.activeElement);
    if (e.key === 'Escape' || e.key === 'Tab') { toggleList(false); if (e.key === 'Escape') trigger.focus(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) options[i].click(); return; }
    var j = null;
    if (e.key === 'ArrowDown') j = Math.min(options.length - 1, i + 1);
    if (e.key === 'ArrowUp') j = Math.max(0, i - 1);
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = options.length - 1;
    if (j !== null) { e.preventDefault(); options[j].focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!list.hidden && !picker.contains(e.target)) toggleList(false);
  });

  /* ----------------------------------------------------------------------
     Montage
     ---------------------------------------------------------------------- */
  var panels = ZONES.map(panelFor);
  var root = h('section', { id: 'sg-zones', class: 'sg-zones', 'aria-label': 'Forums' }, [
    h('div', { class: 'sg-zones__aside' }, [nav, picker]),
    h('div', { class: 'sg-zones__panels' }, panels)
  ]);
  blocks[0].parentNode.insertBefore(root, blocks[0]);
  document.body.classList.add('sg-zones-on');

  function select(slug, user) {
    var i = 0;
    ZONES.forEach(function (z, k) { if (z.slug === slug) i = k; });
    var zone = ZONES[i];
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
      t.tabIndex = k === i ? 0 : -1;
    });
    options.forEach(function (o, k) { o.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    panels.forEach(function (p, k) { p.hidden = k !== i; });
    current.replaceChildren(sign(zone), label(zone));
    trigger.setAttribute('style', zoneStyle(zone));
    if (user) {
      try { localStorage.setItem(STORE, zone.slug); } catch (e) {}
      try {
        var url = new URL(location.href);
        url.searchParams.set(PARAM, zone.slug);
        history.replaceState(history.state, '', url);
      } catch (e) {}
    }
  }

  function initial() {
    var fromUrl = null;
    var stored = null;
    try { fromUrl = new URL(location.href).searchParams.get(PARAM); } catch (e) {}
    try { stored = localStorage.getItem(STORE); } catch (e) {}
    var valid = function (s) { return ZONES.some(function (z) { return z.slug === s; }); };
    return valid(fromUrl) ? fromUrl : valid(stored) ? stored : DEFAULT;
  }

  select(initial(), false);

  /* Retour arrière depuis le cache du navigateur : réapplique l'onglet de l'adresse */
  window.addEventListener('pageshow', function () { select(initial(), false); });
  }
})();
