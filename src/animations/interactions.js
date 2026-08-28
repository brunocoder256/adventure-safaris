export function initInteractions() {
  // Magnetic effect on desktop buttons
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn, .header-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Card tilt effect
  document.querySelectorAll('.destination-card, .service-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // Destination search
  const search = document.getElementById('destinationSearch');
  const grid = document.getElementById('destinationGrid');
  const empty = document.getElementById('destinationEmpty');
  if (search && grid && empty) {
    search.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      let count = 0;
      grid.querySelectorAll('.destination-card').forEach(card => {
        const show = !q || card.dataset.search.includes(q);
        card.style.display = show ? 'block' : 'none';
        if (show) count++;
      });
      empty.style.display = count ? 'none' : 'block';
    });
  }

  // Destination card → booking form link
  document.querySelectorAll('[data-destination]').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.destination;
      const select = document.getElementById('destination');
      if (select) select.value = d;
    });
  });

  // WhatsApp booking form
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name')?.value.trim() || '';
      const dest = document.getElementById('destination')?.value || 'Not selected';
      const date = document.getElementById('date')?.value || 'Flexible';
      const travellers = document.getElementById('travellers')?.value || 'Not specified';
      const service = document.getElementById('service')?.value || '';
      const msg = document.getElementById('message')?.value.trim() || 'No extra details yet.';
      const text = `Hello Adventure Safaris East Africa!%0A%0AI'd like to plan a journey.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Destination:* ${encodeURIComponent(dest)}%0A*Travel date:* ${encodeURIComponent(date)}%0A*Travellers:* ${encodeURIComponent(travellers)}%0A*Service:* ${encodeURIComponent(service)}%0A*Details:* ${encodeURIComponent(msg)}%0A%0APlease advise me on the next steps.`;
      window.open(`https://wa.me/256761890792?text=${text}`, '_blank', 'noopener');
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav active state
  function updateNav() {
    const ids = ['home', 'destinations', 'services', 'contact'];
    const links = document.querySelectorAll('.mobile-bottom-nav a');
    const y = scrollY + innerHeight * 0.35;
    let active = 'home';
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) active = id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Header scroll state + progress bar
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', scrollY > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${h ? scrollY / h * 100 : 0}%`;
    }
  }, { passive: true });

  // Mobile drawer
  const drawer = document.getElementById('mobileDrawer');
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeMenu');

  function openDrawer() {
    drawer?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
  }
  menuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-drawer a').forEach(a => a.addEventListener('click', closeDrawer));

  // Pause Earth animation when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('tab-hidden');
    } else {
      document.body.classList.remove('tab-hidden');
    }
  });
}
