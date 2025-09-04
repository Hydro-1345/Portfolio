/* ===== PORTFOLIO WEBSITE JAVASCRIPT ===== */
/* Professional interactive features and functionality */

// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components when DOM is ready
    initializeNavigation();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeTypingAnimation();
    initializeProjectFilters();
    initializeLazyLoading();
    
    console.log('🚀 Portfolio website loaded successfully!');
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Active nav link highlighting and header background
    const debouncedScrollHandler = debounce(() => {
        highlightActiveNavLink();
        updateHeaderBackground();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateHeaderBackground() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===== THEME TOGGLE FUNCTIONALITY =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-toggle__icon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition animation
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeIcon.setAttribute('aria-label', `${theme === 'dark' ? 'Switch to light' : 'Switch to dark'} mode`);
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('.form__input, .form__textarea');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const btnText = submitButton?.querySelector('.btn__text');
    const btnLoader = submitButton?.querySelector('.btn__loader');
    const formSuccess = document.getElementById('form-success');

    if (!submitButton || !btnText || !btnLoader || !formSuccess) return;

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Form submission - allow normal Formspree submission
    contactForm.addEventListener('submit', async (e) => {
        // Don't prevent default - let Formspree handle the submission
        // e.preventDefault(); // REMOVED THIS LINE
        
        if (!validateForm()) {
            e.preventDefault(); // Only prevent if validation fails
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        // Let the form submit normally to Formspree
        // The success message will be shown after Formspree redirects back
        // or we can show it immediately for better UX
        
        // Show success message after a short delay to simulate submission
        setTimeout(() => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 5000);
        }, 1000);
        
        // Reset button state after form submission
        setTimeout(() => {
            submitButton.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }, 2000);
    });

    function validateForm() {
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!errorElement) return true;
        
        let errorMessage = '';

        if (!value) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
        } else if (fieldName === 'email' && !isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address.';
        } else if (fieldName === 'name' && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long.';
        } else if (fieldName === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long.';
        }

        if (errorMessage) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            return false;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    }

    function clearFieldError(field) {
        if (field.value.trim()) {
            field.classList.remove('error');
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) errorElement.textContent = '';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Remove the simulateFormSubmission function as it's no longer needed
    // async function simulateFormSubmission(formData) {
    //     // Replace this with your actual form submission logic
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             if (Math.random() > 0.1) {
    //                 resolve('Message sent successfully');
    //             } else {
    //                 reject(new Error('Network error'));
    //             }
    //         }, 2000);
    //     });
    // }

    function showFormError(message) {
        let errorDiv = contactForm.querySelector('.form__error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form__error-message';
            errorDiv.style.cssText = 'color: var(--error-color); margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: var(--border-radius); text-align: center;';
            contactForm.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.skill__category, .project__card, .timeline__item, .education__item, .contact__detail'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    addScrollAnimationCSS();
}

function addScrollAnimationCSS() {
    if (document.querySelector('#scroll-animations-style')) return;
    
    const style = document.createElement('style');
    style.id = 'scroll-animations-style';
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill__category.animate-on-scroll {
            transform: translateY(30px) scale(0.95);
        }
        
        .skill__category.animate-in {
            transform: translateY(0) scale(1);
        }
        
        .project__card.animate-on-scroll {
            transform: translateY(40px);
        }
        
        .timeline__item.animate-on-scroll {
            transform: translateX(-30px);
            opacity: 0;
        }
        
        .timeline__item:nth-child(even).animate-on-scroll {
            transform: translateX(30px);
        }
        
        .timeline__item.animate-in {
            transform: translateX(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    const debouncedScrollHandler = debounce(() => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== TYPING ANIMATION =====
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.hero__title .hero__highlight');
    if (!typingElement) return;

    const phrases = [
        'bridge technology and innovation',
        'create meaningful digital experiences',
        'solve complex problems with code',
        'build the future, one line at a time'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isPaused) {
            isPaused = false;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
            isPaused = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// ===== PROJECT FILTERS =====
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project__card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu?.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Skip to main content with Tab key
    if (e.key === 'Tab' && e.target.classList.contains('skip-link')) {
        e.preventDefault();
        const mainContent = document.getElementById('main');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
        }
    }
});

// This is the code for inline formspree data submission confirmation 
const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop redirect
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      form.reset();
      document.querySelector(".form__success").style.display = "block";
    } else {
      alert("Oops! Something went wrong.");
    }
  } catch (error) {
    alert("Error submitting form. Please try again.");
  }
});

// Respect user's motion preferences
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
        
        if (!document.querySelector('#reduce-motion-style')) {
            const style = document.createElement('style');
            style.id = 'reduce-motion-style';
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', respectMotionPreferences);

// ===== PERFORMANCE MONITORING =====
function monitorPerformance() {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page load time: ${pageLoadTime}ms`);
        }
    });
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', monitorPerformance);

console.log('✅ Portfolio JavaScript loaded and initialized successfully!');