/**
 * Preview module - Markdown rendering with Marked.js and DOMPurify.
 */

/**
 * Updates the preview element with rendered markdown.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {HTMLElement} preview - The preview element.
 */
export function updatePreview(editor, preview) {
  const raw = editor.value;
  const html = DOMPurify.sanitize(marked.parse(raw));
  preview.innerHTML = html;
}

/**
 * Initializes the Marked.js configuration.
 */
export function initMarked() {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
}
