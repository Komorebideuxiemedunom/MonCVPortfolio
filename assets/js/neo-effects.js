/**
 * neo-effects.js : barre de lecture et envoi du formulaire de contact
 */
(function () {
  'use strict';

  var prefersReduced = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ====================================================
     0. RÉCIT AU SCROLL : le parcours se dessine, les chiffres
        montent, la façon de travailler se déroule étape par étape.
        Rien de tout ça si le visiteur demande moins d'animations.
  ==================================================== */
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  function initStory() {
    if (prefersReduced()) return;
    document.documentElement.classList.add('story');

    var items = document.querySelectorAll('.resume .resume-item');
    var path = document.querySelector('.career-path');
    var steps = path ? path.querySelectorAll('li') : [];
    var how = document.querySelector('.qleap-how');
    var words = how ? how.querySelectorAll('.flow-word') : [];

    function update() {
      var vh = window.innerHeight;
      // Frise du CV : le trait descend avec la lecture, chaque poste s'allume quand il l'atteint
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var fill = clamp01((vh * 0.7 - r.top) / Math.max(r.height, 1));
        el.style.setProperty('--fill', (fill * 100).toFixed(1) + '%');
        el.classList.toggle('is-reached', fill > 0);
      });
      // Parcours en quatre temps : les étapes s'allument l'une après l'autre
      if (path) {
        var r = path.getBoundingClientRect();
        var n = Math.round(clamp01((vh * 0.85 - r.top) / (vh * 0.5)) * steps.length);
        steps.forEach(function (li, i) { li.classList.toggle('is-reached', i < n); });
      }
      // Façon de travailler : épinglée, une étape par portion de scroll
      if (how) {
        var h = how.getBoundingClientRect();
        var prog = clamp01(-h.top / Math.max(h.height - vh, 1));
        var active = Math.min(words.length - 1, Math.floor(prog * words.length));
        words.forEach(function (w, i) {
          w.classList.toggle('is-done', i < active);
          w.classList.toggle('is-active', i === active);
        });
        how.style.setProperty('--how', prog.toFixed(3));
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Chiffres : ils montent jusqu'à leur valeur la première fois qu'on les voit
    var counters = document.querySelectorAll('.qleap-stats strong');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var m = e.target.textContent.match(/^(\d+)(.*)$/);
        if (!m) return;
        var end = parseInt(m[1], 10), rest = m[2], t0 = null;
        function tick(t) {
          if (!t0) t0 = t;
          var k = clamp01((t - t0) / 1100);
          e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + rest;
          if (k < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
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
    initStory();
    initReadingProgress();
    initContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
