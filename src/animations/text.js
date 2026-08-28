export function initTextAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Rotating hero words
  const words = ['SAFARI', 'ADVENTURE', 'DISCOVERY', 'WILDLIFE', 'JOURNEY'];
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Create word rotator
  const rotator = document.createElement('div');
  rotator.className = 'word-rotator';
  rotator.setAttribute('aria-live', 'polite');
  rotator.setAttribute('aria-label', 'Rotating adventure words');
  const wordEl = document.createElement('span');
  wordEl.className = 'rotator-word';
  wordEl.textContent = words[0];
  rotator.appendChild(wordEl);
  heroContent.querySelector('.eyebrow')?.after(rotator);

  let currentIndex = 0;
  function rotateWord() {
    currentIndex = (currentIndex + 1) % words.length;
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(10px)';
    setTimeout(() => {
      wordEl.textContent = words[currentIndex];
      wordEl.style.opacity = '1';
      wordEl.style.transform = 'translateY(0)';
    }, 300);
  }
  setInterval(rotateWord, 3000);

  // Dynamic destination words in the ticker area
  const destinations = ['UGANDA', 'RWANDA', 'KENYA', 'TANZANIA', 'SOUTH SUDAN', 'WESTERN CONGO', 'ETHIOPIA', 'SUDAN'];
  const discoverEl = document.createElement('div');
  discoverEl.className = 'discover-dynamic';
  discoverEl.innerHTML = '<span class="discover-prefix">DISCOVER</span><span class="discover-dest">' + destinations[0] + '</span>';
  const introSection = document.querySelector('.intro');
  if (introSection) {
    introSection.prepend(discoverEl);
  }

  let destIndex = 0;
  function rotateDestination() {
    destIndex = (destIndex + 1) % destinations.length;
    const destSpan = discoverEl.querySelector('.discover-dest');
    if (destSpan) {
      destSpan.style.opacity = '0';
      destSpan.style.transform = 'translateY(8px)';
      setTimeout(() => {
        destSpan.textContent = destinations[destIndex];
        destSpan.style.opacity = '1';
        destSpan.style.transform = 'translateY(0)';
      }, 250);
    }
  }
  setInterval(rotateDestination, 2800);
}
