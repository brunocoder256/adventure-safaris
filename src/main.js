import './styles/main.css';
import { EarthExperience } from './earth/EarthExperience.js';
import { initScrollAnimations } from './animations/scroll.js';
import { initTextAnimations } from './animations/text.js';
import { initInteractions } from './animations/interactions.js';
import { initSmokeParticles } from './animations/smoke.js';
import { initWaterRipple } from './animations/ripple.js';

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }, 2000);
  }

  // Initialize Earth
  const canvas = document.getElementById('earthCanvas');
  const stage = canvas?.parentElement;
  if (canvas && stage) {
    try {
      new EarthExperience(canvas, stage);
    } catch (err) {
      console.error('Earth failed to initialize:', err);
      stage.classList.add('earth-fallback');
    }
  }

  // Initialize water ripple in hero
  initWaterRipple();

  // Initialize smoke particles
  initSmokeParticles();

  // Initialize animations and interactions
  initScrollAnimations();
  initTextAnimations();
  initInteractions();
});
