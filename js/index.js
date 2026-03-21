/* ================================================
   INDEX.JS — Parallax lerp multi-couches,
              tilt 3D, compteurs, reveals
   ================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * LERP — interpolation linéaire
   * Donne le côté "huilé" du parallax :
   * chaque couche glisse doucement vers sa cible
   * au lieu de sauter directement dessus.
   * ───────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  var LERP_SCROLL = 0.07;   /* vitesse de suivi du scroll (0.05 = très doux, 0.15 = réactif) */
  var LERP_MOUSE  = 0.055;  /* vitesse de suivi de la souris */

  /* ── Références DOM ────────────────────────── */
  var heroEl   = null;
  var heroGrid = null;

  /* ── Couches hero (du fond le plus lointain vers l'avant) ──
   *  0 : hr-3       — le plus lointain (0.012x)
   *  1 : hr-2       — lointain         (0.025x)
   *  2 : shape-ring — intermédiaire    (0.06x)
   *  3 : orb-1      — lent             (0.10x)
   *  4 : orb-2      — moyen-lent       (0.17x)
   *  5 : orb-3      — intermédiaire    (0.14x)
   *  6 : orb-4      — plus rapide      (0.22x)
   */
  var layers = [
    { el: null, scrollSpeed: 0.012, mouseDepth: 1  },  /* hr-3       */
    { el: null, scrollSpeed: 0.025, mouseDepth: 2  },  /* hr-2       */
    { el: null, scrollSpeed: 0.06,  mouseDepth: 9  },  /* shape-ring */
    { el: null, scrollSpeed: 0.10,  mouseDepth: 13 },  /* orb-1      */
    { el: null, scrollSpeed: 0.17,  mouseDepth: 9  },  /* orb-2      */
    { el: null, scrollSpeed: 0.14,  mouseDepth: 11 },  /* orb-3      */
    { el: null, scrollSpeed: 0.22,  mouseDepth: 17 }   /* orb-4      */
  ];

  /* ── Icônes tech fantômes — 8 éléments individuels ──
   * Chacun a sa propre vitesse de parallax pour un effet
   * de profondeur réaliste (couche la plus lente = la plus lointaine).
   */
  var hfiItems = [
    { el: null, scrollSpeed: 0.03, mouseDepth: 4,  rotSpeed:  0.016, rot: 0 },  /* hfi-1 php    */
    { el: null, scrollSpeed: 0.07, mouseDepth: 7,  rotSpeed: -0.022, rot: 0 },  /* hfi-2 docker */
    { el: null, scrollSpeed: 0.05, mouseDepth: 5,  rotSpeed:  0.012, rot: 0 },  /* hfi-3 linux  */
    { el: null, scrollSpeed: 0.09, mouseDepth: 9,  rotSpeed: -0.028, rot: 0 },  /* hfi-4 git    */
    { el: null, scrollSpeed: 0.04, mouseDepth: 6,  rotSpeed:  0.020, rot: 0 },  /* hfi-5 golang */
    { el: null, scrollSpeed: 0.08, mouseDepth: 8,  rotSpeed: -0.014, rot: 0 },  /* hfi-6 js     */
    { el: null, scrollSpeed: 0.06, mouseDepth: 5,  rotSpeed:  0.024, rot: 0 },  /* hfi-7 mysql  */
    { el: null, scrollSpeed: 0.11, mouseDepth: 11, rotSpeed: -0.018, rot: 0 }   /* hfi-8 python */
  ];

  /* ── Orbes des sections intérieures ────────────
   * Collectés via [data-speed] sur .sec-orb.
   * Animés sur toute la page (pas de garde hero).
   */
  var secOrbItems = [];

  /* ── Sections : données pour updateSectionEffects ──
   * Chaque section a une config conic (amplitude + offset)
   * et des flags pour les effets spécifiques (aurora, grid).
   */
  var sectItems = [];

  /* ── Référence carte et border pour scroll-driven ── */
  var cardBorderEl = null;

  /* ── Valeurs cibles (mises à jour par events) ── */
  var target  = { scrollY: 0, mouseX: 0, mouseY: 0 };
  /* ── Valeurs lerpées (mises à jour dans RAF) ─── */
  var current = { scrollY: 0, mouseX: 0, mouseY: 0 };

  var rafId   = null;
  var heroH   = 0;

  /* ── Vélocité scroll — inertie des anneaux ─── */
  var prevLerpedScroll = 0;
  var scrollVelocity   = 0;

  /* ── Barre de progression scroll ────────────── */
  var scrollBarEl = null;

  /* ── Halo curseur global ─────────────────────── */
  var cursorGlowEl = null;
  var cursorRawX   = null;  /* null = pas encore bougé */
  var cursorRawY   = 0;
  var cursorLerpX  = 0;
  var cursorLerpY  = 0;

  /* ─────────────────────────────────────────────
   * BOUCLE RAF — lerp + rendu
   * ───────────────────────────────────────────── */
  function tick() {
    /* Lerp progressif vers la cible */
    current.scrollY = lerp(current.scrollY, target.scrollY, LERP_SCROLL);
    current.mouseX  = lerp(current.mouseX,  target.mouseX,  LERP_MOUSE);
    current.mouseY  = lerp(current.mouseY,  target.mouseY,  LERP_MOUSE);

    scrollVelocity   = current.scrollY - prevLerpedScroll;
    prevLerpedScroll = current.scrollY;

    /* Halo curseur — lerp doux vers position réelle */
    if (cursorRawX !== null && cursorGlowEl) {
      cursorLerpX = lerp(cursorLerpX, cursorRawX, 0.09);
      cursorLerpY = lerp(cursorLerpY, cursorRawY, 0.09);
      cursorGlowEl.style.transform =
        'translate(' + (cursorLerpX - 300).toFixed(1) + 'px, ' +
                       (cursorLerpY - 300).toFixed(1) + 'px)';
    }

    renderParallax();
    updateSectionEffects();
    rafId = requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────
   * RENDU DES COUCHES
   * ───────────────────────────────────────────── */
  function renderParallax() {
    var sy = current.scrollY;
    var mx = current.mouseX;
    var my = current.mouseY;
    var maxH = heroH * 1.2;

    /* Orbes + anneau (actifs seulement dans et juste après le hero) */
    if (sy <= maxH) {
    layers.forEach(function (layer) {
      if (!layer.el) return;
      var ty = sy * layer.scrollSpeed + my * layer.mouseDepth;
      var tx = mx * layer.mouseDepth;
      layer.el.style.transform = 'translate(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px)';
    });

    /* Icônes tech fantômes (couche fond) */
    hfiItems.forEach(function (item) {
      if (!item.el) return;
      var ty = sy * item.scrollSpeed + my * item.mouseDepth;
      var tx = mx * item.mouseDepth;
      item.el.style.transform = 'translate(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px)';
      item.rot += item.rotSpeed;
      item.el.style.rotate = item.rot.toFixed(3) + 'deg';
    });
    } /* fin du if (sy <= maxH) */

    /* Orbes des sections intérieures — actifs sur toute la page */
    secOrbItems.forEach(function (item) {
      var ty = sy * item.speed;
      item.el.style.transform = 'translateY(' + ty.toFixed(2) + 'px)';
    });

    /* Hero-grid : contenu avant-plan */
    if (heroGrid) {
      var gridTy = sy * 0.38;
      heroGrid.style.transform = 'translateY(' + gridTy.toFixed(2) + 'px)';

      /* Fade-out entre 18 % et 70 % de la hauteur hero */
      var fadeStart = heroH * 0.18;
      var fadeEnd   = heroH * 0.70;
      var opacity   = 1;
      if (sy > fadeStart) {
        opacity = 1 - (sy - fadeStart) / (fadeEnd - fadeStart);
        opacity = Math.max(0, Math.min(1, opacity));
      }
      heroGrid.style.opacity = opacity.toFixed(3);
    }
  }

  /* ─────────────────────────────────────────────
   * EFFETS SCROLL-DRIVEN — pilotés par JS dans RAF
   * Garantit un fonctionnement cross-browser sans
   * dépendance à animation-timeline CSS.
   * ───────────────────────────────────────────── */
  function updateSectionEffects() {
    var sy = current.scrollY;
    var vh = window.innerHeight;

    /* ── Rotation des anneaux hero (hr-2 / hr-3) ─
     * hr-2 tourne dans le sens horaire, hr-3 en sens inverse.
     * Utilise rotate (prop. individuelle) → compose avec
     * style.transform (translate) sans conflit.
     */
    if (layers[1].el) {  /* hr-2 — sens horaire + inertie vélocité */
      layers[1].el.style.rotate = (sy * 0.055 + scrollVelocity * 1.8).toFixed(2) + 'deg';
    }
    if (layers[0].el) {  /* hr-3 — sens anti-horaire + inertie vélocité */
      layers[0].el.style.rotate = (-sy * 0.038 - scrollVelocity * 1.2).toFixed(2) + 'deg';
    }

    /* ── Bordure carte : --border-angle suit le scroll ── */
    if (cardBorderEl) {
      var borderAngle = (sy * 0.10) % 360;
      cardBorderEl.style.setProperty('--border-angle', borderAngle.toFixed(1) + 'deg');
    }

    /* ── Sections : --sect-prog + --sect-conic ──
     * prog = 0 quand la section est juste sous le viewport,
     *       = 1 quand elle est juste au-dessus.
     * Formule cover 0%→100% : (sy - top + vh) / (height + vh)
     */
    sectItems.forEach(function (item) {
      var prog = (sy - item.el.offsetTop + vh) / (item.el.offsetHeight + vh);
      prog = Math.max(0, Math.min(1, prog));

      /* Dérive des blobs (nécessite @property <number> pour calc()) */
      item.el.style.setProperty('--sect-prog', prog.toFixed(4));

      /* Angle du conic — valeur en degrés, passée directement à CSS.
       * Aucun calc() CSS → cross-browser garanti. */
      var angle = prog * item.conicRange + item.conicOffset;
      item.el.style.setProperty('--sect-conic', angle.toFixed(1) + 'deg');

      /* Aurora (section Contact) */
      if (item.isContact) {
        item.el.style.setProperty('--sect-aurora',   (prog * 360).toFixed(1) + 'deg');
        item.el.style.setProperty('--sect-aurora-b', (prog * 360 + 180).toFixed(1) + 'deg');
      }
      /* Grille (section Stack) */
      if (item.isStack) {
        item.el.style.setProperty('--sect-grid', (prog * 44).toFixed(1) + 'px');
      }
    });
  }

  /* ─────────────────────────────────────────────
   * EVENTS
   * ───────────────────────────────────────────── */
  function onScroll() {
    target.scrollY = window.pageYOffset;

    /* Barre de progression — mise à jour immédiate (pas de lerp) */
    if (scrollBarEl) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct  = docH > 0 ? (window.pageYOffset / docH * 100) : 0;
      scrollBarEl.style.width = pct.toFixed(2) + '%';
    }
  }

  function onMouseMove(e) {
    if (!heroEl) return;
    var rect = heroEl.getBoundingClientRect();
    target.mouseX = ((e.clientX - rect.left)  / rect.width  - 0.5);  /* -0.5 → +0.5 */
    target.mouseY = ((e.clientY - rect.top)   / rect.height - 0.5);
  }

  function onMouseLeave() {
    target.mouseX = 0;
    target.mouseY = 0;
  }

  /* ─────────────────────────────────────────────
   * TILT 3D — carte profil
   * On écoute sur .profile-card-border (qui enveloppe
   * exactement la carte) pour un calcul de position précis.
   * ───────────────────────────────────────────── */
  function initTilt() {
    var card   = document.querySelector('.profile-card');
    var border = document.querySelector('.profile-card-border');
    if (!card || !border) return;

    border.addEventListener('mouseenter', function () {
      card.classList.add('is-tilting');
    });

    border.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var dx   = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      var dy   = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
      card.style.transform =
        'perspective(700px) rotateX(' + (-dy * 13).toFixed(1) + 'deg)'
        + ' rotateY(' + (dx * 13).toFixed(1) + 'deg)'
        + ' scale3d(1.04,1.04,1.04)';
    });

    border.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform  = '';
      setTimeout(function () {
        card.classList.remove('is-tilting');
        card.style.transition = '';
      }, 560);
    });
  }

  /* ─────────────────────────────────────────────
   * COUNT-UP — stats hero
   * ───────────────────────────────────────────── */
  function countUp(el) {
    var raw    = el.textContent.trim();
    var num    = parseInt(raw, 10);
    var suffix = raw.replace(/[0-9]/g, '');
    if (isNaN(num)) return;
    var duration  = 900 + num * 60;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * num) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var stats = document.querySelectorAll('.hero-stat-number');
    if (!stats.length || !('IntersectionObserver' in window)) return;
    var done = false;
    var obs  = new IntersectionObserver(function (entries) {
      if (done) return;
      if (entries[0].isIntersecting) {
        done = true;
        stats.forEach(countUp);
        obs.disconnect();
      }
    }, { threshold: 0.6 });
    obs.observe(stats[0]);
  }

  /* ─────────────────────────────────────────────
   * REVEAL — IntersectionObserver
   * ───────────────────────────────────────────── */
  function initReveal() {
    var sel     = '.reveal, .reveal-wipe, .reveal-left, .reveal-right';
    var reveals = document.querySelectorAll(sel);
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    /* Toggle : .visible ajouté à l'entrée, retiré à la sortie (quelle que soit
     * la direction). L'IO fire immédiatement pour les éléments en vue au chargement.
     * → L'animation se rejoue à chaque re-entrée dans le viewport. */
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* ─────────────────────────────────────────────
   * SPOTLIGHT — halo qui suit la souris dans chaque section
   * Met à jour --spot-x et --spot-y sur l'élément,
   * CSS affiche un radial-gradient centré sur ces coords.
   * ───────────────────────────────────────────── */
  function initSpotlight() {
    document.querySelectorAll('.idx-section').forEach(function (section) {
      section.addEventListener('mousemove', function (e) {
        var rect = section.getBoundingClientRect();
        section.style.setProperty('--spot-x', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
        section.style.setProperty('--spot-y', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
      });
      section.addEventListener('mouseleave', function () {
        /* Repousse le spotlight hors champ en haut */
        section.style.setProperty('--spot-y', '-20%');
      });
    });
  }

  /* ─────────────────────────────────────────────
   * SECTION EFFECTS — orbe brumeux rotatif
   * Injecte .sect-conic-orb dans 1 section sur 2.
   * ───────────────────────────────────────────── */
  function initSectionEffects() {
    var sections = document.querySelectorAll('#Profil, #Domaines, .idx-section');
    if (!sections.length) return;

    /* Orbe brumeux : une section sur deux (index pair), 3 variantes cycliques */
    var orbVariants = ['orb-var-a', 'orb-var-b', 'orb-var-c'];
    var orbCount = 0;
    sections.forEach(function (section, i) {
      if (i % 2 !== 0) return;
      var orb = document.createElement('div');
      orb.className = 'sect-conic-orb ' + orbVariants[orbCount % orbVariants.length];
      orb.setAttribute('aria-hidden', 'true');
      section.insertBefore(orb, section.firstChild);
      orbCount++;
    });
  }

  /* ─────────────────────────────────────────────
   * SCRAMBLE TEXT — effet "hacker" sur le nom hero
   * Les lettres s'affichent aléatoirement puis se
   * figent une par une de gauche à droite.
   * ───────────────────────────────────────────── */
  function scrambleEl(el, startDelay) {
    var target     = el.getAttribute('data-text') || el.textContent;
    /* Seulement des majuscules — largeurs similaires dans Poppins,
       aucun caractère spécial qui ferait varier la largeur brutalement */
    var chars      = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    var len        = target.length;
    var locked     = 0;
    var tick       = 0;
    var TICK_MS    = 42;
    var LOCK_EVERY = 2;
    var iv;
    var spans      = [];

    function rand() { return chars[Math.floor(Math.random() * chars.length)]; }

    /* ── Étape 1 : construire un <span> par caractère ──
       On laisse d'abord chaque span afficher le bon caractère
       pour mesurer sa largeur naturelle, puis on la fixe. */
    el.textContent = '';
    for (var i = 0; i < len; i++) {
      var s = document.createElement('span');
      s.style.display    = 'inline-block';
      s.style.textAlign  = 'center';
      s.textContent      = target[i];
      el.appendChild(s);
      spans.push(s);
    }

    /* ── Étape 2 : fixer la largeur de chaque span ──
       Le layout ne bougera plus pendant le scramble. */
    spans.forEach(function (s) {
      s.style.minWidth = s.offsetWidth + 'px';
    });

    /* ── Étape 3 : afficher le bruit initial ── */
    spans.forEach(function (s, i) {
      if (target[i] === '-' || target[i] === ' ') return; /* ponctuation fixe */
      s.textContent = rand();
    });

    /* ── Étape 4 : boucle de verrouillage progressif ── */
    setTimeout(function () {
      iv = setInterval(function () {
        tick++;
        if (tick % LOCK_EVERY === 0 && locked < len) locked++;

        spans.forEach(function (s, i) {
          if (i < locked) {
            s.textContent = target[i]; /* lettre définitive */
          } else if (target[i] !== '-' && target[i] !== ' ') {
            s.textContent = rand();    /* encore du bruit   */
          }
        });

        if (locked >= len) {
          clearInterval(iv);
          /* Nettoyer les spans — remettre le texte brut */
          el.textContent = target;
        }
      }, TICK_MS);
    }, startDelay || 0);
  }

  function initScramble() {
    var els = document.querySelectorAll('.js-scramble');
    if (!els.length) return;
    var base = 300;
    /* Le 2ème élément commence quand le 1er est à ~50% */
    var gap = els[0] ? Math.round(els[0].getAttribute('data-text').length * 2 * 42 * 0.5) : 350;
    els.forEach(function (el, i) {
      scrambleEl(el, base + i * gap);
    });
  }

  /* ── Scroll indicator ────────────────────────── */
  function initScrollIndicator() {
    var el = document.querySelector('.scroll-indicator');
    if (!el) return;
    el.addEventListener('click', function () {
      var t = document.getElementById('Profil');
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
   * INIT
   * ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    heroEl   = document.querySelector('.hero');
    heroGrid = document.querySelector('.hero-grid');
    heroH    = heroEl ? heroEl.offsetHeight : window.innerHeight;

    /* Couches hero (le plus lointain en premier) */
    layers[0].el = document.querySelector('.hr-3');
    layers[1].el = document.querySelector('.hr-2');
    layers[2].el = document.querySelector('.shape-ring');
    layers[3].el = document.querySelector('.orb-1');
    layers[4].el = document.querySelector('.orb-2');
    layers[5].el = document.querySelector('.orb-3');
    layers[6].el = document.querySelector('.orb-4');

    /* Orbes + formes des sections — tout élément avec data-speed hors hero */
    document.querySelectorAll('[data-speed]').forEach(function (el) {
      secOrbItems.push({ el: el, speed: parseFloat(el.getAttribute('data-speed')) });
    });

    /* Icônes tech fantômes — chacune assignée individuellement */
    var hfiEls = document.querySelectorAll('.hfi');
    hfiEls.forEach(function (el, i) {
      if (hfiItems[i]) hfiItems[i].el = el;
    });

    /* ── Carte : référence pour scroll-driven --border-angle ── */
    cardBorderEl = document.querySelector('.profile-card-border');

    /* ── Sections : config conic + flags spéciaux ── */
    var sectionConf = {
      'Profil':   { conicRange: 180, conicOffset: -90 },
      'Domaines': { conicRange: 180, conicOffset: -90 },
      'Projets':  { conicRange: 240, conicOffset: -120 },
      'Parcours': { conicRange: 180, conicOffset: -90 },
      'Stack':    { conicRange: 240, conicOffset: -120, isStack:   true },
      'Contact':  { conicRange: 360, conicOffset:    0, isContact: true }
    };
    document.querySelectorAll('#Profil, #Domaines, .idx-section').forEach(function (el) {
      var conf = sectionConf[el.id] || { conicRange: 180, conicOffset: -90 };
      sectItems.push({
        el:          el,
        conicRange:  conf.conicRange,
        conicOffset: conf.conicOffset,
        isStack:     !!conf.isStack,
        isContact:   !!conf.isContact
      });
    });

    /* ── Barre de progression scroll ── */
    scrollBarEl = document.createElement('div');
    scrollBarEl.id = 'scroll-bar';
    scrollBarEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scrollBarEl);

    /* ── Halo curseur global ── */
    cursorGlowEl = document.createElement('div');
    cursorGlowEl.id = 'cursor-glow';
    cursorGlowEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorGlowEl);

    document.addEventListener('mousemove', function (e) {
      if (cursorRawX === null) {
        /* Premier mouvement : téléporter le lerp sur la position réelle */
        cursorLerpX = e.clientX;
        cursorLerpY = e.clientY;
      }
      cursorRawX = e.clientX;
      cursorRawY = e.clientY;
    });

    initReveal();
    initTilt();
    initCounters();
    initScrollIndicator();
    initSpotlight();
    initSectionEffects();
    initScramble();

    /* Démarrage de la boucle RAF */
    rafId = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });

    if (heroEl) {
      heroEl.addEventListener('mousemove',  onMouseMove);
      heroEl.addEventListener('mouseleave', onMouseLeave);
    }
  });
})();
