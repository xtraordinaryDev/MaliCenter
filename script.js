document.addEventListener('DOMContentLoaded', () => {

    // iOS hero video — muted property + playsinline must be set in JS, not just HTML
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('playsinline', '');

        const tryPlay = () => {
            const promise = heroVideo.play();
            if (promise !== undefined) {
                promise.catch(() => {
                    // Autoplay blocked by browser — hide the video element so the
                    // hero background-image (poster) shows cleanly with no play button
                    heroVideo.style.display = 'none';
                });
            }
        };

        // Multiple attempts: immediately, on first data, and once buffered enough
        tryPlay();
        heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
        heroVideo.addEventListener('canplay', tryPlay, { once: true });

        // On first touch anywhere, restore the video and try again — covers
        // iOS Low Power Mode and strict autoplay policies
        document.addEventListener('touchstart', () => {
            heroVideo.style.display = '';
            heroVideo.muted = true;
            tryPlay();
        }, { once: true, passive: true });
    }

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

    // Parallax: images and full-section background layers
    const parallaxElements = document.querySelectorAll('.parallax-img, .parallax-card');

    if (parallaxElements.length > 0) {
        // Pre-mark elements for GPU compositing
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            if (!Number.isNaN(speed)) el.style.willChange = 'transform';
        });

        let rafPending = false;

        function updateParallax() {
            rafPending = false;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed'));
                if (Number.isNaN(speed)) return;

                // For full-section bg layers use their own rect; for floating imgs use parent rect
                const rect = el.classList.contains('parallax-img')
                    ? el.parentElement.getBoundingClientRect()
                    : el.getBoundingClientRect();

                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (viewportCenter - elementCenter) * speed;

                el.style.transform = `translateY(${offset}px)`;
            });
        }

        function requestUpdate() {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(updateParallax);
            }
        }

        // scroll fires on desktop; touchmove fires during finger movement on iOS
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('touchmove', requestUpdate, { passive: true });

        // Run once on load so initial position is correct
        updateParallax();
    }
});
