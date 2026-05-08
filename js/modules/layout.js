/**
 * Layout module - split view and resizable divider.
 */

import * as storage from './storage.js';

const SPLIT_KEY = storage.KEYS.SPLIT;
const DIVIDER_WIDTH_KEY = storage.KEYS.DIVIDER_WIDTH;

/**
 * Initializes the layout module.
 * @param {Object} options - Configuration options.
 * @param {HTMLElement} options.mainLayout - The main layout element.
 * @param {HTMLElement} options.resizeDivider - The resize divider element.
 * @param {Object} options.buttons - View toggle buttons.
 * @param {HTMLElement} options.buttons.split - Split view button.
 * @param {HTMLElement} options.buttons.editor - Editor only button.
 * @param {HTMLElement} options.buttons.preview - Preview only button.
 */
export function initLayout({ mainLayout, resizeDivider, buttons }) {
  const currentSplit = localStorage.getItem(SPLIT_KEY) || 'split';

  // View toggle buttons
  buttons.split.addEventListener('click', () => applySplit('split', mainLayout, buttons));
  buttons.editor.addEventListener('click', () => applySplit('editor', mainLayout, buttons));
  buttons.preview.addEventListener('click', () => applySplit('preview', mainLayout, buttons));

  // Resizable divider
  initResizableDivider(mainLayout, resizeDivider);

  // Apply initial split
  applySplit(currentSplit, mainLayout, buttons);
}

/**
 * Applies a split view mode.
 * @param {string} mode - The mode ('split', 'editor', 'preview').
 * @param {HTMLElement} mainLayout - The main layout element.
 * @param {Object} buttons - View toggle buttons.
 */
export function applySplit(mode, mainLayout, buttons) {
  mainLayout.classList.remove(
    'app__main--editor-only',
    'app__main--preview-only',
    'app__main--resizable'
  );

  // Reset all buttons
  Object.values(buttons).forEach(btn => {
    btn.classList.remove('toolbar__btn--active');
    btn.setAttribute('aria-pressed', 'false');
  });

  if (mode === 'editor') {
    mainLayout.classList.add('app__main--editor-only');
    buttons.editor.classList.add('toolbar__btn--active');
    buttons.editor.setAttribute('aria-pressed', 'true');
  } else if (mode === 'preview') {
    mainLayout.classList.add('app__main--preview-only');
    buttons.preview.classList.add('toolbar__btn--active');
    buttons.preview.setAttribute('aria-pressed', 'true');
  } else {
    mainLayout.classList.add('app__main--resizable');
    buttons.split.classList.add('toolbar__btn--active');
    buttons.split.setAttribute('aria-pressed', 'true');
    loadDividerWidth(mainLayout);
  }

  localStorage.setItem(SPLIT_KEY, mode);
}

function initResizableDivider(mainLayout, resizeDivider) {
  let isDraggingDivider = false;

  resizeDivider.addEventListener('mousedown', (e) => {
    isDraggingDivider = true;
    resizeDivider.classList.add('divider--dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingDivider) return;

    const rect = mainLayout.getBoundingClientRect();
    const style = window.getComputedStyle(mainLayout);
    const paddingLeft = parseFloat(style.paddingLeft) || 24;
    const paddingRight = parseFloat(style.paddingRight) || 24;

    const width = ((e.clientX - rect.left - paddingLeft) / (rect.width - paddingLeft - paddingRight)) * 100;
    const clamped = Math.max(20, Math.min(80, width));
    const widthStr = clamped + '%';

    mainLayout.style.setProperty('--editor-width', widthStr);

    try {
      localStorage.setItem(DIVIDER_WIDTH_KEY, widthStr);
    } catch (e) {
      // Ignore
    }
  });

  document.addEventListener('mouseup', () => {
    if (!isDraggingDivider) return;
    isDraggingDivider = false;
    resizeDivider.classList.remove('divider--dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}

function loadDividerWidth(mainLayout) {
  const saved = localStorage.getItem(DIVIDER_WIDTH_KEY);
  if (saved) {
    mainLayout.style.setProperty('--editor-width', saved);
  }
}
