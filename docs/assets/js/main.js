const navWrapper = document.getElementById('navWrapper');
window.addEventListener('scroll', () => {
  navWrapper.classList.toggle('scrolled', window.scrollY > 50);
});

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('navLinks').classList.remove('open');
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Active nav tracking
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(id)) link.classList.add('active');
      });
    }
  });
}, { rootMargin: '-30% 0px -70% 0px' }).observe && sections.forEach(s =>
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('onclick')?.includes(entry.target.id)) link.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' }).observe(s)
);

// Scroll reveals
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// Stat counter
let statAnimated = false;
function animateNumber(el, end, suffix) {
  const start = performance.now();
  const dur = 1200;
  (function update(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(update);
  })(start);
}

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statAnimated) {
      statAnimated = true;
      document.querySelectorAll('.stat-number').forEach(s => {
        const t = s.textContent;
        if (t.includes('+')) animateNumber(s, parseInt(t), '+');
      });
    }
  }, { threshold: 0.3 }).observe(statsGrid);
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav');
  const links = document.getElementById('navLinks');
  if (!nav.contains(e.target) && links.classList.contains('open')) links.classList.remove('open');
});
