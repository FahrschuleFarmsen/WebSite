// ===================================
// FAHRSCHULE FARMSEN - JavaScript
// Helles, modernes Design
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initStatsAnimation();
    initScrollAnimations();
    initActiveNavigation();
});

// ===================================
// NAVBAR
// ===================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Add scrolled class for background
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll (only on desktop)
                if (window.innerWidth > 768) {
                    if (currentScroll > lastScroll && currentScroll > 200) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// STATS COUNTER ANIMATION
// ===================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;

        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            animated = true;
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
        }
    };

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats(); // Check on load
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(updateCounter);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .feature-card,
        .step-card,
        .service-card,
        .team-card,
        .booking-card,
        .contact-item,
        .testimonial-card,
        .section-header,
        .hours-card,
        .team-cta
    `);

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.5s ease ${(index % 4) * 0.1}s, transform 0.5s ease ${(index % 4) * 0.1}s`;
        observer.observe(el);
    });
}

// Add animate-in class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');

    const updateActiveLink = () => {
        let current = '';
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // Add active link styles
    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .nav-links a.active {
            color: var(--primary) !important;
        }
        .nav-links a.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(activeStyle);
}

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroElements = document.querySelectorAll('.hero-badge, .hero h1, .hero-subtitle, .hero-cta, .hero-stats, .hero-image');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });
});

// ===================================
// FORM VALIDATION (Future Use)
// ===================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]{6,}$/;
    return re.test(phone);
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    a:focus-visible, button:focus-visible {
        outline: 3px solid var(--primary);
        outline-offset: 3px;
        border-radius: 4px;
    }
`;
document.head.appendChild(focusStyle);

// ===================================
// CONSOLE BRANDING
// ===================================

console.log('%c🚗 Fahrschule Farmsen', 'font-size: 24px; font-weight: bold; color: #A12B38;');
console.log('%cErfolgreich seit 1959', 'font-size: 14px; color: #5C5C5C;');
console.log('%chttps://fahrschule-farmsen.de', 'font-size: 12px; color: #8A8A8A;');
