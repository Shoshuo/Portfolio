/* ================================================
   INDEX.JS — Parallax scroll + reveal animations
   ================================================ */

(function () {
  'use strict';

  var heroEl    = null;
  var heroGrid  = null;
  var orbs      = [
    { el: null, speed: 0.18 },
    { el: null, speed: 0.10 },
    { el: null, speed: 0.14 }
  ];

  /* ── Parallax au scroll ──────────────────────── */
  /*
   * Principe : quand l'utilisateur scrolle de N px,
   *   - les orbes (fond) montent de N × 0.1-0.18 px  → restent "en place" = effet parallax lent
   *   - le contenu hero-grid monte de N × 0.35 px     → plus lent que le scroll normal = parallax
   * Résultat : plusieurs couches se déplacent à des vitesses différentes.
   */
  function onScroll() {
    var scrollY  = window.pageYOffset;
    var heroH    = heroEl ? heroEl.offsetHeight : window.innerHeight;

    /* N'appliquer le parallax que pendant que le hero est visible */
    if (scrollY > heroH) return;

    /* Orbes : couche la plus lente (fond) */
    orbs.forEach(function (orb) {
      if (orb.el) orb.el.style.transform = 'translateY(' + (scrollY * orb.speed) + 'px)';
    });

    /* Contenu hero : couche intermédiaire
     * translateY positif = compense une partie du scroll vers le haut
     * → le contenu monte à 65 % de la vitesse normale (1 - 0.35 = 0.65) */
    if (heroGrid) {
      heroGrid.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    }
  }

  /* ── IntersectionObserver pour .reveal ────────── */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    /* Éléments déjà visibles au chargement */
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

  /* ── Scroll indicator → section Profil ──────── */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', function () {
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

    initReveal();
    initScrollIndicator();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
