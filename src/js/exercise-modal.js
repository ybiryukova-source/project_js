import { openRatingModal } from './rating-modal.js';
import { isFavorite, toggleFavorite } from './favorites.js';
import { getCurrentPage } from './header.js';
import { loadFavoritesExercises } from './exercises.js';

const API_BASE = 'https://your-energy.b.goit.study/api';

let activeExerciseId = null;

function getEl(id) {
  return document.getElementById(id);
}

function openModal() {
  const modal = getEl('js-exercise-modal');
  if (!modal) return;

  modal.classList.add('exercise-modal--open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = getEl('js-exercise-modal');
  if (!modal) return;

  modal.classList.remove('exercise-modal--open');
  document.body.style.overflow = '';
}

export { closeModal as closeExerciseModal };

async function apiFetchExercise(exerciseId) {
  const res = await fetch(`${API_BASE}/exercises/${exerciseId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch exercise details');
  }
  return res.json();
}

function renderLoading() {
  const title = getEl('js-exercise-modal-title');
  const image = getEl('js-exercise-modal-image');
  const ratingValue = document.querySelector('.exercise-modal__rating-value');

  const target = getEl('js-exercise-modal-target');
  const bodyPart = getEl('js-exercise-modal-body-part');
  const equipment = getEl('js-exercise-modal-equipment');
  const popular = getEl('js-exercise-modal-popular');
  const calories = getEl('js-exercise-modal-calories');
  const time = getEl('js-exercise-modal-time');
  const description = getEl('js-exercise-modal-description');

  if (title) title.textContent = 'Loading...';
  if (ratingValue) ratingValue.textContent = '0.0';

  if (target) target.textContent = '';
  if (bodyPart) bodyPart.textContent = '';
  if (equipment) equipment.textContent = '';
  if (popular) popular.textContent = '0';
  if (calories) calories.textContent = '0';
  if (time) time.textContent = '/0 min';
  if (description) description.textContent = '';

  if (image) {
    image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    image.alt = 'Exercise illustration';
  }

  paintStars(0);
  syncFavoriteButton();
}

function renderError() {
  const title = getEl('js-exercise-modal-title');
  const description = getEl('js-exercise-modal-description');

  if (title) title.textContent = 'Error loading exercise';
  if (description) {
    description.textContent =
      'Failed to load exercise details. Please try again later.';
  }

  paintStars(0);
  syncFavoriteButton();
}

function paintStars(rawRating) {
  const starsWrap = document.querySelector('.exercise-modal__rating-stars');
  if (!starsWrap) return;

  const stars = starsWrap.querySelectorAll('.exercise-modal__rating-star');
  const filled = Math.round(Number(rawRating || 0));

  stars.forEach((star, idx) => {
    const path = star.querySelector('path');
    if (!path) return;

    if (idx < filled) {
      path.setAttribute('fill', '#EEA10C');
      path.removeAttribute('stroke');
      path.removeAttribute('stroke-width');
    } else {
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(255,255,255,0.3)');
      path.setAttribute('stroke-width', '1.5');
    }
  });
}

function syncFavoriteButton() {
  const btn = getEl('js-exercise-modal-favorites');
  if (!btn) return;

  const label = btn.querySelector('span');
  const iconPath = btn.querySelector('svg path');

  const inFavorites = activeExerciseId ? isFavorite(activeExerciseId) : false;

  btn.classList.toggle('active', inFavorites);

  if (label) {
    label.textContent = inFavorites ? 'Remove from favorites' : 'Add to favorites';
  }

  if (iconPath) {
    if (inFavorites) {
      iconPath.setAttribute('fill', 'currentColor');
      iconPath.removeAttribute('stroke');
      iconPath.removeAttribute('stroke-width');
    } else {
      iconPath.setAttribute('fill', 'none');
      iconPath.setAttribute('stroke', 'currentColor');
      iconPath.setAttribute('stroke-width', '2');
    }
  }
}

function fillExerciseData(exercise) {
  const image = getEl('js-exercise-modal-image');
  const title = getEl('js-exercise-modal-title');

  const ratingValue = document.querySelector('.exercise-modal__rating-value');
  const target = getEl('js-exercise-modal-target');
  const bodyPart = getEl('js-exercise-modal-body-part');
  const equipment = getEl('js-exercise-modal-equipment');
  const popular = getEl('js-exercise-modal-popular');
  const calories = getEl('js-exercise-modal-calories');
  const time = getEl('js-exercise-modal-time');
  const description = getEl('js-exercise-modal-description');

  if (image) image.src = exercise.gifUrl || '';
  if (title) title.textContent = exercise.name || '';

  if (target) target.textContent = exercise.target || '';
  if (bodyPart) bodyPart.textContent = exercise.bodyPart || '';
  if (equipment) equipment.textContent = exercise.equipment || '';
  if (popular) popular.textContent = String(exercise.popularity || 0);

  if (calories) calories.textContent = String(exercise.burnedCalories || 0);
  if (time) time.textContent = `/${exercise.time || 0} min`;
  if (description) description.textContent = exercise.description || '';

  const rating = Number(exercise.rating || 0);
  if (ratingValue) ratingValue.textContent = rating.toFixed(1);

  paintStars(rating);
  syncFavoriteButton();
}

export async function openExerciseModal(exerciseId) {
  const modal = getEl('js-exercise-modal');
  if (!modal) return;

  activeExerciseId = exerciseId;

  openModal();
  renderLoading();

  try {
    const data = await apiFetchExercise(exerciseId);


    if (activeExerciseId !== exerciseId) return;

    fillExerciseData(data);
  } catch (err) {
    if (activeExerciseId !== exerciseId) return;
    renderError();
  }
}

export function initExerciseModal() {
  const modal = getEl('js-exercise-modal');
  if (!modal) return;

  const closeBtn = getEl('js-exercise-modal-close');
  const overlay = modal.querySelector('.exercise-modal__overlay');

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);


  const favoritesBtn = getEl('js-exercise-modal-favorites');
  favoritesBtn?.addEventListener('click', () => {
    if (!activeExerciseId) return;

    const wasAdded = toggleFavorite(activeExerciseId);
    syncFavoriteButton();

    if (!wasAdded && getCurrentPage() === 'favorites') {
      closeModal();
      loadFavoritesExercises();
    }
  });
  const ratingBtn = getEl('js-exercise-modal-rating-btn');
  ratingBtn?.addEventListener('click', () => {
    if (!activeExerciseId) return;
    closeModal();
    openRatingModal(activeExerciseId);
  });
}

