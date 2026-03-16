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

  /* ── Couches orbes (du fond vers l'avant) ──────
   *  0 : orb-1   — lent          (0.10x)
   *  1 : orb-2   — moyen-lent    (0.17x)
   *  2 : orb-3   — intermédiaire (0.14x)
   *  3 : orb-4   — plus rapide   (0.22x)
   *  4 : shape-ring              (0.06x)
   */
  var layers = [
    { el: null, scrollSpeed: 0.06, mouseDepth: 9  },  /* shape-ring */
    { el: null, scrollSpeed: 0.10, mouseDepth: 13 },  /* orb-1      */
    { el: null, scrollSpeed: 0.17, mouseDepth: 9  },  /* orb-2      */
    { el: null, scrollSpeed: 0.14, mouseDepth: 11 },  /* orb-3      */
    { el: null, scrollSpeed: 0.22, mouseDepth: 17 }   /* orb-4      */
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

    /* Orbes + anneau */
    layers[0].el = document.querySelector('.shape-ring');
    layers[1].el = document.querySelector('.orb-1');
    layers[2].el = document.querySelector('.orb-2');
    layers[3].el = document.querySelector('.orb-3');
    layers[4].el = document.querySelector('.orb-4');

    /* Orbes des sections intérieures */
    document.querySelectorAll('.sec-orb[data-speed]').forEach(function (el) {
      secOrbItems.push({ el: el, speed: parseFloat(el.getAttribute('data-speed')) });
    });

    /* Icônes tech fantômes — chacune assignée individuellement */
    var hfiEls = document.querySelectorAll('.hfi');
    hfiEls.forEach(function (el, i) {
      if (hfiItems[i]) hfiItems[i].el = el;
    });

    initReveal();
    initTilt();
    initCounters();
    initScrollIndicator();

    /* Démarrage de la boucle RAF */
    rafId = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });

    if (heroEl) {
      heroEl.addEventListener('mousemove',  onMouseMove);
      heroEl.addEventListener('mouseleave', onMouseLeave);
    }
  });
})();
