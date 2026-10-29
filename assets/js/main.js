/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');
  const mobileNav = window.matchMedia('(max-width: 1199.98px)');

  // Menu mobile fermé : hors écran, ses liens ne doivent pas rester atteignables au clavier.
  function syncHeaderInert() {
    var header = document.querySelector('#header');
    var hidden = mobileNav.matches && !header.classList.contains('header-show');
    Array.prototype.forEach.call(header.children, function(child) {
      if (child !== headerToggleBtn) child.inert = hidden;
    });
  }

  function headerToggle() {
    var open = document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
    headerToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    headerToggleBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    syncHeaderInert();
    if (open) {
      var first = document.querySelector('#navmenu a');
      if (first) first.focus();
    }
  }
  syncHeaderInert();
  mobileNav.addEventListener('change', syncHeaderInert);
  headerToggleBtn.addEventListener('click', headerToggle);
  headerToggleBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); headerToggle(); }
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: scrollBehavior()
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') new PureCounter();

  /**
   * Initiate glightbox — runs on load so it also picks up
   * dynamically wrapped slider images below
   */
  window.addEventListener('load', function() {
    // Wrap portfolio slider images in lightbox links
    document.querySelectorAll('.portfolio-details-slider .swiper-slide img').forEach(function(img) {
      if (img.closest('a.glightbox')) return;
      var a = document.createElement('a');
      a.href = img.src;
      a.className = 'glightbox';
      a.setAttribute('data-gallery', 'portfolio-slider');
      a.setAttribute('data-title', img.alt || '');
      img.parentNode.insertBefore(a, img);
      a.appendChild(img);
    });
    GLightbox({ selector: '.glightbox' });
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        // Un filtre choisi avant la fin du chargement des images est appliqué ici.
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      // Filtres utilisables au clavier et annoncés comme des boutons à bascule.
      filters.setAttribute('role', 'button');
      filters.setAttribute('tabindex', '0');
      filters.setAttribute('aria-pressed', filters.classList.contains('filter-active') ? 'true' : 'false');
      function choose() {
        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(other) {
          other.classList.remove('filter-active');
          other.setAttribute('aria-pressed', 'false');
        });
        filters.classList.add('filter-active');
        filters.setAttribute('aria-pressed', 'true');
        filter = filters.getAttribute('data-filter');
        if (initIsotope) initIsotope.arrange({ filter: filter });
      }
      filters.addEventListener('click', choose, false);
      filters.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      });
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      // « Réduire les animations » : pas de défilement automatique ni de transition.
      if (reducedMotion.matches) {
        delete config.autoplay;
        config.speed = 0;
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Figma iframes — pass focus on hover so wheel/scroll events go inside
   */
  document.querySelectorAll('.figma-embed-wrapper iframe').forEach(function(iframe) {
    iframe.addEventListener('mouseenter', function() { this.focus(); });
    iframe.addEventListener('mouseleave', function() { this.blur(); });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: scrollBehavior()
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
