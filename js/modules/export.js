/**
 * Export module - download and export functionality.
 */

import { showToast } from './toast.js';

/**
 * Sanitizes a filename by replacing invalid characters.
 * @param {string} name - The raw filename.
 * @returns {string} The sanitized filename.
 */
function sanitizeFilename(name) {
  return (name.trim() || 'note').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}

/**
 * Downloads the editor content as a .md file.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} filename - The filename (without extension).
 */
export function downloadMarkdown(editor, filename) {
  const safeName = sanitizeFilename(filename);
  const blob = new Blob([editor.value], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${safeName}.md`);
}

/**
 * Exports the editor content as a .html file.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} filename - The filename (without extension).
 */
export function exportHtml(editor, filename) {
  const safeName = sanitizeFilename(filename);
  const safeTitle = safeName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const htmlContent = buildHtmlDocument(safeTitle, editor.value);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  triggerDownload(blob, `${safeName}.html`);
}

/**
 * Copies the editor content to clipboard.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {HTMLElement} button - The copy button element for feedback.
 */
export async function copyToClipboard(editor, button) {
  try {
    await navigator.clipboard.writeText(editor.value);
    showToast('Markdown zkopírován do schránky', 'success');

    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Zkopírováno`;
    button.style.color = '#86efac';
    button.style.borderColor = '#166534';

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.color = '';
      button.style.borderColor = '';
    }, 1800);
  } catch {
    showToast('Kopírování selhalo. Zkus manuálně (Ctrl+A, Ctrl+C).', 'error');
  }
}

/**
 * Builds an HTML document string from markdown content.
 * @param {string} title - The document title.
 * @param {string} markdown - The markdown content.
 * @returns {string} The complete HTML document.
 */
function buildHtmlDocument(title, markdown) {
  const htmlBody = DOMPurify.sanitize(marked.parse(markdown));

  return '<!DOCTYPE html>\n' +
    '<html lang="cs">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + title + '</title>\n' +
    '<style>\n' +
    'body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#333}\n' +
    'h1,h2,h3,h4,h5,h6{margin-top:1.5rem;margin-bottom:.75rem}\n' +
    'code{background:#f4f4f4;padding:.15em .4em;border-radius:4px;font-family:monospace}\n' +
    'pre{background:#f4f4f4;padding:1rem;border-radius:8px;overflow-x:auto}\n' +
    'pre code{background:none;padding:0}\n' +
    'blockquote{border-left:4px solid #6366f1;padding-left:1rem;margin-left:0;color:#666}\n' +
    'table{border-collapse:collapse;width:100%;margin:1rem 0}\n' +
    'th,td{border:1px solid #ddd;padding:.5rem;text-align:left}\n' +
    'th{background:#f8f8f8}\n' +
    'a{color:#6366f1}\n' +
    '<\/style>\n' +
    '<\/head>\n' +
    '<body>\n' +
    htmlBody + '\n' +
    '<\/body>\n' +
    '<\/html>';
}

/**
 * Triggers a file download.
 * @param {Blob} blob - The file blob.
 * @param {string} filename - The filename.
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
