/**
 * MamaPlus - Utilities
 * Shared utility functions for date handling, UI helpers, and formatters
 */

// ========================================
// DATE UTILITIES
// ========================================

/**
 * Get the Monday of the week for a given date
 * @param {Date} date - The reference date
 * @returns {Date} The Monday of that week
 */
function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Add days to a date
 * @param {Date} date - The base date
 * @param {number} n - Number of days to add
 * @returns {Date} The new date
 */
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 * @param {Date} date - The date to format
 * @returns {string} ISO formatted date
 */
function isoDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ========================================
// DATE FORMATTERS
// ========================================

// Short format: "25 ene"
const fmtShort = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' });

// Long format: "lunes, 25 de enero"
const fmtLong = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'long' });

/**
 * Format a week range as a readable string
 * @param {Date} startMonday - The Monday of the week
 * @returns {string} Formatted range "25 ene — 31 ene"
 */
function formatWeekRange(startMonday) {
  const start = startMonday;
  const end = addDays(startMonday, 6);
  const s = fmtShort.format(start).replace('.', '');
  const e = fmtShort.format(end).replace('.', '');
  return `${s} — ${e}`;
}

// ========================================
// UI HELPERS
// ========================================

/**
 * Show a toast notification
 * @param {string} msg - The message to display
 */
function toast(msg) {
  const t = document.getElementById('toast');
  const inner = document.getElementById('toast-inner');
  if (!t || !inner) return;

  inner.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}

/**
 * Split a time range into start and end times
 * @param {string} horaRango - Time range "10:00-11:00"
 * @returns {Object} Object with ini and fin properties
 */
function splitHora(horaRango) {
  const [ini, fin] = horaRango.split('-');
  return { ini, fin };
}
