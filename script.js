// ===================================
// ES6 Class-Based Architecture
// ===================================

/**
 * Preloader Class
 * Handles the loading animation and initialization
 */
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

/**
 * TypedAnimation Class
 * Manages the Typed.js animation in the hero section
 */
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
        if (this.typed) {
            this.typed.destroy();
        }
    }
}

/**
 * ProgressTrackerNavigation Class
 * Unified progress tracker for desktop and mobile
 */
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
        
        // Section names for mobile label
        this.sectionNames = {
            'home': 'Home',
            'about': 'About',
            'services': 'Services',
            'video': 'Video',
            'contact': 'Contact'
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
        
        if (this.progressBar) {
            this.progressBar.style.width = `${scrolled}%`;
        }
    }

    setupActiveTracking() {
        window.addEventListener('scroll', () => this.updateActiveSection());
        this.updateActiveSection();
    }

    updateActiveSection() {
        const scrollY = window.pageYOffset;
        let currentSection = null;
        let currentIndex = 0;

        // Find the current section
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
                currentIndex = index;
            }
        });

        // Update desktop dots
        this.desktopDots.forEach((dot, index) => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.remove('active', 'completed');
            
            if (dotSection === currentSection) {
                dot.classList.add('active');
            } else if (index < currentIndex) {
                dot.classList.add('completed');
            }
        });

        // Update mobile dots
        this.mobileDots.forEach((dot, index) => {
            const dotSection = dot.getAttribute('data-section');
            dot.classList.remove('active', 'completed');
            
            if (dotSection === currentSection) {
                dot.classList.add('active');
            } else if (index < currentIndex) {
                dot.classList.add('completed');
            }
        });

        // Update mobile section label
        if (this.currentSectionLabel && currentSection) {
            this.currentSectionLabel.textContent = this.sectionNames[currentSection] || currentSection;
        }

        // Update progress line
        this.updateProgressLine(currentIndex);
    }

    updateProgressLine(currentIndex) {
        if (!this.progressLine) return;
        
        const totalDots = this.desktopDots.length;
        const progressPercentage = totalDots > 1 ? (currentIndex / (totalDots - 1)) * 100 : 0;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .progress-line::after {
                width: ${progressPercentage}% !important;
            }
        `;
        
        const oldStyle = document.getElementById('progress-line-style');
        if (oldStyle) oldStyle.remove();
        
        styleSheet.id = 'progress-line-style';
        document.head.appendChild(styleSheet);
    }

    setupSmoothScrolling() {
        // Desktop dots
        this.desktopDots.forEach(dot => {
            dot.addEventListener('click', (e) => this.handleDotClick(e, dot));
        });

        // Mobile dots
        this.mobileDots.forEach(dot => {
            dot.addEventListener('click', (e) => this.handleDotClick(e, dot));
        });
    }

    handleDotClick(e, dot) {
        e.preventDefault();
        const targetId = dot.getAttribute('href') || `#${dot.getAttribute('data-section')}`;
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = this.header?.offsetHeight || 80;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setupAccessibility() {
        // Keyboard navigation for desktop dots
        this.desktopDots.forEach((dot, index) => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dot.click();
                }
            });
        });

        // Keyboard navigation for mobile dots
        this.mobileDots.forEach((dot, index) => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dot.click();
                }
            });
        });
    }
}

/**
 * ScrollEffects Class
 * Manages scroll-based animations and effects
 */
class ScrollEffects {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.heroBackground = document.querySelector('.hero-background');
        this.heroVideo = document.querySelector('.hero-video');
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
        
        if (this.progressBar) {
            this.progressBar.style.width = `${scrolled}%`;
        }
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        
        if (this.heroBackground) {
            this.heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        if (this.heroVideo) {
            this.heroVideo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.3}px) scale(1.1)`;
        }
    }
}

/**
 * ParticleAnimation Class
 * Handles dynamic particle animations
 */
class ParticleAnimation {
    constructor(selector = '.particle') {
        this.particles = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.particles.forEach((particle, index) => {
            const animationDuration = 10 + Math.random() * 10;
            particle.style.animationDuration = `${animationDuration}s`;
            
            this.animateParticle(particle, animationDuration);
        });
    }

    animateParticle(particle, duration) {
        setInterval(() => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            particle.style.left = `${randomX}%`;
            particle.style.top = `${randomY}%`;
        }, duration * 1000);
    }
}

/**
 * FormHandler Class
 * Manages form submissions and validations
 */
class FormHandler {
    constructor(selector) {
        this.form = document.querySelector(selector);
        this.inputs = document.querySelectorAll(`${selector} input, ${selector} textarea`);
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupSubmitHandler();
        this.setupInputEffects();
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            message: document.getElementById('message')?.value
        };
        
        console.log('Form submitted:', formData);
        
        this.showSuccessMessage();
        this.form.reset();
    }

    showSuccessMessage() {
        alert('Thank you for your message! We will get back to you soon.');
    }

    setupInputEffects() {
        this.inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

/**
 * VideoPlayer Class
 * Handles video placeholder and embedding
 */
class VideoPlayer {
    constructor(selector = '.video-placeholder', videoId = 'dQw4w9WgXcQ') {
        this.placeholder = document.querySelector(selector);
        this.videoId = videoId;
        this.init();
    }

    init() {
        if (!this.placeholder) return;
        
        this.placeholder.addEventListener('click', () => this.loadVideo());
    }

    loadVideo() {
        const videoEmbed = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${this.videoId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            ></iframe>
        `;
        
        const videoWrapper = document.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.innerHTML = videoEmbed;
        }
    }
}

/**
 * CardObserver Class
 * Manages intersection observer for card animations
 */
class CardObserver {
    constructor(selector = '.about-card, .service-card, .info-card, .service-card-overlay') {
        this.cards = document.querySelectorAll(selector);
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.options
        );
        
        this.setupCards();
    }

    setupCards() {
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

/**
 * LogoAnimation Class
 * Handles interactive logo animations
 */
class LogoAnimation {
    constructor(selector = '.hero-logo img, .hero-logo svg') {
        this.logo = document.querySelector(selector);
        this.init();
    }

    init() {
        if (!this.logo) return;
        
        this.logo.addEventListener('mouseenter', () => this.animate());
    }

    animate() {
        if (this.logo.tagName === 'IMG') {
            this.logo.style.transition = 'transform 0.3s ease, filter 0.3s ease';
            this.logo.style.transform = 'scale(1.05)';
            this.logo.style.filter = 'drop-shadow(0 15px 40px rgba(79, 195, 247, 0.5))';
            
            setTimeout(() => {
                this.logo.style.transform = 'scale(1)';
                this.logo.style.filter = 'drop-shadow(0 10px 30px rgba(79, 195, 247, 0.3))';
            }, 300);
            return;
        }

        const lotusLarge = this.logo.querySelector('.lotus-large');
        const lotusSmall = this.logo.querySelector('.lotus-small');
        const wheel = this.logo.querySelector('.wheel');
        
        if (lotusLarge) lotusLarge.style.animation = 'petalPulse 0.8s ease-in-out';
        if (lotusSmall) lotusSmall.style.animation = 'petalPulse 0.8s ease-in-out 0.2s';
        if (wheel) wheel.style.animation = 'rotateWheel 2s linear';
        
        setTimeout(() => {
            if (lotusLarge) lotusLarge.style.animation = '';
            if (lotusSmall) lotusSmall.style.animation = '';
            if (wheel) wheel.style.animation = 'rotateWheel 8s linear infinite';
        }, 1000);
    }
}

/**
 * ScrollToTop Class
 * Creates and manages scroll-to-top button
 */
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
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #4FC3F7, #29B6F6);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(79, 195, 247, 0.4);
            z-index: 999;
        `;
        document.body.appendChild(btn);
        return btn;
    }

    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
        this.button.addEventListener('mouseenter', () => this.handleHover(true));
        this.button.addEventListener('mouseleave', () => this.handleHover(false));
    }

    toggleVisibility() {
        if (window.pageYOffset > 500) {
            this.button.style.opacity = '1';
            this.button.style.visibility = 'visible';
        } else {
            this.button.style.opacity = '0';
            this.button.style.visibility = 'hidden';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleHover(isHovered) {
        if (isHovered) {
            this.button.style.transform = 'translateY(-5px)';
            this.button.style.boxShadow = '0 6px 20px rgba(79, 195, 247, 0.5)';
        } else {
            this.button.style.transform = 'translateY(0)';
            this.button.style.boxShadow = '0 4px 15px rgba(79, 195, 247, 0.4)';
        }
    }
}

/**
 * KonamiCode Class
 * Easter egg functionality
 */
class KonamiCode {
    constructor() {
        this.code = [];
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.checkCode(e));
    }

    checkCode(e) {
        this.code.push(e.key);
        this.code = this.code.slice(-10);
        
        if (this.code.join('') === this.sequence.join('')) {
            this.activate();
        }
    }

    activate() {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        this.addRainbowAnimation();
        console.log('🎉 Konami Code activated! 🎉');
    }

    addRainbowAnimation() {
        if (document.getElementById('rainbow-animation')) return;
        
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.innerHTML = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * PerformanceMonitor Class
 * Monitors and logs performance metrics
 */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => this.logPerformance());
    }

    logPerformance() {
        if (!('performance' in window)) return;
        
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Page load time: ${pageLoadTime}ms`);
        
        this.logConsoleMessage();
    }

    logConsoleMessage() {
        console.log('%c🌸 Child & Family Psychological Services 🌸', 'font-size: 20px; color: #4FC3F7; font-weight: bold;');
        console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #9575CD;');
    }
}

/**
 * ServiceWorkerManager Class
 * Manages service worker registration
 */
class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    init() {
        if (!('serviceWorker' in navigator)) return;
        
        window.addEventListener('load', () => this.register());
    }

    register() {
        // Uncomment below when you have a service worker file
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    }
}

/**
 * StaffModalHandler Class
 * Manages the staff modal open/close functionality
 */
class StaffModalHandler {
    constructor() {
        this.modal = document.getElementById('staffModal');
        this.openBtn = document.getElementById('openStaffModal');
        this.closeBtn = document.getElementById('closeModal');
        this.overlay = document.getElementById('modalOverlay');
        this.init();
    }

    init() {
        if (!this.modal || !this.openBtn) return;

        // Open modal
        this.openBtn.addEventListener('click', () => this.open());

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * ServicesCarousel Class
 * Manages carousel navigation, modals, and responsive behavior
 */
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
        
        // Touch/swipe support
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Modal data for all services
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
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1200) return 2;
        return 3;
    }

    calculateCardWidth() {
        if (this.cards.length > 0) {
            const cardStyle = window.getComputedStyle(this.cards[0]);
            const cardMargin = parseFloat(cardStyle.marginRight) || 30;
            this.cardWidth = this.cards[0].offsetWidth + cardMargin;
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
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Touch events for mobile swipe
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
            this.track.addEventListener('touchend', () => this.handleTouchEnd());
        }

        // Modal buttons
        const modalButtons = document.querySelectorAll('.card-btn');
        modalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modalId = btn.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const threshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    next() {
        if (this.currentIndex < this.totalPages - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    goToPage(pageIndex) {
        this.currentIndex = pageIndex;
        this.updateCarousel();
    }

    updateCarousel() {
        const offset = -this.currentIndex * this.cardWidth * this.cardsPerView;
        if (this.track) {
            this.track.style.transform = `translateX(${offset}px)`;
        }

        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
        }
    }

    handleResize() {
        const newCardsPerView = this.getCardsPerView();
        if (newCardsPerView !== this.cardsPerView) {
            this.cardsPerView = newCardsPerView;
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
            this.createDots();
        }
        this.calculateCardWidth();
        this.updateCarousel();
    }

    // Service data for modals
    getServiceData() {
        return {
            'child-therapy': {
                title: 'Child Therapy',
                subtitle: 'Nurturing emotional growth and resilience in children',
                description: 'Our child therapy sessions provide a safe, supportive environment where children can express themselves freely through play, art, and conversation. Dr. Doheny uses evidence-based approaches including play therapy, sandplay therapy, and expressive therapy tailored to each child\'s unique needs.',
                before: [
                    'Difficulty expressing emotions',
                    'Behavioral challenges at home or school',
                    'Anxiety or worry',
                    'Social difficulties with peers',
                    'Processing traumatic experiences'
                ],
                after: [
                    'Improved emotional regulation',
                    'Better coping strategies',
                    'Increased confidence',
                    'Stronger social skills',
                    'Healthier emotional expression'
                ],
                process: [
                    { title: 'Initial Assessment', description: 'Comprehensive evaluation to understand your child\'s needs and develop a personalized treatment plan.' },
                    { title: 'Therapeutic Play Sessions', description: 'Weekly sessions using age-appropriate techniques like play therapy, art, and sandplay.' },
                    { title: 'Parent Collaboration', description: 'Regular updates and guidance to help you support your child\'s progress at home.' },
                    { title: 'Progress Monitoring', description: 'Ongoing assessment to track growth and adjust interventions as needed.' }
                ]
            },
            'adolescent-therapy': {
                title: 'Adolescent Therapy',
                subtitle: 'Supporting teens through life\'s challenges',
                description: 'Adolescence brings unique challenges including identity formation, peer pressure, academic stress, and emotional changes. Our adolescent therapy provides a confidential space for teens to explore their feelings, develop coping strategies, and build resilience using CBT, DBT, and person-centered approaches.',
                before: [
                    'Depression or mood swings',
                    'Anxiety or panic attacks',
                    'Identity and self-esteem issues',
                    'Relationship conflicts',
                    'Academic or social pressures'
                ],
                after: [
                    'Improved emotional stability',
                    'Stronger sense of identity',
                    'Better stress management',
                    'Healthier relationships',
                    'Increased academic focus'
                ],
                process: [
                    { title: 'Confidential Consultation', description: 'Building trust through one-on-one sessions where teens feel heard and respected.' },
                    { title: 'Goal Setting', description: 'Collaboratively identifying challenges and creating achievable goals.' },
                    { title: 'Skill Development', description: 'Teaching practical coping strategies, communication skills, and emotional regulation.' },
                    { title: 'Ongoing Support', description: 'Regular sessions to navigate challenges and celebrate progress.' }
                ]
            },
            'individual-therapy': {
                title: 'Individual Therapy',
                subtitle: 'Personalized support for your mental wellness journey',
                description: 'Individual therapy for adults provides a confidential space to address personal challenges, process emotions, and develop strategies for growth. Dr. Doheny uses person-centered, cognitive-behavioral, and humanistic approaches to help clients overcome anxiety, depression, trauma, life transitions, and relationship issues.',
                before: [
                    'Feeling overwhelmed or stuck',
                    'Anxiety or depression symptoms',
                    'Unprocessed trauma or grief',
                    'Life transition challenges',
                    'Low self-esteem or confidence'
                ],
                after: [
                    'Greater self-awareness',
                    'Improved emotional well-being',
                    'Effective coping strategies',
                    'Clearer life direction',
                    'Enhanced relationships'
                ],
                process: [
                    { title: 'Initial Evaluation', description: 'Comprehensive assessment to understand your unique needs and goals.' },
                    { title: 'Treatment Planning', description: 'Developing a personalized approach that honors your individual journey.' },
                    { title: 'Therapeutic Work', description: 'Regular sessions using evidence-based techniques tailored to your needs.' },
                    { title: 'Growth & Integration', description: 'Building skills and insights that support lasting positive change.' }
                ]
            },
            'family-therapy': {
                title: 'Family Therapy',
                subtitle: 'Strengthening bonds and improving communication',
                description: 'Family therapy helps families improve communication, resolve conflicts, and strengthen relationships. Whether facing specific challenges or seeking to enhance family dynamics, our sessions provide a supportive space for all family members to be heard and work collaboratively toward positive change.',
                before: [
                    'Communication breakdowns',
                    'Frequent conflicts or tension',
                    'Difficulties with life transitions',
                    'Behavioral issues with children',
                    'Feeling disconnected as a family'
                ],
                after: [
                    'Improved family communication',
                    'Stronger emotional bonds',
                    'Effective conflict resolution',
                    'Better understanding of each other',
                    'Increased family cohesion'
                ],
                process: [
                    { title: 'Family Assessment', description: 'Understanding family dynamics, strengths, and areas for growth.' },
                    { title: 'Goal Identification', description: 'Collaboratively defining what the family wants to achieve together.' },
                    { title: 'Communication Skills', description: 'Learning techniques for healthy expression and active listening.' },
                    { title: 'Ongoing Sessions', description: 'Regular meetings to practice new skills and address emerging challenges.' }
                ]
            },
            'marital-therapy': {
                title: 'Marital Therapy',
                subtitle: 'Nurturing your partnership and connection',
                description: 'Couples therapy helps partners strengthen their relationship, improve communication, and navigate challenges together. Whether you\'re facing specific issues or want to deepen your connection, our sessions provide tools and insights to build a healthier, more fulfilling partnership using evidence-based approaches like Emotionally Focused Therapy.',
                before: [
                    'Communication difficulties',
                    'Frequent arguments or conflicts',
                    'Trust or intimacy issues',
                    'Feeling disconnected',
                    'Life transition challenges'
                ],
                after: [
                    'Improved communication patterns',
                    'Deeper emotional connection',
                    'Better conflict resolution skills',
                    'Renewed intimacy and trust',
                    'Stronger partnership foundation'
                ],
                process: [
                    { title: 'Couples Assessment', description: 'Understanding relationship dynamics, attachment patterns, and goals.' },
                    { title: 'Communication Enhancement', description: 'Learning effective listening and expressing techniques.' },
                    { title: 'Conflict Resolution', description: 'Developing healthy ways to navigate disagreements and differences.' },
                    { title: 'Strengthening Connection', description: 'Rebuilding intimacy, trust, and emotional bonding.' }
                ]
            },
            'divorce-support': {
                title: 'Divorce Support',
                subtitle: 'Navigating separation with compassion and guidance',
                description: 'Divorce is one of life\'s most challenging transitions. Our divorce support services help individuals and families navigate this difficult time, process emotions, establish co-parenting strategies, and develop healthy coping mechanisms for moving forward.',
                before: [
                    'Emotional overwhelm and grief',
                    'Co-parenting conflicts',
                    'Children struggling with changes',
                    'Uncertainty about the future',
                    'Difficulty managing stress'
                ],
                after: [
                    'Emotional healing and acceptance',
                    'Effective co-parenting strategies',
                    'Children adapting positively',
                    'Clearer path forward',
                    'Improved coping skills'
                ],
                process: [
                    { title: 'Emotional Support', description: 'Processing grief, anger, and other emotions in a safe environment.' },
                    { title: 'Co-Parenting Planning', description: 'Developing communication strategies and parenting plans.' },
                    { title: 'Child Support', description: 'Helping children understand and adjust to family changes.' },
                    { title: 'Moving Forward', description: 'Building resilience and creating a positive future for your family.' }
                ]
            },
            'reunification-therapy': {
                title: 'Reunification Therapy',
                subtitle: 'Rebuilding parent-child relationships',
                description: 'Reunification therapy is a specialized intervention designed to repair and rebuild parent-child relationships that have been disrupted due to separation, divorce, or estrangement. This structured therapeutic process focuses on creating safe opportunities for reconnection and healing.',
                before: [
                    'Parent-child estrangement',
                    'Resistance to contact',
                    'Negative perceptions',
                    'Communication breakdowns',
                    'Unresolved conflict'
                ],
                after: [
                    'Restored communication',
                    'Rebuilding trust',
                    'Positive interactions',
                    'Improved relationship quality',
                    'Emotional healing'
                ],
                process: [
                    { title: 'Assessment Phase', description: 'Evaluating the relationship dynamics and barriers to reunification.' },
                    { title: 'Preparation', description: 'Individual sessions to prepare both parent and child for contact.' },
                    { title: 'Gradual Reintroduction', description: 'Structured, supervised sessions facilitating positive interactions.' },
                    { title: 'Relationship Building', description: 'Developing healthy communication patterns and rebuilding connection.' }
                ]
            },
            'supervised-visitation': {
                title: 'Therapeutic Supervised Visitation',
                subtitle: 'Safe, supportive parent-child contact',
                description: 'Therapeutic supervised visitation provides a safe, neutral environment for parent-child contact when safety concerns exist or during family transitions. Our licensed professionals monitor visits while supporting positive interactions and documenting observations for the court.',
                before: [
                    'Safety concerns during visits',
                    'Need for neutral environment',
                    'Court-ordered supervision',
                    'Anxiety about contact',
                    'Documentation requirements'
                ],
                after: [
                    'Safe visit environment',
                    'Positive parent-child interactions',
                    'Professional documentation',
                    'Increased comfort and trust',
                    'Progress toward unsupervised visits'
                ],
                process: [
                    { title: 'Intake & Planning', description: 'Review of court orders and visit guidelines with all parties.' },
                    { title: 'Supervised Sessions', description: 'Professional monitoring of visits in our comfortable facility.' },
                    { title: 'Interaction Support', description: 'Guidance to promote positive, age-appropriate interactions.' },
                    { title: 'Documentation & Reporting', description: 'Detailed reports for court and attorneys as required.' }
                ]
            },
            'parent-coordination': {
                title: 'Parent Coordination',
                subtitle: 'Reducing conflict and implementing custody agreements',
                description: 'Parent coordination is a court-ordered service designed to help high-conflict divorced or separated parents implement their custody agreement and reduce conflict. The parent coordinator serves as a neutral professional who helps resolve disputes about parenting issues.',
                before: [
                    'High-conflict co-parenting',
                    'Frequent court involvement',
                    'Communication breakdowns',
                    'Child caught in the middle',
                    'Custody agreement violations'
                ],
                after: [
                    'Reduced parental conflict',
                    'Effective communication',
                    'Consistent custody implementation',
                    'Child protection from conflict',
                    'Less court involvement'
                ],
                process: [
                    { title: 'Court Appointment', description: 'Review of court order and parenting plan with both parties.' },
                    { title: 'Communication Management', description: 'Facilitating parent communication and decision-making.' },
                    { title: 'Dispute Resolution', description: 'Mediating conflicts and making recommendations when needed.' },
                    { title: 'Ongoing Coordination', description: 'Monitoring compliance and supporting successful co-parenting.' }
                ]
            },
            'custody-evaluations': {
                title: 'Custody Evaluations',
                subtitle: 'Comprehensive assessments for informed custody decisions',
                description: 'Child custody evaluations are comprehensive psychological assessments conducted to assist courts in making informed decisions about custody and parenting time arrangements. Dr. Doheny conducts thorough evaluations considering the best interests of the child.',
                before: [
                    'Custody disputes',
                    'Need for professional assessment',
                    'Court requirement for evaluation',
                    'Concerns about child wellbeing',
                    'Parenting capability questions'
                ],
                after: [
                    'Comprehensive psychological evaluation',
                    'Professional recommendations',
                    'Detailed written report',
                    'Court testimony if needed',
                    'Informed custody decisions'
                ],
                process: [
                    { title: 'Case Review', description: 'Reviewing court documents, records, and relevant history.' },
                    { title: 'Comprehensive Assessment', description: 'Interviews, observations, psychological testing, and collateral contacts.' },
                    { title: 'Analysis & Report', description: 'Detailed written report with findings and recommendations.' },
                    { title: 'Court Involvement', description: 'Testimony and consultation as needed to support decision-making.' }
                ]
            },
            'mental-health-evaluations': {
                title: 'Mental Health Evaluations',
                subtitle: 'Professional psychological assessments',
                description: 'Comprehensive mental health evaluations provide diagnostic clarity and treatment recommendations for various psychological and developmental concerns. Dr. Doheny conducts thorough assessments for ADHD, autism spectrum disorder, learning disabilities, developmental delays, and other mental health conditions.',
                before: [
                    'Diagnostic uncertainty',
                    'Behavioral or academic concerns',
                    'Developmental questions',
                    'Need for treatment planning',
                    'School accommodation requirements'
                ],
                after: [
                    'Clear diagnostic understanding',
                    'Comprehensive evaluation report',
                    'Treatment recommendations',
                    'Educational planning support',
                    'Resource connections'
                ],
                process: [
                    { title: 'Clinical Interview', description: 'Gathering developmental history and current concerns.' },
                    { title: 'Testing Administration', description: 'Comprehensive psychological and educational testing.' },
                    { title: 'Analysis & Diagnosis', description: 'Interpreting results and formulating diagnoses.' },
                    { title: 'Feedback & Planning', description: 'Reviewing findings and creating actionable recommendations.' }
                ]
            }
        };
    }

    // Generate modal HTML for all services
    generateModals() {
        const container = document.querySelector('.service-modals-container');
        if (!container) return;
        
        Object.keys(this.serviceData).forEach(serviceKey => {
            const service = this.serviceData[serviceKey];
            const gradientClass = this.getGradientClass(serviceKey);
            
            const modalHTML = `
                <div class="service-modal" id="modal-${serviceKey}">
                    <div class="modal-overlay"></div>
                    <div class="modal-content-wrapper">
                        <button class="modal-close" aria-label="Close modal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        
                        <div class="modal-header">
                            <div class="modal-icon ${gradientClass}">
                                ${this.getServiceIcon(serviceKey)}
                            </div>
                            <h2>${service.title}</h2>
                            <p class="modal-subtitle">${service.subtitle}</p>
                        </div>
                        
                        <div class="modal-body">
                            <div class="modal-section">
                                <h3>What to Expect</h3>
                                <p>${service.description}</p>
                            </div>
                            
                            <div class="before-after-grid">
                                <div class="before-after-card before">
                                    <h4>Before Treatment</h4>
                                    <ul>
                                        ${service.before.map(item => `<li>${item}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="before-after-card after">
                                    <h4>After Treatment</h4>
                                    <ul>
                                        ${service.after.map(item => `<li>${item}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="modal-section">
                                <h3>Our Process</h3>
                                <div class="process-steps">
                                    ${service.process.map((step, index) => `
                                        <div class="process-step">
                                            <div class="step-number">${index + 1}</div>
                                            <div class="step-content">
                                                <h4>${step.title}</h4>
                                                <p>${step.description}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="modal-cta">
                                <h3>Ready to Get Started?</h3>
                                <p>Take the first step toward healing and growth. Contact us today to schedule your consultation.</p>
                                <a href="#contact" class="modal-cta-btn">
                                    <span>Schedule Consultation</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', modalHTML);
        });
        
        // Setup modal event listeners
        this.setupModalListeners();
    }

    getGradientClass(serviceKey) {
        const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5', 'gradient-6'];
        const index = Object.keys(this.serviceData).indexOf(serviceKey) % gradients.length;
        return gradients[index];
    }

    getServiceIcon(serviceKey) {
        const icons = {
            'child-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke-width="2"/></svg>',
            'adolescent-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke-width="2"/><path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke-width="2" stroke-linecap="round"/></svg>',
            'individual-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="4" stroke-width="2"/><path d="M5.5 21C5.5 17.134 8.634 14 12.5 14C16.366 14 19.5 17.134 19.5 21" stroke-width="2"/></svg>',
            'family-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke-width="2"/><path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126M16 3.12988C17.7252 3.57396 19 5.13988 19 7C19 8.86012 17.7252 10.426 16 10.8701" stroke-width="2"/></svg>',
            'marital-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99882 7.05 2.99882C5.59096 2.99882 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54882 7.04097 1.54882 8.5C1.54882 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke-width="2"/></svg>',
            'divorce-support': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke-width="2"/><path d="M12 8V12L15 15" stroke-width="2" stroke-linecap="round"/></svg>',
            'reunification-therapy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke-width="2"/><path d="M22 21V19C22 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke-width="2"/></svg>',
            'supervised-visitation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke-width="2"/><path d="M9 12L11 14L15 10" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="2" stroke-width="2"/></svg>',
            'parent-coordination': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke-width="2"/><path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke-width="2"/></svg>',
            'custody-evaluations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke-width="2"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke-width="2" stroke-linecap="round"/></svg>',
            'mental-health-evaluations': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke-width="2"/><path d="M2 21V19C2 17.9391 2.42143 16.9217 3.17157 16.1716C3.92172 15.4214 4.93913 15 6 15H12C13.0609 15 14.0783 15.4214 14.8284 16.1716C15.5786 16.9217 16 17.9391 16 19V21M16 11H22M19 8V14" stroke-width="2" stroke-linecap="round"/></svg>'
        };
        return icons[serviceKey] || icons['child-therapy'];
    }

    setupModalListeners() {
        const modals = document.querySelectorAll('.service-modal');
        
        modals.forEach(modal => {
            const overlay = modal.querySelector('.modal-overlay');
            const closeBtn = modal.querySelector('.modal-close');
            const ctaBtn = modal.querySelector('.modal-cta-btn');
            
            // Close modal on overlay click
            if (overlay) {
                overlay.addEventListener('click', () => this.closeModal(modal));
            }
            
            // Close modal on close button click
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal));
            }
            
            // Close modal on CTA button click (smooth scroll to contact)
            if (ctaBtn) {
                ctaBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal(modal);
                    setTimeout(() => {
                        const contactSection = document.querySelector('#contact');
                        if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 300);
                });
            }
            
            // Close modal on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    this.closeModal(modal);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * App Class
 * Main application controller that initializes all components
 */
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        this.components.preloader = new Preloader();
        this.components.typedAnimation = new TypedAnimation('#typed-text');
        this.components.progressTrackerNavigation = new ProgressTrackerNavigation();
        this.components.scrollEffects = new ScrollEffects();
        this.components.particleAnimation = new ParticleAnimation();
        this.components.formHandler = new FormHandler('.contact-form');
        this.components.videoPlayer = new VideoPlayer();
        this.components.cardObserver = new CardObserver();
        this.components.logoAnimation = new LogoAnimation();
        this.components.scrollToTop = new ScrollToTop();
        this.components.konamiCode = new KonamiCode();
        this.components.performanceMonitor = new PerformanceMonitor();
        this.components.serviceWorkerManager = new ServiceWorkerManager();
        this.components.staffModalHandler = new StaffModalHandler();
        this.components.servicesCarousel = new ServicesCarousel();
    }

    getComponent(name) {
        return this.components[name];
    }
}

// ===================================
// Initialize Application
// ===================================
const app = new App();
