/**
 * neo-effects.js — Curseur neon + Gooey scroll reveal
 * Le trail WebGL Navier-Stokes est dans fluid-trail.js
 */
(function () {
  'use strict';

  var isTouchDevice = function () { return window.matchMedia('(hover: none)').matches; };
  var prefersReduced = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ====================================================
     1. CUSTOM NEON CURSOR
  ==================================================== */
  function initCursor() {
    if (isTouchDevice()) return;

    var dot  = document.getElementById('neo-cursor');
    var ring = document.getElementById('neo-cursor-ring');
    if (!dot || !ring) return;

    var mx = -300, my = -300;
    var rx = -300, ry = -300;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    /* Ring suit avec lerp (lag doux) */
    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    function onEnter() {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    }
    function onLeave() {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    }

    function bindHoverTargets() {
      var sel = 'a, button, .portfolio-filters li, .service-item, .portfolio-content, .lang-opt, .scroll-top, .btn-cv, .btn-project-link, .back-to-portfolio';
      document.querySelectorAll(sel).forEach(function (el) {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    }
    bindHoverTargets();
  }

  /* ====================================================
     2. GOOEY SCROLL REVEAL (blur → sharp, à la neonikala)
  ==================================================== */
  function initGooeyReveal() {
    if (prefersReduced()) {
      document.querySelectorAll('.gooey-reveal').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var elements = document.querySelectorAll('.gooey-reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? el.parentElement.querySelectorAll('.gooey-reveal') : [];
        var idx = Array.prototype.indexOf.call(siblings, el);
        var delay = Math.min(idx * 80, 300);
        setTimeout(function () {
          el.classList.add('is-revealed');
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ====================================================
     3. READING PROGRESS — fil d'Ariane visuel
  ==================================================== */
  function initReadingProgress() {
    if (prefersReduced()) return;
    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Progression de lecture');
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ====================================================
     INIT
  ==================================================== */
  function init() {
    initCursor();
    initGooeyReveal();
    initReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
