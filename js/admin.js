/**
 * MamaPlus - Admin Panel Application
 * Main application logic for admin.html
 */

// ========================================
// STATE
// ========================================

let ADMIN_TOKEN = '';
let weekStart = startOfWeekMonday(new Date());
let slots = [];
let cuidadorasList = []; // Lista de cuidadoras para el selector
let allCaregivers = []; // Lista unificada para autocomplete

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
  const days = getLocalizedDays();
  const th = document.getElementById('thead');
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
    // Normalizar fecha (quitar T00:00:00.000Z) y horas (quitar :00 segundos)
    const fechaNorm = s.fecha.split('T')[0];
    const horaIniNorm = s.hora_inicio.substring(0, 5);
    const horaFinNorm = s.hora_fin.substring(0, 5);
    const key = `${fechaNorm}|${horaIniNorm}-${horaFinNorm}`;
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

        const freeLabel = t('free');
        const occupiedLabel = t('occupied');
        const noTitularLabel = t('noTitular');
        const suplShort = t('substitutesShort');

        div.innerHTML = `
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="px-1.5 py-0.5 rounded-md ${row.estado_slot === 'libre' ? 'bg-emerald-200/50 text-emerald-800' : 'bg-slate-200/50 text-slate-600'} text-[9px] font-bold uppercase">
              ${row.estado_slot === 'libre' ? freeLabel : occupiedLabel}
            </span>
            ${row.suplentes_count > 0 ? '<span class="text-amber-600"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></span>' : ''}
          </div>
          <div class="text-[11px] font-extrabold text-slate-900 truncate">${row.titular_nombre || noTitularLabel}</div>
          <div class="mt-1.5 flex items-center gap-1.5">
            <div class="flex -space-x-2">
              ${Array.from({ length: Math.min(row.suplentes_count, 3) }).map(() => `<div class="w-4 h-4 rounded-full border border-white bg-slate-300"></div>`).join('')}
            </div>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              ${row.suplentes_count > 0 ? `${row.suplentes_count} ${suplShort}` : ""}
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

let currentModalRow = null;
let lastLiberatedEmail = '';

function openModal(row) {
  currentModalRow = row;

  const fechaNorm = row.fecha.split('T')[0];
  const d = new Date(fechaNorm + "T00:00:00");
  document.getElementById('m-title').textContent = `${fmtLong.format(d)} - ${row.hora_inicio.substring(0,5)}-${row.hora_fin.substring(0,5)}`;
  document.getElementById('m-titular').textContent = row.titular_nombre || t('noAssignedCaregiver');
  document.getElementById('m-titular-sub').textContent = row.titular_email || t('noEmailRegistered');

  const suplentesNames = row.suplentes_count > 0 ? row.suplentes_nombres : t('noSubstitutesAssigned');
  document.getElementById('m-suplentes').textContent = suplentesNames;

  // Mostrar/ocultar botones según estado
  const btnLiberar = document.getElementById('btn-liberar');
  const btnPromover = document.getElementById('btn-promover');
  btnLiberar.style.display = row.estado_slot === 'ocupado' ? 'flex' : 'none';
  btnPromover.style.display = (row.suplentes_count > 0) ? 'flex' : 'none';

  // Texto del botón cerrar/abrir
  const btnCerrarTexto = document.getElementById('btn-cerrar-texto');
  if (row.estado_slot === 'cerrado') {
    btnCerrarTexto.textContent = t('openShift');
  } else {
    btnCerrarTexto.textContent = t('closeShiftBlock');
  }

  // Poblar selector de cuidadoras
  const selectEl = document.getElementById('select-cuidadora');
  selectEl.innerHTML = `<option value="">${t('selectCaregiverOption')}</option>` +
    cuidadorasList.map(c =>
      `<option value="${c.email}">${c.nombre} (${c.email})</option>`
    ).join('');
  // Pre-seleccionar email si acabamos de liberar un turno
  selectEl.value = lastLiberatedEmail || '';
  const msg = document.getElementById('m-action-msg');
  msg.classList.add('hidden');

  const m = document.getElementById('modal');
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function closeModal() {
  currentModalRow = null;
  const m = document.getElementById('modal');
  m.classList.add('hidden');
  m.classList.remove('flex');
}

// ========================================
// ADMIN ACTIONS
// ========================================

async function adminAction(accion) {
  if (!currentModalRow) return;

  const fechaNorm = currentModalRow.fecha.split('T')[0];
  const horaIni = currentModalRow.hora_inicio.substring(0, 5);
  const horaFin = currentModalRow.hora_fin.substring(0, 5);

  const body = {
    admin_token: ADMIN_TOKEN,
    fecha: fechaNorm,
    hora_inicio: horaIni,
    hora_fin: horaFin,
    accion: accion
  };

  // Guardar email antes de liberar para auto-completar después
  if (accion === 'liberar' && currentModalRow.titular_email) {
    lastLiberatedEmail = currentModalRow.titular_email;
  }

  if (accion === 'asignar') {
    const email = document.getElementById('select-cuidadora').value;
    if (!email) {
      showActionMsg(t('selectCaregiverFromList'), 'text-red-500');
      return;
    }
    body.cuidadora_email = email;
    // Limpiar el email guardado después de asignar
    lastLiberatedEmail = '';
  }

  showActionMsg(t('processing'), 'text-slate-500');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const r = await fetch(API_ADMIN_TURNO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await r.json();

    if (data.ok) {
      showActionMsg(data.mensaje || t('operationDone'), 'text-emerald-600');
      setTimeout(() => {
        closeModal();
        load();
      }, 1200);
    } else {
      showActionMsg(data.error || t('operationError'), 'text-red-500');
    }
  } catch (e) {
    console.error('Error admin action:', e);
    if (e.name === 'AbortError') {
      showActionMsg(t('timeoutError'), 'text-red-500');
    } else {
      showActionMsg(t('connectionError'), 'text-red-500');
    }
  }
}

async function adminToggleEstado() {
  if (!currentModalRow) return;

  const fechaNorm = currentModalRow.fecha.split('T')[0];
  const horaIni = currentModalRow.hora_inicio.substring(0, 5);
  const horaFin = currentModalRow.hora_fin.substring(0, 5);
  const nuevoEstado = currentModalRow.estado_slot === 'cerrado' ? 'abierto' : 'cerrado';

  showActionMsg(t('processing'), 'text-slate-500');

  try {
    const r = await fetch(API_ADMIN_TURNO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_token: ADMIN_TOKEN,
        fecha: fechaNorm,
        hora_inicio: horaIni,
        hora_fin: horaFin,
        accion: 'cambiar_estado',
        nuevo_estado: nuevoEstado
      })
    });
    const data = await r.json();

    if (data.ok) {
      showActionMsg(nuevoEstado === 'cerrado' ? t('shiftClosed') : t('shiftOpened'), 'text-emerald-600');
      setTimeout(() => {
        closeModal();
        load();
      }, 1200);
    } else {
      showActionMsg(data.error || t('operationError'), 'text-red-500');
    }
  } catch (e) {
    console.error('Error toggle estado:', e);
    showActionMsg(t('connectionError'), 'text-red-500');
  }
}

function showActionMsg(text, colorClass) {
  const msg = document.getElementById('m-action-msg');
  msg.textContent = text;
  msg.className = `text-center text-sm font-semibold ${colorClass}`;
  msg.classList.remove('hidden');
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const r = await fetch(`${API_ADMIN_SLOTS}?token=${encodeURIComponent(ADMIN_TOKEN)}&week_start=${encodeURIComponent(ws)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await r.json();
    if (!data.ok) {
      throw new Error(data.message);
    }
    slots = (data.slots || []).filter(s => s.fecha && s.hora_inicio);
    applyFilters();
  } catch (e) {
    console.error('Error cargando slots:', e);
    if (e.name === 'AbortError') {
      console.error('Timeout: el servidor tardó más de 15s en responder para slots');
    }
  }

  // Cargar horas de todas las cuidadoras y después construir lista de autocomplete
  await loadHorasCuidadoras();
  buildCaregiversList();
}

async function loadHorasCuidadoras() {
  const tbody = document.getElementById('tbody-horas');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const r = await fetch(`${API_ADMIN_HORAS}?token=${encodeURIComponent(ADMIN_TOKEN)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await r.json();

    if (!data.ok) {
      throw new Error(data.message || "Error cargando horas");
    }

    const cuidadoras = data.cuidadoras || [];
    cuidadorasList = cuidadoras; // Guardar para el selector del modal

    if (cuidadoras.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="p-8 text-center text-slate-400">
            ${t('noHoursData')}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = cuidadoras.map(c => `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
        <td class="p-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              ${(c.nombre || '?')[0].toUpperCase()}
            </div>
            <span class="font-semibold text-slate-900">${c.nombre || '—'}</span>
          </div>
        </td>
        <td class="p-4 text-sm text-slate-500">${c.email || '—'}</td>
        <td class="p-4 text-center">
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">
            ${c.horas_trabajadas || 0}h
          </span>
        </td>
        <td class="p-4 text-center">
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-bold text-sm">
            ${c.horas_pendientes || 0}h
          </span>
        </td>
        <td class="p-4 text-center font-semibold text-slate-600">${c.turnos_completados || 0}</td>
        <td class="p-4 text-center font-semibold text-slate-600">${c.turnos_pendientes || 0}</td>
      </tr>
    `).join('');

  } catch (e) {
    console.error('Error cargando horas:', e);
    const errorMsg = e.name === 'AbortError'
      ? t('timeoutError')
      : `${t('operationError')}: ${e.message}`;
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-red-500">
          ${errorMsg}
        </td>
      </tr>
    `;
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
// AUTOCOMPLETE
// ========================================

function buildCaregiversList() {
  const namesMap = new Map();

  // 1. Add from cuidadorasList (API_ADMIN_HORAS - tabla cuidadora_usuarios)
  for (const c of cuidadorasList) {
    if (c.nombre) {
      namesMap.set(c.nombre.trim().toLowerCase(), {
        nombre: c.nombre.trim(),
        email: (c.email || '').trim()
      });
    }
  }

  // 2. Add from slots (titulares y suplentes - incluye quienes se asignaron desde admin)
  for (const s of slots) {
    const titName = (s.titular_nombre || '').trim();
    if (titName && !namesMap.has(titName.toLowerCase())) {
      namesMap.set(titName.toLowerCase(), {
        nombre: titName,
        email: (s.titular_email || '').trim()
      });
    }

    // Suplentes
    if (s.suplentes_nombres) {
      for (const name of s.suplentes_nombres.split(',')) {
        const trimmed = name.trim();
        if (trimmed && !namesMap.has(trimmed.toLowerCase())) {
          namesMap.set(trimmed.toLowerCase(), { nombre: trimmed, email: '' });
        }
      }
    }
  }

  allCaregivers = Array.from(namesMap.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, getCurrentLang() === 'de' ? 'de' : 'es')
  );
}

function showDropdown(matches) {
  const dropdown = document.getElementById('q-dropdown');
  const input = document.getElementById('q');

  if (matches.length === 0) {
    dropdown.classList.add('hidden');
    return;
  }

  const closeLabel = t('close');
  const noEmailLabel = t('noEmailShort');

  dropdown.innerHTML = `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between">
      <span class="text-xs font-bold uppercase tracking-widest text-slate-400">${matches.length} ${t('caregiverFound')}</span>
      <button type="button" id="q-dropdown-close" class="text-slate-400 hover:text-slate-600 text-sm font-semibold">${closeLabel}</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 p-3">
      ${matches.map(c => `
        <button type="button" class="text-left px-4 py-3.5 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-4"
                data-name="${c.nombre}">
          <div class="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
            ${(c.nombre || '?')[0].toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-slate-900 text-[15px] leading-tight">${c.nombre}</div>
            ${c.email ? `<div class="text-sm text-slate-400 mt-0.5">${c.email}</div>` : `<div class="text-sm text-slate-300 mt-0.5 italic">${noEmailLabel}</div>`}
          </div>
        </button>
      `).join('')}
    </div>
  `;

  dropdown.classList.remove('hidden');

  document.getElementById('q-dropdown-close').onclick = () => {
    dropdown.classList.add('hidden');
  };

  dropdown.querySelectorAll('button[data-name]').forEach(btn => {
    btn.onclick = () => {
      input.value = btn.dataset.name;
      dropdown.classList.add('hidden');
      applyFilters();
    };
  });
}

function initAutocomplete() {
  const input = document.getElementById('q');
  const dropdown = document.getElementById('q-dropdown');

  input.addEventListener('input', () => {
    const val = input.value.toLowerCase().trim();
    if (!val) {
      dropdown.classList.add('hidden');
      return;
    }

    const matches = allCaregivers.filter(c =>
      (c.nombre || '').toLowerCase().includes(val) ||
      (c.email || '').toLowerCase().includes(val)
    );

    showDropdown(matches);
  });

  // Show all caregivers on focus when input is empty
  input.addEventListener('focus', () => {
    if (!input.value.trim() && allCaregivers.length > 0) {
      showDropdown(allCaregivers);
    } else if (input.value.trim()) {
      input.dispatchEvent(new Event('input'));
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#q') && !e.target.closest('#q-dropdown')) {
      dropdown.classList.add('hidden');
    }
  });
}

// ========================================
// LANGUAGE CHANGE HANDLER
// ========================================

function onAdminLanguageChanged() {
  // Re-render the table and header with new language
  setRange();
  header();
  applyFilters();
}

window.addEventListener('languageChanged', onAdminLanguageChanged);

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
}

// ========================================
// INITIALIZATION
// ========================================

function initAdminApp() {
  initAdminToken();
  initEventHandlers();
  initAutocomplete();
  load();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initAdminApp);
