'use strict';

// ── Data binding ──────────────────────────────────────────────────────────
// Reads data.json and populates elements that have data-val / data-href.
// Falls back gracefully if fetch fails (e.g. file:// protocol).

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

function bindData(data) {
  document.querySelectorAll('[data-val]').forEach(el => {
    const val = getPath(data, el.dataset.val);
    if (val != null) el.textContent = val;
  });
  document.querySelectorAll('[data-href]').forEach(el => {
    const val = getPath(data, el.dataset.href);
    if (val != null) el.href = val;
  });
}

fetch('data.json')
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(bindData)
  .catch(() => { /* valores do HTML ficam como estão */ });

// ── Sticky header shadow ──────────────────────────────────────────────────
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const siteNav   = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Smooth-scroll ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
