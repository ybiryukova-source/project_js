let hideTimerId = null;

const NOTIF = {
  rootId: 'js-global-notification',
  textId: 'js-global-notification-text',
  closeId: 'js-global-notification-close',
  visibleClass: 'global-notification--visible',
  errorClass: 'global-notification--error',
  warningClass: 'global-notification--warning',
};

function getNodes() {
  return {
    root: document.getElementById(NOTIF.rootId),
    text: document.getElementById(NOTIF.textId),
    closeBtn: document.getElementById(NOTIF.closeId),
  };
}

function clearTimer() {
  if (hideTimerId) {
    clearTimeout(hideTimerId);
    hideTimerId = null;
  }
}

function setTypeClass(rootEl, type) {
  rootEl.classList.remove(NOTIF.errorClass, NOTIF.warningClass);

  if (type === 'error') rootEl.classList.add(NOTIF.errorClass);
  if (type === 'warning') rootEl.classList.add(NOTIF.warningClass);
}

/**
 * Shows a global notification message
 * @param {string} message
 * @param {'success'|'error'|'warning'} type
 */
export function showGlobalNotification(message, type = 'success') {
  const { root, text } = getNodes();
  if (!root || !text) return;

  clearTimer();

  text.textContent = message;
  setTypeClass(root, type);

  root.classList.add(NOTIF.visibleClass);

  hideTimerId = setTimeout(() => {
    hideGlobalNotification();
  }, 3000);
}

export function hideGlobalNotification() {
  const { root, text } = getNodes();
  if (!root) return;

  clearTimer();

  root.classList.remove(NOTIF.visibleClass);

  setTimeout(() => {
    if (text) text.textContent = '';
    root.classList.remove(NOTIF.errorClass, NOTIF.warningClass);
  }, 300);
}

export function initGlobalNotification() {
  const { closeBtn } = getNodes();
  closeBtn?.addEventListener('click', hideGlobalNotification);
}

