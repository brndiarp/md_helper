/**
 * Storage module - handles localStorage with sessionStorage fallback.
 */

const PREFIX = 'md-helper';

/**
 * Gets an item from storage (localStorage first, then sessionStorage).
 * @param {string} key - The storage key.
 * @returns {string|null} The stored value or null.
 */
export function getItem(key) {
  const fullKey = `${PREFIX}-${key}`;
  try {
    const local = localStorage.getItem(fullKey);
    if (local !== null) return local;
  } catch (e) {
    // localStorage unavailable
  }
  try {
    return sessionStorage.getItem(fullKey);
  } catch (e) {
    // sessionStorage unavailable
  }
  return null;
}

/**
 * Sets an item in storage (localStorage first, then sessionStorage fallback).
 * @param {string} key - The storage key.
 * @param {string} value - The value to store.
 */
export function setItem(key, value) {
  const fullKey = `${PREFIX}-${key}`;
  try {
    localStorage.setItem(fullKey, value);
  } catch (e) {
    try {
      sessionStorage.setItem(fullKey, value);
    } catch (e2) {
      // Both unavailable
    }
  }
}

/**
 * Storage keys used by the application.
 */
export const KEYS = {
  CONTENT: 'content',
  FILENAME: 'filename',
  TIMESTAMP: 'timestamp',
  SPLIT: 'split',
  DIVIDER_WIDTH: 'divider-width',
};
