/**
 * neo-effects.js : barre de lecture et envoi du formulaire de contact
 */
(function () {
  'use strict';

  var prefersReduced = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ====================================================
     0. MANIFESTE : chaque morceau s'allume à mesure qu'on lit
  ==================================================== */
  function initManifesto() {
    var box = document.querySelector('.manifesto-text');
    if (!box || prefersReduced()) return;
    var parts = box.querySelectorAll('span');
    box.classList.add('is-armed');
    function update() {
      var r = box.getBoundingClientRect();
      var vh = window.innerHeight;
      var prog = (vh * 0.8 - r.top) / (r.height + vh * 0.3);
      var lit = Math.round(Math.max(0, Math.min(1, prog)) * parts.length);
      parts.forEach(function (p, i) { p.classList.toggle('is-lit', i < lit); });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ====================================================
     1. READING PROGRESS
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
     2. CONTACT FORM : envoi AJAX + notification
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
          showToast('success', 'Message envoyé. Je vous réponds au plus vite.');
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
    initManifesto();
    initReadingProgress();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
