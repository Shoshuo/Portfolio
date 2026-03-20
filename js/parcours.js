/* ================================================
   PARCOURS.JS — Reveal, count-up KPI,
                 timeline fill scroll-driven
   ================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * COUNT-UP — anime un nombre de 0 vers sa valeur cible
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

  /* ─────────────────────────────────────────────
   * KPI COUNT-UP — observe .parc-kpi-wrap,
   * lance le count-up sur tous les .parc-kpi-num
   * ───────────────────────────────────────────── */
  function initKpiCounters() {
    var wrap = document.querySelector('.parc-kpi-wrap');
    var nums = document.querySelectorAll('.parc-kpi-num');
    if (!wrap || !nums.length || !('IntersectionObserver' in window)) return;
    var done = false;
    var obs  = new IntersectionObserver(function (entries) {
      if (done) return;
      if (entries[0].isIntersecting) {
        done = true;
        nums.forEach(countUp);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(wrap);
  }

  /* ─────────────────────────────────────────────
   * TIMELINE FILL — chaque .tl-progress-fill
   * monte au fur et à mesure que le tl-wrap défile
   * ───────────────────────────────────────────── */
  function initTimelineFills() {
    var fills = document.querySelectorAll('.tl-progress-fill');
    var wraps = document.querySelectorAll('.tl-wrap');
    if (!fills.length) return;

    function update() {
      var vh = window.innerHeight;
      wraps.forEach(function (wrap, i) {
        var fill = wrap.querySelector('.tl-progress-fill');
        if (!fill) return;
        var rect = wrap.getBoundingClientRect();
        var prog = (vh * 0.55 - rect.top) / rect.height;
        prog = Math.max(0, Math.min(1, prog));
        fill.style.height = (prog * 100).toFixed(1) + '%';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
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

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* ─────────────────────────────────────────────
   * SCROLLSPY — surligne l'item nav actif
   * selon la section visible à l'écran
   * ───────────────────────────────────────────── */
  function initScrollspy() {
    var navItems  = document.querySelectorAll('.parc-nav-item');
    var sections  = [];
    navItems.forEach(function (item) {
      var id = item.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      if (el) sections.push({ el: el, nav: item });
    });
    if (!sections.length) return;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      var vh      = window.innerHeight;
      var active  = null;

      sections.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top + scrollY;
        if (scrollY + vh * 0.35 >= top) active = s;
      });

      navItems.forEach(function (n) { n.classList.remove('active'); });
      if (active) active.nav.classList.add('active');
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────────
   * SKILL BARS — anime les barres quand visible
   * ───────────────────────────────────────────── */
  function initSkillBars() {
    var container = document.querySelector('.parc-skills');
    if (!container || !('IntersectionObserver' in window)) return;
    var done = false;
    var obs  = new IntersectionObserver(function (entries) {
      if (done) return;
      if (entries[0].isIntersecting) {
        done = true;
        container.classList.add('visible');
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(container);
  }

  /* ─────────────────────────────────────────────
   * INIT
   * ───────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initKpiCounters();
    initTimelineFills();
    initScrollspy();
    initSkillBars();
  });
})();
