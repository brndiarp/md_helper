/**
 * Keyboard shortcuts module.
 */

/**
 * Initializes keyboard shortcuts.
 * @param {Object} options - Configuration options.
 * @param {HTMLTextAreaElement} options.editor - The editor element.
 * @param {Object} options.actions - Action callbacks.
 */
export function initKeyboard({ editor, actions }) {
  editor.addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    switch (e.key.toLowerCase()) {
      case 'z':
        e.preventDefault();
        if (e.shiftKey) {
          actions.redo();
        } else {
          actions.undo();
        }
        break;
      case 'y':
        e.preventDefault();
        actions.redo();
        break;
      case 'b':
        e.preventDefault();
        actions.bold();
        break;
      case 'i':
        e.preventDefault();
        actions.italic();
        break;
      case 'k':
        e.preventDefault();
        actions.link();
        break;
      case '1':
        e.preventDefault();
        actions.heading1();
        break;
      case '2':
        e.preventDefault();
        actions.heading2();
        break;
      case '3':
        e.preventDefault();
        actions.heading3();
        break;
      case 'f':
        e.preventDefault();
        actions.find();
        break;
      case 'h':
        e.preventDefault();
        actions.findReplace();
        break;
    }
  });
}
