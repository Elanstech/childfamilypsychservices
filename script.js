/* ============================================================
   CHILD & FAMILY PSYCHOLOGICAL SERVICES
   script.js — no external dependencies.

   01  Config
   02  Preloader
   03  Typewriter (hero)
   04  Header: sticky, scrollspy, progress rail, mobile drawer
   05  Reveal on scroll
   06  Carousel (services + team)
   07  Modal manager
   08  Service modals
   09  Training season (workshop carousel + registration)
   10  Neurofeedback modal
   11  Team modals
   12  FAQ (accordion + tabs)
   13  Insurance marquee
   14  Forms (Formspree)
   15  FAB + back to top
   16  App bootstrap
   ============================================================ */


/* ============================================================
   01  CONFIG
   ------------------------------------------------------------
   The contact form is an Elfsight embed — its recipients are set
   in the Elfsight dashboard, not here.

   The training registration form uses Formspree. Replace the ID
   below AND the matching `action` attribute on #trainingForm in
   index.html. Create the form on the account for
   elan@elanstechworld.com, then add drkdoheny@gmail.com under
   Form settings → Notification emails so both inboxes receive it.
   ============================================================ */

const CONFIG = {
  trainingEndpoint: 'https://formspree.io/f/YOUR_TRAINING_FORM_ID'
};


/* ============================================================
   02  PRELOADER
   ============================================================ */

class Preloader {
  constructor(minimum = 700) {
    this.el = document.getElementById('preloader');
    this.minimum = minimum;
    this.start = Date.now();
    if (!this.el) return;
    document.body.classList.add('is-locked');
    window.addEventListener('load', () => this.hide());
    setTimeout(() => this.hide(), 4000); // safety net
  }

  hide() {
    if (!this.el || this.done) return;
    this.done = true;
    const wait = Math.max(0, this.minimum - (Date.now() - this.start));
    setTimeout(() => {
      this.el.classList.add('is-hidden');
      document.body.classList.remove('is-locked');
      setTimeout(() => this.el.remove(), 600);
    }, wait);
  }
}


/* ============================================================
   03  TYPEWRITER (hero)
   ============================================================ */

class Typewriter {
  constructor(selector, phrases, opts = {}) {
    this.el = document.querySelector(selector);
    if (!this.el) return;
    this.phrases = phrases;
    this.typeSpeed = opts.typeSpeed || 55;
    this.backSpeed = opts.backSpeed || 28;
    this.hold = opts.hold || 1800;
    this.index = 0;
    this.chars = 0;
    this.deleting = false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.textContent = this.phrases[0];
      return;
    }
    this.tick();
  }

  tick() {
    const phrase = this.phrases[this.index];
    this.chars += this.deleting ? -1 : 1;
    this.el.textContent = phrase.slice(0, this.chars);

    let delay = this.deleting ? this.backSpeed : this.typeSpeed;

    if (!this.deleting && this.chars === phrase.length) {
      delay = this.hold;
      this.deleting = true;
    } else if (this.deleting && this.chars === 0) {
      this.deleting = false;
      this.index = (this.index + 1) % this.phrases.length;
      delay = 320;
    }
    setTimeout(() => this.tick(), delay);
  }
}


/* ============================================================
   04  HEADER
   ============================================================ */

class Header {
  constructor() {
    this.header = document.getElementById('siteHeader');
    this.rail = document.getElementById('scrollRail');
    this.toggle = document.getElementById('navToggle');
    this.drawer = document.getElementById('mobileDrawer');
    this.scrim = document.getElementById('drawerScrim');
    this.close = document.getElementById('drawerClose');
    this.links = Array.from(document.querySelectorAll('[data-nav]'));
    this.sections = this.links
      .map(a => document.getElementById(a.getAttribute('data-nav')))
      .filter(Boolean);
    this.ticking = false;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();

    if (this.toggle) this.toggle.addEventListener('click', () => this.toggleDrawer());
    if (this.close) this.close.addEventListener('click', () => this.closeDrawer());
    if (this.scrim) this.scrim.addEventListener('click', () => this.closeDrawer());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.drawerOpen) this.closeDrawer();
    });

    // smooth anchor scrolling that respects the fixed header
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        this.closeDrawer();
        this.scrollTo(target);
        history.replaceState(null, '', id);
      });
    });
  }

  scrollTo(target) {
    const offset = this.header ? this.header.offsetHeight + 12 : 100;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset;

      if (this.header) this.header.classList.toggle('is-stuck', y > 30);

      if (this.rail) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        this.rail.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      }

      this.spy(y);
      this.ticking = false;
    });
  }

  spy(y) {
    const line = y + (this.header ? this.header.offsetHeight : 90) + 80;
    let current = null;
    this.sections.forEach(section => {
      if (section.offsetTop <= line) current = section.id;
    });
    this.links.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('data-nav') === current);
    });
  }

  toggleDrawer() { this.drawerOpen ? this.closeDrawer() : this.openDrawer(); }

  openDrawer() {
    this.drawerOpen = true;
    this.drawer.classList.add('is-open');
    this.drawer.setAttribute('aria-hidden', 'false');
    this.scrim.hidden = false;
    requestAnimationFrame(() => this.scrim.classList.add('is-open'));
    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-locked');
  }

  closeDrawer() {
    if (!this.drawerOpen) return;
    this.drawerOpen = false;
    this.drawer.classList.remove('is-open');
    this.drawer.setAttribute('aria-hidden', 'true');
    this.scrim.classList.remove('is-open');
    setTimeout(() => { this.scrim.hidden = true; }, 300);
    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked');
  }
}


/* ============================================================
   05  REVEAL ON SCROLL
   ============================================================ */

class Reveal {
  constructor(selector = '.reveal') {
    const items = document.querySelectorAll(selector);
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), i * 70);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(i => io.observe(i));
  }
}


/* ============================================================
   06  CAROUSEL (scroll-snap based — works with touch natively)
   ============================================================ */

class Carousel {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector('.carousel-viewport');
    this.prev = root.querySelector('[data-dir="prev"]');
    this.next = root.querySelector('[data-dir="next"]');
    this.dotsBox = root.querySelector('.carousel-dots');
    if (!this.viewport) return;
    this.init();
  }

  init() {
    this.buildDots();
    if (this.prev) this.prev.addEventListener('click', () => this.step(-1));
    if (this.next) this.next.addEventListener('click', () => this.step(1));
    this.viewport.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('resize', () => { this.buildDots(); this.sync(); });
    this.sync();
  }

  get pages() {
    return Math.max(1, Math.round(this.viewport.scrollWidth / this.viewport.clientWidth));
  }

  buildDots() {
    if (!this.dotsBox) return;
    const count = this.pages;
    if (this.dotsBox.childElementCount === count) return;
    this.dotsBox.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => {
        this.viewport.scrollTo({ left: i * this.viewport.clientWidth, behavior: 'smooth' });
      });
      this.dotsBox.appendChild(dot);
    }
  }

  step(dir) {
    this.viewport.scrollBy({ left: dir * this.viewport.clientWidth, behavior: 'smooth' });
  }

  onScroll() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.sync(); this.raf = null; });
  }

  sync() {
    const { scrollLeft, clientWidth, scrollWidth } = this.viewport;
    const index = Math.round(scrollLeft / clientWidth);
    if (this.dotsBox) {
      Array.from(this.dotsBox.children).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }
    if (this.prev) this.prev.disabled = scrollLeft < 8;
    if (this.next) this.next.disabled = scrollLeft + clientWidth >= scrollWidth - 8;
  }
}


/* ============================================================
   07  MODAL MANAGER
   ============================================================ */

const Modals = {
  current: null,

  open(el) {
    if (!el) return;
    this.close();
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    document.body.classList.add('is-locked');
    this.current = el;
    const focusable = el.querySelector('.modal-close');
    if (focusable) focusable.focus({ preventScroll: true });
  },

  close() {
    const el = this.current;
    if (!el) return;
    el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { el.hidden = true; }, 300);
    this.current = null;
  },

  bind(el) {
    el.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    el.querySelectorAll('[data-close-scroll]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
  },

  init() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }
};


/* ============================================================
   08  SERVICE MODALS
   ============================================================ */

const SERVICE_DATA = {
  'child-therapy': {
    title: 'Child Therapy', subtitle: 'Nurturing emotional growth and resilience in children',
    description: 'Our child therapy sessions provide a safe, supportive environment where children can express themselves freely through play, art, and conversation. We use evidence-based approaches including play therapy, sandplay therapy, and expressive therapy tailored to each child\u2019s unique needs.',
    before: ['Difficulty expressing emotions','Behavioral challenges at home or school','Anxiety or worry','Social difficulties with peers','Processing traumatic experiences'],
    after: ['Improved emotional regulation','Better coping strategies','Increased confidence','Stronger social skills','Healthier emotional expression'],
    process: [
      { title:'Initial assessment', description:'Comprehensive evaluation to understand your child\u2019s needs and develop a personalized treatment plan.' },
      { title:'Therapeutic play sessions', description:'Weekly sessions using age-appropriate techniques like play therapy, art, and sandplay.' },
      { title:'Parent collaboration', description:'Regular updates and guidance to help you support your child\u2019s progress at home.' },
      { title:'Progress monitoring', description:'Ongoing assessment to track growth and adjust interventions as needed.' }
    ]
  },
  'adolescent-therapy': {
    title: 'Adolescent Therapy', subtitle: 'Supporting teens through life\u2019s challenges',
    description: 'Adolescence brings unique challenges including identity formation, peer pressure, academic stress, and emotional changes. Our adolescent therapy provides a confidential space for teens to explore their feelings, develop coping strategies, and build resilience.',
    before: ['Depression or mood swings','Anxiety or panic attacks','Identity and self-esteem issues','Relationship conflicts','Academic or social pressures'],
    after: ['Improved emotional stability','Stronger sense of identity','Better stress management','Healthier relationships','Increased academic focus'],
    process: [
      { title:'Confidential consultation', description:'Building trust through one-on-one sessions where teens feel heard and respected.' },
      { title:'Goal setting', description:'Collaboratively identifying challenges and creating achievable goals.' },
      { title:'Skill development', description:'Teaching practical coping strategies, communication skills, and emotional regulation.' },
      { title:'Ongoing support', description:'Regular sessions to navigate challenges and celebrate progress.' }
    ]
  },
  'individual-therapy': {
    title: 'Individual Therapy', subtitle: 'Personalized support for your mental wellness journey',
    description: 'Individual therapy for adults provides a confidential space to address personal challenges, process emotions, and develop strategies for growth using person-centered, cognitive-behavioral, and humanistic approaches.',
    before: ['Feeling overwhelmed or stuck','Anxiety or depression symptoms','Unprocessed trauma or grief','Life transition challenges','Low self-esteem or confidence'],
    after: ['Greater self-awareness','Improved emotional well-being','Effective coping strategies','Clearer life direction','Enhanced relationships'],
    process: [
      { title:'Initial evaluation', description:'Comprehensive assessment to understand your unique needs and goals.' },
      { title:'Treatment planning', description:'Developing a personalized approach that honors your individual journey.' },
      { title:'Therapeutic work', description:'Regular sessions using evidence-based techniques tailored to your needs.' },
      { title:'Growth & integration', description:'Building skills and insights that support lasting positive change.' }
    ]
  },
  'family-therapy': {
    title: 'Family Therapy', subtitle: 'Strengthening bonds and improving communication',
    description: 'Family therapy helps families improve communication, resolve conflicts, and strengthen relationships. Our sessions provide a supportive space for all family members to be heard and work collaboratively toward positive change.',
    before: ['Communication breakdowns','Frequent conflicts or tension','Difficulties with life transitions','Behavioral issues with children','Feeling disconnected as a family'],
    after: ['Improved family communication','Stronger emotional bonds','Effective conflict resolution','Better understanding of each other','Increased family cohesion'],
    process: [
      { title:'Family assessment', description:'Understanding family dynamics, strengths, and areas for growth.' },
      { title:'Goal identification', description:'Collaboratively defining what the family wants to achieve together.' },
      { title:'Communication skills', description:'Learning techniques for healthy expression and active listening.' },
      { title:'Ongoing sessions', description:'Regular meetings to practice new skills and address emerging challenges.' }
    ]
  },
  'marital-therapy': {
    title: 'Marital Therapy', subtitle: 'Nurturing your partnership and connection',
    description: 'Couples therapy helps partners strengthen their relationship, improve communication, and navigate challenges together using evidence-based approaches like Emotionally Focused Therapy.',
    before: ['Communication difficulties','Frequent arguments or conflicts','Trust or intimacy issues','Feeling disconnected','Life transition challenges'],
    after: ['Improved communication patterns','Deeper emotional connection','Better conflict resolution skills','Renewed intimacy and trust','Stronger partnership foundation'],
    process: [
      { title:'Couples assessment', description:'Understanding relationship dynamics, attachment patterns, and goals.' },
      { title:'Communication enhancement', description:'Learning effective listening and expressing techniques.' },
      { title:'Conflict resolution', description:'Developing healthy ways to navigate disagreements and differences.' },
      { title:'Strengthening connection', description:'Rebuilding intimacy, trust, and emotional bonding.' }
    ]
  },
  'divorce-support': {
    title: 'Divorce Support', subtitle: 'Navigating separation with compassion and guidance',
    description: 'Our divorce support services help individuals and families navigate this difficult time, process emotions, establish co-parenting strategies, and develop healthy coping mechanisms.',
    before: ['Emotional overwhelm and grief','Co-parenting conflicts','Children struggling with changes','Uncertainty about the future','Difficulty managing stress'],
    after: ['Emotional healing and acceptance','Effective co-parenting strategies','Children adapting positively','Clearer path forward','Improved coping skills'],
    process: [
      { title:'Emotional support', description:'Processing grief, anger, and other emotions in a safe environment.' },
      { title:'Co-parenting planning', description:'Developing communication strategies and parenting plans.' },
      { title:'Child support', description:'Helping children understand and adjust to family changes.' },
      { title:'Moving forward', description:'Building resilience and creating a positive future for your family.' }
    ]
  },
  'reunification-therapy': {
    title: 'Reunification Therapy', subtitle: 'Rebuilding parent-child relationships',
    description: 'Reunification therapy is a specialized intervention designed to repair and rebuild parent-child relationships disrupted by separation, divorce, or estrangement.',
    before: ['Parent-child estrangement','Resistance to contact','Negative perceptions','Communication breakdowns','Unresolved conflict'],
    after: ['Restored communication','Rebuilding trust','Positive interactions','Improved relationship quality','Emotional healing'],
    process: [
      { title:'Assessment phase', description:'Evaluating the relationship dynamics and barriers to reunification.' },
      { title:'Preparation', description:'Individual sessions to prepare both parent and child for contact.' },
      { title:'Gradual reintroduction', description:'Structured, supervised sessions facilitating positive interactions.' },
      { title:'Relationship building', description:'Developing healthy communication patterns and rebuilding connection.' }
    ]
  },
  'supervised-visitation': {
    title: 'Therapeutic Supervised Visitation', subtitle: 'Safe, supportive parent-child contact',
    description: 'Therapeutic supervised visitation provides a safe, neutral environment for parent-child contact when safety concerns exist or during family transitions.',
    before: ['Safety concerns during visits','Need for neutral environment','Court-ordered supervision','Anxiety about contact','Documentation requirements'],
    after: ['Safe visit environment','Positive parent-child interactions','Professional documentation','Increased comfort and trust','Progress toward unsupervised visits'],
    process: [
      { title:'Intake & planning', description:'Review of court orders and visit guidelines with all parties.' },
      { title:'Supervised sessions', description:'Professional monitoring of visits in our comfortable facility.' },
      { title:'Interaction support', description:'Guidance to promote positive, age-appropriate interactions.' },
      { title:'Documentation & reporting', description:'Detailed reports for court and attorneys as required.' }
    ]
  },
  'parent-coordination': {
    title: 'Parent Coordination', subtitle: 'Reducing conflict and implementing custody agreements',
    description: 'Parent coordination is a court-ordered service designed to help high-conflict divorced or separated parents implement their custody agreement and reduce conflict.',
    before: ['High-conflict co-parenting','Frequent court involvement','Communication breakdowns','Child caught in the middle','Custody agreement violations'],
    after: ['Reduced parental conflict','Effective communication','Consistent custody implementation','Child protection from conflict','Less court involvement'],
    process: [
      { title:'Court appointment', description:'Review of court order and parenting plan with both parties.' },
      { title:'Communication management', description:'Facilitating parent communication and decision-making.' },
      { title:'Dispute resolution', description:'Mediating conflicts and making recommendations when needed.' },
      { title:'Ongoing coordination', description:'Monitoring compliance and supporting successful co-parenting.' }
    ]
  },
  'custody-evaluations': {
    title: 'Custody Evaluations', subtitle: 'Comprehensive assessments for informed custody decisions',
    description: 'Child custody evaluations are comprehensive psychological assessments conducted to assist courts in making informed decisions about custody and parenting time arrangements.',
    before: ['Custody disputes','Need for professional assessment','Court requirement for evaluation','Concerns about child wellbeing','Parenting capability questions'],
    after: ['Comprehensive psychological evaluation','Professional recommendations','Detailed written report','Court testimony if needed','Informed custody decisions'],
    process: [
      { title:'Case review', description:'Reviewing court documents, records, and relevant history.' },
      { title:'Comprehensive assessment', description:'Interviews, observations, psychological testing, and collateral contacts.' },
      { title:'Analysis & report', description:'Detailed written report with findings and recommendations.' },
      { title:'Court involvement', description:'Testimony and consultation as needed to support decision-making.' }
    ]
  },
  'mental-health-evaluations': {
    title: 'Mental Health Evaluations', subtitle: 'Professional psychological assessments',
    description: 'Comprehensive mental health evaluations provide diagnostic clarity and treatment recommendations for ADHD, autism spectrum disorder, learning disabilities, developmental delays, and other conditions.',
    before: ['Diagnostic uncertainty','Behavioral or academic concerns','Developmental questions','Need for treatment planning','School accommodation requirements'],
    after: ['Clear diagnostic understanding','Comprehensive evaluation report','Treatment recommendations','Educational planning support','Resource connections'],
    process: [
      { title:'Clinical interview', description:'Gathering developmental history and current concerns.' },
      { title:'Testing administration', description:'Comprehensive psychological and educational testing.' },
      { title:'Analysis & diagnosis', description:'Interpreting results and formulating diagnoses.' },
      { title:'Feedback & planning', description:'Reviewing findings and creating actionable recommendations.' }
    ]
  }
};

class ServiceModals {
  constructor() {
    this.container = document.querySelector('.service-modals-container');
    if (!this.container) return;
    this.build();
    this.bindTriggers();
  }

  build() {
    Object.keys(SERVICE_DATA).forEach(key => {
      const s = SERVICE_DATA[key];
      this.container.insertAdjacentHTML('beforeend', `
        <div class="modal" id="modal-${key}" hidden>
          <div class="modal-scrim" data-close></div>
          <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="title-${key}">
            <button class="modal-close" data-close aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <header class="modal-head">
              <span class="eyebrow">Our Services</span>
              <h2 id="title-${key}">${s.title}</h2>
              <p>${s.subtitle}</p>
            </header>
            <div class="modal-body">
              <div class="modal-block">
                <h3>What to expect</h3>
                <p>${s.description}</p>
              </div>
              <div class="modal-split">
                <div class="before">
                  <h4>Before treatment</h4>
                  <ul>${s.before.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
                <div class="after">
                  <h4>After treatment</h4>
                  <ul>${s.after.map(i => `<li>${i}</li>`).join('')}</ul>
                </div>
              </div>
              <div class="modal-block">
                <h3>Our process</h3>
                <ol class="modal-steps">
                  ${s.process.map(p => `<li><strong>${p.title}</strong><p>${p.description}</p></li>`).join('')}
                </ol>
              </div>
              <div class="modal-cta">
                <h3>Ready to get started?</h3>
                <p>Take the first step toward healing and growth. Contact us today.</p>
                <a href="#contact" class="btn btn-cream" data-close-scroll>Schedule a consultation</a>
              </div>
            </div>
          </div>
        </div>
      `);
    });

    this.container.querySelectorAll('.modal').forEach(m => Modals.bind(m));
  }

  bindTriggers() {
    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        Modals.open(document.getElementById(`modal-${btn.getAttribute('data-modal')}`));
      });
    });
  }
}


/* ============================================================
   09  TRAINING SEASON — workshop cards + registration
   ------------------------------------------------------------
   Single source of truth: edit a workshop here and it updates
   the workshop cards AND the registration dropdown.
   ============================================================ */

const TRAINING_SEASON = [
  {
    id: 'history',
    month: 'Sep', day: '25', year: '2026',
    dateLabel: 'September 25, 2026',
    title: 'History of Play Therapy',
    presenter: 'Kristie Doheny, PsyD, LMHC, LMSW, RPT-S',
    level: 'Introductory / Basic',
    fee: '$175', feeNote: 'per participant',
    ces: '6 CEs · APT, MHC & SW',
    description: 'An interactive workshop to learn the history of play therapy and experience play therapy techniques related to each of the theoretical orientations discussed.'
  },
  {
    id: 'diagnosis-assessment',
    month: 'Oct', day: '22', year: '2026',
    dateLabel: 'October 22, 2026',
    title: 'Play Therapy Diagnosis & Assessment',
    presenter: 'Kristie Doheny, PsyD, LMHC, LMSW, RPT-S',
    level: 'Basic / Intermediate',
    fee: '$175', feeNote: 'per participant',
    ces: '6 CEs · APT, MHC & SW',
    description: 'An interactive workshop to learn how to use play therapy tools to both diagnose and assess a child\u2019s mental health symptoms. Interventions will be discussed to further gather information related to the underlying causes of their current symptomology.'
  },
  {
    id: 'developmental',
    month: 'Nov', day: '19', year: '2026',
    dateLabel: 'November 19, 2026',
    title: 'Developmental Play Therapy',
    presenter: 'Kristie Doheny, PsyD, LMHC, LMSW, RPT-S',
    level: 'Basic / Intermediate',
    fee: '$175', feeNote: 'per participant',
    ces: '6 CEs · APT, MHC & SW',
    description: 'Recognize the early stages of development through physical, cognitive and socio-emotional perspectives. Bibliotherapy, games, activities and creative applications will be explored as resources for play therapy with preschoolers.'
  },
  {
    id: 'game-play',
    month: 'Dec', day: '17', year: '2026',
    dateLabel: 'December 17, 2026',
    title: 'Game Play Therapy',
    presenter: 'Kristie Doheny, PsyD, LMHC, LMSW, RPT-S',
    level: 'Basic / Intermediate',
    fee: '$175', feeNote: 'per participant',
    ces: '6 CEs · APT, MHC & SW',
    description: 'This course explores the history of game play therapy. Participants will discuss the most appropriate games or activities to use for game play therapy with an individual, based on age or stage of development.'
  },
  {
    id: 'attachment-lender',
    month: 'Jan', day: '25–26', year: '2027',
    dateLabel: 'January 25–26, 2027',
    title: 'Building Healthy Relationships for Children Through Attachment-Based Play Therapy',
    presenter: 'Dafna Lender — guest presenter',
    level: 'Intermediate',
    fee: '$220', feeNote: 'per day, CEUs included',
    ces: '12 CEs · 6 per day · APT, SW & MHC',
    description: 'Children who have lived in unsafe environments, with inconsistent or impaired caregivers, or who have endured multiple losses may not be able to overcome these traumatic experiences without intervention. Based on the Theraplay model, attachment-based play activities focus on the parent-child relationship as a vehicle to heal problems of trust, hyperarousal and connection in both children and parents.',
    feature: true,
    guest: true
  }
];

class TrainingSeason {
  constructor() {
    this.track = document.getElementById('seasonTrack');
    this.select = document.getElementById('tr-cert');
    if (!this.track) return;
    this.renderCards();
    this.renderOptions();
    this.bindRegisterButtons();
  }

  renderCards() {
    this.track.innerHTML = TRAINING_SEASON.map(w => `
      <article class="w-card${w.feature ? ' is-feature' : ''}">
        <div class="w-date">
          <span class="w-month">${w.month}</span>
          <span class="w-day">${w.day}</span>
          <span class="w-year">${w.year}</span>
        </div>
        <div class="w-meta">
          <span class="w-tag tag-level">${w.level}</span>
          ${w.guest ? '<span class="w-tag tag-guest">Guest presenter</span>' : '<span class="w-tag">8:30am–4pm</span>'}
        </div>
        <h4>${w.title}</h4>
        <p>${w.description}</p>
        <span class="w-presenter">${w.presenter}</span>
        <div class="w-foot">
          <span class="w-price">${w.fee}<small>${w.feeNote} · ${w.ces}</small></span>
          <button type="button" class="btn btn-solid btn-sm" data-workshop="${w.id}">Register</button>
        </div>
      </article>
    `).join('');
  }

  renderOptions() {
    if (!this.select) return;
    const options = TRAINING_SEASON
      .map(w => `<option value="${w.title} — ${w.dateLabel}">${w.title} — ${w.dateLabel}</option>`)
      .join('');
    this.select.insertAdjacentHTML('beforeend', options +
      '<option value="Full RPT certification track (all workshops)">Full RPT certification track (all workshops)</option>' +
      '<option value="Supervision toward RPT">Supervision toward RPT</option>' +
      '<option value="Not sure yet — please advise">Not sure yet — please advise</option>');
  }

  bindRegisterButtons() {
    document.querySelectorAll('[data-workshop]').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = TRAINING_SEASON.find(x => x.id === btn.getAttribute('data-workshop'));
        if (w && this.select) this.select.value = `${w.title} — ${w.dateLabel}`;
        this.goToForm();
      });
    });
    document.querySelectorAll('[data-register]').forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); this.goToForm(); });
    });
  }

  goToForm() {
    const form = document.getElementById('register');
    if (!form) return;
    const header = document.getElementById('siteHeader');
    const offset = header ? header.offsetHeight + 16 : 100;
    window.scrollTo({ top: form.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    setTimeout(() => {
      const name = document.getElementById('tr-name');
      if (name) name.focus({ preventScroll: true });
    }, 650);
  }
}


/* ============================================================
   10  NEUROFEEDBACK MODAL
   ============================================================ */

class NeurofeedbackModal {
  constructor() {
    this.modal = document.getElementById('nfModal');
    this.trigger = document.getElementById('nfOpen');
    if (!this.modal) return;
    Modals.bind(this.modal);
    if (this.trigger) this.trigger.addEventListener('click', () => Modals.open(this.modal));
  }
}


/* ============================================================
   11  TEAM MODALS
   ============================================================ */

const TEAM_DATA = {
  'kristie-doheny': {
    name: 'Dr. Kristie Doheny', credentials: 'PsyD, Owner & Lead Psychologist', photo: 'krisite.jpeg',
    bio: [
      'While we can\u2019t change difficult situations of the past, we can work together to better understand and resolve challenges in your life.',
      'If you\u2019re looking for extra support and guidance through a challenging situation or you\u2019re just ready to move in a new direction in your life, I look forward to working with you to achieve your goals.',
      'With over 15 years of experience working with children, adolescents, adults, and families, I specialize in person centered therapy which enables me to create individualized treatment for each client I meet.',
      'At our practice we use humanistic therapy techniques. I use a variety of techniques such as play therapy, sandplay therapy, expressive therapy, cognitive-behavioral therapy, neurofeedback, biofeedback, and person centered therapy.'
    ],
    highlights: ['Over 15 years of experience','Specializes in person-centered therapy','Offers evaluations for ADHD, learning disabilities, autism (ADOS-2)','Uses play therapy, sandplay, expressive therapy, CBT, neurofeedback','Leads our play therapy training and RPT supervision program']
  },
  'jane-albertson': {
    name: 'Dr. Jane Albertson-Kelly', credentials: 'PhD, Clinical Psychologist', photo: 'jane.jpg',
    bio: [
      'Dr. Albertson-Kelly has worked with individuals and families in crisis for over 15 years. She has a doctorate in clinical psychology and a Master\u2019s Degree in Education.',
      'She has been affiliated with the Adolescent Psychiatric Unit at Mather Hospital, the North Suffolk Center Child Treatment Program, and the Northport VA.',
      'She is recognized as an expert witness in the areas of parenting, custody and sexual abuse.'
    ],
    highlights: ['Over 15 years with individuals and families in crisis','Doctorate in Clinical Psychology + Master\u2019s in Education','Expert witness in parenting, custody, and sexual abuse','Specializes in families adjusting to separation and divorce']
  },
  'barbara-burkhard': {
    name: 'Dr. Barbara Burkhard', credentials: 'PhD, Clinical Psychologist', photo: 'barb.jpeg',
    bio: [
      'Dr. Burkhard has provided psychological services to young children and their families for over 35 years. She holds a doctorate from Stony Brook University.',
      'She has served as program director for several Suffolk County programs including the Child Treatment Program of North Suffolk Mental Health Center.',
      'She has received awards from both Suffolk County and the State University. She provides expert testimony in child abuse and custody proceedings.'
    ],
    highlights: ['Over 35 years with children and families','Doctorate from Stony Brook University','Specialized in child abuse assessment','Award recipient from Suffolk County and State University']
  },
  'jessica-panagiotidis': {
    name: 'Jessica Panagiotidis', credentials: 'MS, CRC, LMSW', photo: 'Jennifer.jpg',
    bio: [
      'I am a licensed psychotherapist and certified vocational counselor specializing in career planning, goal development, and individual counseling.',
      'Jessica graduated from Hofstra University with a Master\u2019s in vocational rehabilitation counseling and from Adelphi University with a Master\u2019s in Social Work.'
    ],
    highlights: ['Licensed psychotherapist and certified vocational counselor','Master\u2019s from Hofstra and Adelphi Universities','Specializes in career planning and goal development','Individual, group, and family counseling services']
  },
  'jennifer-cuevas': {
    name: 'Jennifer Cuevas', credentials: 'LCSW, Licensed Clinical Social Worker', photo: 'cuevas.jpeg',
    bio: [
      'Licensed clinical social worker with 25 years experience working with children, adolescents and families. Specializes in developmental disabilities, autism, chronic illness, and trauma.',
      'Disaster Mental Health Worker for the Red Cross with regular media appearances on News 12, NEWSMAX, CBS & WFAN.'
    ],
    highlights: ['25 years experience with children and families','Specializes in developmental disabilities, autism, and trauma','Red Cross Disaster Mental Health Worker','Expert in special education advocacy']
  },
  'mercedes-infantes': {
    name: 'Mercedes Infantes', credentials: 'Bilingual Mental Health Professional', photo: 'mercedes.jpeg',
    bio: [
      'Bilingual mental health professional fluent in Spanish, dedicated to providing culturally responsive and individualized care. I believe each session should be tailored to each client\u2019s unique needs, goals, life experiences, and cultural background.',
      'I strive to create a supportive and collaborative environment where clients feel heard, respected, and empowered.'
    ],
    highlights: ['Bilingual — fluent in Spanish','Culturally responsive, individualized care','Tailors each session to the client\u2019s unique needs','Supportive, collaborative environment']
  },
  'carla': {
    name: 'Carla Mondelli', credentials: 'Marriage and Family Therapist (MFT), Limited Permit', photo: 'carlamondelli.jpeg',
    bio: [
      'I am a Marriage and Family Therapist (MFT) practicing under a limited permit. I hold a Bachelor\u2019s degree in Psychology and a Master\u2019s degree in Marriage and Family Therapy. My work is grounded in a systemic approach, focusing on how individuals are shaped by their relationships and family dynamics.',
      'I work with individuals, couples, and families to support healthier relationships and emotional well-being. My areas of focus include marital conflict, communication issues, co-parenting challenges, separation and divorce adjustment, and life stressors that impact relationships.',
      'My approach is collaborative and supportive, with an emphasis on helping clients build insight, improve communication, and develop practical tools for change. I strive to provide a safe, nonjudgmental space where clients feel heard and understood.',
      'Whether you are navigating relationship difficulties, parenting transitions, or personal challenges, I aim to support you in creating healthier and more fulfilling connections.'
    ],
    highlights: ['Systemic approach to relationships and family dynamics','Works with individuals, couples, and families','Focus on marital conflict, communication, and co-parenting','Supports separation and divorce adjustment','Collaborative, safe, and nonjudgmental space']
  }
};

class TeamModals {
  constructor() {
    this.container = document.querySelector('.team-modals-container');
    if (!this.container) return;
    this.build();
    this.bindTriggers();
  }

  build() {
    Object.keys(TEAM_DATA).forEach(id => {
      const m = TEAM_DATA[id];
      this.container.insertAdjacentHTML('beforeend', `
        <div class="modal" id="team-modal-${id}" hidden>
          <div class="modal-scrim" data-close></div>
          <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="team-title-${id}">
            <button class="modal-close" data-close aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <header class="modal-head">
              <div class="modal-profile">
                <img src="${m.photo}" alt="${m.name}">
                <div>
                  <h2 id="team-title-${id}">${m.name}</h2>
                  <p class="modal-creds">${m.credentials}</p>
                  <a href="mailto:childfamily12@gmail.com" class="modal-mail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px"><rect x="3" y="5" width="18" height="14" rx="2" stroke-width="2"/><path d="M3.5 7l8.5 6 8.5-6" stroke-width="2"/></svg>
                    childfamily12@gmail.com
                  </a>
                </div>
              </div>
            </header>
            <div class="modal-body">
              <div class="modal-block">
                <h3>Professional background</h3>
                ${m.bio.map(p => `<p>${p}</p>`).join('')}
              </div>
              <div class="modal-highlights">
                <h4>Experience &amp; expertise</h4>
                <ul>${m.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
        </div>
      `);
    });

    this.container.querySelectorAll('.modal').forEach(m => Modals.bind(m));
  }

  bindTriggers() {
    document.querySelectorAll('[data-team]').forEach(btn => {
      btn.addEventListener('click', () => {
        Modals.open(document.getElementById(`team-modal-${btn.getAttribute('data-team')}`));
      });
    });
  }
}


/* ============================================================
   12  FAQ — accordion groups + category tabs
   ============================================================ */

class FAQ {
  constructor() {
    this.section = document.getElementById('faq');
    if (!this.section) return;
    this.groups();
    this.tabs();
  }

  groups() {
    this.section.querySelectorAll('.faq-featured, .faq-panel').forEach(group => {
      const items = group.querySelectorAll('.faq-item');
      items.forEach(item => {
        item.addEventListener('toggle', () => {
          if (!item.open) return;
          items.forEach(other => { if (other !== item) other.open = false; });
        });
      });
    });
  }

  tabs() {
    const tabs = this.section.querySelectorAll('.faq-tab');
    const panels = this.section.querySelectorAll('.faq-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        tabs.forEach(t => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', String(on));
        });
        panels.forEach(p => {
          p.classList.toggle('is-active', p.getAttribute('data-category') === category);
          p.querySelectorAll('.faq-item').forEach(i => { i.open = false; });
        });
      });
    });
  }
}


/* ============================================================
   13  INSURANCE MARQUEE — duplicate the row for a seamless loop
   ============================================================ */

class InsuranceMarquee {
  constructor() {
    const track = document.getElementById('insTrack');
    if (!track) return;
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    track.setAttribute('aria-hidden', 'false');
  }
}


/* ============================================================
   14  FORMS — Formspree with inline validation
   ============================================================ */

class FormspreeForm {
  constructor(formId, endpoint, successMessage) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    this.endpoint = endpoint || this.form.getAttribute('action');
    this.status = this.form.querySelector('[data-status]');
    this.success = successMessage;
    this.form.setAttribute('action', this.endpoint);

    if (this.endpoint.includes('YOUR_')) {
      console.warn(`[${formId}] Formspree endpoint not set yet — update CONFIG in script.js and the form action in index.html.`);
    }

    this.form.addEventListener('submit', e => this.submit(e));
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => this.clearError(field));
      field.addEventListener('blur', () => { if (field.value.trim()) this.clearError(field); });
    });
  }

  clearError(field) {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.remove('has-error');
    const msg = wrap.querySelector('.field-error');
    if (msg) msg.remove();
  }

  setError(field, message) {
    const wrap = field.closest('.field');
    if (!wrap || wrap.querySelector('.field-error')) return;
    wrap.classList.add('has-error');
    const span = document.createElement('span');
    span.className = 'field-error';
    span.textContent = message;
    wrap.appendChild(span);
  }

  validate() {
    let firstBad = null;
    this.form.querySelectorAll('[required]').forEach(field => {
      const value = field.value.trim();
      let message = '';
      if (!value) {
        message = 'This field is required.';
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = 'Enter a valid email address.';
      } else if (field.type === 'tel' && value.replace(/\D/g, '').length < 10) {
        message = 'Enter a phone number with at least 10 digits.';
      }
      if (message) {
        this.setError(field, message);
        if (!firstBad) firstBad = field;
      }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  say(message, ok) {
    if (!this.status) return;
    this.status.textContent = message;
    this.status.classList.add('is-visible');
    this.status.classList.toggle('is-ok', ok);
    this.status.classList.toggle('is-bad', !ok);
  }

  async submit(e) {
    e.preventDefault();
    if (!this.validate()) {
      this.say('Please fix the highlighted fields and try again.', false);
      return;
    }

    const button = this.form.querySelector('button[type="submit"]');
    const label = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    this.say('Sending…', true);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: new FormData(this.form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        this.form.reset();
        this.say(this.success, true);
      } else {
        const data = await response.json().catch(() => ({}));
        const detail = data.errors ? data.errors.map(x => x.message).join(', ') : '';
        this.say(detail || 'That didn\u2019t go through. Please call (631) 265-9850 and we\u2019ll take your details by phone.', false);
      }
    } catch (err) {
      this.say('No connection right now. Please call (631) 265-9850 or email childfamily12@gmail.com.', false);
    } finally {
      if (button) { button.disabled = false; button.textContent = label; }
    }
  }
}


/* ============================================================
   15  FAB + BACK TO TOP
   ============================================================ */

class FloatingActions {
  constructor() {
    this.fab = document.getElementById('fab');
    this.main = document.getElementById('fabMain');
    this.top = document.getElementById('toTop');
    this.open = false;

    if (this.main) {
      this.main.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
      document.addEventListener('click', e => {
        if (this.open && !this.fab.contains(e.target)) this.shut();
      });
      this.fab.querySelectorAll('.fab-item').forEach(item => {
        item.addEventListener('click', () => setTimeout(() => this.shut(), 250));
      });
    }

    if (this.top) this.top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  onScroll() {
    const show = window.pageYOffset > 500;
    if (this.fab) this.fab.classList.toggle('is-visible', show);
    if (this.top) this.top.classList.toggle('is-visible', show);
    if (!show) this.shut();
  }

  toggle() { this.open ? this.shut() : this.show(); }

  show() {
    this.open = true;
    this.fab.classList.add('is-open');
    this.main.setAttribute('aria-expanded', 'true');
  }

  shut() {
    if (!this.open) return;
    this.open = false;
    this.fab.classList.remove('is-open');
    this.main.setAttribute('aria-expanded', 'false');
  }
}


/* ============================================================
   16  APP BOOTSTRAP
   ============================================================ */

class App {
  constructor() {
    Modals.init();

    new Preloader();
    new Header();
    new Reveal();

    new Typewriter('#typed-text', [
      'compassionate therapy for children',
      'family counseling services',
      'support for adolescents',
      'expert psychological care',
      'evidence-based treatment',
      'play therapy training & CEs',
      'a safe space to heal'
    ]);

    // TrainingSeason injects the workshop cards, so it must run
    // before the carousels measure their pages.
    new TrainingSeason();
    document.querySelectorAll('[data-carousel]').forEach(el => new Carousel(el));

    new ServiceModals();
    new NeurofeedbackModal();
    new TeamModals();
    new FAQ();
    new InsuranceMarquee();
    new FloatingActions();

    // The contact form is an Elfsight embed (submissions are configured in
    // the Elfsight dashboard). Only the training registration uses Formspree.
    new FormspreeForm(
      'trainingForm',
      CONFIG.trainingEndpoint,
      'Registration received. We\u2019ll confirm your seat and payment details by email within one business day.'
    );

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
