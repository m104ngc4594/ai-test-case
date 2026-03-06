/**
 * SkillSync Landing Page - Interactive Components
 *
 * This module handles:
 * - Mobile navigation toggle
 * - FAQ accordion functionality
 * - Smooth scroll offset for sticky header
 * - CTA button tracking
 */

(function() {
    'use strict';

    // ===== DOM Elements =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = navLinks.querySelectorAll('.nav-link');
    const headerCta = document.getElementById('headerCta');
    const signupBtn = document.getElementById('signupBtn');
    const faqItems = document.querySelectorAll('.faq-item');
    const header = document.querySelector('.site-header');

    // ===== Mobile Navigation =====
    function initMobileNav() {
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('open', !isExpanded);
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Close mobile menu when clicking a nav link
        navLinksItems.forEach(function(link) {
            link.addEventListener('click', function() {
                if (navLinks.classList.contains('open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // ===== FAQ Accordion =====
    function initFAQ() {
        faqItems.forEach(function(item) {
            const heading = item.querySelector('h3');
            if (!heading) return;

            heading.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');

                // Close all other items
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('p').style.display = 'none';
                });

                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                    item.querySelector('p').style.display = 'block';
                }
            });

            // Set initial state for open items (if any)
            if (item.classList.contains('open')) {
                item.querySelector('p').style.display = 'block';
            }
        });
    }

    // ===== Smooth Scroll with Header Offset =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Skip if it's just "#" or the same element
            if (href === '#' || href === '#') return;

            const targetId = href.substring(1);
            const target = document.getElementById(targetId);

            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetPosition - (headerHeight - 80);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // ===== Header Scroll Effect =====
    function initHeaderScroll() {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 20;

        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY + scrollThreshold) {
                // Scrolling down
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else if (currentScrollY < lastScrollY - scrollThreshold) {
                // Scrolling up
                header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ===== CTA Button Tracking =====
    function initCTAButtons() {
        const ctaButtons = document.querySelectorAll('#cta, #headerCta, .plan-button');

        ctaButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Track CTA clicks (can be extended with analytics)
                const eventName = 'cta_click';
                const eventData = {
                    button: this.textContent,
                    section: this.closest('section')?.id || 'general'
                };

                // Log to console (replace with actual analytics)
                console.log('CTA Click:', eventName, eventData);
            });
        });
    }

    // ===== Keyboard Navigation Enhancement =====
    function initKeyboardNav() {
        // Add keyboard navigation for testimonial cards
        const testimonials = document.querySelectorAll('.testimonial');
        testimonials.forEach(function(testimonial, index) {
            testimonial.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = testimonials[index + 1];
                    if (next) next.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = testimonials[index - 1];
                    if (prev) prev.focus();
                }
            });
        });
    }

    // ===== Intersection Observer for Animations =====
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe pricing cards and feature cards for entrance animation
        const animateElements = document.querySelectorAll('.plan, .feature-card');
        animateElements.forEach(function(el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ===== Initialize All Modules =====
    function init() {
        initMobileNav();
        initFAQ();
        initHeaderScroll();
        initCTAButtons();
        initKeyboardNav();
        initScrollAnimations();

        // Set up initial header shadow state
        if (header) {
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== Expose API for External Use =====
    window.SkillSyncLanding = {
        closeMobileNav: function() {
            if (navToggle && navLinks) {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }
        },
        toggleNav: function() {
            if (navToggle) navToggle.click();
        }
    };

})();
