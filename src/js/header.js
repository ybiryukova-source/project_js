// src/js/header.js

let refs = {
  mobileMenu: null,
  burger: null,
  closeBtn: null,
  overlay: null,
};

function setBodyLock(isLocked) {
  document.body.style.overflow = isLocked ? 'hidden' : '';
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

function setActiveNavLink() {
  const path = window.location.pathname;
  const isFavoritesPage = path.includes('favorites');

  document.querySelectorAll('.header__nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const active =
      (isFavoritesPage && href.includes('favorites')) ||
      (!isFavoritesPage && href.includes('index'));

    link.classList.toggle('header__nav-link--active', active);
  });

  document.querySelectorAll('.mobile-menu__nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const active =
      (isFavoritesPage && href.includes('favorites')) ||
      (!isFavoritesPage && href.includes('index'));

    link.classList.toggle('mobile-menu__nav-link--active', active);
  });
}

export function initHeader() {
  refs.mobileMenu = document.querySelector('.mobile-menu');
  refs.burger = document.querySelector('.header__burger');
  refs.closeBtn = document.querySelector('.mobile-menu__close');
  refs.overlay = document.getElementById('overlay');

  refs.burger?.addEventListener('click', openMenu);
  refs.closeBtn?.addEventListener('click', closeMenu);

  // клік по фону (якщо у вас так задумано)
  refs.mobileMenu?.addEventListener('click', e => {
    if (e.target === refs.mobileMenu) closeMenu();
  });

  // закривати меню при кліку на посилання
  document.querySelector('.mobile-menu__nav')?.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link) closeMenu();
  });

  setActiveNavLink();
}

