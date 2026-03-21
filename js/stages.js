/* ================================================
   STAGES.JS — Reading bar, reveal, KPI, filters
   ================================================ */

(function () {
  'use strict';

  /* ── Count-up ──────────────────────────────── */
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

  function initKpi() {
    var wrap = document.querySelector('.stg-kpi-wrap');
    var nums = document.querySelectorAll('.stg-kpi-num');
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

  /* ── Reading bar ───────────────────────────── */
  function initReadingBar() {
    var bar = document.getElementById('reading-bar');
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress  = docHeight > 0 ? (scrollTop / docHeight * 100) : 0;
      bar.style.width = Math.min(progress, 100).toFixed(1) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Reveal ────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.stg-reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.06 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── Filters ───────────────────────────────── */
  function initFilters() {
    var btns  = document.querySelectorAll('.stg-filter-btn');
    var cards = document.querySelectorAll('.stg-card[data-type]');
    if (!btns.length || !cards.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.classList.remove('stg-filtered-out');
          } else {
            card.classList.add('stg-filtered-out');
          }
        });
      });
    });
  }

  /* ── Init ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initReadingBar();
    initReveal();
    initKpi();
    initFilters();
  });
})();
