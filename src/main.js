import {
  loadExerciseCards,
  updateBreadcrumbs,
  initSearch,
  initCardsEventListener,
  initHashtags,
} from './js/exercises.js';

import { initExerciseModal, closeExerciseModal } from './js/exercise-modal.js';
import { initRatingModal, closeRatingModal } from './js/rating-modal.js';

import { initGlobalNotification } from './js/global-notification.js';
import { initFooterSubscription } from './js/email-validation.js';
import { initHeader } from './js/header.js';
import { displayQuote } from './js/quote.js';

const DEFAULT_FILTER = 'Muscles';
const DEFAULT_PAGE = 1;

const selectors = {
  filterBtn: '.exercises__content__header-filters-item',
  filterBtnActive:
    '.exercises__content__header-filters-item--active',
};


function bootstrapApp() {

  initExerciseModal();
  initRatingModal();
  initGlobalNotification();
  initHeader();
  initFooterSubscription();

  initSearch();
  initCardsEventListener();
  initHashtags();


  displayQuote();

  loadExerciseCards(DEFAULT_FILTER, DEFAULT_PAGE);

  setupEscapeToClose();
  setupFilterSwitching();
}

document.addEventListener('DOMContentLoaded', bootstrapApp);

function setupEscapeToClose() {
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    closeExerciseModal();
    closeRatingModal();
  });
}

function setupFilterSwitching() {
  const buttons = document.querySelectorAll(selectors.filterBtn);
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextFilter = btn.dataset.filter;
      if (!nextFilter) return;

      setActiveFilter(buttons, btn);
      updateBreadcrumbs(null);
      loadExerciseCards(nextFilter, DEFAULT_PAGE);
    });
  });
}

function setActiveFilter(allButtons, activeButton) {
  allButtons.forEach(btn =>
    btn.classList.remove(selectors.filterBtnActive.replace('.', ''))
  );

  activeButton.classList.add(selectors.filterBtnActive.replace('.', ''));
}