/* ==========================================================
   RIKAS Esports — Main JavaScript
   Interactions: scroll nav, mobile menu, scroll animations
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ----- ELEMENTS -----
    const navbar = document.getElementById("navbar");
    const toggleBtn = document.getElementById("navbarToggle");
    const navLinks = document.getElementById("navbarNav");
    const navAnchors = document.querySelectorAll(".navbar__link");
    const animElements = document.querySelectorAll(".scroll-anim");
    const statNumbers = document.querySelectorAll(".stats__number");

    // ----- 1. NAVBAR SCROLL EFFECT -----
    let lastScroll = 0;

    const onScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 20) {
            navbar.classList.add("navbar--scrolled");
        } else {
            navbar.classList.remove("navbar--scrolled");
        }

        lastScroll = currentScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on load to set correct initial state
    onScroll();

    // ----- 2. MOBILE MENU TOGGLE -----
    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !toggleBtn.classList.contains("active");

        toggleBtn.classList.toggle("active", isOpen);
        navLinks.classList.toggle("active", isOpen);
        toggleBtn.setAttribute("aria-expanded", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    toggleBtn.addEventListener("click", () => toggleMenu());

    // Close mobile menu on link click
    navAnchors.forEach((link) => {
        link.addEventListener("click", () => {
            toggleMenu(false);
        });
    });

    // Close mobile menu on click outside
    document.addEventListener("click", (e) => {
        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(e.target) &&
            !toggleBtn.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("active")) {
            toggleMenu(false);
        }
    });

    // ----- 3. SCROLL ANIMATIONS (Intersection Observer) -----
    const animObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    // Unobserve after revealing to save resources
                    animObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px",
        }
    );

    animElements.forEach((el) => animObserver.observe(el));

    // ----- 4. STAT COUNTER ANIMATION -----
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute("data-target"), 10);
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));

    /**
     * Animate a number element from 0 to its target value.
     * @param {HTMLElement} el - The element to update.
     * @param {number} target - The final number.
     * @param {number} duration - Animation duration in ms.
     */
    const animateCounter = (el, target, duration = 1200) => {
        const start = 0;
        const startTime = performance.now();

        const easeOutQuad = (t) => t * (2 - t); // smooth deceleration

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target; // ensure exact final value
            }
        };

        requestAnimationFrame(update);
    };

    // ----- 5. SMOOTH SCROLL FOR ANCHOR LINKS (fallback) -----
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (href === "#") return;

            const targetEl = document.querySelector(href);
            if (!targetEl) return;

            e.preventDefault();

            const offset = navbar.offsetHeight;
            const targetPosition =
                targetEl.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        });
    });

    // ----- 6. KEYBOARD NAVIGATION (optional enhancement) -----
    // Trap focus inside mobile menu when open
    const trapFocus = (e) => {
        if (!navLinks.classList.contains("active")) return;

        const focusableElements = navLinks.querySelectorAll(
            'a[href], button:not([disabled])'
        );
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    document.addEventListener("keydown", trapFocus);

}); // DOMContentLoaded