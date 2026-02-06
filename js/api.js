/**
 * MamaPlus - API Functions
 * Handles all API communications
 */

// ========================================
// TOKEN MANAGEMENT
// ========================================

let panelToken = null;

/**
 * Get token from URL parameters
 * @returns {string|null} The token if found
 */
function getTokenFromUrl() {
  const url = new URL(window.location.href);
  const q = url.searchParams.get('token');
  if (q) return q;

  if (window.location.hash && window.location.hash.includes('token=')) {
    const hash = window.location.hash.replace('#', '');
    const parts = new URLSearchParams(hash);
    return parts.get('token');
  }
  return null;
}

/**
 * Set the panel token
 * @param {string} token - The token to set
 */
function setToken(token) {
  panelToken = token;
  localStorage.setItem('panel_token', token);
}

/**
 * Get the current panel token
 * @returns {string|null} The current token
 */
function getToken() {
  return panelToken;
}

// ========================================
// CAREGIVER API FUNCTIONS
// ========================================

/**
 * Authenticate user with token
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The user object
 */
async function apiMe(token) {
  const url = `${API_ME}?token=${encodeURIComponent(token)}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.message || "Token inválido");
  return data.user;
}

/**
 * Get shifts for a specific week
 * @param {string} weekStartISO - The week start date in ISO format
 * @returns {Promise<Array>} Array of slots
 */
async function apiTurnos(weekStartISO) {
  const url = `${API_TURNOS}?token=${encodeURIComponent(panelToken)}&week_start=${encodeURIComponent(weekStartISO)}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.message || "Error cargando turnos");
  return data.slots || [];
}

/**
 * Save or update a shift
 * @param {Object} params - The shift parameters
 * @param {string} params.fecha - The date
 * @param {string} params.horaRango - The time range
 * @param {string} params.accion - The action (titular, suplente, cancelar, disponible)
 * @param {Function} onConflict - Callback for conflict resolution
 * @returns {Promise<Object>} The API response
 */
async function apiGuardarTurno({ fecha, horaRango, accion }, onConflict) {
  const { ini, fin } = splitHora(horaRango);
  const payload = {
    token: panelToken,
    fecha,
    hora_inicio: ini,
    hora_fin: fin,
    accion
  };

  const r = await fetch(API_GUARDAR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let data = null;
  try {
    data = await r.json();
  } catch {
    data = null;
  }

  if (r.status === 409) {
    const msg = data?.message || "Ese turno ya ha sido cogido por otra cuidadora. Puedes apuntarte como suplente.";
    if (onConflict) await onConflict();
    throw new Error(msg);
  }

  if (!r.ok || data?.ok === false) {
    const msg = data?.message || "Error guardando turno";
    throw new Error(msg);
  }

  return data;
}

// ========================================
// ADMIN API FUNCTIONS
// ========================================

/**
 * Get admin slots for a specific week
 * @param {string} token - The admin token
 * @param {string} weekStartISO - The week start date in ISO format
 * @returns {Promise<Array>} Array of slots
 */
async function apiAdminSlots(token, weekStartISO) {
  const url = `${API_ADMIN_SLOTS}?token=${encodeURIComponent(token)}&week_start=${encodeURIComponent(weekStartISO)}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.message || "Error cargando slots");
  return data.slots || [];
}
/**
 * Get worked hours for the current user
 * @returns {Promise<Object>} Object with hours data
 */
async function apiHorasTrabajadas() {
  const url = `${API_HORAS}?token=${encodeURIComponent(panelToken)}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.message || "Error cargando horas");
  return data.data || {};
}