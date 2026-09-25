(function() {
  'use strict';

  var translations = {
    fr: {
      'nav.about':     'A propos',
      'nav.resume':    'Curriculum Vitae',
      'nav.portfolio': 'Portfolio',
      'nav.contact':   'Contact',

      'hero.subtitle': 'Un profil qui relie plusieurs métiers',
      'hero.tagline':  "Je pilote des projets, et je sais aussi mettre les mains dans la création quand il le faut.",
      'hero.response': 'Réponds sous 24-48h',

      'flow.strategy':  'Stratégie',
      'flow.project':   'Projet',
      'flow.creation':  'Création',
      'flow.tech':      'Tech',
      'flow.comm':      'Communication',
      'flow.delivery':  'Livraison',

      'about.title':          'A Propos',
      'about.subtitle':       "Master en Management de la Création Numérique · Plus de 4 ans d'expérience en gestion de projet, design et communication digitale.",
      'about.h2':             'Chef de projet, créatif et communicant',
      'about.body1':          "Diplômé d'un master en management de la création numérique, je pilote des projets de l'idée au livrable, en combinant rigueur méthodologique et sensibilité créative. Mon parcours couvre la gestion de projet Agile, le design UX/UI, la communication digitale et la production de jeux vidéo. J'utilise ces compétences aussi bien en entreprise qu'en production indépendante.",
      'about.body2':          "Actuellement Chargé de Communication & Marketing Digital chez Q-Leap S.A (Luxembourg), je ne suis pas activement en recherche mais reste ouvert aux opportunités intéressantes en gestion de projet, communication ou design, dans des environnements créatifs, tech ou gaming.",
      'about.label.birthday': 'Naissance :',
      'about.label.driving':  'Permis :',
      'about.label.location': 'Localisation :',
      'about.label.degree':   'Diplôme :',
      'about.label.avail':    'Statut :',
      'about.val.avail':      'Ouvert aux opportunités',
      'about.badge':          'Ouvert aux opportunités',
      'about.download':       'Télécharger mon CV',
      'about.throughline':    "Ce qui compte, ce n'est pas de savoir un peu de tout. C'est de comprendre un projet dans sa globalité, de collaborer avec différents profils, et de pouvoir mettre moi-même les mains dans la production quand c'est nécessaire.",

      'skills.title':    'Compétences',
      'skills.subtitle': "Cinq familles d'outils, qui se répondent selon les besoins du projet.",
      'skills.mgmt':     'Outils de gestion (Trello, Monday, Hacknplan)',
      'skills.veille':   'Veille informatique',
      'skills.methods':  'Méthodes Agile (Scrum, Kanban)',
      'skills.creation': 'Création 2D/3D',
      'skills.office':      'Office & Google Workspace',
      'skills.adobe':       'Adobe Suite (Photoshop, Illustrator, InDesign, XD, After Effects)',
      'skills.blender':     'Blender (Animation 3D)',
      'skills.htmlcss':     'HTML/CSS & Intégration web',
      'skills.emailing':    'E-mailing',
      'skills.multitarget': 'Multi-cible (B2B/B2C)',

      'skills.level.expert':   'Maîtrise',
      'skills.level.solid':    'Bonne maîtrise',
      'skills.level.good':     'Pratique régulière',
      'skills.level.familiar': 'Notions',

      'skills.group.project.tag':     'Projet',
      'skills.group.project.title':   'Coordination & Pilotage',
      'skills.group.project.desc':    'Cadrer un besoin, organiser une équipe, tenir un délai.',
      'skills.group.creative.tag':    'Création',
      'skills.group.creative.title':  'Design & Identité visuelle',
      'skills.group.creative.desc':   'Donner une forme concrète à une idée ou une marque.',
      'skills.group.creativetech.tag':   'Creative Tech',
      'skills.group.creativetech.title': '3D, VFX & Game Dev',
      'skills.group.creativetech.desc':  'Prototyper et faire vivre la création dans un moteur temps réel.',
      'skills.group.digital.tag':     'Digital',
      'skills.group.digital.title':   'Web & Outils digitaux',
      'skills.group.digital.desc':    'Intégrer, publier et faire vivre un projet en ligne.',
      'skills.group.comm.tag':        'Communication',
      'skills.group.comm.title':      'Contenu & Diffusion',
      'skills.group.comm.desc':       'Faire connaître un projet auprès de la bonne audience.',

      'services.title':       "Ce que j'apporte",
      'services.subtitle':    "Six disciplines, un seul fil conducteur : comprendre un projet, le cadrer, le créer et le livrer. Chacune nourrit les autres.",
      'services.tag.project':      'Projet',
      'services.tag.creative':     'Création',
      'services.tag.creativetech': 'Creative Tech',
      'services.tag.comm':         'Communication',
      'services.tag.digital':      'Digital',
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

      'nav.qleap':          'Q-Leap',
      'qleap.subtitle':     'Expérience actuelle · depuis juin 2026',
      'qleap.tag':          'Case study',
      'qleap.status':       'Missions en cours',
      'qleap.intro1':       "Depuis juin 2026, j'accompagne Q-Leap sur des sujets qui dépassent la communication digitale classique : stratégie de contenu, marketing produit, événementiel, CRM, coordination de projets, SEO, veille et outils digitaux.",
      'qleap.intro2':       "Mon rôle consiste à transformer des besoins parfois très différents en actions concrètes, de la réflexion stratégique jusqu'à la production et au suivi.",
      'qleap.kpi':          'Objectif : 400 inscriptions',
      'qleap.axis4.sub':    'Écosystème IT & formation au Luxembourg',
      'qleap.projects':     'Projets clés',
      'qleap.inprogress':   'En cours',
      'qleap.how':          'Ma façon de travailler',
      'qleap.how.text':     "De la définition de l'objectif jusqu'au livrable final, je travaille entre stratégie, coordination et production pour faire avancer les projets.",
      'resume.qleap.intro': "Mon rôle se situe à l'intersection de la communication, du marketing, de la gestion de projet et des outils digitaux : événementiel, marketing produit, CRM, vidéo et coordination de plusieurs sites web, avec des interlocuteurs différents selon les sujets.",
      'resume.qleap.link':  'Voir le case study Q-Leap',
      'resume.title':    'Curriculum Vitae',
      'resume.subtitle': 'Mon parcours académique et professionnel.',
      'resume.edu':      'Formation',
      'resume.exp':      'Expériences Professionnelles',
      'resume.volunteer':'Bénévolat',
      'resume.throughline': "Ça commence par la création : VFX, 3D, game design, avec déjà des équipes à coordonner pendant mes études. Le rôle s'élargit ensuite vers la coordination de projets plus larges, puis la communication, le marketing et la coordination de projets chez Q-Leap.",

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

      'trust.label': 'Universités & entreprises',

      'testimonials.title':      'Ce qu\'on dit de moi',
      'testimonials.subtitle':   'Retours de personnes avec qui j\'ai travaillé.',
      'testimonials.1.text':     "Lucas a pleinement participé à la réflexion stratégique de communication, a apporté un nouveau regard et proposé des améliorations. Son expertise de la prise de parole sur les nouveaux médias nous a ouvert de belles perspectives.",
      'testimonials.1.role':     'Responsable du pôle communication, Université de Lorraine',
      'testimonials.2.text':     "Nous lui avons assigné des tâches d'assistanat de production sur deux longs métrages et il a su s'adapter rapidement, faisant preuve de rigueur et d'initiative. Assez rapidement, nous avons pu le laisser en autonomie. Nous étions satisfaits de son travail à l'issue de son stage.",
      'testimonials.2.role':     'Production Manager, Mélusine Studio',

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

      'hero.subtitle': 'A profile that connects several trades',
      'hero.tagline':  "I run projects, and I can also get hands-on with the creative work when it's needed.",
      'hero.response': 'Replies within 24-48h',

      'flow.strategy':  'Strategy',
      'flow.project':   'Project',
      'flow.creation':  'Creation',
      'flow.tech':      'Tech',
      'flow.comm':      'Communication',
      'flow.delivery':  'Delivery',

      'about.title':          'About',
      'about.subtitle':       "Master's in Digital Creation Management · 4+ years of experience in project management, design and digital communication.",
      'about.h2':             'Project manager, creative and communicator',
      'about.body1':          "With a Master's in digital creation management, I lead projects from concept to delivery, combining methodological rigor with creative sensibility. My background spans Agile project management, UX/UI design, digital communication and video game production. I apply these skills both in professional settings and independent production.",
      'about.body2':          "Currently working as Digital Marketing & Communication Manager at Q-Leap S.A (Luxembourg), I'm not actively job-hunting but stay open to interesting opportunities in project management, communication or design, within creative, tech or gaming environments.",
      'about.label.birthday': 'Birthday:',
      'about.label.driving':  'Driving:',
      'about.label.location': 'Location:',
      'about.label.degree':   'Degree:',
      'about.label.avail':    'Status:',
      'about.val.avail':      'Open to opportunities',
      'about.badge':          'Open to opportunities',
      'about.download':       'Download my CV',
      'about.throughline':    "What matters isn't knowing a bit of everything. It's understanding a project as a whole, working with different profiles, and being able to get hands-on with production myself when it's needed.",

      'skills.title':    'Skills',
      'skills.subtitle': "Five families of tools, that work together depending on what the project needs.",
      'skills.mgmt':     'Management tools (Trello, Monday, Hacknplan)',
      'skills.veille':   'Tech monitoring',
      'skills.methods':  'Agile methods (Scrum, Kanban)',
      'skills.creation': '2D/3D creation',
      'skills.office':      'Office & Google Workspace',
      'skills.adobe':       'Adobe Suite (Photoshop, Illustrator, InDesign, XD, After Effects)',
      'skills.blender':     'Blender (3D animation)',
      'skills.htmlcss':     'HTML/CSS & web integration',
      'skills.emailing':    'Emailing',
      'skills.multitarget': 'Multi-target (B2B/B2C)',

      'skills.level.expert':   'Strong command',
      'skills.level.solid':    'Good command',
      'skills.level.good':     'Regular practice',
      'skills.level.familiar': 'Basics',

      'skills.group.project.tag':     'Project',
      'skills.group.project.title':   'Coordination & Leadership',
      'skills.group.project.desc':    'Scoping a need, organising a team, keeping a deadline.',
      'skills.group.creative.tag':    'Creative',
      'skills.group.creative.title':  'Design & Visual Identity',
      'skills.group.creative.desc':   'Giving concrete shape to an idea or a brand.',
      'skills.group.creativetech.tag':   'Creative Tech',
      'skills.group.creativetech.title': '3D, VFX & Game Dev',
      'skills.group.creativetech.desc':  'Prototyping and bringing creation to life in a real-time engine.',
      'skills.group.digital.tag':     'Digital',
      'skills.group.digital.title':   'Web & Digital Tools',
      'skills.group.digital.desc':    'Integrating, publishing and running a project online.',
      'skills.group.comm.tag':        'Communication',
      'skills.group.comm.title':      'Content & Distribution',
      'skills.group.comm.desc':       'Making a project known to the right audience.',

      'services.title':       'What I bring',
      'services.subtitle':    'Six disciplines, one common thread: understand a project, scope it, create it and deliver it. Each one feeds the others.',
      'services.tag.project':      'Project',
      'services.tag.creative':     'Creative',
      'services.tag.creativetech': 'Creative Tech',
      'services.tag.comm':         'Communication',
      'services.tag.digital':      'Digital',
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

      'nav.qleap':          'Q-Leap',
      'qleap.subtitle':     'Current role · since June 2026',
      'qleap.tag':          'Case study',
      'qleap.status':       'Ongoing missions',
      'qleap.intro1':       "Since June 2026, I have been supporting Q-Leap on topics that go beyond classic digital communication: content strategy, product marketing, events, CRM, project coordination, SEO, market watch and digital tools.",
      'qleap.intro2':       "My role is to turn very different needs into concrete actions, from strategic thinking all the way to production and follow-up.",
      'qleap.kpi':          'Target: 400 registrations',
      'qleap.axis4.sub':    'IT & training ecosystem in Luxembourg',
      'qleap.projects':     'Selected projects',
      'qleap.inprogress':   'Ongoing',
      'qleap.how':          'How I work',
      'qleap.how.text':     "From defining the objective to delivering the final asset, I work across strategy, coordination and production to keep projects moving.",
      'resume.qleap.intro': "My role sits at the intersection of communication, marketing, project management and digital tools: events, product marketing, CRM, video and coordination of several websites, with different stakeholders depending on the topic.",
      'resume.qleap.link':  'See the Q-Leap case study',
      'resume.title':    'Resume',
      'resume.subtitle': 'My academic and professional background.',
      'resume.edu':      'Education',
      'resume.exp':      'Work Experience',
      'resume.volunteer':'Volunteering',
      'resume.throughline': "It starts with creation: VFX, 3D, game design, already coordinating small teams during my studies. The role then widens toward coordinating bigger projects, then communication, marketing and project coordination at Q-Leap.",

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

      'trust.label': 'Universities & companies',

      'testimonials.title':      'What people say',
      'testimonials.subtitle':   "Feedback from people I've worked with.",
      'testimonials.1.text':     "Lucas fully took part in our strategic communication planning, bringing a fresh perspective and suggesting improvements. His expertise on new media platforms opened up great opportunities for us.",
      'testimonials.1.role':     'Head of Communications, Université de Lorraine',
      'testimonials.2.text':     "We assigned him production assistant tasks on two feature films, and he adapted quickly, showing rigor and initiative. We were soon able to let him work independently. We were satisfied with his work by the end of his internship.",
      'testimonials.2.role':     'Production Manager, Mélusine Studio',

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
