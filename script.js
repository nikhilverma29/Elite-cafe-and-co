/* ================================================
   ELITE CAFE & CO. — script.js
   Handles: navbar, hamburger, menu tabs,
            scroll reveal, reservation WhatsApp
================================================ */

// ---- NAVBAR SCROLL SHADOW ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- HAMBURGER MENU ----
const hamburger    = document.getElementById('hamburger');
const mobileNav    = document.getElementById('mobile-nav');
const navClose     = document.getElementById('nav-close');
const mobileLinks  = document.querySelectorAll('.mobile-nav-link');

function openMenu() {
  hamburger.classList.add('open');
  mobileNav.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
navClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ---- SMOOTH SCROLL (all anchor links) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- MENU TABS ----
const tabBtns  = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.menu-grid');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update buttons
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Update panels
    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tab}`) {
        panel.removeAttribute('hidden');
        panel.classList.add('active');
        // Animate cards in
        panel.querySelectorAll('.menu-card').forEach((card, i) => {
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = `fadeUp 0.4s ease ${i * 0.06}s both`;
        });
      } else {
        panel.setAttribute('hidden', '');
        panel.classList.remove('active');
      }
    });
  });
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- RESERVATION FORM -> WHATSAPP ----
const reservationForm = document.getElementById('reservation-form');

reservationForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name   = document.getElementById('res-name').value.trim();
  const phone  = document.getElementById('res-phone').value.trim();
  const date   = document.getElementById('res-date').value;
  const time   = document.getElementById('res-time').value;
  const guests = document.getElementById('res-guests').value;
  const note   = document.getElementById('res-note').value.trim();

  // Basic validation
  if (!name || !phone || !date || !time || !guests) {
    alert('Please fill in all required fields.');
    return;
  }

  // Format date nicely
  const dateObj      = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Format time
  const [h, m]   = time.split(':');
  const hour     = parseInt(h);
  const ampm     = hour >= 12 ? 'PM' : 'AM';
  const hour12   = hour % 12 || 12;
  const formattedTime = `${hour12}:${m} ${ampm}`;

  const message = [
    `Hi Elite Cafe & Co.! 👋`,
    ``,
    `I'd like to book a table:`,
    ``,
    `👤 Name: ${name}`,
    `📞 Phone: ${phone}`,
    `📅 Date: ${formattedDate}`,
    `🕐 Time: ${formattedTime}`,
    `👥 Guests: ${guests}`,
    note ? `📝 Note: ${note}` : '',
    ``,
    `Please confirm my reservation. Thank you!`
  ].filter(Boolean).join('\n');

  const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
});

// ---- SET MIN DATE ON RESERVATION (no past dates) ----
const dateInput = document.getElementById('res-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}
