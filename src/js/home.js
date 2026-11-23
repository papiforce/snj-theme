/* ==========================================================================
   SNJ — Widgets de la page d'accueil
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript
   Placement : "Sur l'index" uniquement.
   Dépend de : src/css/components/30-home.css (servi par jsDelivr).

   Ordre des zones :
   - visiteur : Rejoindre → Univers → Se préparer → Vie du forum → Communauté
   - membre   : Vie du forum → Univers → Se préparer → Communauté (pas d'onboarding)

   Annonces, Rumeurs et Saison sont pour l'instant des données écrites ici
   (reprises de l'annexe). Elles seront branchées sur l'API de l'annexe plus tard :
   seul l'objet DATA changera, pas le rendu.
   ========================================================================== */
(function () {
  'use strict';

  var ANNEXE = 'https://snj-base-de-donnees.vercel.app';
  var DISCORD = 'https://discord.com/invite/bnK7vyGjXV';

  /* ----------------------------------------------------------------------
     DONNÉES (provisoires)
     ---------------------------------------------------------------------- */
  var DATA = {
    onboarding: [
      { icon: 'menu_book', title: 'Guide du joueur', text: 'Découvre les règles, la progression et le combat.', href: ANNEXE + '/guide-du-joueur/', external: true },
      { icon: 'travel_explore', title: 'Annexe', text: 'Explore les clans, les techniques et les PNJ.', href: ANNEXE + '/', external: true },
      { icon: 'edit_note', title: 'Fiche', text: 'Rédige la fiche de ton personnage.', href: '/f2-presentations' },
      { icon: 'verified', title: 'Validation', text: 'Le staff relit et valide ta fiche.', href: '/f2-presentations' },
      { icon: 'manage_accounts', title: 'Configuration du profil', text: 'Avatar, signature et champs de profil.', href: '/profile?mode=editprofile' }
    ],

    context: {
      text: [
        "Il y a plusieurs siècles, l'humanité reçut les enseignements du légendaire Rikudō Sennin. Ce qui devait mener à la compréhension mutuelle devint bien vite un instrument de pouvoir.",
        "Génération après génération, l'ambition supplanta l'harmonie et la méfiance fit naître le conflit. Aujourd'hui, cet héritage a plongé le monde dans le chaos : nous sommes au cœur de l'ère Sengoku, une époque de guerre sans fin…"
      ],
      href: '/t14-i-contexte'
    },

    season: {
      name: 'Hiver',
      year: 120,
      image: 'season-hiver.webp',
      text: "Le froid rigoureux recouvre les terres, les combats s'essoufflent et les clans se replient sur leurs domaines pour survivre à la saison."
    },

    guide: {
      text: 'Règlement, progression, combat : toutes les règles du forum, avec l’essentiel en tête de chaque chapitre.',
      href: ANNEXE + '/guide-du-joueur/'
    },

    annexe: [
      { icon: 'auto_stories', label: 'Bibliothèque', href: ANNEXE + '/bibliotheque/' },
      { icon: 'family_history', label: 'Clans', href: ANNEXE + '/clans/' },
      { icon: 'person_search', label: 'PNJ', href: ANNEXE + '/pnj/' },
      { icon: 'groups', label: 'Personnages', href: ANNEXE + '/personnages/' }
    ],

    /* 5 scénarios au maximum */
    scenarios: [
      { kanji: '海', name: 'Jinchūriki de Kyūbi', href: '/t166-jinchuriki-de-kyubi', image: 'https://i.pinimg.com/736x/35/ab/40/35ab40d5d75f4477f29dcd21e5d04436.jpg' },
      { kanji: '森', name: 'Akimichi Chōso', href: '/t731-akimichi-choso-disponible', image: 'https://i.pinimg.com/736x/e6/3a/c1/e63ac1b449f6bd37e4216a92f358100f.jpg' },
      { kanji: '朱', name: 'Goka Ai', href: '/t729-goka-ai-disponible', image: 'https://i.pinimg.com/736x/9a/c0/43/9ac043c90e9fd7452b76800e2b3a11de.jpg' },
      { kanji: '道', name: 'Nara Shikoe', href: '/t732-nara-shikoe-disponible', image: 'https://i.pinimg.com/736x/34/08/c4/3408c481e79f499880ca79f082a1a8fd.jpg' },
      { kanji: '霧', name: 'Aburame Makoi', href: '/t734-aburame-makoi-disponible', image: 'https://i.pinimg.com/736x/25/39/b2/2539b24e5d1665c2aee5919990089a9a.jpg' }
    ],
    scenariosHref: '/f5-scenarios',

    announcements: [
      { type: 'Mise à jour', date: '13 nov. 2026', title: "V.2 de l'annexe", text: '' },
      { type: 'Évènement', date: '29 oct. 2026', title: "Bonus d'XP à la validation", text: '+20 XP en rejoignant un clan de moins de 3 membres, +10 XP pour un scénario ou un prédéfini. Cumulables.' },
      { type: 'Mise à jour', date: '06 sept. 2026', title: 'La V1 est disponible', text: 'Toutes les modifications sont détaillées dans le sujet d’annonce.', href: '/t954-c-est-la-v1' }
    ],

    rumors: [
      { kanji: '雷', nation: 'Kaminari no Kuni', title: 'Du mouvement à Kaminari no Kuni', text: "Des informations rapportent qu'Hachibi serait en train de se déchaîner dans la région de la Corne d'Hachibi." },
      { kanji: '他', nation: 'Autres', title: "Naissance d'un étrange culte dans la forêt aux bois noirs", text: "On raconte qu'un étrange et sanglant culte serait apparu au sein de la forêt aux bois noirs : le culte de Jashin. Encore mystérieux, il inquiète cependant les autorités de la région." },
      { kanji: '水', nation: 'Mizu no Kuni', title: "L'annexion de l'île Kaguya", text: "L'empereur de Mizu no Kuni prépare l'ultime offensive sur l'île Kaguya, dont la résistance a couvert de honte sa campagne. On raconte que sa propre unité de shinobi devrait s'y rendre sous peu." },
      { kanji: '土', nation: 'Tsuchi no Kuni', title: 'Manme Jin, responsable d’un massacre', text: "Les autorités de Tsuchi no Kuni viennent de découvrir l'horreur dans un village des montagnes Karere, où un laboratoire clandestin aurait été installé. On raconte que le clan Manme devra répondre de ses actes." },
      { kanji: '他', nation: 'Autres', title: "L'empire de Tetsu renforce ses attaques", text: "Après les représailles du clan Inuzuka, l'empire de Tetsu envoie toujours plus de samouraïs au sein des frontières. On raconte que certains seraient plus forts, plus robustes et plus dangereux qu'auparavant." },
      { kanji: '他', nation: 'Autres', title: "Mouvements inquiétants autour de l'archipel Karyuu", text: "Plusieurs navires de guerre de Kaminari no Kuni, appartenant au culte des six voies, auraient été vus au large. Le précédent chef du clan Yuki aurait été capturé." },
      { kanji: '土', nation: 'Tsuchi no Kuni', title: 'Le clan Goka contre Omukade', text: "L'organisation criminelle d'Akimichi Madarame vient de s'en prendre à l'un des villages contrôlés par le clan Goka. On raconte qu'un membre du clan Uzumaki serait sur place." },
      { kanji: '風', nation: 'Kaze no Kuni', title: 'Ichibi se déplace', text: "Le démon des sables Ichibi aurait été vu dans les dunes rouges du clan Imiko, précisément sur le lieu de bataille de Warashi Oma et Sasori. Qu'est-ce que cela signifie ?" },
      { kanji: '水', nation: 'Mizu no Kuni', title: 'Le retour des cinq épéistes', text: "On raconte que l'unité de shinobi d'élite de Mizu no Kuni serait de retour, prête à envahir l'île Kaguya." }
    ],

    staff: [
      { name: 'Torro', role: 'Administrateur, fondateur', avatar: 'https://static.wikia.nocookie.net/sakamoto-days/images/9/92/Gozu_Cover_.png/revision/latest?cb=20251105223153' },
      { name: 'Bourbon', role: 'Administrateur, fondateur', avatar: 'https://i.pinimg.com/1200x/13/b7/3a/13b73adbd73232133665d610c4e6b486.jpg' }
    ],

    topsites: [
      { label: 'Root-Top', num: '壱', href: 'http://www.root-top.com/topsite/virtu4ldreaiviz/in.php?IDmark=5938' },
      { label: 'Root-Top', num: '弐', href: 'http://www.root-top.com/topsite/gilgamesh/in.php?IDmark=8730' },
      { label: 'Root-Top', num: '参', href: 'http://www.root-top.com/topsite/melu/in.php?IDmark=5406' },
      { label: 'Forum RPG', num: '肆', href: 'https://www.forumrpg.fr/vote/sengoku-no-jidai-naruto-xa75xk' }
    ],

    latestCount: 15,
    latestPerSlide: 3
  };

  var DISCORD_PATH = 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z';

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */

  /* Typographie française : espaces insécables avant : ; ! ? et dans « », points de suspension */
  function fr(s) {
    return String(s)
      .replace(/\.\.\./g, '…')
      .replace(/\s*:(?!\/\/)/g, ' :')
      .replace(/\s*([;!?])/g, ' $1')
      .replace(/«\s*/g, '« ')
      .replace(/\s*»/g, ' »');
  }

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

  function icon(name) {
    return h('span', { class: 'material-symbols-outlined', 'aria-hidden': 'true', text: name });
  }

  function link(href, attrs, children) {
    var a = attrs || {};
    a.href = href;
    if (/^https?:\/\//.test(href) && href.indexOf(location.host) === -1) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return h('a', a, children);
  }

  function more(href, label) {
    return link(href, { class: 'sg-more' }, [label, icon('arrow_forward')]);
  }

  function cardHead(kanji, title) {
    return h('header', { class: 'sg-card__head' }, [
      h('span', { class: 'sg-kanji', 'aria-hidden': 'true', text: kanji }),
      h('h3', { class: 'sg-card__title', text: title })
    ]);
  }

  function zone(num, kanji, title, rowClass, cards) {
    return h('section', { class: 'sg-zone', 'aria-label': title }, [
      h('h2', { class: 'sg-zone__title' }, [
        h('span', { class: 'sg-zone__num', 'aria-hidden': 'true', text: kanji }),
        title
      ]),
      h('div', { class: 'sg-row ' + rowClass }, cards)
    ]);
  }

  /* Dossier assets/ à la même version que le CSS chargé (pas de SHA en dur) */
  function assetsBase() {
    var l = document.querySelector('link[href*="snj-theme@"]');
    return l ? l.href.replace(/dist\/[^/]+$/, 'assets/') : '';
  }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Carrousel : chevrons sur les côtés, puces en bas, clavier, glisser au doigt
     ---------------------------------------------------------------------- */
  function carousel(label, slides, opts) {
    opts = opts || {};
    var index = 0;
    var track = h('div', { class: 'sg-carousel__track' }, slides.map(function (s, i) {
      s.classList.add('sg-carousel__slide');
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'diapositive');
      s.setAttribute('aria-label', (i + 1) + ' sur ' + slides.length);
      return s;
    }));
    var dots = slides.map(function (_, i) {
      return h('button', { type: 'button', class: 'sg-carousel__dot', 'aria-label': 'Aller à la diapositive ' + (i + 1), onclick: function () { go(i); } });
    });
    var prev = h('button', { type: 'button', class: 'sg-carousel__nav sg-carousel__nav--prev', 'aria-label': 'Précédent', onclick: function () { go(index - 1); } }, [icon('chevron_left')]);
    var next = h('button', { type: 'button', class: 'sg-carousel__nav sg-carousel__nav--next', 'aria-label': 'Suivant', onclick: function () { go(index + 1); } }, [icon('chevron_right')]);
    var root = h('div', { class: 'sg-carousel', role: 'region', 'aria-roledescription': 'carrousel', 'aria-label': label, tabindex: '0' }, [
      h('div', { class: 'sg-carousel__viewport' }, [track]),
      prev, next,
      h('div', { class: 'sg-carousel__dots' }, dots)
    ]);
    if (slides.length < 2) root.classList.add('sg-carousel--single');

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      slides.forEach(function (s, j) {
        s.setAttribute('aria-hidden', j === index ? 'false' : 'true');
        s.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = j === index ? 0 : -1; });
      });
      dots.forEach(function (d, j) { d.setAttribute('aria-current', j === index ? 'true' : 'false'); });
    }

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    });

    var startX = null;
    root.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') startX = e.clientX; });
    root.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    if (opts.autoplay && !reducedMotion && slides.length > 1) {
      var timer = null;
      var play = function () { stop(); timer = setInterval(function () { go(index + 1); }, opts.autoplay); };
      var stop = function () { if (timer) clearInterval(timer); timer = null; };
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', play);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', play);
      play();
    }

    go(0);
    return root;
  }

  /* ----------------------------------------------------------------------
     Widgets
     ---------------------------------------------------------------------- */
  function onboarding() {
    var steps = DATA.onboarding.map(function (s, i) {
      return h('li', { class: 'sg-step' }, [
        link(s.href, { class: 'sg-step__link' }, [
          h('span', { class: 'sg-step__num', text: String(i + 1) }),
          h('span', { class: 'sg-step__icon' }, [icon(s.icon)]),
          h('span', { class: 'sg-step__title', text: s.title }),
          h('span', { class: 'sg-step__text', text: fr(s.text) })
        ])
      ]);
    });
    return h('article', { class: 'sg-card sg-card--onboarding' }, [
      h('ol', { class: 'sg-steps' }, steps)
    ]);
  }

  function context() {
    return h('article', { class: 'sg-card sg-card--context' }, [
      cardHead('文脈', 'Contexte'),
      h('div', { class: 'sg-prose' }, DATA.context.text.map(function (p) { return h('p', { text: fr(p) }); })),
      more(DATA.context.href, 'Lire la suite')
    ]);
  }

  function season() {
    var s = DATA.season;
    return h('article', { class: 'sg-card sg-card--season sg-card--media' }, [
      h('div', { class: 'sg-media', style: "background-image:url('" + assetsBase() + s.image + "')" }),
      h('div', { class: 'sg-card__overlay' }, [
        h('span', { class: 'sg-eyebrow', text: 'Saison en cours' }),
        h('h3', { class: 'sg-season__name', text: s.name }),
        h('span', { class: 'sg-season__year', text: 'An ' + s.year }),
        h('p', { class: 'sg-season__text', text: fr(s.text) })
      ])
    ]);
  }

  function guide() {
    return link(DATA.guide.href, { class: 'sg-card sg-card--guide sg-card--link' }, [
      h('span', { class: 'sg-watermark', 'aria-hidden': 'true', text: '導' }),
      cardHead('導', 'Guide du joueur'),
      h('p', { class: 'sg-card__text', text: fr(DATA.guide.text) }),
      h('span', { class: 'sg-more' }, ['Lire le guide', icon('arrow_forward')])
    ]);
  }

  function annexe() {
    return h('article', { class: 'sg-card sg-card--annexe' }, [
      cardHead('付録', 'Annexe'),
      h('ul', { class: 'sg-shortcuts' }, DATA.annexe.map(function (s) {
        return h('li', null, [link(s.href, { class: 'sg-shortcut' }, [icon(s.icon), s.label])]);
      })),
      more(ANNEXE + '/', "Ouvrir l'annexe")
    ]);
  }

  function scenarios() {
    var list = DATA.scenarios.slice(0, 5);
    return h('article', { class: 'sg-card sg-card--scenarios' }, [
      cardHead('筋書き', 'Scénarios'),
      h('ul', { class: 'sg-tiles' }, list.map(function (s) {
        return h('li', null, [
          link(s.href, { class: 'sg-tile', 'aria-label': 'Scénario : ' + s.name }, [
            h('span', { class: 'sg-tile__img', style: "background-image:url('" + s.image + "')" }),
            h('span', { class: 'sg-tile__kanji', 'aria-hidden': 'true', text: s.kanji }),
            h('span', { class: 'sg-tile__name', text: s.name })
          ])
        ]);
      })),
      more(DATA.scenariosHref, 'Voir tous les scénarios')
    ]);
  }

  function announcements() {
    var slides = DATA.announcements.map(function (a) {
      return h('div', { class: 'sg-item' }, [
        h('div', { class: 'sg-item__meta' }, [h('span', { class: 'sg-pill', text: a.type }), h('time', { text: a.date })]),
        h('h4', { class: 'sg-item__title' }, [a.href ? link(a.href, null, [fr(a.title)]) : fr(a.title)]),
        a.text ? h('p', { class: 'sg-item__text', text: fr(a.text) }) : null
      ]);
    });
    return h('article', { class: 'sg-card sg-card--feed' }, [cardHead('告知', 'Annonces'), carousel('Annonces', slides)]);
  }

  function rumors() {
    var slides = DATA.rumors.map(function (r) {
      return h('div', { class: 'sg-item' }, [
        h('div', { class: 'sg-item__meta' }, [h('span', { class: 'sg-nation', 'aria-hidden': 'true', text: r.kanji }), h('span', { text: r.nation })]),
        h('h4', { class: 'sg-item__title', text: fr(r.title) }),
        h('p', { class: 'sg-item__text', text: fr(r.text) })
      ]);
    });
    return h('article', { class: 'sg-card sg-card--feed' }, [cardHead('噂', 'Rumeurs'), carousel('Rumeurs', slides, { autoplay: 8000 })]);
  }

  function latest() {
    var body = h('div', { class: 'sg-latest' }, [h('p', { class: 'sg-muted', text: 'Chargement des derniers sujets…' })]);
    var card = h('article', { class: 'sg-card sg-card--feed' }, [cardHead('新着', 'Derniers sujets'), body]);

    fetch('/latest', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var rows = Array.prototype.slice.call(doc.querySelectorAll('.block-topics-details')).slice(0, DATA.latestCount);
        if (!rows.length) throw new Error('vide');
        var topics = rows.map(function (row) {
          var a = row.querySelector('a.topictitle');
          var author = row.querySelector('.block-topics-author strong');
          var last = row.querySelector('.block-topics-lastpost a[href*="#"], .block-topics-lastpost a:last-child');
          var raw = (row.querySelector('.block-topics-author') || row).textContent;
          var date = (raw.split(',').slice(1).join(',') || '').trim();
          return {
            title: a ? a.textContent.trim() : '',
            href: last ? last.getAttribute('href') : (a ? a.getAttribute('href') : '/latest'),
            author: author ? author.textContent.trim() : '',
            date: date
          };
        });
        var slides = [];
        for (var i = 0; i < topics.length; i += DATA.latestPerSlide) {
          slides.push(h('ul', { class: 'sg-topics' }, topics.slice(i, i + DATA.latestPerSlide).map(function (t) {
            return h('li', null, [
              link(t.href, { class: 'sg-topic' }, [
                h('span', { class: 'sg-topic__title', text: t.title }),
                h('span', { class: 'sg-topic__meta', text: [t.author, t.date].filter(Boolean).join(' · ') })
              ])
            ]);
          })));
        }
        body.replaceChildren(carousel('Derniers sujets', slides));
      })
      .catch(function () {
        body.replaceChildren(h('p', { class: 'sg-muted' }, ['Les derniers sujets n’ont pas pu être chargés. ', link('/latest', null, ['Voir les derniers sujets'])]));
      });

    return card;
  }

  function staff() {
    return h('article', { class: 'sg-card sg-card--staff' }, [
      cardHead('人員', 'Le staff'),
      h('ul', { class: 'sg-staff' }, DATA.staff.map(function (m) {
        return h('li', { class: 'sg-member' }, [
          h('img', { class: 'sg-member__avatar', src: m.avatar, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }),
          h('span', { class: 'sg-member__name', text: m.name }),
          h('span', { class: 'sg-member__role', text: m.role })
        ]);
      })),
      link(DISCORD, { class: 'sg-btn sg-btn--ghost' }, [icon('chat'), 'Contacter le staff sur Discord'])
    ]);
  }

  function topsites() {
    return h('article', { class: 'sg-card sg-card--vote' }, [
      cardHead('頂点', 'Voter pour le forum'),
      h('p', { class: 'sg-card__text', text: fr('Un vote par jour et par site : ça aide le forum à se faire connaître.') }),
      h('ul', { class: 'sg-votes' }, DATA.topsites.map(function (t) {
        return h('li', null, [link(t.href, { class: 'sg-vote' }, [h('span', { class: 'sg-vote__num', 'aria-hidden': 'true', text: t.num }), t.label])]);
      }))
    ]);
  }

  function discord() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'sg-discord__logo');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', DISCORD_PATH);
    svg.appendChild(p);
    return link(DISCORD, { class: 'sg-card sg-card--discord sg-card--link', 'aria-label': 'Rejoindre le serveur Discord' }, [
      svg,
      h('span', { class: 'sg-discord__word', text: 'Discord' }),
      h('span', { class: 'sg-discord__cta' }, ['Rejoindre le serveur', icon('arrow_forward')])
    ]);
  }

  /* ----------------------------------------------------------------------
     Montage
     ---------------------------------------------------------------------- */
  function mount() {
    if (document.getElementById('sg-home')) return;
    var wrap = document.getElementById('wrap');
    if (!wrap) return;
    var cssReady = getComputedStyle(document.documentElement).getPropertyValue('--sg-home').trim() !== '';
    if (!cssReady) return;

    var ud = window._userdata || {};
    var logged = String(ud.session_logged_in) === '1';

    var zones = {
      join: zone(0, '壱', 'Rejoindre Sengoku no Jidai', 'sg-row--full', [onboarding()]),
      world: zone(0, '弐', "Découvrir l'univers", 'sg-row--world', [context(), season()]),
      prepare: zone(0, '参', 'Se préparer', 'sg-row--3', [guide(), annexe(), scenarios()]),
      life: zone(0, '肆', 'La vie du forum', 'sg-row--3', [announcements(), rumors(), latest()]),
      community: zone(0, '伍', 'La communauté', 'sg-row--3', [staff(), topsites(), discord()])
    };

    var order = logged ? ['life', 'world', 'prepare', 'community'] : ['join', 'world', 'prepare', 'life', 'community'];
    var nums = ['壱', '弐', '参', '肆', '伍'];
    var home = h('div', { id: 'sg-home', class: logged ? 'is-member' : 'is-visitor' });
    order.forEach(function (k, i) {
      zones[k].querySelector('.sg-zone__num').textContent = nums[i];
      home.appendChild(zones[k]);
    });

    wrap.insertBefore(home, wrap.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
