/* ================================================
   INDEX.JS — Parallax multi-couches + reveal
   ================================================ */

(function () {
  'use strict';

  var heroEl   = null;
  var heroGrid = null;
  var orbs     = [
    { el: null, speed: 0.18 },   /* orb-1 : fond gauche, lent  */
    { el: null, speed: 0.09 },   /* orb-2 : fond droite, très lent */
    { el: null, speed: 0.14 },   /* orb-3 : fond bas, intermédiaire */
    { el: null, speed: 0.22 }    /* orb-4 : accent, plus rapide  */
  ];

  /* ─────────────────────────────────────────────
   * PARALLAX
   * Principe : chaque couche monte à une vitesse
   * différente quand l'utilisateur scroll vers le bas.
   *
   *  orbes (fond)  → vitesse 0.09 – 0.22x  (restent en place = profondeur)
   *  hero-grid     → vitesse 0.38x          (monte plus lentement = parallax)
   *  + fade-out du contenu à partir de 30 % du hero
   * ───────────────────────────────────────────── */
  function onScroll() {
    var scrollY = window.pageYOffset;
    var heroH   = heroEl ? heroEl.offsetHeight : window.innerHeight;

    if (scrollY > heroH * 1.1) return; /* héro hors vue, on arrête */

    /* Orbes : chaque couche a sa propre vitesse */
    orbs.forEach(function (orb) {
      if (orb.el) {
        orb.el.style.transform = 'translateY(' + (scrollY * orb.speed) + 'px)';
      }
    });

    /* Contenu hero : monte à 62 % de la vitesse normale */
    if (heroGrid) {
      heroGrid.style.transform = 'translateY(' + (scrollY * 0.38) + 'px)';

      /* Fade-out progressif entre 20 % et 75 % du hero */
      var fadeStart = heroH * 0.20;
      var fadeEnd   = heroH * 0.75;
      var opacity   = 1;
      if (scrollY > fadeStart) {
        opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
        opacity = Math.max(0, Math.min(1, opacity));
      }
      heroGrid.style.opacity = opacity.toString();
    }
  }

  /* ─────────────────────────────────────────────
   * REVEAL — IntersectionObserver
   * ───────────────────────────────────────────── */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    /* Éléments déjà dans le viewport au chargement */
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

  /* ─────────────────────────────────────────────
   * SCROLL INDICATOR → smooth scroll vers #Profil
   * ───────────────────────────────────────────── */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', function () {
      var target = document.getElementById('Profil');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
   * INIT
   * ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    heroEl   = document.querySelector('.hero');
    heroGrid = document.querySelector('.hero-grid');
    orbs[0].el = document.querySelector('.orb-1');
    orbs[1].el = document.querySelector('.orb-2');
    orbs[2].el = document.querySelector('.orb-3');
    orbs[3].el = document.querySelector('.orb-4');

    initReveal();
    initScrollIndicator();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
