/**
 * MamaPlus - Constants
 * API endpoints, configurations, and shared constants
 * NOTA: API_BASE se define en config.js
 */

// API Endpoints (usan API_BASE de config.js)
const API_ME = `${API_BASE}/webhook/api/me`;
const API_TURNOS = `${API_BASE}/webhook/api/turnos`;
const API_GUARDAR = `${API_BASE}/webhook/api/turno`;
const API_ADMIN_SLOTS = `${API_BASE}/webhook/api/admin/slots`;
const API_HORAS = `${API_BASE}/webhook/api/horas`;
const API_ADMIN_HORAS = `${API_BASE}/webhook/api/admin/horas`;
const API_ADMIN_TURNO = `${API_BASE}/webhook/api/admin/turno`;

// Time slots
const HORAS = [
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00"
];

// Hours array for admin (start-end pairs)
const HOURS_PAIRS = [
  ["10:00", "11:00"],
  ["11:00", "12:00"],
  ["12:00", "13:00"],
  ["13:00", "14:00"],
  ["14:00", "15:00"],
  ["15:00", "16:00"],
  ["16:00", "17:00"],
  ["17:00", "18:00"]
];

// Days of the week
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Status configurations for caregiver panel
const STATUS_CONFIG = {
  titular_mio:  { texto: 'Titular (tú)',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', emoji: '✅' },
  titular_otro: { texto: 'Ocupado',        bg: 'bg-slate-100 text-slate-500 border-slate-200',       emoji: '🔒' },
  suplente_mio: { texto: 'Suplente (tú)',  bg: 'bg-amber-50 text-amber-700 border-amber-100',         emoji: '🙋‍♀️' },
  disponible:   { texto: 'Disponible',     bg: 'bg-white/60 text-slate-400 border-orange-100/50',     emoji: '🔄' }
};
