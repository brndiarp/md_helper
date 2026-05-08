/**
 * Editor module - text manipulation and toolbar actions.
 */

/**
 * Inserts markdown around selected text or at cursor.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} before - Text to insert before selection.
 * @param {string} [after=''] - Text to insert after selection.
 * @param {string} [placeholder=''] - Placeholder if no selection.
 */
export function insertMarkdown(editor, before, after = '', placeholder = '') {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const value = editor.value;
  const selected = value.slice(start, end);

  const inserted = selected.length > 0
    ? before + selected + after
    : before + placeholder + after;

  editor.value = value.slice(0, start) + inserted + value.slice(end);

  const cursorPos = selected.length > 0
    ? start + inserted.length
    : start + before.length + placeholder.length;

  editor.focus();
  editor.setSelectionRange(cursorPos, cursorPos);
}

/**
 * Toggles a line prefix (e.g., # for headings).
 * If line already starts with prefix, adds new line with prefix.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} prefix - The prefix to toggle.
 */
export function insertLinePrefix(editor, prefix) {
  const start = editor.selectionStart;
  const value = editor.value;

  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', start);
  const line = value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);

  // If line already starts with this prefix, add new line with prefix
  if (line.startsWith(prefix) && line.trim() === prefix.trim()) {
    const newLine = '\n' + prefix;
    const before = value.slice(0, lineEnd === -1 ? value.length : lineEnd);
    const after = lineEnd === -1 ? '' : value.slice(lineEnd);
    editor.value = before + newLine + after;

    const newCursor = lineEnd === -1 ? value.length + 1 + prefix.length : lineEnd + 1 + prefix.length;
    editor.focus();
    editor.setSelectionRange(newCursor, newCursor);
    return;
  }

  let newLine;
  let cursorOffset;

  if (line.startsWith(prefix)) {
    newLine = line.slice(prefix.length);
    cursorOffset = 0;
  } else {
    newLine = prefix + line.replace(/^#{1,6}\s*/, '');
    cursorOffset = prefix.length;
  }

  const before = value.slice(0, lineStart);
  const after = lineEnd === -1 ? '' : value.slice(lineEnd);
  editor.value = before + newLine + after;

  const newCursor = lineStart + cursorOffset;
  editor.focus();
  editor.setSelectionRange(newCursor, newCursor);
}

/**
 * Inserts multi-line markdown blocks (3 lines at a time).
 * Each click adds another 3 lines.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} template - The template with placeholders.
 * @param {string} prefix - Line prefix to detect existing block.
 */
export function insertBlockLines(editor, template, prefix) {
  const start = editor.selectionStart;
  const value = editor.value;

  // Check if we're already at the end of an existing block with same prefix
  const beforeCursor = value.slice(0, start);
  const lines = beforeCursor.split('\n');
  const lastLine = lines[lines.length - 1];

  // If last line starts with prefix, we're in an existing block - add 3 more lines
  if (lastLine.trim().startsWith(prefix.trim())) {
    const blockLines = template.split('\n');
    const newBlock = '\n' + blockLines.join('\n');

    editor.value = beforeCursor + newBlock + value.slice(start);
    const newCursor = start + newBlock.length;
    editor.focus();
    editor.setSelectionRange(newCursor, newCursor);
    return;
  }

  // First insertion - add template at cursor
  editor.value = beforeCursor + template + value.slice(start);
  const newCursor = start + template.length;
  editor.focus();
  editor.setSelectionRange(newCursor, newCursor);
}
