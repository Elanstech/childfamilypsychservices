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
        // Set body overflow to hidden initially
        document.body.style.overflow = 'hidden';
        
        // Wait for page to fully load
        window.addEventListener('load', () => this.hide());
    }

    hide() {
        setTimeout(() => {
            this.element.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.initializeAOS();
            
            // Remove preloader from DOM after transition completes
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
 * Navigation Class
 * Handles all navigation-related functionality
 */
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.querySelector('.nav-menu');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.lastScrollTop = 0;
        
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupActiveLinks();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupAccessibility();
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            this.lastScrollTop = scrollTop;
        });
    }

    setupActiveLinks() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        this.updateActiveLink();
    }

    updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        this.sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });
    }

    handleLinkClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.closeMobileMenu();
        }
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn) return;

        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        
        document.addEventListener('click', (e) => {
            if (this.navMenu?.classList.contains('active')) {
                if (!this.navMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.mobileMenuBtn.classList.toggle('active');
        this.animateHamburger();
    }

    closeMobileMenu() {
        if (this.navMenu?.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.animateHamburger(false);
        }
    }

    animateHamburger(open = null) {
        const spans = this.mobileMenuBtn.querySelectorAll('span');
        const isOpen = open !== null ? open : this.navMenu.classList.contains('active');
        
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    setupAccessibility() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        if (!this.navMenu) return;

        const focusableElements = this.navMenu.querySelectorAll('a, button');
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
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
        
        // Parallax effect for hero background
        if (this.heroBackground) {
            this.heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Slower parallax for video to create depth
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
    constructor(selector = '.about-card, .service-card, .info-card') {
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
        // For images, apply simple scale and glow effect
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

        // For SVG elements (if any remain)
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
 * App Class
 * Main application controller that initializes all components
 */
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Initialize all components
        this.components.preloader = new Preloader();
        this.components.typedAnimation = new TypedAnimation('#typed-text');
        this.components.navigation = new Navigation();
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
    }

    getComponent(name) {
        return this.components[name];
    }
}

// ===================================
// Initialize Application
// ===================================
const app = new App();
