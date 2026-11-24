/* ==========================================================================
   SNJ — Statistiques de l'accueil (remplace le bloc « Qui est en ligne »)
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript (module 13)
   Placement : "Sur l'index" uniquement.
   Dépend de : src/css/components/45-stats.css et 08-groups.css (servis par jsDelivr),
   et de l'extrait src/templates/index_body-snippet.html (nombre de messages, de membres,
   dernier inscrit), à insérer dans le template index_body.

   Grille « bento » de 12 colonnes, comme les widgets du haut :
   - Chroniques       : messages publiés (compteur animé) et nombre de membres, motif kikkō
   - Dernier inscrit  : avatar, pseudo à la couleur de son pays, sceau 新
   - En ce moment     : enregistrés, invisibles et invités en une jauge, record en discret
   - Récemment connectés (24 h) : pseudos colorés par pays, icône pour le staff
   - Groupes          : bannières nobori, une par groupe, avec le nombre de membres

   Données lues dans la page (aucune écriture) :
   - #block-online : bloc natif d'AwesomeBB (connectés, record, connectés des 24 h, légende)
   - #sg-stats-data : extrait ajouté au template index_body
   - pages des groupes Staffeux et Modérateurs (icône staff), avatars via /memberlist ;
     les deux sont gardés en mémoire pour la session (sessionStorage).
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     RÉGLAGES
     ---------------------------------------------------------------------- */
  var CONFIG = {
    /* Groupes connus, par fin d'adresse (/g3-hi-no-kuni → hi-no-kuni) */
    groups: {
      'hi-no-kuni': { kanji: '火', sub: 'Pays du Feu', tone: 'hi' },
      'mizu-no-kuni': { kanji: '水', sub: "Pays de l'Eau", tone: 'mizu' },
      'kaze-no-kuni': { kanji: '風', sub: 'Pays du Vent', tone: 'kaze' },
      'kaminari-no-kuni': { kanji: '雷', sub: 'Pays de la Foudre', tone: 'kaminari' },
      'tsuchi-no-kuni': { kanji: '土', sub: 'Pays de la Terre', tone: 'tsuchi' },
      'shokoku': { kanji: '他', sub: 'Les petits pays', tone: 'autres' },
      'moderateurs': { icon: 'gavel', sub: 'Modération', tone: 'mod', staff: true },
      'staffeux': { icon: 'shield_person', sub: 'Administration', tone: 'staff', staff: true }
    },
    /* La légende compte aussi le modérateur du groupe (un compte du staff, qui n'en est pas membre) */
    legendIncludesModerator: true,
    /* Pseudos affichés avant « + N autres » */
    recentMax: 24,
    cacheMinutes: 15
  };

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
      if (c === null || c === undefined) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function icon(name, cls) {
    return h('span', { class: 'material-symbols-outlined' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true', text: name });
  }

  function num(s) {
    var n = parseInt(String(s || '').replace(/[^\d]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  function fmt(n) {
    return Number(n).toLocaleString('fr-FR');
  }

  function plural(n, one, many) {
    return n > 1 ? many : one;
  }

  function slugOf(href) {
    return String(href || '').replace(/^.*\/g\d+-?/, '').replace(/[?#].*$/, '');
  }

  function uidOf(href) {
    var m = String(href || '').match(/\/u(\d+)/);
    return m ? m[1] : '';
  }

  /* Les trois magatama du logo de Sengoku no Jidai, pleins (tracés de assets/snj-logo-outline.svg, sans le cercle) */
  var MAGATAMA = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 21 56 56" fill="currentColor">' +
    '<path d="M73.3 51.0Q72.5 50.3 70.6 49.4Q68.8 48.4 66.4 48.3Q64.1 48.2 61.9 49.1Q59.7 49.9 58.2 51.2Q56.7 52.6 55.6 54.4Q54.6 56.2 54.2 58.1Q53.9 60.0 54.2 61.6Q54.6 63.2 55.5 64.7Q56.4 66.3 57.4 67.5Q58.5 68.8 58.5 69.1Q58.6 69.5 57.3 71.1Q56.0 72.7 54.6 73.7Q53.2 74.7 53.3 75.1Q53.3 75.6 56.3 75.6Q59.3 75.7 62.4 74.8Q65.5 74.0 67.9 72.7Q70.3 71.3 72.0 69.6Q73.8 67.9 74.6 66.6Q75.3 65.4 75.9 64.0Q76.6 62.5 76.7 60.2Q76.9 57.8 76.7 56.8Q76.6 55.8 76.1 54.7Q75.6 53.6 74.8 52.6Q74.1 51.7 73.3 51.0Z"/>' +
    '<path d="M31.1 43.2Q30.8 43.1 30.4 43.4Q29.9 43.8 28.9 45.1Q27.9 46.4 26.5 49.3Q25.1 52.2 24.6 54.6Q24.1 57.0 24.3 60.0Q24.4 62.9 25.3 65.2Q26.1 67.4 27.0 68.7Q27.9 70.0 28.8 70.8Q29.7 71.7 30.7 72.3Q31.8 73.0 32.9 73.4Q34.0 73.8 36.3 73.8Q38.5 73.8 40.6 72.9Q42.6 72.0 43.8 71.0Q44.9 70.0 45.5 69.0Q46.2 68.1 46.7 67.0Q47.1 66.0 47.3 64.6Q47.5 63.2 47.3 61.0Q47.1 58.9 46.1 56.9Q45.1 54.9 43.5 53.6Q42.0 52.2 40.1 51.6Q38.2 51.0 35.4 50.9Q32.6 50.9 32.3 50.4Q32.0 50.0 31.7 48.5Q31.4 47.1 31.4 45.2Q31.4 43.3 31.1 43.2Z"/>' +
    '<path d="M37.2 30.3Q36.7 31.6 36.7 34.1Q36.7 36.6 37.5 38.4Q38.3 40.2 39.8 41.8Q41.4 43.4 43.6 44.4Q45.8 45.3 48.3 45.4Q50.9 45.4 52.5 44.8Q54.0 44.2 55.4 42.9Q56.8 41.6 58.0 39.3Q59.2 37.1 59.7 36.6Q60.3 36.0 61.9 36.4Q63.6 36.7 65.3 37.6Q67.0 38.5 67.2 38.5Q67.5 38.5 67.6 38.3Q67.7 38.1 66.7 35.8Q65.7 33.5 63.8 31.1Q61.9 28.7 59.8 27.0Q57.6 25.3 55.1 24.3Q52.7 23.3 51.3 23.2Q49.9 23.0 48.0 23.0Q46.1 23.1 44.1 23.8Q42.1 24.4 41.1 25.1Q40.2 25.8 39.4 26.6Q38.6 27.5 38.1 28.2Q37.6 29.0 37.2 30.3Z"/>' +
    '</svg>';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Petit cache de session avec durée de vie */
  function cacheGet(key) {
    try {
      var v = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (v && Date.now() - v.t < CONFIG.cacheMinutes * 60000) return v.d;
    } catch (e) {}
    return null;
  }

  function cacheSet(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) {}
  }

  function fetchDoc(url) {
    return fetch(url, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
  }

  /* ----------------------------------------------------------------------
     Lecture des données
     ---------------------------------------------------------------------- */
  function read(block) {
    var inner = block.querySelector(':scope > div') || block;
    var segments = inner.innerHTML.split(/<br\s*\/?>/i).map(function (html) {
      var t = document.createElement('template');
      t.innerHTML = html;
      return t.content;
    });
    var textOf = function (frag) { return (frag.textContent || '').replace(/\s+/g, ' ').trim(); };
    var find = function (re) {
      for (var i = 0; i < segments.length; i++) if (re.test(textOf(segments[i]))) return segments[i];
      return null;
    };
    var people = function (frag) {
      if (!frag) return [];
      return Array.prototype.slice.call(frag.querySelectorAll('a[href]')).filter(function (a) {
        return /^\/u\d+/.test(a.getAttribute('href'));
      }).map(function (a) {
        var span = a.querySelector('span[style], span[class*="group-"]') || a;
        return {
          name: a.textContent.trim(),
          href: a.getAttribute('href'),
          uid: uidOf(a.getAttribute('href')),
          style: span.getAttribute('style') || '',
          cls: (span.className || '').replace(/[^\w\s-]/g, '')
        };
      });
    };

    var onlineText = textOf(find(/en tout/i) || document.createDocumentFragment());
    var recordText = textOf(find(/record/i) || document.createDocumentFragment());
    var recordMatch = recordText.match(/(\d[\d\s]*)\s*le\s+(.+)$/i);

    var legend = Array.prototype.slice.call(inner.querySelectorAll('em a[href^="/g"], a.usr_grp_clr[href^="/g"]'));
    var seen = {};
    var groups = legend.map(function (a) {
      var href = a.getAttribute('href');
      if (seen[href]) return null;
      seen[href] = true;
      var count = num((a.getAttribute('title') || '').split(':').pop());
      if (CONFIG.legendIncludesModerator) count = Math.max(0, count - 1);
      return {
        name: a.textContent.trim(),
        href: href,
        slug: slugOf(href),
        style: a.getAttribute('style') || '',
        count: count
      };
    }).filter(Boolean);

    var data = document.getElementById('sg-stats-data');
    var part = function (k) { return data ? data.querySelector('[data-k="' + k + '"]') : null; };
    var strongNum = function (el) { var s = el && el.querySelector('strong'); return s ? num(s.textContent) : null; };
    var newest = people(part('newest'))[0] || null;

    return {
      total: num((onlineText.match(/en tout\s*(\d[\d\s]*)/i) || [])[1]),
      registered: num((onlineText.match(/(\d+)\s*Enregistr/i) || [])[1]),
      hidden: num((onlineText.match(/(\d+)\s*Invisible/i) || [])[1]),
      guests: num((onlineText.match(/(\d+)\s*Invit/i) || [])[1]),
      record: recordMatch ? { count: num(recordMatch[1]), date: recordMatch[2].trim() } : null,
      online: people(find(/Utilisateurs enregistr/i)),
      recent: people(find(/derni[eè]res heures/i)),
      groups: groups,
      posts: strongNum(part('posts')),
      users: strongNum(part('users')),
      newest: newest
    };
  }

  /* ----------------------------------------------------------------------
     Pseudo coloré (couleur du groupe reprise de Forumactif, rebranchée sur
     nos tokens par 08-groups.css), icône pour le staff
     ---------------------------------------------------------------------- */
  function person(p) {
    return h('a', { class: 'sg-person', href: p.href, 'data-uid': p.uid }, [
      h('span', { class: 'sg-person__name ' + p.cls, style: p.style, text: p.name })
    ]);
  }

  function markStaff(scope, groups) {
    var targets = groups.filter(function (g) { return (CONFIG.groups[g.slug] || {}).staff; });
    if (!targets.length) return;
    var paint = function (ids) {
      scope.querySelectorAll('.sg-person[data-uid]').forEach(function (el) {
        if (ids.indexOf(el.getAttribute('data-uid')) === -1 || el.querySelector('.sg-person__staff')) return;
        /* Magatama du logo de Sengoku no Jidai : marque du staff */
        var mark = h('span', { class: 'sg-person__staff', title: 'Staff', role: 'img', 'aria-label': 'Staff' });
        mark.innerHTML = MAGATAMA;
        el.appendChild(mark);
      });
    };
    var cached = cacheGet('snj-staff');
    if (cached) { paint(cached); return; }
    Promise.all(targets.map(function (g) {
      return fetchDoc(g.href).then(function (doc) {
        return Array.prototype.slice.call(doc.querySelectorAll('tr a[href]')).map(function (a) {
          return /^\/u\d+$/.test(a.getAttribute('href')) ? uidOf(a.getAttribute('href')) : '';
        }).filter(Boolean);
      }).catch(function () { return []; });
    })).then(function (lists) {
      var ids = [];
      lists.forEach(function (l) { l.forEach(function (id) { if (ids.indexOf(id) === -1) ids.push(id); }); });
      cacheSet('snj-staff', ids);
      paint(ids);
    });
  }


  /* Avatar du membre connecté : toujours celui que Forumactif fournit sur la page (_userdata), jamais un cache */
  function ownAvatar(uid) {
    try {
      var u = window._userdata;
      if (u && u.session_logged_in && String(u.user_id) === String(uid)) {
        var m = String(u.avatar || '').match(/src="([^"]+)"/);
        if (m) return m[1];
      }
    } catch (e) {}
    return null;
  }

  /* Avatar d'un membre, lu dans la liste des membres (même cache que les Derniers sujets).
     Cache de session de 10 minutes : un avatar modifié finit par apparaître sans fermer l'onglet. */
  function avatar(p, el) {
    var KEY = 'snj-avatars';
    var cache = {};
    try { cache = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) {}
    var paint = function (src) {
      if (!src) return;
      el.replaceChildren(h('img', { src: src, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }));
      el.classList.add('has-img');
    };
    var mine = ownAvatar(p.uid);
    if (mine) { paint(mine); return; }
    var hit = cache[p.uid];
    if (hit && typeof hit === 'object' && Date.now() - hit.t < 10 * 60000) { paint(hit.s); return; }
    fetchDoc('/memberlist?username=' + encodeURIComponent(p.name)).then(function (doc) {
      var block = Array.prototype.slice.call(doc.querySelectorAll('.member-block')).filter(function (b) {
        return b.querySelector('a[href="/u' + p.uid + '"]');
      })[0];
      var img = block && block.querySelector('.avatar-default img');
      var src = img ? img.getAttribute('src') : '';
      cache[p.uid] = { s: src, t: Date.now() };
      try { sessionStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {}
      paint(src);
    }).catch(function () {});
  }

  /* Compteur qui défile jusqu'à sa valeur à la première apparition */
  function counter(n) {
    var el = h('span', { class: 'sg-count', 'data-to': String(n), text: reducedMotion ? fmt(n) : '0' });
    el.setAttribute('aria-label', fmt(n));
    return el;
  }

  function runCounters(scope) {
    if (reducedMotion) return;
    var els = scope.querySelectorAll('.sg-count[data-to]');
    var start = function (el) {
      var to = num(el.getAttribute('data-to'));
      var t0 = null;
      var dur = 1400;
      (function step(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var eased = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(Math.round(to * eased));
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    };
    if (!('IntersectionObserver' in window)) { els.forEach(start); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        start(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Cartes
     ---------------------------------------------------------------------- */
  function eyebrow(text) { return h('span', { class: 'sg-eyebrow', text: text }); }
  function title(text, size) { return h('h3', { class: 'sg-title sg-title--' + (size || 'm'), text: text }); }

  function chronicles(d) {
    var ratio = d.users ? Math.round(d.posts / d.users) : 0;
    return h('article', { class: 'sg-card sg-s-chronicles sg-pat sg-pat--kikko' }, [
      eyebrow('Chroniques du forum'),
      h('p', { class: 'sg-chron__big' }, [counter(d.posts || 0), h('span', { class: 'sg-chron__unit', text: plural(d.posts, 'message publié', 'messages publiés') })]),
      h('div', { class: 'sg-chron__row' }, [
        h('p', { class: 'sg-chron__fact' }, [icon('groups'), h('span', null, [counter(d.users || 0), ' ' + plural(d.users, 'shinobi', 'shinobis')])]),
        ratio ? h('p', { class: 'sg-chron__fact' }, [icon('history_edu'), h('span', { text: 'soit ' + fmt(ratio) + ' ' + plural(ratio, 'message', 'messages') + ' par shinobi' })]) : null
      ])
    ]);
  }

  function newest(d) {
    var p = d.newest;
    if (!p) return null;
    var av = h('span', { class: 'sg-newest__avatar', 'aria-hidden': 'true' }, [icon('person')]);
    avatar(p, av);
    return h('a', { class: 'sg-card sg-card--link sg-s-newest', href: p.href }, [
      av,
      h('div', { class: 'sg-newest__body' }, [
        eyebrow('Dernier inscrit'),
        h('span', { class: 'sg-newest__name ' + p.cls, style: p.style, text: p.name }),
        h('span', { class: 'sg-newest__text', text: 'Bienvenue sur Sengoku no Jidai.' })
      ]),
      /* Sceau 新 (« nouveau »), posé en biais */
      h('span', { class: 'sg-seal', 'aria-hidden': 'true', text: '新' })
    ]);
  }

  function now(d) {
    var total = d.registered + d.hidden + d.guests;
    var seg = function (cls, n, label) {
      return h('span', { class: 'sg-gauge__seg sg-gauge__seg--' + cls, style: 'flex-grow:' + n, title: n + ' ' + label });
    };
    var row = function (cls, n, one, many) {
      return h('li', { class: 'sg-now__item' }, [
        h('span', { class: 'sg-now__dot sg-now__dot--' + cls }),
        h('span', { class: 'sg-now__label', text: plural(n, one, many) }),
        h('strong', { class: 'sg-now__num', text: fmt(n) })
      ]);
    };
    return h('article', { class: 'sg-card sg-s-now' }, [
      h('div', { class: 'sg-now__head' }, [
        h('span', { class: 'sg-live', 'aria-hidden': 'true' }),
        eyebrow('En ce moment')
      ]),
      h('p', { class: 'sg-now__total' }, [h('strong', { text: fmt(d.total || total) }), ' ' + plural(d.total || total, 'personne en ligne', 'personnes en ligne')]),
      h('div', { class: 'sg-gauge', role: 'img', 'aria-label': d.registered + ' enregistrés, ' + d.hidden + ' invisibles, ' + d.guests + ' invités' },
        total ? [seg('reg', d.registered, 'enregistrés'), seg('hid', d.hidden, 'invisibles'), seg('gue', d.guests, 'invités')] : []),
      h('ul', { class: 'sg-now__list' }, [
        row('reg', d.registered, 'Enregistré', 'Enregistrés'),
        row('hid', d.hidden, 'Invisible', 'Invisibles'),
        row('gue', d.guests, 'Invité', 'Invités')
      ]),
      d.record ? h('p', { class: 'sg-now__record' }, [icon('trophy'), 'Record : ' + fmt(d.record.count) + ' le ' + d.record.date]) : null
    ]);
  }

  function recent(d) {
    var list = d.recent.length ? d.recent : d.online;
    var shown = list.slice(0, CONFIG.recentMax);
    var rest = list.slice(CONFIG.recentMax);
    var ul = h('ul', { class: 'sg-people' }, shown.map(function (p) { return h('li', null, [person(p)]); }));
    if (rest.length) {
      var btn = h('button', { class: 'sg-people__more', type: 'button', 'aria-expanded': 'false' }, ['+ ' + rest.length + ' ' + plural(rest.length, 'autre', 'autres')]);
      btn.addEventListener('click', function () {
        rest.forEach(function (p) { ul.insertBefore(h('li', null, [person(p)]), btn.parentNode); });
        btn.parentNode.remove();
        markStaff(ul, d.groups);
      });
      ul.appendChild(h('li', null, [btn]));
    }
    return h('article', { class: 'sg-card sg-s-recent sg-pat sg-pat--shippo' }, [
      h('div', { class: 'sg-s-head' }, [
        title('Aperçus récemment', 'm'),
        h('span', { class: 'sg-s-badge', text: fmt(list.length) })
      ]),
      h('p', { class: 'sg-card__text', text: 'Shinobis passés au cours des dernières 24 heures.' }),
      list.length ? ul : h('p', { class: 'sg-muted', text: 'Personne pour le moment.' }),
      h('a', { class: 'sg-more', href: '/viewonline' }, ['Qui est en ligne', icon('arrow_forward')])
    ]);
  }

  /* Bannières nobori : une par groupe, à sa couleur */
  function groups(d) {
    if (!d.groups.length) return null;
    return h('article', { class: 'sg-card sg-s-groups' }, [
      h('div', { class: 'sg-s-head' }, [title('Les groupes', 'm'), h('a', { class: 'sg-more', href: '/groups' }, ['Tous les groupes', icon('arrow_forward')])]),
      h('ul', { class: 'sg-nobori' }, d.groups.map(function (g, i) {
        var meta = CONFIG.groups[g.slug] || {};
        return h('li', { style: '--i:' + i }, [
          h('a', {
            class: 'sg-nobori__flag sg-flag--' + (meta.tone || 'other'),
            href: g.href,
            title: g.name + (meta.sub ? ' — ' + meta.sub : '') + ' : ' + g.count + ' ' + plural(g.count, 'membre', 'membres'),
            /* Couleur du groupe telle que réglée dans le PA, pour les groupes sans ton connu */
            style: meta.tone ? null : '--flag:' + ((g.style.match(/#[0-9a-f]{3,6}/i) || ['var(--sg-primary)'])[0])
          }, [
            h('span', { class: 'sg-nobori__cloth' }, [
              h('span', { class: 'sg-nobori__mon', 'aria-hidden': 'true' }, [meta.kanji ? document.createTextNode(meta.kanji) : icon(meta.icon || 'flag')]),
              h('span', { class: 'sg-nobori__name', text: g.name })
            ]),
            h('span', { class: 'sg-nobori__count' }, [h('strong', { text: fmt(g.count) }), ' ' + plural(g.count, 'membre', 'membres')])
          ])
        ]);
      }))
    ]);
  }

  /* ----------------------------------------------------------------------
     Montage
     ---------------------------------------------------------------------- */
  function mount() {
    if (document.getElementById('sg-stats')) return;
    var block = document.querySelector('#index #block-online, #index .block-subtle');
    if (!block) return;
    var cssReady = getComputedStyle(document.documentElement).getPropertyValue('--sg-stats').trim() !== '';
    if (!cssReady) return; /* sans le CSS, on garde le bloc natif */

    var d = read(block);
    var cards = [
      d.posts !== null ? chronicles(d) : null,
      newest(d),
      now(d),
      recent(d),
      groups(d)
    ].filter(Boolean);

    var root = h('section', { id: 'sg-stats', class: 'sg-stats', 'aria-label': 'Statistiques du forum' }, cards);
    block.parentNode.insertBefore(root, block);
    document.body.classList.add('sg-stats-on');
    markStaff(root, d.groups);
    runCounters(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
