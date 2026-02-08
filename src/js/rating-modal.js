import { showGlobalNotification } from './global-notification.js';
import { showFieldError, hideFieldError, validateEmail } from './form-validation.js';

const API_BASE = 'https://your-energy.b.goit.study/api';

const SELECTORS = {
  modal: 'js-rating-modal',
  closeBtn: 'js-rating-modal-close',
  form: 'js-rating-modal-form',
  email: 'js-rating-modal-email',
  comment: 'js-rating-modal-comment',
  value: 'js-rating-modal-value',
  stars: '.rating-modal__star',

  emailError: 'js-email-error',
  commentError: 'js-comment-error',
  ratingError: 'js-rating-error',

  serverBox: 'js-rating-server-message',
  serverText: 'js-rating-server-message-text',
  serverClose: 'js-rating-server-message-close',
};

const STAR_ACTIVE_CLASS = 'rating-modal__star--active';
const MODAL_OPEN_CLASS = 'rating-modal--open';

const STAR_ACTIVE_COLOR = '#EEA10C';
const STAR_DEFAULT_STROKE = 'currentColor';

let exerciseIdForRating = null;


function byId(id) {
  return document.getElementById(id);
}

function getModalNodes() {
  const modal = byId(SELECTORS.modal);

  return {
    modal,
    overlay: modal?.querySelector('.rating-modal__overlay') || null,
    closeBtn: byId(SELECTORS.closeBtn),
    form: byId(SELECTORS.form),
    email: byId(SELECTORS.email),
    comment: byId(SELECTORS.comment),
    value: byId(SELECTORS.value),
    stars: Array.from(document.querySelectorAll(SELECTORS.stars)),
    emailError: byId(SELECTORS.emailError),
    commentError: byId(SELECTORS.commentError),
    ratingError: byId(SELECTORS.ratingError),
    serverBox: byId(SELECTORS.serverBox),
    serverText: byId(SELECTORS.serverText),
    serverClose: byId(SELECTORS.serverClose),
  };
}


function setServerMessage(text, type = 'error') {
  const { serverBox, serverText } = getModalNodes();
  if (!serverBox || !serverText) return;

  serverText.textContent = text;

  serverBox.classList.remove(
    'rating-modal__server-message--error',
    'rating-modal__server-message--success'
  );
  serverBox.classList.add(`rating-modal__server-message--${type}`);
  serverBox.classList.add('rating-modal__server-message--visible');
}

function clearServerMessage() {
  const { serverBox, serverText } = getModalNodes();
  if (!serverBox) return;

  serverBox.classList.remove('rating-modal__server-message--visible');
  serverBox.classList.remove(
    'rating-modal__server-message--error',
    'rating-modal__server-message--success'
  );

  if (serverText) serverText.textContent = '';
}

function paintStar(starBtn, isActive) {
  const svg = starBtn.querySelector('svg');
  const path = svg?.querySelector('path');
  if (!path) return;

  if (isActive) {
    path.setAttribute('fill', STAR_ACTIVE_COLOR);
    path.setAttribute('stroke', STAR_ACTIVE_COLOR);
  } else {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', STAR_DEFAULT_STROKE);
  }
}

function setStars(rating) {
  const { stars } = getModalNodes();

  stars.forEach((star, idx) => {
    const shouldBeActive = idx < rating;
    star.classList.toggle(STAR_ACTIVE_CLASS, shouldBeActive);
    paintStar(star, shouldBeActive);
  });
}

function getSelectedRating() {
  const { stars } = getModalNodes();

  let rating = 0;
  stars.forEach((star, idx) => {
    if (star.classList.contains(STAR_ACTIVE_CLASS)) {
      rating = Math.max(rating, idx + 1);
    }
  });

  return rating;
}

function resetFormUI() {
  const {
    form,
    value,
    email,
    comment,
    emailError,
    commentError,
    ratingError,
    stars,
  } = getModalNodes();

  if (form) form.reset();
  if (value) value.textContent = '0.0';

  hideFieldError(email, emailError);
  hideFieldError(comment, commentError);
  hideFieldError(null, ratingError);

  clearServerMessage();

  stars.forEach(star => {
    star.classList.remove(STAR_ACTIVE_CLASS);
    paintStar(star, false);
    star.style.color = ''; 
  });
}

function validateForm() {
  const { email, comment, emailError, commentError, ratingError } = getModalNodes();

  const rating = getSelectedRating();
  const emailValue = email?.value.trim() || '';
  const commentValue = comment?.value.trim() || '';

  let hasErrors = false;

  if (rating === 0) {
    showFieldError(null, ratingError, 'Please select a rating');
    hasErrors = true;
  } else {
    hideFieldError(null, ratingError);
  }

  if (!emailValue) {
    showFieldError(email, emailError, 'Please enter your email');
    hasErrors = true;
  } else if (!validateEmail(emailValue)) {
    showFieldError(email, emailError, 'Please enter a valid email address');
    hasErrors = true;
  } else {
    hideFieldError(email, emailError);
  }

  if (!commentValue) {
    showFieldError(comment, commentError, 'Please enter your comment');
    hasErrors = true;
  } else {
    hideFieldError(comment, commentError);
  }

  return { hasErrors, rating, emailValue, commentValue };
}

export function openRatingModal(exerciseId) {
  const { modal } = getModalNodes();
  if (!modal) return;

  exerciseIdForRating = exerciseId;

  resetFormUI();

  modal.classList.add(MODAL_OPEN_CLASS);
  document.body.style.overflow = 'hidden';
}

function closeRatingModalInner() {
  const { modal } = getModalNodes();
  if (!modal) return;

  modal.classList.remove(MODAL_OPEN_CLASS);
  document.body.style.overflow = '';

  exerciseIdForRating = null;

  resetFormUI();
}

export { closeRatingModalInner as closeRatingModal };

async function sendRating({ exerciseId, rate, email, review }) {
  const response = await fetch(`${API_BASE}/exercises/${exerciseId}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate, email, review }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || 'Failed to submit rating. Please try again.';
    throw new Error(message);
  }

  return data;
}

export function initRatingModal() {
  const { modal, overlay, closeBtn, serverClose, stars, value, email, comment, form, ratingError } =
    getModalNodes();

  if (!modal) return;

  closeBtn?.addEventListener('click', closeRatingModalInner);
  overlay?.addEventListener('click', closeRatingModalInner);

  serverClose?.addEventListener('click', clearServerMessage);

  email?.addEventListener('input', () => {
    const { emailError } = getModalNodes();
    hideFieldError(email, emailError);
  });

  comment?.addEventListener('input', () => {
    const { commentError } = getModalNodes();
    hideFieldError(comment, commentError);
  });

  stars.forEach((star, idx) => {
    star.addEventListener('click', () => {
      const selected = idx + 1;

      if (value) value.textContent = selected.toFixed(1);

      setStars(selected);
      hideFieldError(null, ratingError);
    });
    star.addEventListener('mouseenter', () => {
      const hover = idx + 1;
      stars.forEach((s, i) => {
        if (i < hover && !s.classList.contains(STAR_ACTIVE_CLASS)) {
          s.style.color = 'rgba(255, 255, 255, 0.6)';
        }
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => {
        if (!s.classList.contains(STAR_ACTIVE_CLASS)) {
          s.style.color = 'rgba(255, 255, 255, 0.3)';
        }
      });
    });
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const { hasErrors, rating, emailValue, commentValue } = validateForm();
    if (hasErrors) return;

    if (!exerciseIdForRating) return;

    clearServerMessage();

    try {
      const data = await sendRating({
        exerciseId: exerciseIdForRating,
        rate: rating,
        email: emailValue,
        review: commentValue,
      });

      closeRatingModalInner();

      const exerciseName = data?.name || 'the exercise';
      showGlobalNotification(
        `Thank you, your review for exercise ${exerciseName} has been submitted`,
        'success'
      );
    } catch (err) {
      setServerMessage(err.message, 'error');
    }
  });
}
