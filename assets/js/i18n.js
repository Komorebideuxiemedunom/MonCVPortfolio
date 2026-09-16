(function() {
  'use strict';

  var translations = {
    fr: {
      'nav.about':     'A propos',
      'nav.resume':    'Curriculum Vitae',
      'nav.portfolio': 'Portfolio',
      'nav.contact':   'Contact',

      'hero.subtitle': 'Je suis ',

      'about.title':          'A Propos',
      'about.subtitle':       "Master en Management de la Création Numérique · Plus de 4 ans d'expérience en gestion de projet, design et communication digitale.",
      'about.h2':             'Chef de Projet & Designer Numérique · Profil créatif & pluridisciplinaire',
      'about.body1':          "Diplômé d'un master en management de la création numérique, je pilote des projets de l'idée au livrable en combinant rigueur méthodologique et sensibilité créative. Mon parcours couvre la gestion de projet Agile, le design UX/UI, la communication digitale et la production de jeux vidéo — des compétences appliquées aussi bien en entreprise qu'en production indépendante.",
      'about.body2':          "Actuellement Chargé de Communication & Marketing Digital chez Q-Leap S.A (Luxembourg), je suis ouvert à de nouvelles opportunités en gestion de projet, communication ou design dans des environnements créatifs, tech ou gaming.",
      'about.label.birthday': 'Naissance :',
      'about.label.driving':  'Permis :',
      'about.label.location': 'Localisation :',
      'about.label.degree':   'Diplôme :',
      'about.label.avail':    'Disponibilité :',
      'about.val.avail':      'Immédiate',
      'about.download':       'Télécharger mon CV',

      'skills.title':    'Compétences',
      'skills.subtitle': "Outils métiers solides (Adobe Suite, Agile, Unity) associés à une réelle aptitude créative et une forte capacité d'adaptation.",
      'skills.mgmt':     'Outils de gestion (Trello, Monday, Hacknplan)',
      'skills.veille':   'Veille informatique',
      'skills.methods':  'Méthodes Agile (Scrum, Kanban)',
      'skills.creation': 'Création 2D/3D',

      'services.title':       "Ce que j'apporte",
      'services.subtitle':    'Un profil pluridisciplinaire qui combine gestion de projet, création visuelle, communication digitale et développement web.',
      'services.pm.title':    'Gestion de Projet Agile',
      'services.pm.desc':     "Pilotage de projets créatifs et numériques en Agile/Scrum/Waterfall. Backlog, sprints, coordination multi-profils, reporting aux parties prenantes.",
      'services.ux.title':    'UX/UI & Prototypage',
      'services.ux.desc':     "Conception de wireframes et prototypes interactifs (Figma, Adobe XD). Optimisation des parcours utilisateur, tests QA, documentation fonctionnelle.",
      'services.vfx.title':   'Effets Visuels (VFX)',
      'services.vfx.desc':    "Création et intégration d'effets visuels sous Unity (Particle System, ShaderGraph). Motion design et post-production pour jeux vidéo et contenus numériques.",
      'services.com.title':   'Communication & Contenu',
      'services.com.desc':    "Community management, copywriting, production vidéo (pub, produits, réseaux). Création de contenus multicanaux B2B et B2C, gestion événementielle.",
      'services.design.title':'Design Graphique & Identité',
      'services.design.desc': "Conception de logos, infographies, assets et chartes graphiques. Maîtrise de la Suite Adobe (Photoshop, Illustrator, InDesign, XD, After Effects).",
      'services.web.title':   'Développement Web',
      'services.web.desc':    "Intégration HTML/CSS, migration et refonte de sites (Bootstrap, Firebase). Approche orientée accessibilité, performance et expérience utilisateur.",

      'resume.title':    'Curriculum Vitae',
      'resume.subtitle': 'Mon parcours académique et professionnel.',
      'resume.edu':      'Formation',
      'resume.exp':      'Expériences Professionnelles',

      'passions.title':        'Passions',
      'passions.subtitle':     'Ce qui me passionne en dehors du travail.',
      'passions.games.title':  'Jeux vidéos',
      'passions.series.title': 'Séries et films',
      'passions.read.title':   'Lecture',

      'portfolio.title':        'Portfolio',
      'portfolio.subtitle':     'Découvrez mes projets créatifs et numériques.',
      'portfolio.filter.all':   'Tous',
      'portfolio.filter.games': 'Jeux vidéos',
      'portfolio.filter.design':'Design',

      'contact.title':        'Me contacter',
      'contact.subtitle':     "N'hésitez pas à me contacter pour toute opportunité professionnelle.",
      'contact.address':      'Adresse',
      'contact.phone':        'Téléphone',
      'contact.email':        'Email',
      'contact.form.name':    'Votre Nom',
      'contact.form.email':   'Votre Email',
      'contact.form.subject': 'Sujet',
      'contact.form.message': 'Message',
      'contact.form.send':    'Envoyer le Message',
    },
    en: {
      'nav.about':     'About',
      'nav.resume':    'Resume',
      'nav.portfolio': 'Portfolio',
      'nav.contact':   'Contact',

      'hero.subtitle': 'I am ',

      'about.title':          'About',
      'about.subtitle':       "Master's in Digital Creation Management · 4+ years of experience in project management, design and digital communication.",
      'about.h2':             'Project Manager & Digital Designer · Creative & Multidisciplinary',
      'about.body1':          "With a Master's in digital creation management, I lead projects from concept to delivery by combining methodological rigor with creative sensibility. My background spans Agile project management, UX/UI design, digital communication and video game production — skills applied both in professional settings and independent production.",
      'about.body2':          "Currently working as Digital Marketing & Communication Manager at Q-Leap S.A (Luxembourg), I am open to new opportunities in project management, communication or design within creative, tech or gaming environments.",
      'about.label.birthday': 'Birthday:',
      'about.label.driving':  'Driving:',
      'about.label.location': 'Location:',
      'about.label.degree':   'Degree:',
      'about.label.avail':    'Availability:',
      'about.val.avail':      'Immediate',
      'about.download':       'Download my CV',

      'skills.title':    'Skills',
      'skills.subtitle': 'Solid professional tools (Adobe Suite, Agile, Unity) combined with genuine creative ability and strong adaptability.',
      'skills.mgmt':     'Management tools (Trello, Monday, Hacknplan)',
      'skills.veille':   'Tech monitoring',
      'skills.methods':  'Agile methods (Scrum, Kanban)',
      'skills.creation': '2D/3D creation',

      'services.title':       'What I bring',
      'services.subtitle':    'A multidisciplinary profile combining project management, visual creation, digital communication and web development.',
      'services.pm.title':    'Agile Project Management',
      'services.pm.desc':     'Leading creative and digital projects in Agile/Scrum/Waterfall. Backlog, sprints, multi-profile coordination, stakeholder reporting.',
      'services.ux.title':    'UX/UI & Prototyping',
      'services.ux.desc':     'Wireframe and interactive prototype design (Figma, Adobe XD). User journey optimisation, QA testing, functional documentation.',
      'services.vfx.title':   'Visual Effects (VFX)',
      'services.vfx.desc':    'Creation and integration of visual effects in Unity (Particle System, ShaderGraph). Motion design and post-production for video games and digital content.',
      'services.com.title':   'Communication & Content',
      'services.com.desc':    'Community management, copywriting, video production (ads, products, social). Multichannel B2B and B2C content creation, event management.',
      'services.design.title':'Graphic Design & Identity',
      'services.design.desc': 'Logo design, infographics, assets and brand guidelines. Proficient in the Adobe Suite (Photoshop, Illustrator, InDesign, XD, After Effects).',
      'services.web.title':   'Web Development',
      'services.web.desc':    'HTML/CSS integration, site migration and redesign (Bootstrap, Firebase). Accessibility, performance and user-experience focused approach.',

      'resume.title':    'Resume',
      'resume.subtitle': 'My academic and professional background.',
      'resume.edu':      'Education',
      'resume.exp':      'Work Experience',

      'passions.title':        'Interests',
      'passions.subtitle':     'What I am passionate about outside of work.',
      'passions.games.title':  'Video games',
      'passions.series.title': 'Series & films',
      'passions.read.title':   'Reading',

      'portfolio.title':        'Portfolio',
      'portfolio.subtitle':     'Explore my creative and digital projects.',
      'portfolio.filter.all':   'All',
      'portfolio.filter.games': 'Video games',
      'portfolio.filter.design':'Design',

      'contact.title':        'Get in touch',
      'contact.subtitle':     'Feel free to contact me for any professional opportunity.',
      'contact.address':      'Address',
      'contact.phone':        'Phone',
      'contact.email':        'Email',
      'contact.form.name':    'Your Name',
      'contact.form.email':   'Your Email',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Message',
      'contact.form.send':    'Send Message',
    }
  };

  var currentLang = localStorage.getItem('lang') || 'fr';

  function applyLang(lang) {
    if (!translations[lang]) lang = 'fr';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
    var t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });
    document.querySelectorAll('.lang-opt').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    applyLang(currentLang);
    document.querySelectorAll('.lang-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        applyLang(this.getAttribute('data-lang'));
      });
    });
  });

  window.__i18n = {
    applyLang: applyLang,
    getLang: function() { return currentLang; }
  };
})();
