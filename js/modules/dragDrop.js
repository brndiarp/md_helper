/**
 * Drag & Drop module.
 */

import { showToast } from './toast.js';

const SUPPORTED_IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'];
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

let dragCounter = 0;

/**
 * Initializes drag & drop handlers.
 * @param {Object} options - Configuration options.
 * @param {HTMLTextAreaElement} options.editor - The editor element.
 * @param {HTMLElement} options.overlay - The drag overlay element.
 * @param {Function} options.onFileLoad - Callback when a file is loaded.
 */
export function initDragDrop({ editor, overlay, onFileLoad }) {
  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  document.body.addEventListener('dragenter', () => {
    dragCounter++;
    overlay.classList.add('overlay--drag-active');
  });

  document.body.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) {
      overlay.classList.remove('overlay--drag-active');
    }
  });

  document.body.addEventListener('drop', (e) => {
    dragCounter = 0;
    overlay.classList.remove('overlay--drag-active');
    handleDrop(e, editor, onFileLoad);
  });
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e, editor, onFileLoad) {
  const files = e.dataTransfer.files;
  if (files.length === 0) return;

  const file = files[0];
  const ext = file.name.split('.').pop().toLowerCase();

  if (SUPPORTED_IMAGE_EXTS.includes(ext)) {
    handleImageDrop(file, editor, onFileLoad);
    return;
  }

  if (ext === 'md') {
    handleMarkdownDrop(file, editor, onFileLoad);
    return;
  }

  showToast('Podporované formáty: .md, .png, .jpg, .jpeg, .gif, .webp, .svg', 'error', 4000);
}

function handleImageDrop(file, editor, onFileLoad) {
  if (file.size > MAX_IMAGE_SIZE) {
    showToast('Obrázek je větší než 1MB. Zvaž menší velikost.', 'error', 5000);
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target.result;
    const altText = file.name.replace(/\.[^.]+$/, '');
    const imageMarkdown = `![${altText}](${base64})`;
    const pos = editor.selectionStart;

    editor.value = editor.value.slice(0, pos) + imageMarkdown + editor.value.slice(pos);
    editor.focus();
    editor.setSelectionRange(pos + imageMarkdown.length, pos + imageMarkdown.length);

    onFileLoad();
    showToast(`Obrázek ${file.name} vložen`, 'success');
  };
  reader.readAsDataURL(file);
}

function handleMarkdownDrop(file, editor, onFileLoad) {
  const reader = new FileReader();
  reader.onload = (event) => {
    editor.value = event.target.result;
    onFileLoad(file.name.replace(/\.md$/i, ''));
    showToast(`Soubor ${file.name} načten`, 'success');
  };
  reader.readAsText(file);
}
