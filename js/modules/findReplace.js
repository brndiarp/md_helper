/**
 * Find & Replace module.
 */

import { escapeRegExp } from '../utils/helpers.js';

let findMatches = [];
let findIndex = -1;
let lastFindQuery = '';

/**
 * Finds all matches of a query in the editor text.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} query - The search query.
 * @returns {Array} Array of match objects with start and end positions.
 */
export function findAll(editor, query) {
  findMatches = [];
  findIndex = -1;
  lastFindQuery = query;

  if (!query || !query.trim()) {
    return findMatches;
  }

  const text = editor.value;
  try {
    const regex = new RegExp(escapeRegExp(query), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      findMatches.push({ start: match.index, end: match.index + match[0].length });
    }
    if (findMatches.length > 0) {
      findIndex = 0;
      selectMatch(editor, 0);
    }
  } catch (e) {
    // Invalid regex, ignore
  }

  return findMatches;
}

/**
 * Selects a match in the editor.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {number} idx - The match index.
 */
export function selectMatch(editor, idx) {
  if (idx < 0 || idx >= findMatches.length) return;
  findIndex = idx;
  const m = findMatches[idx];
  editor.focus();
  editor.setSelectionRange(m.start, m.end);
}

/**
 * Moves to the next match.
 * @param {HTMLTextAreaElement} editor - The editor element.
 */
export function findNext(editor) {
  if (findMatches.length === 0) return;
  const next = (findIndex + 1) % findMatches.length;
  selectMatch(editor, next);
}

/**
 * Replaces the current match.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} replaceText - The replacement text.
 * @param {Function} onUpdate - Callback after replacement.
 */
export function replaceOne(editor, replaceText, onUpdate) {
  if (findMatches.length === 0 || findIndex < 0) return;

  const m = findMatches[findIndex];
  const before = editor.value.slice(0, m.start);
  const after = editor.value.slice(m.end);

  editor.value = before + replaceText + after;

  // Recalculate all matches
  findAll(editor, lastFindQuery);

  // Set index to nearest match after replacement
  if (findMatches.length > 0) {
    const newIndex = findMatches.findIndex(match => match.start >= m.start + replaceText.length);
    findIndex = newIndex >= 0 ? newIndex : 0;
    selectMatch(editor, findIndex);
  }

  onUpdate();
}

/**
 * Replaces all matches.
 * @param {HTMLTextAreaElement} editor - The editor element.
 * @param {string} query - The search query.
 * @param {string} replaceText - The replacement text.
 * @param {Function} onUpdate - Callback after replacement.
 * @returns {number} Number of replacements made.
 */
export function replaceAll(editor, query, replaceText, onUpdate) {
  if (!query || !query.trim()) return 0;

  const regex = new RegExp(escapeRegExp(query), 'gi');
  const count = (editor.value.match(regex) || []).length;

  editor.value = editor.value.replace(regex, replaceText);
  findMatches = [];
  findIndex = -1;

  onUpdate();
  return count;
}

/**
 * Gets the current match count info.
 * @returns {Object} Object with current index and total matches.
 */
export function getMatchInfo() {
  if (findMatches.length > 0) {
    return { current: findIndex + 1, total: findMatches.length };
  } else if (lastFindQuery) {
    return { current: 0, total: 0 };
  }
  return { current: 0, total: 0 };
}

/**
 * Clears all find state.
 */
export function clearFind() {
  findMatches = [];
  findIndex = -1;
  lastFindQuery = '';
}
