// ============================================
// CHILD & FAMILY PSYCHOLOGICAL SERVICES
// Main JavaScript File - ES6+ (2025)
// Developer: Elanstech
// ============================================

'use strict';

// ============================================
// PRELOADER
// ============================================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 1500);
        });
    }

    hide() {
        if (this.preloader) {
            this.preloader.style.opacity = '0';
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }
    }
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.sections = document.querySelectorAll('section');
        
        this.init();
    }
    
    init() {
        this.handleStickyHeader();
        this.handleMobileMenu();
        this.handleActiveLinks();
        this.handleScrollSpy();
    }
    
    handleStickyHeader() {
        const onScroll = () => {
            if (window.scrollY > 100) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', throttle(onScroll, 10));
    }
    
    handleMobileMenu() {
        if (this.mobileMenuBtn && this.navMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.mobileMenuBtn.classList.toggle('active');
            });
        }
    }
    
    handleActiveLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.setActiveLink(link);
                this.closeMobileMenu();
            });
        });
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    closeMobileMenu() {
        if (this.navMenu?.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.mobileMenuBtn?.classList.remove('active');
        }
    }
    
    handleScrollSpy() {
        const updateActiveSection = () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', throttle(updateActiveSection, 50));
    }
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.init();
    }
    
    init() {
        if (!this.progressBar) return;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            this.progressBar.style.width = `${scrollPercentage}%`;
        };

        window.addEventListener('scroll', throttle(updateProgress, 10));
    }
}

// ============================================
// TYPED.JS EFFECT (WITH FALLBACK)
// ============================================
class TypedEffect {
    constructor() {
        this.element = document.getElementById('typed-text');
        this.strings = [
            'compassionate care',
            'expert guidance',
            'family support',
            'healing solutions',
            'personalized therapy',
            'professional assessments'
        ];
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        if (!this.element) return;

        // Check if Typed.js is loaded
        if (typeof Typed !== 'undefined') {
            this.initTyped();
        } else {
            console.warn('Typed.js not loaded, using fallback animation');
            this.initFallback();
        }
    }
    
    initTyped() {
        try {
            new Typed('#typed-text', {
                strings: this.strings,
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                cursorChar: '|',
                smartBackspace: true
            });
        } catch (error) {
            console.error('Typed.js initialization failed:', error);
            this.initFallback();
        }
    }
    
    initFallback() {
        const rotateText = () => {
            this.element.textContent = this.strings[this.currentIndex];
            this.currentIndex = (this.currentIndex + 1) % this.strings.length;
        };
        
        rotateText();
        setInterval(rotateText, 3000);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleClick(e, link);
            });
        });
    }

    handleClick(e, link) {
        const href = link.getAttribute('href');
        
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
}

// ============================================
// AOS ANIMATION INITIALIZATION
// ============================================
class AOSManager {
    constructor() {
        this.init();
    }

    init() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                disable: window.innerWidth < 768 ? true : false
            });

            // Refresh AOS on window resize
            window.addEventListener('resize', debounce(() => {
                AOS.refresh();
            }, 200));
        } else {
            console.warn('AOS library not loaded');
        }
    }
}

// ============================================
// STAFF MODAL FUNCTIONALITY
// ============================================
class StaffModal {
    constructor() {
        this.modal = document.getElementById('staffModal');
        this.openBtn = document.getElementById('openStaffModal');
        this.closeBtn = document.getElementById('closeModal');
        this.overlay = document.getElementById('modalOverlay');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;

        this.handleOpenModal();
        this.handleCloseModal();
        this.handleKeyboardClose();
    }
    
    handleOpenModal() {
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => {
                this.open();
            });
        }
    }
    
    handleCloseModal() {
        const closeElements = [this.closeBtn, this.overlay];
        
        closeElements.forEach(element => {
            if (element) {
                element.addEventListener('click', () => {
                    this.close();
                });
            }
        });
    }
    
    handleKeyboardClose() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }
    
    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Trap focus within modal
        this.trapFocus();
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });

            // Add real-time validation
            this.addValidation();
        }
    }

    addValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (isValid) {
            field.classList.remove('error');
            this.removeErrorMessage(field);
        } else {
            field.classList.add('error');
            this.showErrorMessage(field);
        }

        return isValid;
    }

    showErrorMessage(field) {
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '5px';

        if (field.type === 'email') {
            errorDiv.textContent = 'Please enter a valid email address';
        } else {
            errorDiv.textContent = 'This field is required';
        }

        field.parentElement.appendChild(errorDiv);
    }

    removeErrorMessage(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    handleSubmit(e) {
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', data);
        
        // Show success message
        this.showMessage('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        
        // Reset form
        this.form.reset();
        
        // In production, send to backend
        // this.sendToBackend(data);
    }
    
    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.style.padding = '15px 20px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.marginBottom = '20px';
        messageDiv.style.fontWeight = '500';
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.3s ease';
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d1fae5';
            messageDiv.style.color = '#065f46';
            messageDiv.style.border = '1px solid #6ee7b7';
        } else {
            messageDiv.style.backgroundColor = '#fee2e2';
            messageDiv.style.color = '#991b1b';
            messageDiv.style.border = '1px solid #fca5a5';
        }
        
        messageDiv.textContent = message;
        
        this.form.insertAdjacentElement('beforebegin', messageDiv);
        
        // Fade in
        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
    
    async sendToBackend(data) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            throw error;
        }
    }
}

// ============================================
// VIDEO PLACEHOLDER INTERACTION
// ============================================
class VideoPlayer {
    constructor() {
        this.videoPlaceholder = document.querySelector('.video-placeholder');
        this.init();
    }
    
    init() {
        if (this.videoPlaceholder) {
            this.videoPlaceholder.addEventListener('click', () => {
                this.handleClick();
            });
        }
    }
    
    handleClick() {
        // Replace with your actual video embed URL (YouTube, Vimeo, etc.)
        const videoURL = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1';
        const iframe = document.createElement('iframe');
        
        iframe.setAttribute('src', videoURL);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '20px';
        
        const videoWrapper = this.videoPlaceholder.parentElement;
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(iframe);
    }
}

// ============================================
// PARALLAX EFFECT FOR HERO PARTICLES
// ============================================
class ParallaxEffect {
    constructor() {
        this.particles = document.querySelectorAll('.particle');
        this.heroSection = document.querySelector('.hero-section');
        this.init();
    }
    
    init() {
        if (this.particles.length === 0) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const heroBottom = this.heroSection?.offsetHeight || 1000;

            // Only apply parallax within hero section
            if (scrolled < heroBottom) {
                this.particles.forEach((particle, index) => {
                    const speed = (index + 1) * 0.05;
                    particle.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        };

        window.addEventListener('scroll', throttle(handleScroll, 10));
    }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
class AnimationObserver {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        if (this.animatedElements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const debounce = (func, wait = 20) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit = 20) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// PERFORMANCE MONITORING
// ============================================
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #10b981; font-weight: bold;');
                }, 0);
            });
        }
    }
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
const showWelcomeMessage = () => {
    const styles = [
        'color: #6366f1',
        'font-size: 20px',
        'font-weight: bold',
        'padding: 10px',
        'text-shadow: 2px 2px 4px rgba(0,0,0,0.1)'
    ].join(';');
    
    const subStyles = [
        'color: #8b5cf6',
        'font-size: 14px',
        'font-weight: 500'
    ].join(';');

    console.log('%c🌟 Child & Family Psychological Services', styles);
    console.log('%c💻 Developed with ❤️ by Elanstech | 2025', subStyles);
    console.log('%cVersion: 1.0.0 | Last Updated: 2025-11-14', 'color: #6b7280; font-size: 12px;');
};

// ============================================
// ERROR HANDLING
// ============================================
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            console.error('Global Error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================
class App {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Show welcome message
            showWelcomeMessage();

            // Initialize all components
            this.components = [
                new Preloader(),
                new Navigation(),
                new ScrollProgress(),
                new TypedEffect(),
                new SmoothScroll(),
                new AOSManager(),
                new StaffModal(),
                new ContactForm(),
                new VideoPlayer(),
                new ParallaxEffect(),
                new AnimationObserver(),
                new PerformanceMonitor(),
                new ErrorHandler()
            ];

            console.log('%c✅ All components initialized successfully', 'color: #10b981; font-weight: bold;');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }
}

// ============================================
// START APPLICATION
// ============================================
const app = new App();

// Make utilities available globally if needed
window.ChildFamilyApp = {
    debounce,
    throttle,
    version: '1.0.0',
    lastUpdated: '2025-11-14'
};
