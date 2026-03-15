/* ================================================
   INDEX.JS — Parallax orbs + reveal animations
   ================================================ */

(function () {
  'use strict';

  /* ── Parallax orbes au scroll ────────────────── */
  var orbs = [
    { el: null, speed: 0.25 },
    { el: null, speed: 0.15 },
    { el: null, speed: 0.20 }
  ];

  function initOrbs() {
    orbs[0].el = document.querySelector('.orb-1');
    orbs[1].el = document.querySelector('.orb-2');
    orbs[2].el = document.querySelector('.orb-3');
  }

  function onScroll() {
    var scrollY = window.pageYOffset;
    orbs.forEach(function (orb) {
      if (!orb.el) return;
      orb.el.style.transform = 'translateY(' + (scrollY * orb.speed) + 'px)';
    });
  }

  /* ── IntersectionObserver pour .reveal ────────── */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    /* Déclencher immédiatement les éléments visibles au chargement */
    setTimeout(function () {
      reveals.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('visible');
        }
      });
    }, 80);

    if (!('IntersectionObserver' in window)) {
      /* Fallback : tout afficher */
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ── Scroll indicator : clic → section Profil ── */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', function () {
      var target = document.getElementById('Profil');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ── Init ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initOrbs();
    initReveal();
    initScrollIndicator();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
