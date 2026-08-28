import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal animations for elements with .reveal class
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        delay: el.classList.contains('delay-1') ? 0.15 : el.classList.contains('delay-2') ? 0.3 : el.classList.contains('delay-3') ? 0.45 : 0,
      }
    );
  });

  // 3D text line animations — each line flips in with perspective
  const text3dGroups = document.querySelectorAll('.text-3d');
  text3dGroups.forEach(group => {
    const lines = group.querySelectorAll('.text-3d-line');
    if (!lines.length) return;

    // Set initial 3D state
    gsap.set(lines, {
      rotationX: -70,
      rotationY: 15,
      opacity: 0,
      y: 40,
      transformOrigin: 'center bottom',
      filter: 'blur(4px)',
    });

    // Determine if hero (plays on load) or scroll-triggered
    const isHero = group.closest('.hero');

    if (isHero) {
      // Hero: animate on page load with stagger
      gsap.to(lines, {
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.18,
        delay: 2.2,
      });
    } else {
      // Scroll-triggered sections
      const section = group.closest('section') || group.closest('.final-cta');
      gsap.to(lines, {
        rotationX: 0,
        rotationY: 0,
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    }
  });

  // Destination cards — staggered entrance
  const destCards = document.querySelectorAll('.destination-card');
  if (destCards.length) {
    gsap.fromTo(destCards,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '#destinationGrid',
          start: 'top 80%',
        },
      }
    );
  }

  // Service cards — slide in from bottom
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceGrid = document.querySelector('.service-grid');
  if (serviceCards.length) {
    gsap.fromTo(serviceCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.service-grid',
          start: 'top 80%',
        },
      }
    );
  }

  // Service cards — auto-scroll demo on mobile
  if (serviceGrid && window.innerWidth <= 640) {
    ScrollTrigger.create({
      trigger: '.services',
      start: 'top 60%',
      once: true,
      onEnter: () => {
        const cardWidth = serviceCards[0]?.offsetWidth || 200;
        const scrollAmount = cardWidth + 14;
        const tl = gsap.timeline();
        tl.to(serviceGrid, { scrollLeft: scrollAmount, duration: 0.8, ease: 'power2.inOut', delay: 0.6 });
        tl.to(serviceGrid, { scrollLeft: 0, duration: 0.8, ease: 'power2.inOut', delay: 0.3 });
      },
    });
  }

  // Experience strip — numbered items
  const stripItems = document.querySelectorAll('.experience-strip > div');
  if (stripItems.length) {
    gsap.fromTo(stripItems,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.experience-strip',
          start: 'top 80%',
        },
      }
    );
  }

  // Journey section — Earth stage parallax scale
  const globeStage = document.querySelector('.globe-stage');
  if (globeStage) {
    gsap.fromTo(globeStage,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#journey',
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    );
  }

  // Final CTA section — dramatic entrance
  const finalCta = document.querySelector('.final-content');
  if (finalCta) {
    gsap.fromTo(finalCta,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: '.final-cta',
          start: 'top 75%',
        },
      }
    );
  }

  // Booking section
  const bookingCard = document.querySelector('.booking-card');
  if (bookingCard) {
    gsap.fromTo(bookingCard,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: {
          trigger: '#booking',
          start: 'top 75%',
        },
      }
    );
  }

  // Parallax for hero images
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    gsap.to(heroMedia, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Story section parallax
  const storyImage = document.querySelector('.story-image img');
  if (storyImage) {
    gsap.fromTo(storyImage,
      { scale: 1.15 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  // Ticker marquee
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    gsap.to(tickerTrack, {
      xPercent: -50,
      ease: 'none',
      duration: 20,
      repeat: -1,
    });
  }
}
