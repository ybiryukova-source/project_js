const CLASS_MAP = [
  { match: 'rating-modal__textarea', errorClass: 'rating-modal__textarea--error' },
  { match: 'rating-modal__input', errorClass: 'rating-modal__input--error' },
  { match: 'footer__subscribe-form-input', errorClass: 'footer__subscribe-form-input--error' },
];

function resolveErrorClass(fieldEl) {
  if (!fieldEl) return 'form-field--error';

  const found = CLASS_MAP.find(item => fieldEl.classList.contains(item.match));
  return found ? found.errorClass : 'form-field--error';
}

/**

 * @param {HTMLElement|null} fieldEl
 * @param {HTMLElement|null} errorEl
 * @param {string} message
 */
export function showFieldError(fieldEl, errorEl, message) {
  if (fieldEl) {
    fieldEl.classList.add(resolveErrorClass(fieldEl));
  }

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('form-error--visible');
  }
}

/**
 * @param {HTMLElement|null} fieldEl
 * @param {HTMLElement|null} errorEl
 */
export function hideFieldError(fieldEl, errorEl) {
  if (fieldEl) {
    fieldEl.classList.remove(
      'rating-modal__input--error',
      'rating-modal__textarea--error',
      'footer__subscribe-form-input--error',
      'form-field--error'
    );
  }

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('form-error--visible');
  }
}

/**
 * 
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 
 * @param {string} value
 * @returns {boolean}
 */
export function validateRequired(value) {
  return value.trim().length > 0;
}


export function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;

  yearEl.textContent = String(new Date().getFullYear());
}
