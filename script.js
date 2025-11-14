// ============================================
// CHILD & FAMILY PSYCHOLOGICAL SERVICES
// Main JavaScript File - ES6+
// ============================================

// ============================================
// PRELOADER
// ============================================
const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });
};

handlePreloader();

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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
    
    handleMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.mobileMenuBtn.classList.toggle('active');
            });
        }
    }
    
    handleActiveLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu when link is clicked
                if (this.navMenu.classList.contains('active')) {
                    this.navMenu.classList.remove('active');
                    this.mobileMenuBtn.classList.remove('active');
                }
            });
        });
    }
    
    handleScrollSpy() {
        window.addEventListener('scroll', () => {
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
        });
    }
}

// Initialize Navigation
const navigation = new Navigation();

// ============================================
// SCROLL PROGRESS BAR
// ============================================

class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            this.progressBar.style.width = `${scrollPercentage}%`;
        });
    }
}

// Initialize Scroll Progress
const scrollProgress = new ScrollProgress();

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
        this.init();
    }
    
    init() {
        // Check if Typed.js is loaded
        if (typeof Typed !== 'undefined') {
            this.initTyped();
        } else {
            // Fallback to simple text rotation
            this.initFallback();
        }
    }
    
    initTyped() {
        new Typed('#typed-text', {
            strings: this.strings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|',
            smartBackspace: true
        });
    }
    
    initFallback() {
        let currentIndex = 0;
        
        const rotateText = () => {
            this.element.textContent = this.strings[currentIndex];
            currentIndex = (currentIndex + 1) % this.strings.length;
        };
        
        rotateText(); // Initial display
        setInterval(rotateText, 3000);
    }
}

// Initialize Typed Effect
const typedEffect = new TypedEffect();

// ============================================
// SMOOTH SCROLL
// ============================================

const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
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
        });
    });
};

smoothScroll();

// ============================================
// AOS ANIMATION INITIALIZATION
// ============================================

const initAOS = () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
};

// Initialize AOS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
} else {
    initAOS();
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
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize Staff Modal
const staffModal = new StaffModal();

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
        }
    }
    
    handleSubmit(e) {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', data);
        
        // Show success message
        this.showMessage('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        this.form.reset();
        
        // In production, you would send this to your backend:
        // this.sendToBackend(data);
    }
    
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.textContent = message;
        
        this.form.insertAdjacentElement('beforebegin', messageDiv);
        
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
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        }
    }
}

// Initialize Contact Form
const contactForm = new ContactForm();

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
        // Replace with your actual video embed URL
        const videoURL = 'YOUR_VIDEO_URL_HERE';
        const iframe = document.createElement('iframe');
        
        iframe.setAttribute('src', videoURL);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '20px';
        
        const videoWrapper = this.videoPlaceholder.parentElement;
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(iframe);
    }
}

// Initialize Video Player
const videoPlayer = new VideoPlayer();

// ============================================
// PARALLAX EFFECT FOR HERO PARTICLES
// ============================================

class ParallaxEffect {
    constructor() {
        this.particles = document.querySelectorAll('.particle');
        this.init();
    }
    
    init() {
        if (this.particles.length > 0) {
            window.addEventListener('scroll', () => {
                this.handleScroll();
            });
        }
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.05;
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// Initialize Parallax Effect
const parallaxEffect = new ParallaxEffect();

// ============================================
// UTILITY FUNCTIONS
// ============================================

const debounce = (func, wait = 20) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const throttle = (func, limit = 20) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

class AnimationObserver {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window && this.animatedElements.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('aos-animate');
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
}

// Initialize Animation Observer
const animationObserver = new AnimationObserver();

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

const showWelcomeMessage = () => {
    const styles = [
        'color: #6366f1',
        'font-size: 16px',
        'font-weight: bold',
        'padding: 10px'
    ].join(';');
    
    console.log('%c🌟 Child & Family Psychological Services', styles);
    console.log('%cDeveloped with ❤️ by Elanstech', 'color: #8b5cf6; font-size: 12px;');
};

showWelcomeMessage();

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ============================================
// EXPORT FOR MODULE USAGE (OPTIONAL)
// ============================================

export {
    Navigation,
    ScrollProgress,
    TypedEffect,
    StaffModal,
    ContactForm,
    VideoPlayer,
    ParallaxEffect,
    AnimationObserver,
    debounce,
    throttle
};
