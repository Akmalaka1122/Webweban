/* ============================================================
   RIKAS INDO TECHNOLOGY - Main JavaScript
   Scroll Animations · Mobile Menu · Smooth Nav · Stats Counter
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // DOM REFS
  // ============================================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const hero = document.getElementById('hero');
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  // ============================================================
  // NAVBAR: Transparent → Glassmorphism on scroll (NAVI.gg-style)
  // ============================================================
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    // Active nav link based on scroll position
    updateActiveNavLink(scrollY);

    lastScrollY = scrollY;
  }

  function updateActiveNavLink(scrollY) {
    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // If at the very top, activate 'Beranda'
    if (scrollY < 100) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#hero') {
          link.classList.add('active');
        }
      });
    }
  }

  // Throttled scroll handler for performance
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleNavScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Initial call
  handleNavScroll();

  // ============================================================
  // MOBILE MENU TOGGLE
  // ============================================================
  function toggleMobileMenu() {
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  // Close menu on nav link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      closeMobileMenu();

      // Smooth scroll to target
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const offsetTop =
            targetEl.getBoundingClientRect().top +
            window.scrollY -
            navbar.offsetHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Close menu on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // ============================================================
  // SMOOTH SCROLL FOR NAV LINKS (desktop fallback)
  // ============================================================
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        // Only prevent default if mobile menu handler didn't already
        if (!navMenu.classList.contains('active')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            const offsetTop =
              targetEl.getBoundingClientRect().top +
              window.scrollY -
              navbar.offsetHeight;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth',
            });
          }
        }
      }
    });
  });

  // ============================================================
  // INTERSECTION OBSERVER: Fade-in scroll animations
  // ============================================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply staggered delay via the inline style if set
          const delay = entry.target.style.transitionDelay || '0s';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('visible');
          // Unobserve after animation fires
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // Also observe glass cards for subtle extra stagger
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach((card) => {
    if (!card.classList.contains('fade-in')) {
      // Glass cards inside sections already have .fade-in,
      // but observe standalone ones too
      fadeObserver.observe(card);
    }
  });

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  function handleBackToTop() {
    if (window.scrollY > hero.offsetHeight * 0.6) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', () => {
    handleBackToTop();
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // ============================================================
  // STATS COUNTER ANIMATION
  // ============================================================
  function animateCounters() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      const duration = 2000; // ms
      const startTime = performance.now();
      let animated = false;

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(easeOut * target);

        // Format with + if target >= 1000
        if (target >= 1000) {
          stat.textContent = currentValue + '+';
        } else {
          stat.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Ensure final value is exact
          if (target >= 1000) {
            stat.textContent = target + '+';
          } else {
            stat.textContent = target;
          }
          animated = true;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe stats section to trigger counter animation
  const statsSection = document.querySelector('.contact-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // ============================================================
  // PARALLAX EFFECT ON HERO (subtle mouse movement)
  // ============================================================
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ============================================================
  // RESIZE HANDLER: Clear parallax transform on mobile
  // ============================================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth <= 768 && heroContent) {
        heroContent.style.transform = '';
      }
    }, 200);
  });

  // ============================================================
  // CONSOLE LOGO (developer easter egg)
  // ============================================================
  console.log(
    '%c RIKAS INDO TECHNOLOGY %c',
    'background: linear-gradient(135deg, #4facfe, #00f2fe); color: #fff; font-size: 18px; font-weight: bold; padding: 10px 20px; border-radius: 8px;',
    'background: none; font-size: 12px;'
  );
  console.log('🚀 Event & Komunitas Esports Jawa Tengah');
});