/* ================================================
   STAGES.JS — Reading bar, reveal, KPI, filters,
               card tilt, filter counts
   ================================================ */

(function () {
  'use strict';

  /* ── Count-up ──────────────────────────────── */
  function countUp(el) {
    var raw    = el.textContent.trim();
    var num    = parseInt(raw, 10);
    var suffix = raw.replace(/[0-9]/g, '');
    if (isNaN(num)) return;
    var duration  = 900 + num * 55;
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
      if (entries[0].isIntersecting) { done = true; nums.forEach(countUp); obs.disconnect(); }
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
      bar.style.width = (docHeight > 0 ? Math.min(scrollTop / docHeight * 100, 100) : 0).toFixed(1) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Reveal ────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.stg-reveal');
    if (!els.length) return;

    /* Assign stagger delays based on DOM order */
    els.forEach(function (el, i) { el.setAttribute('data-delay', i); });

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ── Filters + count ───────────────────────── */
  function initFilters() {
    var btns       = document.querySelectorAll('.stg-filter-btn');
    var cards      = document.querySelectorAll('.stg-card[data-type]');
    var countEl    = document.querySelector('.stg-result-count');
    var total      = cards.length;
    if (!btns.length || !cards.length) return;

    /* Count cards per type */
    var typeCounts = { all: total };
    cards.forEach(function (card) {
      var t = card.getAttribute('data-type');
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    /* Update count badges in buttons */
    btns.forEach(function (btn) {
      var f   = btn.getAttribute('data-filter');
      var cnt = btn.querySelector('.stg-filter-count');
      if (cnt && typeCounts[f] !== undefined) cnt.textContent = typeCounts[f];
    });

    function updateResultCount(n) {
      if (!countEl) return;
      countEl.innerHTML = 'Affichage de <strong>' + n + '</strong> stage' + (n > 1 ? 's' : '');
    }

    updateResultCount(total);

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var visible = 0;
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.classList.remove('stg-filtered-out');
            visible++;
          } else {
            card.classList.add('stg-filtered-out');
          }
        });

        updateResultCount(visible);
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
