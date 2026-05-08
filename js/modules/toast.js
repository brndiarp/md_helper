/**
 * Toast notification module.
 */

const MAX_TOASTS = 5;
const CONTAINER_ID = 'toast-container';

/**
 * Gets or creates the toast container element.
 * @returns {HTMLElement} The toast container.
 */
function getContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='info'] - The toast type (success, error, info).
 * @param {number} [duration=3000] - Display duration in milliseconds.
 */
export function showToast(message, type = 'info', duration = 3000) {
  const container = getContainer();

  // Limit number of toasts
  while (container.children.length >= MAX_TOASTS) {
    container.firstChild.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const icons = {
    success: '\u2713 ',
    error: '\u2717 ',
    info: '\u2139 ',
  };

  toast.textContent = (icons[type] || icons.info) + message;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
