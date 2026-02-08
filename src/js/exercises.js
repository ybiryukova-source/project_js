import { openExerciseModal } from './exercise-modal.js';
import { getFavorites } from './favorites.js';
import { showGlobalNotification } from './global-notification.js';

const API_BASE = 'https://your-energy.b.goit.study/api';
const ITEMS_PER_PAGE = 10;

const SELECTORS = {
  content: '.exercises__content',
  cards: '.exercises__content__main__cards',
  pagination: '.exercises__content__pagination',
  filtersBar: '.exercises__content__header-filters',
  breadcrumbs: 'js-exercises-breadcrumbs',
  searchWrap: 'js-exercises-search',
  searchInput: 'js-exercises-search-input',
  hashtags: '.home__hashtags',
};

const CLS = {
  cardsAsExercises: 'exercises__content__main__cards--exercises',
  contentFavorites: 'exercises__content--favorites',

  crumbItem: 'exercises__content__header-breadcrumbs-item',
  crumbActive: 'exercises__content__header-breadcrumbs-item--active',
  crumbSep: 'exercises__content__header-breadcrumbs-separator',

  paginationArrow: 'exercises__content__pagination-arrow',
  paginationPage: 'exercises__content__pagination-page',
  paginationActive: 'exercises__content__pagination-page--active',
  paginationDots: 'exercises__content__pagination-ellipsis',
};

const state = {
  mode: 'home', 
  filter: 'Muscles',
  page: 1,
  category: null,
  keyword: '',
};


function qs(sel) {
  return document.querySelector(sel);
}
function qsa(sel) {
  return document.querySelectorAll(sel);
}
function byId(id) {
  return document.getElementById(id);
}

function setDisplay(el, value) {
  if (!el) return;
  el.style.display = value;
}


async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);

  return res;
}


function buildOptimizedImg(url, alt, className = '') {
  if (!url) return '';

  const proxy = 'https://wsrv.nl/?url=';

  const sm = `${proxy}${url}&w=150&output=webp&q=75`;
  const md = `${proxy}${url}&w=350&output=webp&q=75`;
  const lg = `${proxy}${url}&w=700&output=webp&q=80`;

  return `
    <img
      class="${className}"
      src="${md}"
      srcset="${sm} 150w, ${md} 350w, ${lg} 700w"
      sizes="(max-width: 767px) 150px, (max-width: 1440px) 350px, 350px"
      alt="${alt}"
      loading="lazy"
      decoding="async"
    />
  `;
}


function showSearch() {
  const wrap = byId(SELECTORS.searchWrap);
  setDisplay(wrap, 'flex');
}

function hideSearchAndReset() {
  const wrap = byId(SELECTORS.searchWrap);
  const input = byId(SELECTORS.searchInput);

  setDisplay(wrap, 'none');

  if (input) input.value = '';
  state.keyword = '';
}


function renderCards(htmlItems, asExercises = false) {
  const container = qs(SELECTORS.cards);
  if (!container) return;

  container.innerHTML = '';
  container.classList.toggle(CLS.cardsAsExercises, asExercises);

  htmlItems.forEach(markup => container.insertAdjacentHTML('beforeend', markup));
}

function categoryCardMarkup(item) {
  return `
    <div class="exercises__content__main__cards-item" data-category-name="${item.name}">
      <div class="exercises__content__main__cards-item-image">
        ${buildOptimizedImg(item.imgURL, `${item.name} exercise`)}
        <div class="exercises__content__main__cards-item-overlay">
          <div class="exercises__content__main__cards-item-overlay-name">${item.name}</div>
          <div class="exercises__content__main__cards-item-overlay-category">${item.filter}</div>
        </div>
      </div>
    </div>
  `;
}

function exerciseCardMarkup(ex) {
  const rating = Number(ex.rating || 0);
  const burnedCalories = ex.burnedCalories || 0;
  const time = ex.time || 0;
  const bodyPart = ex.bodyPart || '';
  const target = ex.target || '';
  const id = ex._id || '';

  return `
    <div class="exercises__content__main__cards-item exercises__content__main__cards-item--exercise" data-exercise-id="${id}">
      <div class="exercises__content__main__cards-item-header">
        <button class="exercises__content__main__cards-item-workout-btn">WORKOUT</button>

        <div class="exercises__content__main__cards-item-rating">
          <span class="exercises__content__main__cards-item-rating-value">${rating.toFixed(1)}</span>
          <svg class="exercises__content__main__cards-item-rating-star" width="18" height="18" viewBox="0 0 18 18" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0L11.0206 6.21885L17.5595 6.21885L12.2694 10.0623L14.2901 16.2812L9 12.4377L3.70993 16.2812L5.73056 10.0623L0.440492 6.21885L6.97937 6.21885L9 0Z" fill="#EEA10C"/>
          </svg>
        </div>

        <button class="exercises__content__main__cards-item-start-btn">
          Start
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="exercises__content__main__cards-item-body">
        <div class="exercises__content__main__cards-item-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h3 class="exercises__content__main__cards-item-title">${ex.name}</h3>
      </div>

      <div class="exercises__content__main__cards-item-footer">
        <div class="exercises__content__main__cards-item-info">
          <span class="exercises__content__main__cards-item-info-label">Burned calories:</span>
          <span class="exercises__content__main__cards-item-info-value">${burnedCalories}</span>
          <span class="exercises__content__main__cards-item-info-label">/ ${time} min</span>
        </div>

        <div class="exercises__content__main__cards-item-info">
          <span class="exercises__content__main__cards-item-info-label">Body part:</span>
          <span class="exercises__content__main__cards-item-info-value">${bodyPart}</span>
        </div>

        <div class="exercises__content__main__cards-item-info">
          <span class="exercises__content__main__cards-item-info-label">Target:</span>
          <span class="exercises__content__main__cards-item-info-value">${target}</span>
        </div>
      </div>
    </div>
  `;
}

function renderEmpty(message) {
  renderCards(
    [
      `
      <div class="exercises__content__main__empty-state">
        <p class="exercises__content__main__empty-state-text">${message}</p>
      </div>
    `,
    ],
    true
  );

  const pag = qs(SELECTORS.pagination);
  if (pag) pag.innerHTML = '';
}


export function updateBreadcrumbs(categoryName = null) {
  const box = byId(SELECTORS.breadcrumbs);
  if (!box) return;

  box.innerHTML = '';

  if (state.mode === 'favorites') {
    const btn = document.createElement('button');
    btn.className = `${CLS.crumbItem} ${CLS.crumbActive}`;
    btn.textContent = 'Favorites';
    btn.setAttribute('data-breadcrumb', 'favorites');
    box.appendChild(btn);
    return;
  }

  const exercisesBtn = document.createElement('button');
  exercisesBtn.className = CLS.crumbItem;
  exercisesBtn.textContent = 'Exercises';
  exercisesBtn.setAttribute('data-breadcrumb', 'exercises');

  if (!categoryName) exercisesBtn.classList.add(CLS.crumbActive);

  exercisesBtn.addEventListener('click', () => {
    state.category = null;
    state.page = 1;
    loadExerciseCards(state.filter, 1);
  });

  box.appendChild(exercisesBtn);

  if (!categoryName) return;

  const sep = document.createElement('span');
  sep.className = CLS.crumbSep;
  sep.textContent = '/';
  box.appendChild(sep);

  const categoryBtn = document.createElement('button');
  categoryBtn.className = `${CLS.crumbItem} ${CLS.crumbActive}`;
  categoryBtn.textContent = categoryName;
  box.appendChild(categoryBtn);
}


function buildPaginationModel(totalPages, current) {
  const pages = [];

  pages.push(1);

  if (totalPages <= 7) {
    for (let i = 2; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  let left = current - 1;
  let right = current + 1;

  if (current < 5) {
    left = 2;
    right = 5;
  }

  if (current > totalPages - 4) {
    left = totalPages - 4;
    right = totalPages - 1;
  }

  if (left > 2) pages.push('...');

  for (let i = left; i <= right; i += 1) {
    if (i > 1 && i < totalPages) pages.push(i);
  }

  if (right < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}

function renderPagination(totalPages, page = 1) {
  const box = qs(SELECTORS.pagination);
  if (!box) return;

  box.innerHTML = '';
  if (totalPages <= 1) return;

  const go = nextPage => {
    state.page = nextPage;

    if (state.mode === 'favorites') {
      loadFavoritesExercises(nextPage);
      return;
    }

    if (state.category) {
      loadExercisesByCategory(state.category, nextPage, state.keyword);
      return;
    }

    loadExerciseCards(state.filter, nextPage);
  };

  const mkArrow = (labelHtml, disabled, onClick) => {
    const btn = document.createElement('button');
    btn.className = CLS.paginationArrow;
    btn.innerHTML = labelHtml;
    btn.disabled = disabled;
    btn.addEventListener('click', onClick);
    return btn;
  };

  const mkPage = num => {
    const btn = document.createElement('button');
    btn.className = CLS.paginationPage;
    btn.textContent = String(num);
    if (num === page) btn.classList.add(CLS.paginationActive);
    btn.addEventListener('click', () => go(num));
    return btn;
  };

  const mkDots = () => {
    const span = document.createElement('span');
    span.className = CLS.paginationDots;
    span.textContent = '...';
    return span;
  };

  box.appendChild(mkArrow('&laquo;', page === 1, () => go(1)));
  box.appendChild(mkArrow('&lsaquo;', page === 1, () => go(page - 1)));

  const model = buildPaginationModel(totalPages, page);
  model.forEach(item => {
    if (item === '...') box.appendChild(mkDots());
    else box.appendChild(mkPage(item));
  });

  box.appendChild(mkArrow('&rsaquo;', page === totalPages, () => go(page + 1)));
  box.appendChild(mkArrow('&raquo;', page === totalPages, () => go(totalPages)));
}


function resolveCategoryParam() {
  if (state.filter === 'Muscles') return 'muscles';
  if (state.filter === 'Body parts') return 'bodypart';
  if (state.filter === 'Equipment') return 'equipment';
  return '';
}


export function loadExerciseCards(filter, page = 1) {
  state.filter = filter;
  state.page = page;
  state.category = null;

  hideSearchAndReset();

  const encodedFilter = encodeURIComponent(filter);
  const url = `/filters?filter=${encodedFilter}&page=${page}`;

  apiGet(url)
    .then(res => res.json())
    .then(data => {
      const items = data.results || data.exercises || data || [];
      const totalPages = data.totalPages || data.total_pages || data.pageCount || 1;

      updateBreadcrumbs(null);

      if (Array.isArray(items) && items.length) {
        renderCards(items.map(categoryCardMarkup), false);
        renderPagination(totalPages, page);
      } else {
        renderCards([], false);
        renderPagination(1, 1);
      }
    })
    .catch(() => {
      renderEmpty('Failed to load categories. Please try again later.');
    });
}


export function loadExercisesByCategory(categoryName, page = 1, keyword = state.keyword) {
  state.category = categoryName;
  state.page = page;
  state.keyword = keyword;

  showSearch();

  const paramName = resolveCategoryParam();
  const encodedCategory = encodeURIComponent(categoryName);

  let url = `/exercises?${paramName}=${encodedCategory}&page=${page}&limit=${ITEMS_PER_PAGE}`;

  const trimmed = (keyword || '').trim();
  if (trimmed) {
    url += `&keyword=${encodeURIComponent(trimmed)}`;
  }

  apiGet(url)
    .then(async res => {

      if (res.status === 409) return { results: [], totalPages: 0 };
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    })
    .then(data => {
      const list = data.results || [];
      const totalPages = data.totalPages || 1;

      updateBreadcrumbs(categoryName);

      if (Array.isArray(list) && list.length) {
        renderCards(list.map(exerciseCardMarkup), true);
        renderPagination(totalPages, page);
      } else {
        renderEmpty(
          'Unfortunately, no results were found. You may want to consider other search options.'
        );
      }
    })
    .catch(() => {
      renderEmpty('Failed to load exercises. Please try again later.');
    });
}


export function initSearch() {
  const wrap = byId(SELECTORS.searchWrap);
  const input = byId(SELECTORS.searchInput);
  if (!wrap || !input) return;

  const runSearch = () => {
    const keyword = input.value.trim().toLowerCase();

    if (!state.category) {
      showGlobalNotification('Please select a category first', 'error');
      return;
    }

    loadExercisesByCategory(state.category, 1, keyword);
  };

  input.addEventListener('input', e => {
    const value = e.target.value.trim();


    if (value === '' && state.category) {
      loadExercisesByCategory(state.category, 1, '');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    runSearch();
  });

  const icon = wrap.querySelector('.exercises__content__header-search-icon');
  icon?.addEventListener('click', runSearch);
}


export function initCardsEventListener() {
  const container = qs(SELECTORS.cards);
  if (!container) return;

  container.addEventListener('click', e => {
    const card = e.target.closest('.exercises__content__main__cards-item');
    if (!card) return;

    const categoryName = card.getAttribute('data-category-name');
    if (categoryName) {
      loadExercisesByCategory(categoryName);
      return;
    }

    const exId = card.getAttribute('data-exercise-id');
    if (exId) {
      openExerciseModal(exId);
    }
  });
}


export function initHashtags() {
  const box = qs(SELECTORS.hashtags);
  if (!box) return;

  box.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const keyword =
      btn.getAttribute('data-keyword') ||
      btn.textContent.replace('#', '').trim();


    if (state.mode !== 'home') {
      const homeLink = qs('.header__nav-link[data-page="home"]');
      if (homeLink) homeLink.click();
      else switchToHome();
    }

    const input = byId(SELECTORS.searchInput);
    if (input) input.value = keyword;

    const content = qs(SELECTORS.content);
    content?.scrollIntoView({ behavior: 'smooth' });

    if (state.category) {
      loadExercisesByCategory(state.category, 1, keyword);
    } else {
      showGlobalNotification(
        'Please select a category (e.g., abs) to start searching.',
        'error'
      );
    }
  });
}


function renderFavoritesEmpty() {
  renderEmpty(
    `It appears that you haven't added any exercises to your favorites yet.
To get started, you can add exercises that you like to your favorites for easier access in the future.`
  );
}

export function loadFavoritesExercises(page = 1) {
  state.page = page;

  updateBreadcrumbs(null);

  const ids = getFavorites();
  if (!ids.length) {
    renderFavoritesEmpty();
    return;
  }

  const totalPages = Math.ceil(ids.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  state.page = safePage;

  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const slice = ids.slice(start, start + ITEMS_PER_PAGE);

  const requests = slice.map(id =>
    apiGet(`/exercises/${id}`)
      .then(res => (res.ok ? res.json() : null))
      .catch(() => null)
  );

  Promise.all(requests).then(items => {
    const valid = items.filter(Boolean);

    if (valid.length) {
      renderCards(valid.map(exerciseCardMarkup), true);
      renderPagination(totalPages, safePage);
    } else {
      renderFavoritesEmpty();
    }
  });
}


export function switchToHome() {
  state.mode = 'home';
  state.category = null;
  state.keyword = '';

  const filtersBar = qs(SELECTORS.filtersBar);
  setDisplay(filtersBar, 'flex');

  const content = qs(SELECTORS.content);
  content?.classList.remove(CLS.contentFavorites);

  loadExerciseCards(state.filter, 1);
}

export function switchToFavorites() {
  state.mode = 'favorites';
  state.category = null;
  state.keyword = '';

  const filtersBar = qs(SELECTORS.filtersBar);
  setDisplay(filtersBar, 'none');

  hideSearchAndReset();

  const content = qs(SELECTORS.content);
  content?.classList.add(CLS.contentFavorites);

  loadFavoritesExercises(1);
}
