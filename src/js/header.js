import { switchToHome, switchToFavorites } from './exercises.js';

let activePage = 'home';

let refs = {
  mobileMenu: null,
  burger: null,
  closeBtn: null,
  overlay: null,
};

function setBodyLock(isLocked) {
  document.body.style.overflow = isLocked ? 'hidden' : '';
}

function updateNavUI(page) {
  document.querySelectorAll('.header__nav-link').forEach(link => {
    link.classList.toggle(
      'header__nav-link--active',
      link.getAttribute('data-page') === page
    );
  });

  document.querySelectorAll('.mobile-menu__nav-link').forEach(btn => {
    btn.classList.toggle(
      'mobile-menu__nav-link--active',
      btn.getAttribute('data-page') === page
    );
  });
}

export function switchPage(page) {
  if (!page || page === activePage) return;

  activePage = page;
  updateNavUI(page);

  if (page === 'home') switchToHome();
  if (page === 'favorites') switchToFavorites();
}

function openMenu() {
  if (!refs.mobileMenu) return;

  refs.mobileMenu.classList.add('is-open');
  refs.burger?.classList.add('is-hidden');
  refs.overlay?.classList.add('active');
  setBodyLock(true);
}

function closeMenu() {
  if (!refs.mobileMenu) return;

  refs.mobileMenu.classList.remove('is-open');
  refs.burger?.classList.remove('is-hidden');
  refs.overlay?.classList.remove('active');
  setBodyLock(false);
}

function onNavClick(e) {
  const target = e.target.closest('[data-page]');
  if (!target) return;

  e.preventDefault();

  const page = target.getAttribute('data-page');
  switchPage(page);

  if (target.classList.contains('mobile-menu__nav-link')) {
    closeMenu();
  }
}

export function initHeader() {
  const desktopNav = document.querySelector('.header__nav');
  desktopNav?.addEventListener('click', onNavClick);
  refs.mobileMenu = document.querySelector('.mobile-menu');
  refs.burger = document.querySelector('.header__burger');
  refs.closeBtn = document.querySelector('.mobile-menu__close');
  refs.overlay = document.getElementById('overlay');
  refs.burger?.addEventListener('click', openMenu);
  refs.closeBtn?.addEventListener('click', closeMenu);
  const mobileNav = document.querySelector('.mobile-menu__nav');
  mobileNav?.addEventListener('click', onNavClick);
  refs.mobileMenu?.addEventListener('click', e => {
    if (e.target === refs.mobileMenu) closeMenu();
  });
  updateNavUI(activePage);
}

export function getCurrentPage() {
  return activePage;
}
