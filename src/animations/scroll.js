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
