/**
 * Main application entry point.
 * Initializes all modules and sets up event listeners.
 */

import { initMarked } from './modules/preview.js';
import { updatePreview } from './modules/preview.js';
import { saveState, undo, redo, canUndo, canRedo, clearStacks } from './modules/undoRedo.js';
import { insertMarkdown, insertLinePrefix, insertBlockLines } from './modules/editor.js';
import { findAll, findNext, replaceOne, replaceAll, getMatchInfo, clearFind } from './modules/findReplace.js';
import * as storage from './modules/storage.js';
import { initDragDrop } from './modules/dragDrop.js';
import { downloadMarkdown, exportHtml, copyToClipboard } from './modules/export.js';
import { showToast } from './modules/toast.js';
import { initLayout, applySplit } from './modules/layout.js';
import { initKeyboard } from './modules/keyboard.js';
import { decodeHtmlEntities } from './utils/helpers.js';

// ── Constants ──
const DEFAULT_CONTENT = `# Vítej v MD Helper

Toto je **živý náhled** tvého Markdownu. Začni psát vlevo nebo použij tlačítka v toolbaru.

## Co umí Markdown?

Formátování textu: **tučný text**, _kurzíva_, nebo obojí: _**tučná kurzíva**_.

### Seznamy

Odrážkový seznam:
- Jednoduchý na čtení
- Skvělý pro výčty
- Funguje i vnořeně

Číslovaný seznam:
1. Nejdřív tohle
2. Pak tohle
3. A nakonec tohle

### Checklist

- [ ] Naučit se Markdown
- [x] Otevřít MD Helper
- [ ] Napsat si vlastní poznámky

### Kód

Inline: \`npm install marked\`

\`\`\`
// blok kódu
function hello() {
  console.log("Ahoj, Markdown!");
}
\`\`\`

### Odkaz

Více info na [Markdown Guide](https://www.markdownguide.org).

### Tabulka

| Prvek     | Syntax       |
|-----------|--------------|
| Nadpis    | \`# text\`   |
| Tučný     | \`**text**\` |
| Odkaz     | \`[t](url)\` |

---

*Smaž tento obsah a začni psát vlastní poznámky!*
`;

// ── DOM References ──
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const filenameEl = document.getElementById('filename');
const mainLayout = document.getElementById('main-layout');
const resizeDivider = document.getElementById('resize-divider');
const dragOverlay = document.getElementById('drag-overlay');

// Buttons
const buttons = {
  undo: document.getElementById('btn-undo'),
  redo: document.getElementById('btn-redo'),
  copy: document.getElementById('btn-copy'),
  download: document.getElementById('btn-download'),
  exportHtml: document.getElementById('btn-export-html'),
  clear: document.getElementById('btn-clear-editor'),
  reset: document.getElementById('btn-reset'),
  split: document.getElementById('btn-view-split'),
  editor: document.getElementById('btn-view-editor'),
  preview: document.getElementById('btn-view-preview'),
};

// Find & Replace elements
const frDialog = document.getElementById('find-replace-dialog');
const frFind = document.getElementById('fr-find');
const frReplace = document.getElementById('fr-replace');
const frCount = document.getElementById('fr-count');

// ── State ──
let lastSavedInput = '';

// ── Initialization ──
function init() {
  initMarked();
  loadFromStorage();
  setupEventListeners();
  initLayout({
    mainLayout,
    resizeDivider,
    buttons: {
      split: buttons.split,
      editor: buttons.editor,
      preview: buttons.preview,
    },
  });
  initDragDrop({
    editor,
    overlay: dragOverlay,
    onFileLoad: (filename) => {
      if (filename) filenameEl.value = filename;
      updatePreview(editor, preview);
      saveToStorage();
    },
  });
  initKeyboard({
    editor,
    actions: {
      undo: handleUndo,
      redo: handleRedo,
      bold: () => insertMarkdown(editor, '**', '**', 'tučný text'),
      italic: () => insertMarkdown(editor, '_', '_', 'kurzíva'),
      link: () => insertMarkdown(editor, '[', '](https://)', 'text odkazu'),
      heading1: () => insertLinePrefix(editor, '# '),
      heading2: () => insertLinePrefix(editor, '## '),
      heading3: () => insertLinePrefix(editor, '### '),
      find: openFindReplace,
      findReplace: () => {
        openFindReplace();
        frReplace.focus();
      },
    },
  });

  updatePreview(editor, preview);
  updateUndoRedoButtons();
}

// ── Storage ──
function loadFromStorage() {
  const saved = storage.getItem(storage.KEYS.CONTENT);
  if (saved !== null) {
    editor.value = saved;
  } else {
    editor.value = DEFAULT_CONTENT;
  }

  const savedFilename = storage.getItem(storage.KEYS.FILENAME);
  if (savedFilename) filenameEl.value = savedFilename;

  clearStacks();
  lastSavedInput = editor.value;
}

function saveToStorage() {
  storage.setItem(storage.KEYS.CONTENT, editor.value);
  storage.setItem(storage.KEYS.FILENAME, filenameEl.value);
  storage.setItem(storage.KEYS.TIMESTAMP, Date.now().toString());
}

// ── Event Listeners ──
function setupEventListeners() {
  // Editor input with debounced save
  let inputTimeout;
  editor.addEventListener('input', () => {
    updatePreview(editor, preview);

    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
      if (editor.value !== lastSavedInput) {
        saveState(editor);
        lastSavedInput = editor.value;
        updateUndoRedoButtons();
      }
    }, 1500);
  });

  // Toolbar buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => handleToolbarAction(btn.dataset.action));
  });

  // Undo/Redo buttons
  buttons.undo.addEventListener('click', handleUndo);
  buttons.redo.addEventListener('click', handleRedo);

  // Action buttons
  buttons.copy.addEventListener('click', () => copyToClipboard(editor, buttons.copy));
  buttons.download.addEventListener('click', () => downloadMarkdown(editor, filenameEl.value));
  buttons.exportHtml.addEventListener('click', () => exportHtml(editor, filenameEl.value));
  buttons.clear.addEventListener('click', handleClear);
  buttons.reset.addEventListener('click', handleReset);

  // Filename
  filenameEl.addEventListener('input', saveToStorage);

  // Find & Replace
  setupFindReplaceListeners();

  // Cheat sheet copy
  document.querySelectorAll('.cheatsheet__syntax[data-copy]').forEach(el => {
    el.addEventListener('click', () => copyCheatSyntax(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyCheatSyntax(el);
      }
    });
  });

  // Before unload
  window.addEventListener('beforeunload', (e) => {
    if (editor.value.trim() !== '' && editor.value !== DEFAULT_CONTENT) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

// ── Toolbar Actions ──
function handleToolbarAction(action) {
  saveState(editor);

  switch (action) {
    case 'h1': insertLinePrefix(editor, '# '); break;
    case 'h2': insertLinePrefix(editor, '## '); break;
    case 'h3': insertLinePrefix(editor, '### '); break;
    case 'bold': insertMarkdown(editor, '**', '**', 'tučný text'); break;
    case 'italic': insertMarkdown(editor, '_', '_', 'kurzíva'); break;
    case 'bullet':
      insertBlockLines(editor, '- položka 1\n- položka 2\n- položka 3', '- ');
      break;
    case 'numbered':
      insertBlockLines(editor, '1. položka 1\n2. položka 2\n3. položka 3', '1. ');
      break;
    case 'checklist':
      insertBlockLines(editor, '- [ ] úkol 1\n- [ ] úkol 2\n- [ ] úkol 3', '- [ ]');
      break;
    case 'link': insertMarkdown(editor, '[', '](https://)', 'text odkazu'); break;
    case 'inlinecode': insertMarkdown(editor, '`', '`', 'kód'); break;
    case 'codeblock': insertMarkdown(editor, '```\n', '\n```', 'kód zde'); break;
    case 'table':
      insertMarkdown(editor, '', '', '| Sloupec 1 | Sloupec 2 | Sloupec 3 |\n|-----------|-----------|----------|\n| hodnota   | hodnota   | hodnota  |\n| hodnota   | hodnota   | hodnota  |\n');
      break;
  }

  updatePreview(editor, preview);
  updateUndoRedoButtons();
}

// ── Undo/Redo Handlers ──
function handleUndo() {
  if (undo(editor, () => {
    updatePreview(editor, preview);
    saveToStorage();
  })) {
    updateUndoRedoButtons();
  }
}

function handleRedo() {
  if (redo(editor, () => {
    updatePreview(editor, preview);
    saveToStorage();
  })) {
    updateUndoRedoButtons();
  }
}

function updateUndoRedoButtons() {
  buttons.undo.disabled = !canUndo();
  buttons.redo.disabled = !canRedo();
}

// ── Clear/Reset ──
function handleClear() {
  if (confirm('Opravdu chceš smazat celý obsah editoru?')) {
    saveState(editor);
    editor.value = '';
    updatePreview(editor, preview);
    saveToStorage();
    editor.focus();
    updateUndoRedoButtons();
  }
}

function handleReset() {
  if (confirm('Opravdu chceš smazat obsah editoru a obnovit výchozí text?')) {
    saveState(editor);
    editor.value = DEFAULT_CONTENT;
    updatePreview(editor, preview);
    saveToStorage();
    editor.focus();
    updateUndoRedoButtons();
  }
}

// ── Find & Replace ──
function setupFindReplaceListeners() {
  const frFindNext = document.getElementById('fr-find-next');
  const frReplaceOne = document.getElementById('fr-replace-one');
  const frReplaceAll = document.getElementById('fr-replace-all');
  const frClose = document.getElementById('fr-close');

  frFind.addEventListener('input', () => {
    findAll(editor, frFind.value);
    updateFindCount();
  });

  frFind.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      findNext(editor);
      updateFindCount();
    }
  });

  frReplace.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleReplaceOne();
    }
  });

  frFindNext.addEventListener('click', () => {
    findNext(editor);
    updateFindCount();
  });

  frReplaceOne.addEventListener('click', handleReplaceOne);
  frReplaceAll.addEventListener('click', handleReplaceAll);
  frClose.addEventListener('click', closeFindReplace);

  frDialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeFindReplace();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && frDialog.classList.contains('dialog--visible')) {
      closeFindReplace();
    }
  });
}

function openFindReplace() {
  frDialog.classList.add('dialog--visible');
  frFind.focus();
  frFind.select();
}

function closeFindReplace() {
  frDialog.classList.remove('dialog--visible');
  frCount.textContent = '';
  clearFind();
  editor.focus();
}

function updateFindCount() {
  const info = getMatchInfo();
  if (info.total > 0) {
    frCount.textContent = `${info.current} / ${info.total}`;
  } else if (info.total === 0 && lastFindQuery) {
    frCount.textContent = '0 / 0';
  } else {
    frCount.textContent = '';
  }
}

function handleReplaceOne() {
  saveState(editor);
  replaceOne(editor, frReplace.value, () => {
    updatePreview(editor, preview);
    saveToStorage();
  });
  updateFindCount();
}

function handleReplaceAll() {
  const query = frFind.value;
  if (!query || !query.trim()) return;

  saveState(editor);
  const count = replaceAll(editor, query, frReplace.value, () => {
    updatePreview(editor, preview);
    saveToStorage();
  });

  if (count > 0) {
    frCount.textContent = `Nahrazeno: ${count}`;
    showToast(`Nahrazeno ${count} výskytů`, 'success');
  } else {
    showToast('Nic k nahrazení', 'info');
  }
}

// ── Cheat Sheet ──
async function copyCheatSyntax(el) {
  const text = decodeHtmlEntities(el.dataset.copy);
  try {
    await navigator.clipboard.writeText(text);
    const orig = el.style.borderColor;
    el.style.borderColor = '#4f46e5';
    el.style.background = '#1e1b4b';
    setTimeout(() => {
      el.style.borderColor = orig;
      el.style.background = '';
    }, 800);
  } catch {
    // Silent failure
  }
}

// ── Start ──
init();
