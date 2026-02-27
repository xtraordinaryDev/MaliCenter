document.addEventListener('DOMContentLoaded', () => {

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hero section text entrance
    setTimeout(() => {
        const heroContent = document.querySelector('.fade-in-up');
        if (heroContent) {
            heroContent.classList.add('active');
        }
    }, 300);

    // Scroll reveal animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Elegant element-level parallax effect
    const parallaxImgs = document.querySelectorAll('.parallax-img');
    if (parallaxImgs.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxImgs.forEach(img => {
                const speed = parseFloat(img.getAttribute('data-speed'));
                const rect = img.parentElement.getBoundingClientRect();

                // Calculate position relative to viewport center
                const elementCenter = rect.top + (rect.height / 2);
                const viewportCenter = window.innerHeight / 2;
                const offset = (viewportCenter - elementCenter) * speed;

                img.style.transform = `translateY(${offset}px)`;
            });
        });
    }
});
