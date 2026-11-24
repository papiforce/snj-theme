/* ==========================================================================
   SNJ — Widgets de la page d'accueil
   PA › Modules › HTML & JavaScript › Gestion des codes JavaScript
   Placement : "Sur l'index" et "Sur les sous-forums" (pages des forums : Guide, Saison et Annexe).
   Dépend de : src/css/components/30-home.css (servi par jsDelivr).

   Une seule grille « bento » (12 colonnes), cartes variées : grandes cartes illustrées,
   carte à couverture, cartes à motifs de l'ère Edo, carrousels, carte Discord.
   - visiteur : Onboarding → Contexte, Saison → Guide, Annexe → Annonces, Rumeurs, Derniers sujets
                → Scénarios, Staff, Vote + Discord
   - membre   : pas d'onboarding, Annonces / Rumeurs / Derniers sujets en premier

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
      { kanji: '海', name: 'Jinchūriki de Kyūbi', href: '/t166-jinchuriki-de-kyubi', taken: true, image: 'https://i.pinimg.com/736x/35/ab/40/35ab40d5d75f4477f29dcd21e5d04436.jpg' },
      { kanji: '森', name: 'Akimichi Chōso', href: '/t731-akimichi-choso-disponible', taken: true, image: 'https://i.pinimg.com/736x/e6/3a/c1/e63ac1b449f6bd37e4216a92f358100f.jpg' },
      { kanji: '朱', name: 'Goka Ai', href: '/t729-goka-ai-disponible', image: 'https://i.pinimg.com/736x/9a/c0/43/9ac043c90e9fd7452b76800e2b3a11de.jpg' },
      { kanji: '道', name: 'Nara Shikoe', href: '/t732-nara-shikoe-disponible', taken: true, image: 'https://i.pinimg.com/736x/34/08/c4/3408c481e79f499880ca79f082a1a8fd.jpg' },
      { kanji: '霧', name: 'Aburame Makoi', href: '/t734-aburame-makoi-disponible', taken: true, image: 'https://i.pinimg.com/736x/25/39/b2/2539b24e5d1665c2aee5919990089a9a.jpg' }
    ],
    scenariosHref: '/f5-scenarios',

    announcements: [
      { type: 'Mise à jour', date: '13 nov. 2026', title: "V.2 de l'annexe", text: '' },
      { type: 'Évènement', date: '29 oct. 2026', title: "Bonus d'XP à la validation", text: '+20 XP en rejoignant un clan de moins de 3 membres, +10 XP pour un scénario ou un prédéfini. Cumulables.' },
      { type: 'Mise à jour', date: '06 sept. 2026', title: 'La V1 est disponible', text: 'Toutes les modifications sont détaillées dans le sujet d’annonce.', href: '/t954-c-est-la-v1' }
    ],

    rumors: [
      { kanji: '雷', nation: 'Kaminari no Kuni', title: 'Du mouvement à Kaminari no Kuni', text: "Des informations rapportent qu'Hachibi serait en train de se déchaîner dans la région de la Corne d'Hachibi." },
      { kanji: '他', nation: 'Shōkoku', title: "Naissance d'un étrange culte dans la forêt aux bois noirs", text: "On raconte qu'un étrange et sanglant culte serait apparu au sein de la forêt aux bois noirs : le culte de Jashin. Encore mystérieux, il inquiète cependant les autorités de la région." },
      { kanji: '水', nation: 'Mizu no Kuni', title: "L'annexion de l'île Kaguya", text: "L'empereur de Mizu no Kuni prépare l'ultime offensive sur l'île Kaguya, dont la résistance a couvert de honte sa campagne. On raconte que sa propre unité de shinobi devrait s'y rendre sous peu." },
      { kanji: '土', nation: 'Tsuchi no Kuni', title: 'Manme Jin, responsable d’un massacre', text: "Les autorités de Tsuchi no Kuni viennent de découvrir l'horreur dans un village des montagnes Karere, où un laboratoire clandestin aurait été installé. On raconte que le clan Manme devra répondre de ses actes." },
      { kanji: '他', nation: 'Shōkoku', title: "L'empire de Tetsu renforce ses attaques", text: "Après les représailles du clan Inuzuka, l'empire de Tetsu envoie toujours plus de samouraïs au sein des frontières. On raconte que certains seraient plus forts, plus robustes et plus dangereux qu'auparavant." },
      { kanji: '他', nation: 'Shōkoku', title: "Mouvements inquiétants autour de l'archipel Karyuu", text: "Plusieurs navires de guerre de Kaminari no Kuni, appartenant au culte des six voies, auraient été vus au large. Le précédent chef du clan Yuki aurait été capturé." },
      { kanji: '土', nation: 'Tsuchi no Kuni', title: 'Le clan Goka contre Omukade', text: "L'organisation criminelle d'Akimichi Madarame vient de s'en prendre à l'un des villages contrôlés par le clan Goka. On raconte qu'un membre du clan Uzumaki serait sur place." },
      { kanji: '風', nation: 'Kaze no Kuni', title: 'Ichibi se déplace', text: "Le démon des sables Ichibi aurait été vu dans les dunes rouges du clan Imiko, précisément sur le lieu de bataille de Warashi Oma et Sasori. Qu'est-ce que cela signifie ?" },
      { kanji: '水', nation: 'Mizu no Kuni', title: 'Le retour des cinq épéistes', text: "On raconte que l'unité de shinobi d'élite de Mizu no Kuni serait de retour, prête à envahir l'île Kaguya." }
    ],

    staffHref: '/t655-credit-staff-remerciement',
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
    latestHidden: /corbeille/i, /* forums dont les sujets ne s'affichent pas (sujets supprimés) */
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

    var resetTimer = null;

    function go(i) {
      index = (i + slides.length) % slides.length;
      if (resetTimer) resetTimer();
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

    /* Défilement automatique + minuteur circulaire (coin supérieur droit de la carte).
       Survol ou focus : pause (icône au centre du minuteur), reprise au temps restant.
       Changement manuel de diapositive : le minuteur repart de zéro. */
    if (opts.autoplay && !reducedMotion && slides.length > 1) {
      var duration = opts.autoplay;
      var remaining = duration;
      var startedAt = 0;
      var timeout = null;
      var hovered = false;
      var focused = false;
      var ring = h('span', { class: 'sg-ctimer', 'aria-hidden': 'true' });
      ring.style.setProperty('--sg-ctimer-d', duration + 'ms');
      ring.innerHTML = '<svg viewBox="0 0 24 24"><circle class="sg-ctimer__track" cx="12" cy="12" r="10"/>' +
        '<circle class="sg-ctimer__bar" cx="12" cy="12" r="10" pathLength="100"/></svg>';
      ring.appendChild(icon('pause'));
      var bar = ring.querySelector('.sg-ctimer__bar');

      var running = function () { return !hovered && !focused; };
      var restartBar = function () {
        bar.style.animation = 'none';
        void bar.getBoundingClientRect();
        bar.style.animation = '';
      };
      var schedule = function () {
        clearTimeout(timeout);
        if (!running()) { ring.classList.add('is-paused'); return; }
        ring.classList.remove('is-paused');
        startedAt = Date.now();
        timeout = setTimeout(function () { go(index + 1); }, remaining);
      };
      var hold = function () {
        if (timeout && !ring.classList.contains('is-paused')) remaining = Math.max(0, remaining - (Date.now() - startedAt));
        clearTimeout(timeout);
        timeout = null;
        ring.classList.add('is-paused');
      };
      resetTimer = function () {
        remaining = duration;
        restartBar();
        schedule();
      };

      root.addEventListener('mouseenter', function () { hovered = true; ring.classList.add('is-hover'); hold(); });
      root.addEventListener('mouseleave', function () { hovered = false; ring.classList.remove('is-hover'); schedule(); });
      root.addEventListener('focusin', function () { focused = true; hold(); });
      root.addEventListener('focusout', function () { focused = false; schedule(); });
      root.sgTimer = ring;
    }

    go(0);
    return root;
  }

  /* ----------------------------------------------------------------------
     Briques de cartes
     ---------------------------------------------------------------------- */
  var NATIONS = { 'Hi no Kuni': 'hi', 'Mizu no Kuni': 'mizu', 'Kaminari no Kuni': 'kaminari', 'Tsuchi no Kuni': 'tsuchi', 'Kaze no Kuni': 'kaze', 'Shōkoku': 'autres', 'Autres': 'autres' };

  function img(name) { return "background-image:url('" + assetsBase() + name + "')"; }

  /* Image avec une variante claire, au ton de la bannière (CSS : --img / --img-light) */
  function imgPair(dark, light) {
    var b = assetsBase();
    return "--img:url('" + b + dark + "');--img-light:url('" + b + light + "')";
  }

  function title(text, size) {
    return h('h3', { class: 'sg-title sg-title--' + (size || 'm'), text: text });
  }

  function eyebrow(text) {
    return h('span', { class: 'sg-eyebrow', text: text });
  }

  /* ----------------------------------------------------------------------
     Widgets
     ---------------------------------------------------------------------- */
  function onboarding() {
    var steps = DATA.onboarding.map(function (s, i) {
      return h('li', { class: 'sg-step' }, [
        link(s.href, { class: 'sg-step__link' }, [
          h('span', { class: 'sg-step__num', text: String(i + 1) }),
          h('span', { class: 'sg-step__body' }, [
            h('span', { class: 'sg-step__title' }, [icon(s.icon), s.title]),
            h('span', { class: 'sg-step__text', text: fr(s.text) })
          ])
        ])
      ]);
    });
    return h('article', { class: 'sg-card sg-c-onboarding sg-pat sg-pat--seigaiha' }, [
      h('div', { class: 'sg-onboarding__intro' }, [
        eyebrow('Nouveau venu'),
        title('Rejoindre Sengoku no Jidai', 'l'),
        h('p', { class: 'sg-card__text', text: fr('Cinq étapes pour passer du visiteur au shinobi.') })
      ]),
      h('ol', { class: 'sg-steps' }, steps)
    ]);
  }

  function context() {
    return h('article', { class: 'sg-card sg-c-context sg-pat sg-pat--kikko' }, [
      eyebrow("L'univers"),
      title('Contexte', 'xl'),
      h('div', { class: 'sg-prose' }, DATA.context.text.map(function (p) { return h('p', { text: fr(p) }); })),
      more(DATA.context.href, 'Lire la suite')
    ]);
  }

  function season() {
    var s = DATA.season;
    return h('article', { class: 'sg-card sg-c-season sg-hero' }, [
      h('div', { class: 'sg-hero__img', style: img(s.image) }),
      h('div', { class: 'sg-hero__body' }, [
        eyebrow('Saison en cours'),
        h('div', { class: 'sg-season__line' }, [title(s.name, 'xl'), h('span', { class: 'sg-season__year', text: 'An ' + s.year })]),
        h('p', { class: 'sg-hero__text', text: fr(s.text) })
      ])
    ]);
  }

  function guide() {
    return link(DATA.guide.href, { class: 'sg-card sg-c-guide sg-hero sg-tone sg-card--link' }, [
      h('div', { class: 'sg-hero__img sg-has-light', style: imgPair('card-guide.webp', 'card-guide-light.webp') }),
      h('div', { class: 'sg-hero__body' }, [
        eyebrow('Avant de commencer'),
        title('Guide du joueur', 'xxl'),
        h('p', { class: 'sg-hero__text', text: fr(DATA.guide.text) }),
        h('span', { class: 'sg-btn sg-btn--light' }, ['Lire le guide', icon('arrow_forward')])
      ])
    ]);
  }

  function annexe() {
    return h('article', { class: 'sg-card sg-c-annexe sg-cover sg-tone' }, [
      link(ANNEXE + '/', { class: 'sg-cover__img sg-has-light', style: imgPair('card-annexe.webp', 'card-annexe-light.webp'), 'aria-label': "Ouvrir l'annexe" }, [
        title('Annexe', 'l')
      ]),
      h('div', { class: 'sg-cover__body' }, [
        h('ul', { class: 'sg-shortcuts' }, DATA.annexe.map(function (s, i) {
          var ico = icon(s.icon);
          ico.classList.add('sg-shortcut__icon');
          return h('li', null, [link(s.href, { class: 'sg-shortcut sg-shortcut--' + (i + 1) }, [
            ico,
            h('span', { class: 'sg-shortcut__label', text: s.label })
          ])]);
        }))
      ])
    ]);
  }

  function scenarios() {
    /* Scénarios disponibles d'abord, puis ceux déjà pris */
    var list = DATA.scenarios.filter(function (s) { return !s.taken; })
      .concat(DATA.scenarios.filter(function (s) { return s.taken; }))
      .slice(0, 5);
    return h('article', { class: 'sg-card sg-c-scenarios' }, [
      h('div', { class: 'sg-card__top' }, [
        h('div', null, [eyebrow('Personnages à reprendre'), title('Scénarios', 'l')]),
        more(DATA.scenariosHref, 'Tous les scénarios')
      ]),
      h('ul', { class: 'sg-tiles' }, list.map(function (s) {
        if (s.taken) {
          return h('li', null, [
            h('div', { class: 'sg-tile sg-tile--taken', role: 'img', 'aria-label': 'Scénario pris : ' + s.name }, [
              h('span', { class: 'sg-tile__img', style: "background-image:url('" + s.image + "')" }),
              h('span', { class: 'sg-tile__kanji', 'aria-hidden': 'true', text: s.kanji }),
              h('span', { class: 'sg-tile__seal', 'aria-hidden': 'true' }, [icon('lock'), 'Pris']),
              h('span', { class: 'sg-tile__name', 'aria-hidden': 'true', text: s.name })
            ])
          ]);
        }
        return h('li', null, [
          link(s.href, { class: 'sg-tile', 'aria-label': 'Scénario : ' + s.name }, [
            h('span', { class: 'sg-tile__img', style: "background-image:url('" + s.image + "')" }),
            h('span', { class: 'sg-tile__kanji', 'aria-hidden': 'true', text: s.kanji }),
            h('span', { class: 'sg-tile__name', text: s.name })
          ])
        ]);
      }))
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
    var car = carousel('Annonces', slides, { autoplay: 8000 });
    return h('article', { class: 'sg-card sg-c-announcements sg-feed' }, [title('Annonces', 's'), car, car.sgTimer]);
  }

  function rumors() {
    var slides = DATA.rumors.map(function (r) {
      var key = NATIONS[r.nation] || 'autres';
      return h('div', { class: 'sg-rumor sg-nation--' + key }, [
        h('span', { class: 'sg-rumor__img sg-has-light', style: imgPair('land-' + key + '.webp', 'land-' + key + '-light.webp') }),
        h('div', { class: 'sg-rumor__body' }, [
          h('span', { class: 'sg-rumor__nation', text: r.nation }),
          h('h4', { class: 'sg-rumor__title', text: fr(r.title) }),
          h('p', { class: 'sg-rumor__text', text: fr(r.text) })
        ])
      ]);
    });
    var car = carousel('Rumeurs', slides, { autoplay: 8000 });
    return h('article', { class: 'sg-card sg-c-rumors sg-feed sg-tone' }, [
      h('div', { class: 'sg-c-rumors__head' }, [eyebrow('On murmure que…'), title('Rumeurs', 'm')]),
      car, car.sgTimer
    ]);
  }

  /* Avatars des derniers participants : lus dans la liste des membres (une requête
     par membre), gardés en mémoire pour la session */
  function loadAvatars(topics, scope) {
    var KEY = 'snj-avatars';
    var cache = {};
    try { cache = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) {}
    var paint = function (uid, src) {
      if (!src) return;
      scope.querySelectorAll('.sg-topic__avatar[data-uid="' + uid + '"]').forEach(function (el) {
        el.replaceChildren(h('img', { src: src, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }));
        el.classList.add('has-img');
      });
    };
    var seen = {};
    topics.forEach(function (t) {
      if (!t.uid || seen[t.uid]) return;
      seen[t.uid] = true;
      if (cache[t.uid] !== undefined) { paint(t.uid, cache[t.uid]); return; }
      fetch('/memberlist?username=' + encodeURIComponent(t.author), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var blocks = Array.prototype.slice.call(doc.querySelectorAll('.member-block'));
          var block = blocks.filter(function (b) { return b.querySelector('a[href="/u' + t.uid + '"]'); })[0];
          var img = block && block.querySelector('.avatar-default img');
          var src = img ? img.getAttribute('src') : '';
          cache[t.uid] = src;
          try { sessionStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {}
          paint(t.uid, src);
        })
        .catch(function () {});
    });
  }

  function latest() {
    var body = h('div', { class: 'sg-latest' }, [h('p', { class: 'sg-muted', text: 'Chargement des derniers sujets…' })]);
    var card = h('article', { class: 'sg-card sg-c-latest sg-feed' }, [title('Derniers sujets', 's'), body]);

    fetch('/latest', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        /* Sujets supprimés (déplacés dans la Corbeille) exclus */
        var rows = Array.prototype.slice.call(doc.querySelectorAll('.block-topics-content')).filter(function (row) {
          var cat = row.querySelector('.block-topics-category');
          return !(cat && DATA.latestHidden.test(cat.textContent + ' ' + (cat.getAttribute('href') || '')));
        }).slice(0, DATA.latestCount);
        if (!rows.length) {
          body.replaceChildren(h('p', { class: 'sg-muted', text: 'Aucun sujet pour l’instant.' }));
          return;
        }
        var topics = rows.map(function (row) {
          var a = row.querySelector('a.topictitle');
          var poster = row.querySelector('.block-topics-lastpost strong a') || row.querySelector('.block-topics-author a');
          var last = row.querySelector('.block-topics-lastpost a[href*="/t"]');
          var lp = row.querySelector('.block-topics-lastpost');
          var m = lp ? lp.textContent.replace(/\s+/g, ' ').match(/,\s*([^,]+?)\s*$/) : null;
          return {
            title: a ? a.textContent.trim() : '',
            href: last ? last.getAttribute('href') : (a ? a.getAttribute('href') : '/latest'),
            author: poster ? poster.textContent.trim() : '',
            uid: poster ? (poster.getAttribute('href') || '').replace(/^.*\/u(\d+).*$/, '$1') : '',
            date: m ? m[1].trim() : ''
          };
        });
        var slides = [];
        for (var i = 0; i < topics.length; i += DATA.latestPerSlide) {
          slides.push(h('ul', { class: 'sg-topics' }, topics.slice(i, i + DATA.latestPerSlide).map(function (t) {
            var av = h('span', { class: 'sg-topic__avatar', 'data-uid': t.uid, 'aria-hidden': 'true' }, [icon('person')]);
            return h('li', null, [
              link(t.href, { class: 'sg-topic' }, [
                h('span', { class: 'sg-topic__text' }, [
                  h('span', { class: 'sg-topic__title', text: t.title }),
                  h('span', { class: 'sg-topic__meta', text: [t.author, t.date].filter(Boolean).join(' · ') })
                ]),
                av
              ])
            ]);
          })));
        }
        loadAvatars(topics, body);
        body.replaceChildren(carousel('Derniers sujets', slides));
      })
      .catch(function () {
        body.replaceChildren(h('p', { class: 'sg-muted' }, ['Les derniers sujets n’ont pas pu être chargés. ', link('/latest', null, ['Voir les derniers sujets'])]));
      });

    return card;
  }

  function staff() {
    return h('article', { class: 'sg-card sg-c-staff sg-pat sg-pat--shippo' }, [
      title('Le staff', 'm'),
      /* Avatars en portrait seulement ; le pseudo apparaît au survol, comme les scénarios */
      h('ul', { class: 'sg-staff' }, DATA.staff.map(function (m) {
        return h('li', null, [
          h('div', { class: 'sg-tile sg-tile--photo', role: 'img', 'aria-label': m.name + ', ' + m.role, title: m.name + ' — ' + m.role }, [
            h('img', { class: 'sg-tile__img', src: m.avatar, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }),
            h('span', { class: 'sg-tile__name', 'aria-hidden': 'true', text: m.name })
          ])
        ]);
      })),
      h('div', { class: 'sg-actions' }, [
        link(DATA.staffHref, { class: 'sg-btn sg-btn--ghost sg-btn--next' }, ['Voir le staff et les crédits', icon('arrow_forward')]),
        link(DISCORD, { class: 'sg-btn sg-btn--ghost' }, [icon('chat'), 'Contacter sur Discord'])
      ])
    ]);
  }

  function topsites() {
    return h('article', { class: 'sg-card sg-c-vote sg-pat sg-pat--shippo' }, [
      title('Voter pour le forum', 's'),
      h('ul', { class: 'sg-votes' }, DATA.topsites.map(function (t, i) {
        return h('li', null, [link(t.href, { class: 'sg-vote' }, [String(i + 1), h('span', { class: 'sg-vote__label', text: t.label })])]);
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
    return link(DISCORD, { class: 'sg-card sg-c-discord sg-card--link', 'aria-label': 'Rejoindre le serveur Discord' }, [
      h('span', { class: 'sg-discord__brand' }, [svg, h('span', { class: 'sg-discord__word', text: 'Discord' })]),
      h('span', { class: 'sg-discord__cta' }, ['Rejoindre le serveur', icon('arrow_forward')])
    ]);
  }

  function stack(cards, cls) {
    return h('div', { class: 'sg-stack ' + cls }, cards);
  }

  /* ----------------------------------------------------------------------
     Montage : une seule grille, ordre selon visiteur ou membre
     ---------------------------------------------------------------------- */
  function mount() {
    if (document.getElementById('sg-home')) return;
    var wrap = document.getElementById('wrap');
    if (!wrap) return;
    var cssReady = getComputedStyle(document.documentElement).getPropertyValue('--sg-home').trim() !== '';
    if (!cssReady) return;

    /* Page d'un forum (/f4-presentations, /f4p20-…) : Guide, Saison et Annexe, puis le séparateur */
    if (!document.getElementById('index') && /^\/f\d+/.test(location.pathname)) {
      var row = h('div', { id: 'sg-home', class: 'is-forum' }, [guide(), season(), annexe()]);
      wrap.insertBefore(row, wrap.firstChild);
      row.parentNode.insertBefore(divider(), row.nextSibling);
      return;
    }

    var ud = window._userdata || {};
    var logged = String(ud.session_logged_in) === '1';

    var c = {
      onboarding: onboarding,
      context: context,
      season: season,
      guide: guide,
      annexe: annexe,
      announcements: announcements,
      rumors: rumors,
      latest: latest,
      scenarios: scenarios,
      staff: staff,
      community: function () { return stack([topsites(), discord()], 'sg-c-community'); }
    };

    var order = logged
      ? ['announcements', 'rumors', 'latest', 'context', 'season', 'guide', 'annexe', 'scenarios', 'staff', 'community']
      : ['onboarding', 'context', 'season', 'guide', 'annexe', 'announcements', 'rumors', 'latest', 'scenarios', 'staff', 'community'];

    var home = h('div', { id: 'sg-home', class: logged ? 'is-member' : 'is-visitor' }, order.map(function (k) { return c[k](); }));
    wrap.insertBefore(home, wrap.firstChild);

    /* Séparateur entre les widgets et les catégories, à la place de la barre
       de liens rapides d'AwesomeBB (masquée par le CSS quand il la précède) */
    var bar = document.querySelector('#index .action-bar-top');
    var sep = divider();
    if (bar) bar.parentNode.insertBefore(sep, bar);
    else home.parentNode.insertBefore(sep, home.nextSibling);
  }

  /* Logo de Sengoku no Jidai au trait (assets/snj-logo-outline.svg) */
  var LOGO_OUTLINE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">' +
    '<circle cx="50.4" cy="50.4" r="38.4" vector-effect="non-scaling-stroke"/>' +
    '<path vector-effect="non-scaling-stroke" d="M73.3 51.0Q72.5 50.3 70.6 49.4Q68.8 48.4 66.4 48.3Q64.1 48.2 61.9 49.1Q59.7 49.9 58.2 51.2Q56.7 52.6 55.6 54.4Q54.6 56.2 54.2 58.1Q53.9 60.0 54.2 61.6Q54.6 63.2 55.5 64.7Q56.4 66.3 57.4 67.5Q58.5 68.8 58.5 69.1Q58.6 69.5 57.3 71.1Q56.0 72.7 54.6 73.7Q53.2 74.7 53.3 75.1Q53.3 75.6 56.3 75.6Q59.3 75.7 62.4 74.8Q65.5 74.0 67.9 72.7Q70.3 71.3 72.0 69.6Q73.8 67.9 74.6 66.6Q75.3 65.4 75.9 64.0Q76.6 62.5 76.7 60.2Q76.9 57.8 76.7 56.8Q76.6 55.8 76.1 54.7Q75.6 53.6 74.8 52.6Q74.1 51.7 73.3 51.0Z"/>' +
    '<path vector-effect="non-scaling-stroke" d="M31.1 43.2Q30.8 43.1 30.4 43.4Q29.9 43.8 28.9 45.1Q27.9 46.4 26.5 49.3Q25.1 52.2 24.6 54.6Q24.1 57.0 24.3 60.0Q24.4 62.9 25.3 65.2Q26.1 67.4 27.0 68.7Q27.9 70.0 28.8 70.8Q29.7 71.7 30.7 72.3Q31.8 73.0 32.9 73.4Q34.0 73.8 36.3 73.8Q38.5 73.8 40.6 72.9Q42.6 72.0 43.8 71.0Q44.9 70.0 45.5 69.0Q46.2 68.1 46.7 67.0Q47.1 66.0 47.3 64.6Q47.5 63.2 47.3 61.0Q47.1 58.9 46.1 56.9Q45.1 54.9 43.5 53.6Q42.0 52.2 40.1 51.6Q38.2 51.0 35.4 50.9Q32.6 50.9 32.3 50.4Q32.0 50.0 31.7 48.5Q31.4 47.1 31.4 45.2Q31.4 43.3 31.1 43.2Z"/>' +
    '<path vector-effect="non-scaling-stroke" d="M37.2 30.3Q36.7 31.6 36.7 34.1Q36.7 36.6 37.5 38.4Q38.3 40.2 39.8 41.8Q41.4 43.4 43.6 44.4Q45.8 45.3 48.3 45.4Q50.9 45.4 52.5 44.8Q54.0 44.2 55.4 42.9Q56.8 41.6 58.0 39.3Q59.2 37.1 59.7 36.6Q60.3 36.0 61.9 36.4Q63.6 36.7 65.3 37.6Q67.0 38.5 67.2 38.5Q67.5 38.5 67.6 38.3Q67.7 38.1 66.7 35.8Q65.7 33.5 63.8 31.1Q61.9 28.7 59.8 27.0Q57.6 25.3 55.1 24.3Q52.7 23.3 51.3 23.2Q49.9 23.0 48.0 23.0Q46.1 23.1 44.1 23.8Q42.1 24.4 41.1 25.1Q40.2 25.8 39.4 26.6Q38.6 27.5 38.1 28.2Q37.6 29.0 37.2 30.3Z"/>' +
    '</svg>';

  /* Séparateur ornemental (voir src/css/components/05-ornaments.css) */
  function divider() {
    var logo = h('span', { class: 'sg-divider__logo', 'aria-hidden': 'true' });
    logo.innerHTML = LOGO_OUTLINE;
    var rule = h('span', { class: 'sg-divider__rule', 'aria-hidden': 'true' }, [h('span', { class: 'sg-divider__line' })]);
    rule.insertAdjacentHTML('beforeend', '<svg class="sg-divider__notch" viewBox="0 0 48 25" aria-hidden="true"><path d="M0 .5L24 24.5L48 .5"/></svg>');
    rule.appendChild(h('span', { class: 'sg-divider__line' }));
    return h('div', { class: 'sg-divider', role: 'separator' }, [logo, rule]);
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
