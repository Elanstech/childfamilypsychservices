/* ===================================
   CHILD & FAMILY PSYCHOLOGICAL SERVICES
   Complete JavaScript - Organized by Page Flow

   TABLE OF CONTENTS:
   1.  Preloader
   2.  TypedAnimation (Hero)
   3.  ProgressTrackerNavigation (Header)
   4.  ScrollEffects (Hero parallax + progress bar)
   5.  ParticleAnimation (Hero)
   6.  LogoAnimation (Hero)
   7.  CardObserver (About + global cards)
   8.  ServicesCarousel + Modals
   9.  NeurofeedbackSection
   10. TeamCarousel + Modals
   11. FAQAccordion
   12. InsuranceScroll
   13. PlayTherapySection + Modal
   14. FormHandler (Contact)
   15. FABContactMenu
   16. ScrollToTop
   17. PerformanceMonitor
   18. App (Main Controller)
   =================================== */


/* ===================================
   1. PRELOADER
   =================================== */

class Preloader {
    constructor(duration = 2500) {
        this.element = document.getElementById('preloader');
        this.duration = duration;
        this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';
        window.addEventListener('load', () => this.hide());
    }

    hide() {
        setTimeout(() => {
            this.element.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.initializeAOS();
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.remove();
                }
            }, 600);
        }, this.duration);
    }

    initializeAOS() {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}


/* ===================================
   2. TYPED ANIMATION (Hero)
   =================================== */

class TypedAnimation {
    constructor(selector, options = {}) {
        this.selector = selector;
        this.defaultOptions = {
            strings: [
                'compassionate therapy for children',
                'family counseling services',
                'support for adolescents',
                'expert psychological care',
                'evidence-based treatment',
                'a safe space to heal'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            autoInsertCss: true
        };
        this.options = { ...this.defaultOptions, ...options };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.typed = new Typed(this.selector, this.options);
        });
    }

    destroy() {
        if (this.typed) this.typed.destroy();
    }
}


/* ===================================
   3. PROGRESS TRACKER NAVIGATION (Header)
   =================================== */

class ProgressTrackerNavigation {
    constructor() {
        this.header = document.getElementById('header');
        this.desktopDots = document.querySelectorAll('.desktop-tracker .progress-dot');
        this.mobileDots = document.querySelectorAll('.mobile-tracker .mobile-dot');
        this.progressLine = document.querySelector('.progress-line');
        this.currentSectionLabel = document.querySelector('.current-section-label');
        this.sections = document.querySelectorAll('section[id]');
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.lastScrollTop = 0;
        this.sectionNames = {
            'home': 'Home', 'about': 'About', 'services': 'Services',
            'team': 'Team', 'faq': 'FAQ', 'insurance': 'Insurance',
            'locations': 'Locations', 'contact': 'Contact'
        };
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupActiveTracking();
        this.setupSmoothScrolling();
        this.setupAccessibility();
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
            this.updateProgressBar();
            this.lastScrollTop = scrollTop;
        });
    }

    updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (this.progressBar) this.progressBar.style.width = `${scrolled}%`;
    }

    setupActiveTracking() {
        window.addEventListener('scroll', () => this.updateActiveSection());
        this.updateActiveSection();
    }

    updateActiveSection() {
        const scrollY = window.pageYOffset;
        let currentSection = null;
        let currentIndex = 0;

        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
                currentIndex = index;
            }
        });

        this.desktopDots.forEach((dot, index) => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.remove('active', 'completed');
            if (dotSection === currentSection) dot.classList.add('active');
            else if (index < currentIndex) dot.classList.add('completed');
        });

        this.mobileDots.forEach((dot, index) => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.remove('active', 'completed');
            if (dotSection === currentSection) dot.classList.add('active');
            else if (index < currentIndex) dot.classList.add('completed');
        });

        if (this.currentSectionLabel && currentSection) {
            this.currentSectionLabel.textContent = this.sectionNames[currentSection] || currentSection;
        }

        this.updateProgressLine(currentIndex);
    }

    updateProgressLine(currentIndex) {
        if (!this.progressLine) return;
        const totalDots = this.desktopDots.length;
        const pct = totalDots > 1 ? (currentIndex / (totalDots - 1)) * 100 : 0;
        const oldStyle = document.getElementById('progress-line-style');
        if (oldStyle) oldStyle.remove();
        const style = document.createElement('style');
        style.id = 'progress-line-style';
        style.textContent = `.progress-line::after { width: ${pct}% !important; }`;
        document.head.appendChild(style);
    }

    setupSmoothScrolling() {
        [...this.desktopDots, ...this.mobileDots].forEach(dot => {
            dot.addEventListener('click', (e) => this.handleDotClick(e, dot));
        });
    }

    handleDotClick(e, dot) {
        e.preventDefault();
        const targetId = dot.getAttribute('href') || `#${dot.getAttribute('data-section')}`;
        const target = document.querySelector(targetId);
        if (target) {
            const headerH = this.header?.offsetHeight || 80;
            window.scrollTo({ top: target.offsetTop - headerH, behavior: 'smooth' });
        }
    }

    setupAccessibility() {
        [...this.desktopDots, ...this.mobileDots].forEach(dot => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dot.click(); }
            });
        });
    }
}


/* ===================================
   4. SCROLL EFFECTS (Hero parallax)
   =================================== */

class ScrollEffects {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.heroBackground = document.querySelector('.hero-background');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.updateParallax();
        });
    }

    updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (this.progressBar) this.progressBar.style.width = `${scrolled}%`;
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        if (this.heroBackground && window.innerWidth > 768) {
            this.heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
}


/* ===================================
   5. PARTICLE ANIMATION (Hero)
   =================================== */

class ParticleAnimation {
    constructor(selector = '.particle') {
        this.particles = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.particles.forEach((particle) => {
            const duration = 10 + Math.random() * 10;
            particle.style.animationDuration = `${duration}s`;
            this.animateParticle(particle, duration);
        });
    }

    animateParticle(particle, duration) {
        setInterval(() => {
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
        }, duration * 1000);
    }
}


/* ===================================
   6. LOGO ANIMATION (Hero)
   =================================== */

class LogoAnimation {
    constructor(selector = '.hero-logo img') {
        this.logo = document.querySelector(selector);
        this.init();
    }

    init() {
        if (!this.logo) return;
        this.logo.addEventListener('mouseenter', () => this.animate());
    }

    animate() {
        this.logo.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        this.logo.style.transform = 'scale(1.05)';
        this.logo.style.filter = 'drop-shadow(0 15px 40px rgba(79, 195, 247, 0.5))';
        setTimeout(() => {
            this.logo.style.transform = 'scale(1)';
            this.logo.style.filter = 'drop-shadow(0 4px 20px rgba(79, 195, 247, 0.25))';
        }, 300);
    }
}


/* ===================================
   7. CARD OBSERVER (About + global)
   =================================== */

class CardObserver {
    constructor(selector = '.about-card, .service-card, .info-card, .service-card-overlay') {
        this.cards = document.querySelectorAll(selector);
        this.options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.options
        );
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(card);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}


/* ===================================
   8. SERVICES CAROUSEL + MODALS
   =================================== */

class ServicesCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = Array.from(document.querySelectorAll('.carousel-card'));
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.serviceData = this.getServiceData();
        this.init();
    }

    init() {
        if (!this.track || this.cards.length === 0) return;
        this.calculateCardWidth();
        this.createDots();
        this.setupEventListeners();
        this.updateCarousel();
        this.generateModals();
        window.addEventListener('resize', () => this.handleResize());
    }

    getCardsPerView() {
        const w = window.innerWidth;
        if (w < 768) return 1;
        if (w < 1200) return 2;
        return 3;
    }

    calculateCardWidth() {
        if (this.cards.length > 0) {
            const style = window.getComputedStyle(this.cards[0]);
            const margin = parseFloat(style.marginRight) || 30;
            this.cardWidth = this.cards[0].offsetWidth + margin;
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(document.querySelectorAll('.carousel-dot'));
    }

    setupEventListeners() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => { this.touchStartX = e.touches[0].clientX; }, { passive: true });
            this.track.addEventListener('touchmove', (e) => { this.touchEndX = e.touches[0].clientX; }, { passive: true });
            this.track.addEventListener('touchend', () => this.handleTouchEnd());
        }
        document.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(btn.getAttribute('data-modal'));
            });
        });
    }

    handleTouchEnd() {
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); }
    }

    prev() { if (this.currentIndex > 0) { this.currentIndex--; this.updateCarousel(); } }
    next() { if (this.currentIndex < this.totalPages - 1) { this.currentIndex++; this.updateCarousel(); } }
    goToPage(i) { this.currentIndex = i; this.updateCarousel(); }

    updateCarousel() {
        const offset = -this.currentIndex * this.cardWidth * this.cardsPerView;
        if (this.track) this.track.style.transform = `translateX(${offset}px)`;
        if (this.dots) this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
    }

    handleResize() {
        const newCPV = this.getCardsPerView();
        if (newCPV !== this.cardsPerView) {
            this.cardsPerView = newCPV;
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
            this.createDots();
        }
        this.calculateCardWidth();
        this.updateCarousel();
    }

    getServiceData() {
        return {
            'child-therapy': {
                title: 'Child Therapy', subtitle: 'Nurturing emotional growth and resilience in children',
                description: 'Our child therapy sessions provide a safe, supportive environment where children can express themselves freely through play, art, and conversation. We use evidence-based approaches including play therapy, sandplay therapy, and expressive therapy tailored to each child\'s unique needs.',
                before: ['Difficulty expressing emotions','Behavioral challenges at home or school','Anxiety or worry','Social difficulties with peers','Processing traumatic experiences'],
                after: ['Improved emotional regulation','Better coping strategies','Increased confidence','Stronger social skills','Healthier emotional expression'],
                process: [{ title:'Initial Assessment', description:'Comprehensive evaluation to understand your child\'s needs and develop a personalized treatment plan.' },{ title:'Therapeutic Play Sessions', description:'Weekly sessions using age-appropriate techniques like play therapy, art, and sandplay.' },{ title:'Parent Collaboration', description:'Regular updates and guidance to help you support your child\'s progress at home.' },{ title:'Progress Monitoring', description:'Ongoing assessment to track growth and adjust interventions as needed.' }]
            },
            'adolescent-therapy': {
                title: 'Adolescent Therapy', subtitle: 'Supporting teens through life\'s challenges',
                description: 'Adolescence brings unique challenges including identity formation, peer pressure, academic stress, and emotional changes. Our adolescent therapy provides a confidential space for teens to explore their feelings, develop coping strategies, and build resilience.',
                before: ['Depression or mood swings','Anxiety or panic attacks','Identity and self-esteem issues','Relationship conflicts','Academic or social pressures'],
                after: ['Improved emotional stability','Stronger sense of identity','Better stress management','Healthier relationships','Increased academic focus'],
                process: [{ title:'Confidential Consultation', description:'Building trust through one-on-one sessions where teens feel heard and respected.' },{ title:'Goal Setting', description:'Collaboratively identifying challenges and creating achievable goals.' },{ title:'Skill Development', description:'Teaching practical coping strategies, communication skills, and emotional regulation.' },{ title:'Ongoing Support', description:'Regular sessions to navigate challenges and celebrate progress.' }]
            },
            'individual-therapy': {
                title: 'Individual Therapy', subtitle: 'Personalized support for your mental wellness journey',
                description: 'Individual therapy for adults provides a confidential space to address personal challenges, process emotions, and develop strategies for growth using person-centered, cognitive-behavioral, and humanistic approaches.',
                before: ['Feeling overwhelmed or stuck','Anxiety or depression symptoms','Unprocessed trauma or grief','Life transition challenges','Low self-esteem or confidence'],
                after: ['Greater self-awareness','Improved emotional well-being','Effective coping strategies','Clearer life direction','Enhanced relationships'],
                process: [{ title:'Initial Evaluation', description:'Comprehensive assessment to understand your unique needs and goals.' },{ title:'Treatment Planning', description:'Developing a personalized approach that honors your individual journey.' },{ title:'Therapeutic Work', description:'Regular sessions using evidence-based techniques tailored to your needs.' },{ title:'Growth & Integration', description:'Building skills and insights that support lasting positive change.' }]
            },
            'family-therapy': {
                title: 'Family Therapy', subtitle: 'Strengthening bonds and improving communication',
                description: 'Family therapy helps families improve communication, resolve conflicts, and strengthen relationships. Our sessions provide a supportive space for all family members to be heard and work collaboratively toward positive change.',
                before: ['Communication breakdowns','Frequent conflicts or tension','Difficulties with life transitions','Behavioral issues with children','Feeling disconnected as a family'],
                after: ['Improved family communication','Stronger emotional bonds','Effective conflict resolution','Better understanding of each other','Increased family cohesion'],
                process: [{ title:'Family Assessment', description:'Understanding family dynamics, strengths, and areas for growth.' },{ title:'Goal Identification', description:'Collaboratively defining what the family wants to achieve together.' },{ title:'Communication Skills', description:'Learning techniques for healthy expression and active listening.' },{ title:'Ongoing Sessions', description:'Regular meetings to practice new skills and address emerging challenges.' }]
            },
            'marital-therapy': {
                title: 'Marital Therapy', subtitle: 'Nurturing your partnership and connection',
                description: 'Couples therapy helps partners strengthen their relationship, improve communication, and navigate challenges together using evidence-based approaches like Emotionally Focused Therapy.',
                before: ['Communication difficulties','Frequent arguments or conflicts','Trust or intimacy issues','Feeling disconnected','Life transition challenges'],
                after: ['Improved communication patterns','Deeper emotional connection','Better conflict resolution skills','Renewed intimacy and trust','Stronger partnership foundation'],
                process: [{ title:'Couples Assessment', description:'Understanding relationship dynamics, attachment patterns, and goals.' },{ title:'Communication Enhancement', description:'Learning effective listening and expressing techniques.' },{ title:'Conflict Resolution', description:'Developing healthy ways to navigate disagreements and differences.' },{ title:'Strengthening Connection', description:'Rebuilding intimacy, trust, and emotional bonding.' }]
            },
            'divorce-support': {
                title: 'Divorce Support', subtitle: 'Navigating separation with compassion and guidance',
                description: 'Our divorce support services help individuals and families navigate this difficult time, process emotions, establish co-parenting strategies, and develop healthy coping mechanisms.',
                before: ['Emotional overwhelm and grief','Co-parenting conflicts','Children struggling with changes','Uncertainty about the future','Difficulty managing stress'],
                after: ['Emotional healing and acceptance','Effective co-parenting strategies','Children adapting positively','Clearer path forward','Improved coping skills'],
                process: [{ title:'Emotional Support', description:'Processing grief, anger, and other emotions in a safe environment.' },{ title:'Co-Parenting Planning', description:'Developing communication strategies and parenting plans.' },{ title:'Child Support', description:'Helping children understand and adjust to family changes.' },{ title:'Moving Forward', description:'Building resilience and creating a positive future for your family.' }]
            },
            'reunification-therapy': {
                title: 'Reunification Therapy', subtitle: 'Rebuilding parent-child relationships',
                description: 'Reunification therapy is a specialized intervention designed to repair and rebuild parent-child relationships disrupted by separation, divorce, or estrangement.',
                before: ['Parent-child estrangement','Resistance to contact','Negative perceptions','Communication breakdowns','Unresolved conflict'],
                after: ['Restored communication','Rebuilding trust','Positive interactions','Improved relationship quality','Emotional healing'],
                process: [{ title:'Assessment Phase', description:'Evaluating the relationship dynamics and barriers to reunification.' },{ title:'Preparation', description:'Individual sessions to prepare both parent and child for contact.' },{ title:'Gradual Reintroduction', description:'Structured, supervised sessions facilitating positive interactions.' },{ title:'Relationship Building', description:'Developing healthy communication patterns and rebuilding connection.' }]
            },
            'supervised-visitation': {
                title: 'Therapeutic Supervised Visitation', subtitle: 'Safe, supportive parent-child contact',
                description: 'Therapeutic supervised visitation provides a safe, neutral environment for parent-child contact when safety concerns exist or during family transitions.',
                before: ['Safety concerns during visits','Need for neutral environment','Court-ordered supervision','Anxiety about contact','Documentation requirements'],
                after: ['Safe visit environment','Positive parent-child interactions','Professional documentation','Increased comfort and trust','Progress toward unsupervised visits'],
                process: [{ title:'Intake & Planning', description:'Review of court orders and visit guidelines with all parties.' },{ title:'Supervised Sessions', description:'Professional monitoring of visits in our comfortable facility.' },{ title:'Interaction Support', description:'Guidance to promote positive, age-appropriate interactions.' },{ title:'Documentation & Reporting', description:'Detailed reports for court and attorneys as required.' }]
            },
            'parent-coordination': {
                title: 'Parent Coordination', subtitle: 'Reducing conflict and implementing custody agreements',
                description: 'Parent coordination is a court-ordered service designed to help high-conflict divorced or separated parents implement their custody agreement and reduce conflict.',
                before: ['High-conflict co-parenting','Frequent court involvement','Communication breakdowns','Child caught in the middle','Custody agreement violations'],
                after: ['Reduced parental conflict','Effective communication','Consistent custody implementation','Child protection from conflict','Less court involvement'],
                process: [{ title:'Court Appointment', description:'Review of court order and parenting plan with both parties.' },{ title:'Communication Management', description:'Facilitating parent communication and decision-making.' },{ title:'Dispute Resolution', description:'Mediating conflicts and making recommendations when needed.' },{ title:'Ongoing Coordination', description:'Monitoring compliance and supporting successful co-parenting.' }]
            },
            'custody-evaluations': {
                title: 'Custody Evaluations', subtitle: 'Comprehensive assessments for informed custody decisions',
                description: 'Child custody evaluations are comprehensive psychological assessments conducted to assist courts in making informed decisions about custody and parenting time arrangements.',
                before: ['Custody disputes','Need for professional assessment','Court requirement for evaluation','Concerns about child wellbeing','Parenting capability questions'],
                after: ['Comprehensive psychological evaluation','Professional recommendations','Detailed written report','Court testimony if needed','Informed custody decisions'],
                process: [{ title:'Case Review', description:'Reviewing court documents, records, and relevant history.' },{ title:'Comprehensive Assessment', description:'Interviews, observations, psychological testing, and collateral contacts.' },{ title:'Analysis & Report', description:'Detailed written report with findings and recommendations.' },{ title:'Court Involvement', description:'Testimony and consultation as needed to support decision-making.' }]
            },
            'mental-health-evaluations': {
                title: 'Mental Health Evaluations', subtitle: 'Professional psychological assessments',
                description: 'Comprehensive mental health evaluations provide diagnostic clarity and treatment recommendations for ADHD, autism spectrum disorder, learning disabilities, developmental delays, and other conditions.',
                before: ['Diagnostic uncertainty','Behavioral or academic concerns','Developmental questions','Need for treatment planning','School accommodation requirements'],
                after: ['Clear diagnostic understanding','Comprehensive evaluation report','Treatment recommendations','Educational planning support','Resource connections'],
                process: [{ title:'Clinical Interview', description:'Gathering developmental history and current concerns.' },{ title:'Testing Administration', description:'Comprehensive psychological and educational testing.' },{ title:'Analysis & Diagnosis', description:'Interpreting results and formulating diagnoses.' },{ title:'Feedback & Planning', description:'Reviewing findings and creating actionable recommendations.' }]
            }
        };
    }

    generateModals() {
        const container = document.querySelector('.service-modals-container');
        if (!container) return;

        const icons = {
            'child-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke-width="2"/></svg>',
            'adolescent-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke-width="2"/><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke-width="2" stroke-linecap="round"/></svg>',
            'individual-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="4" stroke-width="2"/><path d="M5.5 21C5.5 17.134 8.634 14 12.5 14C16.366 14 19.5 17.134 19.5 21" stroke-width="2"/></svg>',
            'family-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke-width="2"/></svg>',
            'marital-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke-width="2"/></svg>',
            'divorce-support': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke-width="2"/><path d="M12 8V12L15 15" stroke-width="2" stroke-linecap="round"/></svg>',
            'reunification-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21V19C17 17.94 16.58 16.92 15.83 16.17C15.08 15.42 14.06 15 13 15H5C3.94 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.94 1 19V21" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke-width="2"/></svg>',
            'supervised-visitation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke-width="2"/><path d="M9 12L11 14L15 10" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="2" stroke-width="2"/></svg>',
            'parent-coordination': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M2 12H22" stroke-width="2"/><path d="M12 2C14.5 4.74 15.92 8.29 16 12C15.92 15.71 14.5 19.26 12 22C9.5 19.26 8.08 15.71 8 12C8.08 8.29 9.5 4.74 12 2Z" stroke-width="2"/></svg>',
            'custody-evaluations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke-width="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke-width="2" stroke-linecap="round"/></svg>',
            'mental-health-evaluations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11a4 4 0 100-8 4 4 0 000 8z" stroke-width="2"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2M16 11h6M19 8v6" stroke-width="2" stroke-linecap="round"/></svg>'
        };

        const gradients = ['gradient-1','gradient-2','gradient-3','gradient-4','gradient-5','gradient-6'];

        Object.keys(this.serviceData).forEach((key, idx) => {
            const s = this.serviceData[key];
            const g = gradients[idx % gradients.length];
            const icon = icons[key] || icons['child-therapy'];

            container.insertAdjacentHTML('beforeend', `
                <div class="service-modal" id="modal-${key}">
                    <div class="modal-overlay"></div>
                    <div class="modal-content-wrapper">
                        <button class="modal-close" aria-label="Close modal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg></button>
                        <div class="modal-header">
                            <div class="modal-icon ${g}">${icon}</div>
                            <h2>${s.title}</h2>
                            <p class="modal-subtitle">${s.subtitle}</p>
                        </div>
                        <div class="modal-body">
                            <div class="modal-section"><h3>What to Expect</h3><p>${s.description}</p></div>
                            <div class="before-after-grid">
                                <div class="before-after-card before"><h4>Before Treatment</h4><ul>${s.before.map(i => `<li>${i}</li>`).join('')}</ul></div>
                                <div class="before-after-card after"><h4>After Treatment</h4><ul>${s.after.map(i => `<li>${i}</li>`).join('')}</ul></div>
                            </div>
                            <div class="modal-section"><h3>Our Process</h3>
                                <div class="process-steps">${s.process.map((step, i) => `<div class="process-step"><div class="step-number">${i+1}</div><div class="step-content"><h4>${step.title}</h4><p>${step.description}</p></div></div>`).join('')}</div>
                            </div>
                            <div class="modal-cta">
                                <h3>Ready to Get Started?</h3>
                                <p>Take the first step toward healing and growth. Contact us today.</p>
                                <a href="#contact" class="modal-cta-btn"><span>Schedule Consultation</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round"/></svg></a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

        this.setupModalListeners();
    }

    setupModalListeners() {
        document.querySelectorAll('.service-modal').forEach(modal => {
            const overlay = modal.querySelector('.modal-overlay');
            const closeBtn = modal.querySelector('.modal-close');
            const ctaBtn = modal.querySelector('.modal-cta-btn');
            if (overlay) overlay.addEventListener('click', () => this.closeModal(modal));
            if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal(modal));
            if (ctaBtn) {
                ctaBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal(modal);
                    setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
                });
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) this.closeModal(modal);
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}


/* ===================================
   9. NEUROFEEDBACK SECTION
   =================================== */

class NeurofeedbackSection {
    constructor() {
        this.section = document.querySelector('.neurofeedback-section');
        this.modal = document.getElementById('nf-detail-modal');
        this.openBtn = document.getElementById('nf-open-modal');
        if (!this.section) return;
        this.init();
    }

    init() {
        this.setupModal();
        this.setupBrainAnimation();
        this.setupChipHover();
    }

    /* ========================================
       MODAL OPEN / CLOSE
       ======================================== */

    setupModal() {
        if (!this.modal) return;

        const overlay = this.modal.querySelector('.modal-overlay');
        const closeBtn = this.modal.querySelector('.modal-close');
        const ctaBtn = this.modal.querySelector('#nf-modal-cta');

        // Open
        if (this.openBtn) {
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Close via overlay
        if (overlay) overlay.addEventListener('click', () => this.closeModal());

        // Close via X
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

        // Close via CTA (scroll to contact)
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
                setTimeout(() => {
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            });
        }

        // Close via Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    /* ========================================
       BRAIN GRAPHIC PARALLAX
       ======================================== */

    setupBrainAnimation() {
        const graphic = this.section.querySelector('.nf-brain-graphic');
        if (!graphic) return;

        graphic.addEventListener('mousemove', (e) => {
            const rect = graphic.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

            graphic.querySelectorAll('.nf-brain-ring').forEach((ring, i) => {
                const intensity = (i + 1) * 5;
                ring.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
                ring.style.transition = 'transform 0.3s ease';
            });
        });

        graphic.addEventListener('mouseleave', () => {
            graphic.querySelectorAll('.nf-brain-ring').forEach(ring => {
                ring.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ========================================
       CONDITION CHIP HOVER
       ======================================== */

    setupChipHover() {
        this.section.querySelectorAll('.nf-chip').forEach(chip => {
            chip.addEventListener('mouseenter', () => {
                const svg = chip.querySelector('svg');
                if (svg) {
                    svg.style.transform = 'scale(1.2) rotate(10deg)';
                    svg.style.transition = 'transform 0.3s ease';
                }
            });
            chip.addEventListener('mouseleave', () => {
                const svg = chip.querySelector('svg');
                if (svg) svg.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
}

/* ===================================
   10. TEAM CAROUSEL + MODALS
   =================================== */

class TeamCarousel {
    constructor() {
        this.track = document.querySelector('.team-carousel-track');
        this.cards = Array.from(document.querySelectorAll('.team-carousel-card'));
        this.prevBtn = document.querySelector('.team-carousel-prev');
        this.nextBtn = document.querySelector('.team-carousel-next');
        this.dotsContainer = document.querySelector('.team-carousel-dots');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.teamData = this.getTeamData();
        this.init();
    }

    init() {
        if (!this.track || this.cards.length === 0) return;
        this.calculateCardWidth();
        this.createDots();
        this.setupEventListeners();
        this.updateCarousel();
        this.generateModals();
        window.addEventListener('resize', () => this.handleResize());
    }

    getCardsPerView() { const w = window.innerWidth; if (w < 768) return 1; if (w < 1200) return 2; return 3; }

    calculateCardWidth() {
        if (this.cards.length > 0) {
            const margin = parseFloat(window.getComputedStyle(this.cards[0]).marginRight) || 30;
            this.cardWidth = this.cards[0].offsetWidth + margin;
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('team-carousel-dot');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(document.querySelectorAll('.team-carousel-dot'));
    }

    setupEventListeners() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => { this.touchStartX = e.touches[0].clientX; }, { passive: true });
            this.track.addEventListener('touchmove', (e) => { this.touchEndX = e.touches[0].clientX; }, { passive: true });
            this.track.addEventListener('touchend', () => { const diff = this.touchStartX - this.touchEndX; if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); } });
        }
        document.querySelectorAll('.team-learn-more').forEach(btn => {
            btn.addEventListener('click', () => this.openModal(btn.getAttribute('data-team')));
        });
    }

    prev() { if (this.currentIndex > 0) { this.currentIndex--; this.updateCarousel(); } }
    next() { if (this.currentIndex < this.totalPages - 1) { this.currentIndex++; this.updateCarousel(); } }
    goToPage(i) { this.currentIndex = i; this.updateCarousel(); }

    updateCarousel() {
        const offset = -this.currentIndex * this.cardWidth * this.cardsPerView;
        if (this.track) this.track.style.transform = `translateX(${offset}px)`;
        if (this.dots) this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
    }

    handleResize() {
        const newCPV = this.getCardsPerView();
        if (newCPV !== this.cardsPerView) { this.cardsPerView = newCPV; this.totalPages = Math.ceil(this.cards.length / this.cardsPerView); this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1); this.createDots(); }
        this.calculateCardWidth();
        this.updateCarousel();
    }

    getTeamData() {
        return {
            'kristie-doheny': { name:'Dr. Kristie Doheny', credentials:'PsyD, Owner & Lead Psychologist', email:'childfamily12@gmail.com', photo:'krisite.jpeg',
                bio:['While we can\'t change difficult situations of the past, we can work together to better understand and resolve challenges in your life.','If you\'re looking for extra support and guidance through a challenging situation or you\'re just ready to move in a new direction in your life, I look forward to working with you to achieve your goals.','With over 15 years of experience working with children, adolescents, adults, and families, I specialize in person centered therapy which enables me to create individualized treatment for each client I meet.','At our practice we use humanistic therapy techniques. I use a variety of techniques such as play therapy, sandplay therapy, expressive therapy, cognitive-behavioral therapy, neurofeedback, biofeedback, and person centered therapy.'],
                highlights:['Over 15 years of experience','Specializes in person-centered therapy','Offers evaluations for ADHD, learning disabilities, autism (ADOS-2)','Uses play therapy, sandplay, expressive therapy, CBT, neurofeedback','Creates individualized treatment plans'] },
            'jane-albertson': { name:'Dr. Jane Albertson-Kelly', credentials:'PhD, Clinical Psychologist', email:'childfamily12@gmail.com', photo:'jane.jpg',
                bio:['Dr. Albertson-Kelly has worked with individuals and families in crisis for over 15 years. She has a doctorate in clinical psychology and a Master\'s Degree in Education.','She has been affiliated with the Adolescent Psychiatric Unit at Mather Hospital, the North Suffolk Center Child Treatment Program, and the Northport VA.','She is recognized as an expert witness in the areas of parenting, custody and sexual abuse.'],
                highlights:['Over 15 years with individuals and families in crisis','Doctorate in Clinical Psychology + Master\'s in Education','Expert witness in parenting, custody, and sexual abuse','Specializes in families adjusting to separation and divorce'] },
            'barbara-burkhard': { name:'Dr. Barbara Burkhard', credentials:'PhD, Clinical Psychologist', email:'childfamily12@gmail.com', photo:'barb.jpeg',
                bio:['Dr. Burkhard has provided psychological services to young children and their families for over 35 years. She holds a doctorate from Stony Brook University.','She has served as program director for several Suffolk County programs including the Child Treatment Program of North Suffolk Mental Health Center.','She has received awards from both Suffolk County and the State University. She provides expert testimony in child abuse and custody proceedings.'],
                highlights:['Over 35 years with children and families','Doctorate from Stony Brook University','Specialized in child abuse assessment','Award recipient from Suffolk County and State University'] },
            'jessica-panagiotidis': { name:'Jessica Panagiotidis', credentials:'MS, CRC, LMSW', email:'childfamily12@gmail.com', photo:'https://static.wixstatic.com/media/d54a3e_617ee6e94fba4bd59a82c71bb27eeb75~mv2.jpg/v1/fill/w_754,h_1004,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9b114896a84f4167c1e7a01587e84c1923addb24-1.jpg',
                bio:['I am a licensed psychotherapist and certified vocational counselor specializing in career planning, goal development, and individual counseling.','Jessica graduated from Hofstra University with a Master\'s in vocational rehabilitation counseling and from Adelphi University with a Master\'s in Social Work.'],
                highlights:['Licensed psychotherapist and certified vocational counselor','Master\'s from Hofstra and Adelphi Universities','Specializes in career planning and goal development','Individual, group, and family counseling services'] },
            'jennifer-cuevas': { name:'Jennifer Cuevas', credentials:'LCSW, Licensed Clinical Social Worker', email:'childfamily12@gmail.com', photo:'https://childfamilypsychservices.vercel.app/Jennifer.jpg',
                bio:['Licensed clinical social worker with 25 years experience working with children, adolescents and families. Specializes in developmental disabilities, autism, chronic illness, and trauma.','Disaster Mental Health Worker for the Red Cross with regular media appearances on News 12, NEWSMAX, CBS & WFAN.'],
                highlights:['25 years experience with children and families','Specializes in developmental disabilities, autism, and trauma','Red Cross Disaster Mental Health Worker','Expert in special education advocacy'] },
            'mercedes-infantes': { name:'Mercedes Infantes', credentials:'LMSW, Licensed Social Worker', email:'childfamily12@gmail.com', photo:'mercedes.jpeg',
                bio:['LGBTQ+ licensed social worker passionate about queer history and advocacy. My goal is providing affirming mental health care to all those under the LGBTQ+ umbrella.','I strive to create a collaborative and warm space to foster a therapeutic relationship based on trust, empathy, and validation.'],
                highlights:['LGBTQ+ affirming care specialist','Passionate about queer history and advocacy','Specializes in identity exploration and acceptance','Focus on trust, empathy, and validation'] }
        };
    }

    generateModals() {
        const container = document.querySelector('.team-modals-container');
        if (!container) return;
        Object.keys(this.teamData).forEach(id => {
            const m = this.teamData[id];
            container.insertAdjacentHTML('beforeend', `
                <div class="team-modal" id="team-modal-${id}">
                    <div class="modal-overlay"></div>
                    <div class="modal-content-wrapper">
                        <button class="modal-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg></button>
                        <div class="modal-header">
                            <div class="modal-photo"><img src="${m.photo}" alt="${m.name}"></div>
                            <h2>${m.name}</h2>
                            <p class="modal-credentials">${m.credentials}</p>
                            <a href="mailto:${m.email}" class="modal-email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-width="2"/><polyline points="22,6 12,13 2,6" stroke-width="2"/></svg>${m.email}</a>
                        </div>
                        <div class="modal-body">
                            <div class="bio-section"><h3>Professional Background</h3>${m.bio.map(p => `<p>${p}</p>`).join('')}</div>
                            <div class="highlights-box"><h4>Experience & Expertise</h4><ul>${m.highlights.map(h => `<li>${h}</li>`).join('')}</ul></div>
                        </div>
                    </div>
                </div>
            `);
        });
        this.setupModalListeners();
    }

    setupModalListeners() {
        document.querySelectorAll('.team-modal').forEach(modal => {
            modal.querySelector('.modal-overlay')?.addEventListener('click', () => this.closeModal(modal));
            modal.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal(modal));
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) this.closeModal(modal); });
        });
    }

    openModal(id) { const m = document.getElementById(`team-modal-${id}`); if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    closeModal(modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
}


/* ===================================
   11. FAQ ACCORDION
   =================================== */

class FAQAccordion {
    constructor() {
        this.faqSection = document.querySelector('.faq-section');
        if (!this.faqSection) return;
        this.faqItems = this.faqSection.querySelectorAll('.faq-item');
        this.categoryTabs = this.faqSection.querySelectorAll('.category-tab');
        this.categoryContents = this.faqSection.querySelectorAll('.faq-category-content');
        this.init();
    }

    init() {
        if (this.faqItems.length === 0) return;
        this.setupFAQItems();
        this.setupCategoryTabs();
    }

    setupFAQItems() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;
            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                const container = item.closest('.featured-faqs, .faq-category-content');
                if (container) container.querySelectorAll('.faq-item').forEach(o => { if (o !== item) o.classList.remove('active'); });
                item.classList.toggle('active', !wasActive);
            });
            question.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); } });
        });
    }

    setupCategoryTabs() {
        if (this.categoryTabs.length === 0) return;
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                this.categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.categoryContents.forEach(c => c.classList.toggle('active', c.getAttribute('data-category') === category));
                this.faqSection.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
            });
        });
    }
}


/* ===================================
   12. INSURANCE SCROLL
   =================================== */

class InsuranceScroll {
    constructor() {
        this.scrollTrack = document.querySelector('.insurance-scroll-track');
        if (!this.scrollTrack) return;
        this.init();
    }

    init() {
        this.scrollTrack.addEventListener('mouseenter', () => { this.scrollTrack.style.animationPlayState = 'paused'; });
        this.scrollTrack.addEventListener('mouseleave', () => { this.scrollTrack.style.animationPlayState = 'running'; });
        this.scrollTrack.addEventListener('touchstart', () => { this.scrollTrack.style.animationPlayState = 'paused'; }, { passive: true });
        this.scrollTrack.addEventListener('touchend', () => { this.scrollTrack.style.animationPlayState = 'running'; });
    }
}


/* ===================================
   13. PLAY THERAPY SECTION + MODAL
   =================================== */

class PlayTherapySection {
    constructor() {
        this.section = document.querySelector('.play-therapy-section');
        this.modal = document.getElementById('pt-detail-modal');
        this.openBtn = document.getElementById('pt-open-modal');
        if (!this.section) return;
        this.init();
    }

    init() {
        this.setupModal();
        this.setupRibbonAnimation();
        this.setupPresenterHover();
    }

    setupModal() {
        if (!this.modal) return;
        const overlay = this.modal.querySelector('.modal-overlay');
        const closeBtn = this.modal.querySelector('.modal-close');

        if (this.openBtn) this.openBtn.addEventListener('click', (e) => { e.preventDefault(); this.openModal(); });
        if (overlay) overlay.addEventListener('click', () => this.closeModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.modal.classList.contains('active')) this.closeModal(); });
    }

    openModal() {
        if (this.modal) { this.modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }

    closeModal() {
        if (this.modal) { this.modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
    }

    setupRibbonAnimation() {
        const ribbon = this.section.querySelector('.ribbon-badge');
        if (!ribbon) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ribbon.style.animation = 'ribbonSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(ribbon);
    }

    setupPresenterHover() {
        this.section.querySelectorAll('.pt-presenter-mini').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                if (img) { img.style.transform = 'scale(1.08)'; img.style.transition = 'transform 0.3s ease'; }
            });
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            });
        });
    }
}


/* ===================================
   14. FORM HANDLER (Contact)
   =================================== */

class FormHandler {
    constructor(selector) {
        this.form = document.querySelector(selector);
        this.inputs = document.querySelectorAll(`${selector} input, ${selector} textarea, ${selector} select`);
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupInputEffects();
        this.setupValidation();
    }

    handleSubmit(e) {
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            service: document.getElementById('service')?.value,
            message: document.getElementById('message')?.value
        };
        console.log('Form submitted:', formData);
        setTimeout(() => this.showSuccessMessage(), 100);
    }

    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'form-notification success';
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-width="2" stroke-linecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div><strong>Thank you for reaching out!</strong><p>Your email client should open shortly. We'll respond within 24 hours.</p></div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 5000);
    }

    setupInputEffects() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
            input.addEventListener('blur', () => { if (input.value === '') input.parentElement.classList.remove('focused'); });
        });
    }

    setupValidation() {
        this.inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                input.addEventListener('blur', () => {
                    input.classList.toggle('error', input.value.trim() === '');
                });
            }
        });
    }
}


/* ===================================
   15. FAB CONTACT MENU
   =================================== */

class FABContactMenu {
    constructor() {
        this.fabMenu = document.querySelector('.fab-contact-menu');
        this.isOpen = false;
        if (!this.fabMenu) return;
        this.mainButton = this.fabMenu.querySelector('.fab-main-button');
        this.buttons = this.fabMenu.querySelectorAll('.fab-button');
        this.init();
    }

    init() {
        this.mainButton.addEventListener('click', () => this.toggle());
        document.addEventListener('click', (e) => { if (!this.fabMenu.contains(e.target) && this.isOpen) this.close(); });
        this.buttons.forEach(btn => btn.addEventListener('click', () => setTimeout(() => this.close(), 300)));
        this.mainButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
            else if (e.key === 'Escape' && this.isOpen) this.close();
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) this.fabMenu.classList.add('visible');
            else { this.fabMenu.classList.remove('visible'); if (this.isOpen) this.close(); }
        });
    }

    toggle() { this.isOpen ? this.close() : this.open(); }

    open() {
        this.isOpen = true;
        this.fabMenu.classList.add('open');
        this.mainButton.setAttribute('aria-expanded', 'true');
        this.buttons.forEach((btn, i) => setTimeout(() => btn.classList.add('show'), i * 50));
    }

    close() {
        this.isOpen = false;
        this.fabMenu.classList.remove('open');
        this.mainButton.setAttribute('aria-expanded', 'false');
        this.buttons.forEach(btn => btn.classList.remove('show'));
    }
}


/* ===================================
   16. SCROLL TO TOP
   =================================== */

class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }

    createButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '↑';
        btn.className = 'scroll-to-top';
        btn.setAttribute('aria-label', 'Scroll to top');
        btn.style.cssText = `position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:linear-gradient(135deg,#4FC3F7,#29B6F6);color:white;border:none;border-radius:50%;font-size:1.5rem;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(79,195,247,0.4);z-index:999;`;
        document.body.appendChild(btn);
        return btn;
    }

    init() {
        window.addEventListener('scroll', () => {
            const visible = window.pageYOffset > 500;
            this.button.style.opacity = visible ? '1' : '0';
            this.button.style.visibility = visible ? 'visible' : 'hidden';
        });
        this.button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        this.button.addEventListener('mouseenter', () => { this.button.style.transform = 'translateY(-5px)'; this.button.style.boxShadow = '0 6px 20px rgba(79,195,247,0.5)'; });
        this.button.addEventListener('mouseleave', () => { this.button.style.transform = 'translateY(0)'; this.button.style.boxShadow = '0 4px 15px rgba(79,195,247,0.4)'; });
    }
}


/* ===================================
   17. PERFORMANCE MONITOR
   =================================== */

class PerformanceMonitor {
    constructor() {
        window.addEventListener('load', () => this.logPerformance());
    }

    logPerformance() {
        if (!('performance' in window)) return;
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c🌸 Child & Family Psychological Services 🌸`, 'font-size:20px;color:#4FC3F7;font-weight:bold;');
        console.log(`%cPage load time: ${loadTime}ms`, 'font-size:14px;color:#9575CD;');
        console.log(`%cWebsite loaded successfully!`, 'font-size:14px;color:#4CAF50;');
    }
}


/* ===================================
   18. APP (Main Controller)
   =================================== */

class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Ordered by page flow
        this.components.preloader = new Preloader();
        this.components.typedAnimation = new TypedAnimation('#typed-text');
        this.components.progressTracker = new ProgressTrackerNavigation();
        this.components.scrollEffects = new ScrollEffects();
        this.components.particleAnimation = new ParticleAnimation();
        this.components.logoAnimation = new LogoAnimation();
        this.components.cardObserver = new CardObserver();
        this.components.servicesCarousel = new ServicesCarousel();
        this.components.neurofeedback = new NeurofeedbackSection();
        this.components.teamCarousel = new TeamCarousel();
        this.components.faqAccordion = new FAQAccordion();
        this.components.insuranceScroll = new InsuranceScroll();
        this.components.playTherapy = new PlayTherapySection();
        this.components.formHandler = new FormHandler('.contact-form');
        this.components.fabMenu = new FABContactMenu();
        this.components.scrollToTop = new ScrollToTop();
        this.components.performance = new PerformanceMonitor();
    }

    getComponent(name) {
        return this.components[name];
    }
}

// ===================================
// Initialize Application
// ===================================
const app = new App();
