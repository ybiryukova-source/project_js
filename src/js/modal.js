export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('is-open');
  document.body.classList.add('modal-open');

  if (modal.dataset.backdropListener !== 'true') {
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeModal(modalId);
      });
    }
    modal.dataset.backdropListener = 'true';
  }

  // Handle Escape key
  if (modal.dataset.escapeListener !== 'true') {
    const handleEscape = e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal(modalId);
      }
    };
    document.addEventListener('keydown', handleEscape);
    modal.dataset.escapeListener = 'true';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('is-open');


    if (modalId === 'rating-modal') {
      openModal('exercise-modal');
    }


    const anyModalOpen = document.querySelector('.modal.is-open');
    if (!anyModalOpen) {
      document.body.classList.remove('modal-open');
    }
  }
}

export function showRatingModal() {
  closeModal('exercise-modal');
  openModal('rating-modal');
  resetRatingForm();
  initRatingStars();
}

export function hideRatingModal() {
  closeModal('rating-modal');
}

export function renderExerciseModal(exercise) {
  if (!exercise) return;

  const gifElement = document.getElementById('modal-exercise-gif');
  if (gifElement) {
    gifElement.src = exercise.gifUrl || '';
    gifElement.alt = exercise.name || 'Exercise';
  }

  const titleElement = document.getElementById('modal-exercise-title');
  if (titleElement) {
    titleElement.textContent = exercise.name || 'Exercise';
  }

  const ratingElement = document.getElementById('modal-exercise-rating');
  if (ratingElement) {
    const rating = exercise.rating || 0;
    const fullStars = Math.floor(rating);

    ratingElement.innerHTML = `
      <span class="modal__rating-value">${rating.toFixed(1)}</span>
      <div class="modal__rating-stars">
        ${Array.from({ length: 5 }, (_, i) => {
          const filled = i < fullStars ? 'modal__star--filled' : '';
          return `<svg class="modal__star ${filled}" width="18" height="18" aria-hidden="true">
            <use href="/img/sprite.svg#icon-star"></use>
          </svg>`;
        }).join('')}
      </div>
    `;
  }

  const targetElement = document.getElementById('modal-target');
  if (targetElement) targetElement.textContent = exercise.target || 'N/A';

  const bodyPartElement = document.getElementById('modal-bodypart');
  if (bodyPartElement) bodyPartElement.textContent = exercise.bodyPart || 'N/A';

  const equipmentElement = document.getElementById('modal-equipment');
  if (equipmentElement) equipmentElement.textContent = exercise.equipment || 'N/A';

  const popularElement = document.getElementById('modal-popular');
  if (popularElement) popularElement.textContent = exercise.popularity || '0';

  const caloriesElement = document.getElementById('modal-calories');
  if (caloriesElement) {
    caloriesElement.textContent = `${exercise.burnedCalories || 0}/${exercise.time || 0} min`;
  }

  const descriptionElement = document.getElementById('modal-description');
  if (descriptionElement) {
    descriptionElement.textContent = exercise.description || 'No description available.';
  }

  const modal = document.getElementById('exercise-modal');
  if (modal) {
    modal.dataset.exerciseId = exercise._id;
  }
}

function resetRatingForm() {
  const ratingForm = document.getElementById('rating-form');
  const ratingValue = document.getElementById('rating-display-value');

  if (ratingForm) ratingForm.reset();
  if (ratingValue) ratingValue.textContent = '0.0';
}

function initRatingStars() {
  const starsContainer = document.getElementById('rating-stars');
  const ratingValue = document.getElementById('rating-display-value');

  if (!starsContainer) return;

  if (starsContainer.dataset.listenerAttached === 'true') return;
  starsContainer.dataset.listenerAttached = 'true';

  starsContainer.addEventListener('change', e => {
    if (e.target.type === 'radio') {
      const selectedRating = parseFloat(e.target.value);
      if (ratingValue) {
        ratingValue.textContent = selectedRating.toFixed(1);
      }
    }
  });
}



export function getCurrentRating() {
  const checkedRadio = document.querySelector('#rating-stars input[name="rating"]:checked');
  return checkedRadio ? parseFloat(checkedRadio.value) : 0;
}