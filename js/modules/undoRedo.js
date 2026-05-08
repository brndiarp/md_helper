/**
 * Undo/Redo module with stack management.
 */

const MAX_HISTORY = 50;

const undoStack = [];
const redoStack = [];
let isUndoing = false;

/**
 * Creates a state snapshot.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @returns {Object} The state object with text and cursor position.
 */
function createState(editor) {
  return {
    text: editor.value,
    cursor: editor.selectionStart,
  };
}

/**
 * Saves the current state to the undo stack.
 * @param {HTMLTextAreaElement} editor - The editor element.
 */
export function saveState(editor) {
  if (isUndoing) return;

  undoStack.push(createState(editor));
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }
  redoStack.length = 0;
}

/**
 * Performs an undo operation.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {Function} onUpdate - Callback to update preview and UI.
 * @returns {boolean} Whether the undo was successful.
 */
export function undo(editor, onUpdate) {
  if (undoStack.length === 0) return false;

  isUndoing = true;
  redoStack.push(createState(editor));

  const state = undoStack.pop();
  editor.value = state.text;
  editor.setSelectionRange(state.cursor, state.cursor);

  onUpdate();
  isUndoing = false;
  return true;
}

/**
 * Performs a redo operation.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {Function} onUpdate - Callback to update preview and UI.
 * @returns {boolean} Whether the redo was successful.
 */
export function redo(editor, onUpdate) {
  if (redoStack.length === 0) return false;

  isUndoing = true;
  undoStack.push(createState(editor));

  const state = redoStack.pop();
  editor.value = state.text;
  editor.setSelectionRange(state.cursor, state.cursor);

  onUpdate();
  isUndoing = false;
  return true;
}

/**
 * Checks if undo is available.
 * @returns {boolean}
 */
export function canUndo() {
  return undoStack.length > 0;
}

/**
 * Checks if redo is available.
 * @returns {boolean}
 */
export function canRedo() {
  return redoStack.length > 0;
}

/**
 * Clears both stacks (e.g., on init).
 */
export function clearStacks() {
  undoStack.length = 0;
  redoStack.length = 0;
}
