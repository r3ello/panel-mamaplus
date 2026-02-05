/**
 * MamaPlus - Admin Panel Application
 * Main application logic for admin.html
 */

// ========================================
// STATE
// ========================================

let ADMIN_TOKEN = 'mlzsieqg2xqup7dnqxgyk5jo-5766539936-ml68f7ix';
let weekStart = startOfWeekMonday(new Date());
let slots = [];

// ========================================
// INITIALIZATION
// ========================================

function initAdminToken() {
  const url = new URL(location.href);
  ADMIN_TOKEN = url.searchParams.get('token') || localStorage.getItem('admin_token') || "";
}

// ========================================
// UI HELPERS
// ========================================

function setRange() {
  const end = addDays(weekStart, 6);
  document.getElementById('range').textContent = `${fmtShort.format(weekStart).replace('.', '')} — ${fmtShort.format(end).replace('.', '')}`;
}

function header() {
  const th = document.getElementById('thead');
  const days = getLocalizedDays();
  th.innerHTML = `<th class="sticky-col border-b border-slate-200 p-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">${t('schedule')}</th>` +
    days.map((n, i) => {
      const d = addDays(weekStart, i);
      const isToday = isoDate(new Date()) === isoDate(d);
      return `<th class="border-b border-slate-200 p-5 font-bold ${isToday ? 'bg-emerald-50/50' : ''}">
        <div class="text-slate-900">${n}</div>
        <div class="text-[11px] text-slate-400 mt-0.5">${fmtShort.format(d).replace('.', '')}</div>
        ${isToday ? '<div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto mt-2"></div>' : ''}
      </th>`;
    }).join('');
}

function getPillStyles(row, isHighlighted) {
  const highlightClass = isHighlighted ? "ring-4 ring-indigo-500/30 scale-[1.03] shadow-md z-10" : "";

  if (row.estado_slot === 'libre')
    return `bg-emerald-50 text-emerald-800 border-emerald-100 ${highlightClass}`;
  if (row.suplentes_count > 0)
    return `bg-amber-50 text-amber-900 border-amber-200 ${highlightClass}`;

  return `bg-white text-slate-700 border-slate-200 ${highlightClass}`;
}

// ========================================
// RENDER TABLE
// ========================================

function render(filteredList = null) {
  const listToUse = filteredList || slots;
  const tb = document.getElementById('tbody');
  tb.innerHTML = "";

  const q = (document.getElementById('q').value || "").toLowerCase().trim();

  const map = new Map();
  for (const s of listToUse) {
    const key = `${s.fecha}|${s.hora_inicio}-${s.hora_fin}`;
    map.set(key, s);
  }

  for (const [h1, h2] of HOURS_PAIRS) {
    const tr = document.createElement('tr');
    tr.className = "group hover:bg-slate-50/30 transition-colors";

    const left = document.createElement('td');
    left.className = "sticky-col border-b border-slate-100 p-5 text-xs font-bold text-slate-500 tabular-nums";
    left.textContent = `${h1} - ${h2}`;
    tr.appendChild(left);

    for (let i = 0; i < 7; i++) {
      const d = addDays(weekStart, i);
      const fecha = isoDate(d);
      const key = `${fecha}|${h1}-${h2}`;
      const row = map.get(key);

      const td = document.createElement('td');
      td.className = "border-b border-slate-100 p-2.5 min-w-[140px]";

      if (row) {
        // Check if this slot matches the search query for highlighting
        const matchesQuery = q && (
          (row.titular_nombre || "").toLowerCase().includes(q) ||
          (row.suplentes_nombres || "").toLowerCase().includes(q)
        );

        const div = document.createElement('button');
        div.className = `w-full text-left rounded-2xl border p-3.5 slot-transition font-semibold text-xs relative ${getPillStyles(row, matchesQuery)}`;

        div.innerHTML = `
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="px-1.5 py-0.5 rounded-md ${row.estado_slot === 'libre' ? 'bg-emerald-200/50 text-emerald-800' : 'bg-slate-200/50 text-slate-600'} text-[9px] font-bold uppercase">
              ${row.estado_slot === 'libre' ? t('free') : t('occupied')}
            </span>
            ${row.suplentes_count > 0 ? '<span class="text-amber-600"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></span>' : ''}
          </div>
          <div class="text-[11px] font-extrabold text-slate-900 truncate">${row.titular_nombre || t('noTitular')}</div>
          <div class="mt-1.5 flex items-center gap-1.5">
            <div class="flex -space-x-2">
              ${Array.from({ length: Math.min(row.suplentes_count, 3) }).map(() => `<div class="w-4 h-4 rounded-full border border-white bg-slate-300"></div>`).join('')}
            </div>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              ${row.suplentes_count > 0 ? `${row.suplentes_count} ${t('substitutesShort')}` : ""}
            </span>
          </div>
        `;

        div.onclick = () => openModal(row);
        td.appendChild(div);
      } else {
        td.innerHTML = `<div class="w-full h-20 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
          <span class="text-[10px] text-slate-300 font-bold uppercase tracking-widest">${t('empty')}</span>
        </div>`;
      }
      tr.appendChild(td);
    }
    tb.appendChild(tr);
  }
}

// ========================================
// MODAL
// ========================================

let currentSlot = null; // Store current slot for admin actions

function openModal(row) {
  currentSlot = row; // Save for admin actions

  const d = new Date(row.fecha + "T00:00:00");
  document.getElementById('m-title').textContent = `${fmtLong.format(d)} - ${row.hora_inicio}-${row.hora_fin}`;
  document.getElementById('m-titular').textContent = row.titular_nombre || t('noAssignedCaregiver');
  document.getElementById('m-titular-sub').textContent = row.titular_email || t('noEmailRegistered');

  const suplentesNames = row.suplentes_count > 0 ? row.suplentes_nombres : t('noSubstitutesAssigned');
  document.getElementById('m-suplentes').textContent = suplentesNames;

  // Update admin button states
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnPromover = document.getElementById('btn-promover');

  // Disable cancel if no titular
  btnCancelar.disabled = !row.titular_email;

  // Disable promote if no substitutes
  btnPromover.disabled = row.suplentes_count === 0;

  const m = document.getElementById('modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function closeModal() {
  const m = document.getElementById('modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
}

// ========================================
// MODAL ASIGNAR CUIDADORA
// ========================================

function mostrarModalAsignar() {
  if (!currentSlot) return;

  const d = new Date(currentSlot.fecha + "T00:00:00");
  document.getElementById('asignar-turno-info').textContent =
    `${fmtLong.format(d)} - ${currentSlot.hora_inicio}-${currentSlot.hora_fin}`;
  document.getElementById('input-cuidadora-email').value = '';

  const m = document.getElementById('modalAsignar');
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function cerrarModalAsignar() {
  const m = document.getElementById('modalAsignar');
  m.classList.add('hidden');
  m.classList.remove('flex');
}

function confirmarAsignacion() {
  const email = document.getElementById('input-cuidadora-email').value.trim();
  if (!email) {
    alert(t('enterEmail') || 'Por favor ingresa un email');
    return;
  }
  if (!currentSlot) return;

  asignarCuidadora(currentSlot.fecha, currentSlot.hora_inicio, currentSlot.hora_fin, email);
  cerrarModalAsignar();
}

// ========================================
// DATA LOADING
// ========================================

async function load() {
  if (!ADMIN_TOKEN) {
    alert(t('missingAdminToken'));
    return;
  }
  localStorage.setItem('admin_token', ADMIN_TOKEN);

  setRange();
  header();

  try {
    const ws = isoDate(weekStart);
    const r = await fetch(`${API_ADMIN_SLOTS}?token=${encodeURIComponent(ADMIN_TOKEN)}&week_start=${encodeURIComponent(ws)}`);
    const data = await r.json();
    if (!data.ok) {
      throw new Error(data.message);
    }
    slots = data.slots;
    applyFilters();
  } catch (e) {
    console.error(e);
  }
}

// ========================================
// FILTERS
// ========================================

function applyFilters() {
  const q = (document.getElementById('q').value || "").toLowerCase().trim();
  const f = document.getElementById('filter').value;

  let filtered = slots.slice();

  // Filter by status
  if (f === 'libre') filtered = filtered.filter(s => s.estado_slot === 'libre');
  if (f === 'ocupado') filtered = filtered.filter(s => s.estado_slot === 'ocupado');
  if (f === 'suplentes') filtered = filtered.filter(s => (s.suplentes_count || 0) > 0);

  // Filter by name (Titular OR Suplentes)
  if (q) {
    filtered = filtered.filter(s =>
      (s.titular_nombre || "").toLowerCase().includes(q) ||
      (s.suplentes_nombres || "").toLowerCase().includes(q)
    );
  }

  render(filtered);
}

// ========================================
// EVENT HANDLERS
// ========================================

function initEventHandlers() {
  document.getElementById('m-close').onclick = closeModal;
  document.getElementById('m-close-top').onclick = closeModal;
  document.getElementById('apply').onclick = applyFilters;
  document.getElementById('q').onkeyup = (e) => e.key === 'Enter' && applyFilters();
  document.getElementById('prev').onclick = () => {
    weekStart = addDays(weekStart, -7);
    load();
  };
  document.getElementById('next').onclick = () => {
    weekStart = addDays(weekStart, 7);
    load();
  };

  // Admin action buttons
  document.getElementById('btn-cancelar').onclick = () => {
    if (currentSlot) {
      liberarTurno(currentSlot.fecha, currentSlot.hora_inicio, currentSlot.hora_fin);
    }
  };
  document.getElementById('btn-cambiar').onclick = mostrarModalAsignar;
  document.getElementById('btn-promover').onclick = () => {
    if (currentSlot) {
      promoverSuplente(currentSlot.fecha, currentSlot.hora_inicio, currentSlot.hora_fin);
    }
  };

  // Modal asignar cuidadora
  document.getElementById('btn-confirmar-asignacion').onclick = confirmarAsignacion;
  document.getElementById('btn-cancelar-asignacion').onclick = cerrarModalAsignar;
}

// ========================================
// INITIALIZATION
// ========================================

function initAdminApp() {
  initAdminToken();
  initEventHandlers();
  load();

  // Listen for language changes to refresh dynamic content
  window.addEventListener('languageChanged', () => {
    // Update select options text
    updateAdminSelectOptions();
    // Reload the view
    if (ADMIN_TOKEN) {
      header();
      render();
    }
  });
}

function updateAdminSelectOptions() {
  // Update filter select options
  const filterSelect = document.getElementById('filter');
  if (filterSelect) {
    filterSelect.querySelectorAll('option').forEach(opt => {
      const key = opt.getAttribute('data-i18n');
      if (key) opt.textContent = t(key);
    });
  }
}

async function liberarTurno(fecha, horaInicio, horaFin) {
  if (!confirm(t('confirmCancelShift') || '¿Cancelar este turno y dejarlo disponible?')) return;

  try {
    const response = await fetch(API_ADMIN_TURNO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_token: ADMIN_TOKEN,
        fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        accion: 'liberar'
      })
    });

    const result = await response.json();
    if (result.ok) {
      alert(t('shiftReleasedSuccess') || '✅ Turno liberado correctamente');
      closeModal();
      load();
    } else {
      alert('❌ Error: ' + (result.error || result.message || 'No se pudo liberar'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

async function asignarCuidadora(fecha, horaInicio, horaFin, emailCuidadora) {
  if (!confirm(`${t('confirmAssignCaregiver') || '¿Asignar a'} ${emailCuidadora}?`)) return;

  try {
    const response = await fetch(API_ADMIN_TURNO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_token: ADMIN_TOKEN,
        fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        accion: 'asignar',
        cuidadora_email: emailCuidadora
      })
    });

    const result = await response.json();
    if (result.ok) {
      alert(t('caregiverAssignedSuccess') || '✅ Cuidadora asignada correctamente');
      closeModal();
      load();
    } else {
      alert('❌ Error: ' + (result.error || result.message || 'No se pudo asignar'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

async function promoverSuplente(fecha, horaInicio, horaFin) {
  if (!confirm(t('confirmPromoteSubstitute') || '¿Promover la primera suplente a titular?')) return;

  try {
    const response = await fetch(API_ADMIN_TURNO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_token: ADMIN_TOKEN,
        fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        accion: 'promover'
      })
    });

    const result = await response.json();
    if (result.ok) {
      alert(t('substitutePromotedSuccess') || '✅ Suplente promovida a titular');
      closeModal();
      load();
    } else {
      alert('❌ Error: ' + (result.error || result.message || 'No se pudo promover'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initAdminApp);
