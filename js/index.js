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
    { el: null, scrollSpeed: 0.03, mouseDepth: 4  },  /* hfi-1 php       */
    { el: null, scrollSpeed: 0.07, mouseDepth: 7  },  /* hfi-2 docker    */
    { el: null, scrollSpeed: 0.05, mouseDepth: 5  },  /* hfi-3 linux     */
    { el: null, scrollSpeed: 0.09, mouseDepth: 9  },  /* hfi-4 git       */
    { el: null, scrollSpeed: 0.04, mouseDepth: 6  },  /* hfi-5 golang    */
    { el: null, scrollSpeed: 0.08, mouseDepth: 8  },  /* hfi-6 js        */
    { el: null, scrollSpeed: 0.06, mouseDepth: 5  },  /* hfi-7 mysql     */
    { el: null, scrollSpeed: 0.11, mouseDepth: 11 }   /* hfi-8 python    */
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

  /* ─────────────────────────────────────────────
   * BOUCLE RAF — lerp + rendu
   * ───────────────────────────────────────────── */
  function tick() {
    /* Lerp progressif vers la cible */
    current.scrollY = lerp(current.scrollY, target.scrollY, LERP_SCROLL);
    current.mouseX  = lerp(current.mouseX,  target.mouseX,  LERP_MOUSE);
    current.mouseY  = lerp(current.mouseY,  target.mouseY,  LERP_MOUSE);

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
    if (layers[1].el) {  /* hr-2 — sens horaire */
      layers[1].el.style.rotate = (sy * 0.055).toFixed(2) + 'deg';
    }
    if (layers[0].el) {  /* hr-3 — sens anti-horaire */
      layers[0].el.style.rotate = (-sy * 0.038).toFixed(2) + 'deg';
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

      /* Angle du conic — valeur en degrés, passée directement à CSS */
      var angle = prog * item.conicRange + item.conicOffset;
      item.el.style.setProperty('--sect-conic', angle.toFixed(1) + 'deg');

      /* Aurora (section Contact) */
      if (item.isContact) {
        item.el.style.setProperty('--sect-aurora', (prog * 360).toFixed(1) + 'deg');
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

    /* Éléments déjà visibles */
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 40) {
          el.classList.add('visible');
        }
      });
    }, 80);

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
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
   * SECTION EFFECTS — scan sweep + barre de profondeur
   * Injecte .sect-scan et .sect-depth-bar dans chaque section.
   * Un IntersectionObserver ajoute .sect-entered (une seule fois)
   * pour déclencher l'animation de balayage CSS.
   * ───────────────────────────────────────────── */
  function initSectionEffects() {
    var sections = document.querySelectorAll('#Profil, #Domaines, .idx-section');
    if (!sections.length) return;

    sections.forEach(function (section) {
      /* Barre de profondeur (fond, derrière les orbes) */
      var bar = document.createElement('div');
      bar.className = 'sect-depth-bar';
      bar.setAttribute('aria-hidden', 'true');
      section.insertBefore(bar, section.firstChild);

      /* Scan line (au-dessus des orbes, sous le contenu) */
      var scan = document.createElement('div');
      scan.className = 'sect-scan';
      scan.setAttribute('aria-hidden', 'true');
      var orbWrap = section.querySelector('.sec-orb-wrap');
      var insertRef = orbWrap ? orbWrap.nextSibling : section.firstChild;
      section.insertBefore(scan, insertRef);
    });

    /* Scan + dégradé pilotés par --sect-prog (CSS scroll-driven animation).
     * Aucune logique JS supplémentaire requise : l'animation se joue
     * dans les deux sens selon la direction du scroll. */
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

    initReveal();
    initTilt();
    initCounters();
    initScrollIndicator();
    initSpotlight();
    initSectionEffects();

    /* Démarrage de la boucle RAF */
    rafId = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });

    if (heroEl) {
      heroEl.addEventListener('mousemove',  onMouseMove);
      heroEl.addEventListener('mouseleave', onMouseLeave);
    }
  });
})();
