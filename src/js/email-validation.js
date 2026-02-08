import { showGlobalNotification } from './global-notification.js';
import { showFieldError, hideFieldError, validateEmail } from './form-validation.js';

const API_URL = 'https://your-energy.b.goit.study/api/subscription';

export function initFooterSubscription() {
  const form = document.getElementById('subscribeForm');
  const input = document.getElementById('subscribeEmail');
  const errorBox = document.getElementById('subscribeEmailError');

  if (!form || !input || !errorBox) return;

  const clearErrorIfOk = () => {
    const value = input.value.trim();
    if (value === '' || validateEmail(value)) hideFieldError(input, errorBox);
  };

  input.addEventListener('input', clearErrorIfOk);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email = input.value.trim();

    if (email === '') {
      showFieldError(input, errorBox, 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      showFieldError(
        input,
        errorBox,
        'Please enter a valid email address (e.g. name@gmail.com)'
      );
      return;
    }

    hideFieldError(input, errorBox);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        showGlobalNotification(data.message, 'success');
        form.reset();
        return;
      }

      if (res.status === 409) {
        showGlobalNotification(
          "You've already subscribed. No need to resubscribe.",
          'warning'
        );
        form.reset();
        return;
      }

      throw new Error(`Subscription failed: ${res.status}`);
    } catch (err) {
      showGlobalNotification(
        'Something went wrong. Please try again later.',
        'error'
      );
      console.error(err);
    }
  });
}
