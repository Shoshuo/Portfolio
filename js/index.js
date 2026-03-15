/* ================================================
   INDEX.JS — Parallax scroll+souris, tilt 3D,
              compteurs animés, reveal
   ================================================ */

(function () {
  'use strict';

  /* ── Références ──────────────────────────────── */
  var heroEl   = null;
  var heroGrid = null;
  var orbs     = [
    { el: null, scrollSpeed: 0.18, mouseDepth: 14 },
    { el: null, scrollSpeed: 0.09, mouseDepth: 8  },
    { el: null, scrollSpeed: 0.14, mouseDepth: 11 },
    { el: null, scrollSpeed: 0.23, mouseDepth: 18 }
  ];

  /* Offsets souris normalisés (-0.5 → +0.5) */
  var mouseNX = 0;
  var mouseNY = 0;
  var scrollY = 0;

  /* ─────────────────────────────────────────────
   * PARALLAX — combine scroll + souris
   *
   * Principe multicouche :
   *  orbes (fond)   → scroll × 0.09-0.23  +  souris × depth
   *  hero-grid      → scroll × 0.38        (contenu monte + lentement)
   *  + fade-out du contenu entre 20 % et 75 % de la hauteur hero
   * ───────────────────────────────────────────── */
  function updateParallax() {
    var heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;

    orbs.forEach(function (orb) {
      if (!orb.el) return;
      var ty = scrollY * orb.scrollSpeed + mouseNY * orb.mouseDepth;
      var tx = mouseNX * orb.mouseDepth;
      orb.el.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
    });

    if (!heroGrid) return;

    /* Monte 62 % de la vitesse normale */
    heroGrid.style.transform = 'translateY(' + (scrollY * 0.38) + 'px)';

    /* Fade-out progressif */
    var fadeStart = heroH * 0.20;
    var fadeEnd   = heroH * 0.72;
    var opacity   = 1;
    if (scrollY > fadeStart) {
      opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      opacity = Math.max(0, Math.min(1, opacity));
    }
    heroGrid.style.opacity = opacity.toString();
  }

  function onScroll() {
    scrollY = window.pageYOffset;
    var heroH = heroEl ? heroEl.offsetHeight * 1.15 : window.innerHeight * 1.5;
    if (scrollY < heroH) updateParallax();
  }

  function onHeroMouseMove(e) {
    if (!heroEl) return;
    var rect = heroEl.getBoundingClientRect();
    mouseNX = (e.clientX - rect.left  - rect.width  / 2) / rect.width;
    mouseNY = (e.clientY - rect.top   - rect.height / 2) / rect.height;
    updateParallax();
  }

  function onHeroMouseLeave() {
    mouseNX = 0;
    mouseNY = 0;
    updateParallax();
  }

  /* ─────────────────────────────────────────────
   * TILT 3D — carte profil
   *
   * Au survol la carte pivote sur X/Y selon la
   * position du curseur (perspective CSS).
   * La float animation est suspendue pendant le tilt.
   * ───────────────────────────────────────────── */
  function initTilt() {
    var card    = document.querySelector('.profile-card');
    var wrapper = document.querySelector('.profile-card-wrapper');
    if (!card || !wrapper) return;

    wrapper.addEventListener('mouseenter', function () {
      card.classList.add('is-tilting');
    });

    wrapper.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2); /* -1 → 1 */
      var dy   = (e.clientY - cy) / (rect.height / 2); /* -1 → 1 */

      var rotX = -dy * 13;   /* inclinaison haut/bas */
      var rotY =  dx * 13;   /* inclinaison gauche/droite */

      card.style.transform =
        'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1.04,1.04,1.04)';
    });

    wrapper.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(function () {
        card.classList.remove('is-tilting');
        card.style.transition = '';
      }, 550);
    });
  }

  /* ─────────────────────────────────────────────
   * COUNT-UP — chiffres des stats
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
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      el.textContent = Math.round(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var stats = document.querySelectorAll('.hero-stat-number');
    if (!stats.length) return;

    if (!('IntersectionObserver' in window)) {
      return; /* pas de fallback nécessaire, déjà affichés */
    }

    var triggered = false;
    var observer  = new IntersectionObserver(function (entries) {
      if (triggered) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          triggered = true;
          stats.forEach(function (el) { countUp(el); });
          observer.disconnect();
        }
      });
    }, { threshold: 0.6 });

    observer.observe(stats[0]);
  }

  /* ─────────────────────────────────────────────
   * REVEAL — IntersectionObserver
   * ───────────────────────────────────────────── */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    /* Éléments déjà visibles */
    setTimeout(function () {
      reveals.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) el.classList.add('visible');
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
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* ── Scroll indicator ────────────────────────── */
  function initScrollIndicator() {
    var el = document.querySelector('.scroll-indicator');
    if (!el) return;
    el.addEventListener('click', function () {
      var target = document.getElementById('Profil');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── Init ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    heroEl   = document.querySelector('.hero');
    heroGrid = document.querySelector('.hero-grid');
    orbs[0].el = document.querySelector('.orb-1');
    orbs[1].el = document.querySelector('.orb-2');
    orbs[2].el = document.querySelector('.orb-3');
    orbs[3].el = document.querySelector('.orb-4');

    initReveal();
    initTilt();
    initCounters();
    initScrollIndicator();

    window.addEventListener('scroll', onScroll, { passive: true });

    if (heroEl) {
      heroEl.addEventListener('mousemove',  onHeroMouseMove);
      heroEl.addEventListener('mouseleave', onHeroMouseLeave);
    }
  });
})();
