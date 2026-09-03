document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Year in Footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = mobileMenuBtn?.querySelector('i');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
            if (mobileMenu.classList.contains('is-open')) {
                mobileIcon.classList.remove('ph-list');
                mobileIcon.classList.add('ph-x');
            } else {
                mobileIcon.classList.remove('ph-x');
                mobileIcon.classList.add('ph-list');
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                mobileIcon.classList.remove('ph-x');
                mobileIcon.classList.add('ph-list');
            });
        });
    }

    // 3. Theme Toggle (Dark/Light mode)
    const themeToggles = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-mobile')
    ];

    const html = document.documentElement;

    // Default to dark mode as requested
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        html.classList.remove('dark');
    } else {
        // Fallback to dark if not explicitly set to light
        html.classList.add('dark');
    }

    function toggleTheme() {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            updateMetaThemeColor('#f8f9fa');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            updateMetaThemeColor('#0a0a0a');
        }
    }

    function updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        }
    }

    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    });

    // 4. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Contact Form → Formspree (sends email to Gmail)
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjyvrqpo';

            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            formSuccess.classList.add('hidden');
            formError.classList.add('hidden');

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(contactForm)
                });

                if (response.ok) {
                    contactForm.reset();
                    formSuccess.classList.remove('hidden');
                    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
                } else {
                    formError.classList.remove('hidden');
                }
            } catch {
                formError.classList.remove('hidden');
            } finally {
                submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send';
                submitBtn.disabled = false;
            }
        });
    }
});
