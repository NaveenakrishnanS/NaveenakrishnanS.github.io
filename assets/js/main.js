// Site behaviour. Plain JS, no dependencies.
// The last line sets window.__siteReady. If anything throws before that, the inline guard in
// <head> removes the .js class on load so hidden-until-revealed content still shows.

const root = document.documentElement;
const prefersMotion = matchMedia('(prefers-reduced-motion: no-preference)').matches;

// MediaQueryList.addEventListener is missing in Safari < 14
function onMediaChange(query, handler) {
  const mq = matchMedia(query);
  if (mq.addEventListener) mq.addEventListener('change', handler);
  else if (mq.addListener) mq.addListener(handler);
}

// Portrait: fall back to the monogram if the photo can't load
const portraitImg = document.querySelector('.portrait img');
if (portraitImg) {
  const useMonogram = () => portraitImg.closest('picture')?.remove();
  if (portraitImg.complete && portraitImg.naturalWidth === 0) useMonogram();
  else portraitImg.addEventListener('error', useMonogram, { once: true });
}

// Nav gains its elevated style once the top of the page scrolls out of view
const siteNav = document.getElementById('siteNav');
const sentinel = document.querySelector('.nav-sentinel');
if (siteNav && sentinel) {
  new IntersectionObserver(([entry]) => {
    siteNav.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

// Active nav link follows the section in the middle of the viewport
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const linkById = new Map(navLinks.map(link => [link.hash.slice(1), link]));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    linkById.get(entry.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// Mobile menu. While open, the rest of the page is inert so focus stays in the menu.
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
const pageRegions = [document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.skip-link')].filter(Boolean);

function setMenu(open, { restoreFocus = false } = {}) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('is-open', open);
  menu.inert = !open;
  pageRegions.forEach(region => { region.inert = open; });
  document.body.classList.toggle('menu-open', open);
  if (open) menu.querySelector('a')?.focus({ preventScroll: true });
  else if (restoreFocus) menuToggle.focus();
}

if (menuToggle && menu) {
  setMenu(false);
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    setMenu(open, { restoreFocus: !open });
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false, { restoreFocus: true });
  });
  onMediaChange('(min-width: 861px)', e => { if (e.matches) setMenu(false); });
}

// Split headings into masked words (.w > .w-i with --wi). Runs before reveals are observed.
function splitWords(el) {
  let index = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) return walk(child);
      if (child.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const outer = document.createElement('span');
        const inner = document.createElement('span');
        outer.className = 'w';
        inner.className = 'w-i';
        inner.style.setProperty('--wi', index++);
        inner.textContent = part;
        outer.append(inner);
        frag.append(outer);
      });
      child.replaceWith(frag);
    });
  };
  walk(el);
}
document.querySelectorAll('[data-split]').forEach(splitWords);

// Scroll reveals
const reveals = document.querySelectorAll('main section:not(.hero) [data-reveal]');
const revealAll = () => reveals.forEach(el => el.classList.add('is-visible'));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  revealAll();
}

// Printing: show everything and expand every role, then put the roles back afterwards.
// Accumulates, because browsers can fire beforeprint more than once per print.
const closedRoles = new Set();
addEventListener('beforeprint', () => {
  revealAll();
  // Never print a counter mid-animation
  document.querySelectorAll('[data-count-to]').forEach(el => {
    el.dataset.countDone = '1';
    el.textContent = el.dataset.countFormat.replace('{n}', el.dataset.countTo);
  });
  document.querySelectorAll('details.role:not([open])').forEach(role => {
    closedRoles.add(role);
    role.open = true;
  });
});
addEventListener('afterprint', () => {
  closedRoles.forEach(role => { role.open = false; });
  closedRoles.clear();
});

// Metric counters: 3+ counts up, latency counts down to its target
const counters = document.querySelectorAll('[data-count-to]');
if (prefersMotion && counters.length) {
  const run = el => {
    const from = Number(el.dataset.countFrom);
    const to = Number(el.dataset.countTo);
    const format = el.dataset.countFormat;
    const start = performance.now();
    const duration = 1600;
    const tick = now => {
      if (el.dataset.countDone) return;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = format.replace('{n}', Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.countDone) return observer.unobserve(el);
      el.textContent = el.dataset.countFormat.replace('{n}', el.dataset.countFrom);
      // Count once the metrics row has faded in
      setTimeout(() => run(el), 350);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));
}

// Pointer effects (fine pointers only): bento spotlight and magnetic primary buttons
if (prefersMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.cell-core').forEach(core => {
    core.addEventListener('pointermove', e => {
      const r = core.getBoundingClientRect();
      core.style.setProperty('--sx', `${e.clientX - r.left}px`);
      core.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
  });

  document.querySelectorAll('.btn-primary').forEach(btn => {
    const strength = 0.22;
    const max = 8;
    const clamp = v => Math.max(-max, Math.min(max, v));
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.classList.add('is-magnetic');
      btn.style.setProperty('--mx', `${clamp((e.clientX - r.left - r.width / 2) * strength)}px`);
      btn.style.setProperty('--my', `${clamp((e.clientY - r.top - r.height / 2) * strength)}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.classList.remove('is-magnetic');
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}

// Copy email (the clipboard API needs https or localhost; the fallback message covers the rest)
const copyBtn = document.querySelector('[data-copy]');
const copyStatus = document.getElementById('copyStatus');
let copyTimer;
copyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.copy);
    copyBtn.classList.add('is-done');
    copyStatus.textContent = 'Email address copied.';
  } catch {
    copyStatus.textContent = 'Could not copy. Select the address above instead.';
  }
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyBtn.classList.remove('is-done');
    copyStatus.textContent = '';
  }, 2400);
});

window.__siteReady = true;
