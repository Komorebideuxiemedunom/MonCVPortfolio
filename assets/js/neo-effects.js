/**
 * neo-effects.js — Curseur neon + Gooey scroll reveal
 * Le trail WebGL Navier-Stokes est dans fluid-trail.js
 */
(function () {
  'use strict';

  var isTouchDevice = function () {
    return window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0);
  };
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
      bar.style.setProperty('--progress', pct + '%');
    }, { passive: true });
  }

  /* ====================================================
     4. CONTACT FORM — envoi AJAX + notification glass
  ==================================================== */
  function showToast(type, message) {
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'glass-toast glass-toast-' + type;

    var icon = document.createElement('i');
    icon.className = 'bi ' + (type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill');
    var text = document.createElement('span');
    text.textContent = message;
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'glass-toast-close';
    close.setAttribute('aria-label', 'Fermer');
    close.innerHTML = '&times;';

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(close);
    container.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('is-visible'); });

    var dismissTimer = setTimeout(dismiss, 6000);
    close.addEventListener('click', dismiss);

    function dismiss() {
      clearTimeout(dismissTimer);
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
    }
  }

  function initContactForm() {
    var form = document.querySelector('.contact form[action*="formsubmit.co"]');
    if (!form) return;

    var endpoint = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then(function () {
          showToast('success', 'Message envoyé avec succès ! Je vous réponds au plus vite.');
          form.reset();
        })
        .catch(function () {
          showToast('error', "L'envoi a échoué. Écrivez-moi directement à lucas.dansac@gmail.com.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });
  }

  /* ====================================================
     INIT
  ==================================================== */
  function init() {
    initCursor();
    initGooeyReveal();
    initReadingProgress();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
