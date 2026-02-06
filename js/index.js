/**
 * MamaPlus - Caregiver Panel Application
 * Main application logic for index.html
 */

// ========================================
// STATE
// ========================================

let currentTab = 'dashboard';
let celdaSeleccionada = null;
let currentUser = null;
let slotsMap = new Map(); // key `${fecha}|${hora}` -> status
let slotsList = [];       // array of slots
let currentWeekStart = startOfWeekMonday(new Date());

// ========================================
// UI HELPERS - LOGIN
// ========================================

function showLogin(show = true, errorMsg = "") {
  const overlay = document.getElementById('login-overlay');
  const err = document.getElementById('login-error');
  if (show) {
    overlay.classList.remove('hidden');
    if (errorMsg) {
      err.textContent = errorMsg;
      err.classList.remove('hidden');
    } else {
      err.classList.add('hidden');
    }
  } else {
    overlay.classList.add('hidden');
    err.classList.add('hidden');
  }
}

function logout() {
  localStorage.removeItem('panel_token');
  panelToken = null;
  currentUser = null;
  showLogin(true, "Has cerrado sesión. Introduce tu token para entrar.");
}

// ========================================
// MOBILE SIDEBAR
// ========================================

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btnMenu = document.getElementById('btn-menu');
  const backdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }

  btnMenu?.addEventListener('click', () => {
    if (sidebar.classList.contains('-translate-x-full')) openSidebar();
    else closeSidebar();
  });

  backdrop?.addEventListener('click', closeSidebar);

  // Expose closeSidebar globally
  window.closeSidebar = closeSidebar;
}

// ========================================
// WEEK NAVIGATION
// ========================================

function buildDayHeadersHTML() {
  return DIAS.map((name, i) => {
    const d = addDays(currentWeekStart, i);
    const isWeekend = i >= 5;
    return `
      <th class="border-b border-orange-200/30 p-4 font-bold text-slate-700 ${isWeekend ? 'text-orange-600' : ''}">
        <div class="leading-tight">${name}</div>
        <div class="text-xs font-extrabold text-slate-400 mt-1">${fmtShort.format(d).replace('.', '')}</div>
      </th>
    `;
  }).join('');
}

function setWeek(newWeekStart) {
  currentWeekStart = startOfWeekMonday(newWeekStart);
  if (currentTab === 'dashboard') renderDashboard();
  if (currentTab === 'suplencias') renderSuplencias();
  if (currentTab === 'disponibilidad') renderDisponibilidad();
  lucide.createIcons();
}

// ========================================
// DATA REFRESH
// ========================================

async function refreshWeekData() {
  const weekISO = isoDate(currentWeekStart);
  const slots = await apiTurnos(weekISO);

  slotsList = slots;
  slotsMap = new Map();

  for (const s of slots) {
    const hora = `${s.hora_inicio}-${s.hora_fin}`;
    const key = `${s.fecha}|${hora}`;
    slotsMap.set(key, s.status);
  }
}

// ========================================
// TABS NAVIGATION
// ========================================

function showTab(tabId) {
  currentTab = tabId;
  const main = document.getElementById('main-content');
  main.classList.remove('fade-in');
  void main.offsetWidth;
  main.classList.add('fade-in');

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('nav-active');
    el.classList.add('nav-inactive');
  });

  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) {
    activeNav.classList.add('nav-active');
    activeNav.classList.remove('nav-inactive');
  }

  if (window.closeSidebar) window.closeSidebar();

  if (tabId === 'dashboard') renderDashboard();
  else if (tabId === 'suplencias') renderSuplencias();
  else if (tabId === 'disponibilidad') renderDisponibilidad();
  else if (tabId === 'historial') renderHistorial();

  lucide.createIcons();
}

// ========================================
// RENDER: DASHBOARD
// ========================================

async function renderDashboard() {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <header class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h2>
        <p class="text-slate-600 font-medium mt-1">Hola ${currentUser?.nombre || ''}, administra tus turnos por semana.</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="exportToExcel()" class="btn-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all">
          <i data-lucide="download" class="w-4 h-4"></i> Exportar Turnos
        </button>
      </div>
    </header>

    <!-- STAT CARDS -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="stat-card stat-shell relative overflow-hidden rounded-3xl p-6">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white"></div>
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center border border-emerald-200">
              <i data-lucide="calendar-check" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Asignados</p>
              <p id="card-asignados" class="text-3xl font-extrabold text-slate-900 leading-tight">—</p>
              <p class="text-sm text-slate-500 -mt-0.5">esta semana</p>
            </div>
          </div>
          <span class="relative text-[11px] font-black uppercase tracking-widest text-emerald-900 bg-emerald-100/70 border border-emerald-200 rounded-full px-3 py-1">Semana</span>
        </div>
        <div class="relative mt-5 h-1.5 w-full rounded-full bg-emerald-100 overflow-hidden">
          <div id="bar-asignados" class="h-full w-1/3 bg-emerald-600/70 rounded-full"></div>
        </div>
      </div>

      <div class="stat-card stat-shell relative overflow-hidden rounded-3xl p-6">
        <div class="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-white"></div>
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-rose-200/30 blur-2xl"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-900 flex items-center justify-center border border-rose-200">
              <i data-lucide="calendar-x" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Cancelados</p>
              <p id="card-cancelados" class="text-3xl font-extrabold text-slate-900 leading-tight">—</p>
              <p class="text-sm text-slate-500 -mt-0.5">esta semana</p>
            </div>
          </div>
          <span class="relative text-[11px] font-black uppercase tracking-widest text-rose-900 bg-rose-100/70 border border-rose-200 rounded-full px-3 py-1">Control</span>
        </div>
        <div class="relative mt-5 h-1.5 w-full rounded-full bg-rose-100 overflow-hidden">
          <div id="bar-cancelados" class="h-full w-1/6 bg-rose-600/70 rounded-full"></div>
        </div>
      </div>

      <div class="stat-card stat-shell relative overflow-hidden rounded-3xl p-6">
        <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-white"></div>
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-200/30 blur-2xl"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-200">
              <i data-lucide="user-plus" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Suplencias</p>
              <p id="card-suplencias" class="text-3xl font-extrabold text-slate-900 leading-tight">—</p>
              <p class="text-sm text-slate-500 -mt-0.5">esta semana</p>
            </div>
          </div>
          <span class="relative text-[11px] font-black uppercase tracking-widest text-amber-900 bg-amber-100/70 border border-amber-200 rounded-full px-3 py-1">Extra</span>
        </div>
        <div class="relative mt-5 h-1.5 w-full rounded-full bg-amber-100 overflow-hidden">
          <div id="bar-suplencias" class="h-full w-1/4 bg-amber-600/70 rounded-full"></div>
        </div>
      </div>

      <div class="stat-card stat-shell relative overflow-hidden rounded-3xl p-6">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white"></div>
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-200/30 blur-2xl"></div>
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center border border-blue-200">
              <i data-lucide="clock" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Horas</p>
              <p id="card-horas" class="text-3xl font-extrabold text-slate-900 leading-tight">—</p>
              <p class="text-sm text-slate-500 -mt-0.5">trabajadas</p>
            </div>
          </div>
          <span class="relative text-[11px] font-black uppercase tracking-widest text-blue-900 bg-blue-100/70 border border-blue-200 rounded-full px-3 py-1">Total</span>
        </div>
        <div class="relative mt-5 h-1.5 w-full rounded-full bg-blue-100 overflow-hidden">
          <div id="bar-horas" class="h-full w-1/4 bg-blue-600/70 rounded-full"></div>
        </div>
      </div>
    </section>

    <div class="calendar-bg rounded-3xl border border-orange-200/50 shadow-xl flex-1 flex flex-col overflow-hidden">
      <div class="p-6 border-b border-orange-200/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <button id="prev-week" class="p-2 hover:bg-orange-200/20 rounded-lg transition-colors text-orange-600" aria-label="Semana anterior">
            <i data-lucide="chevron-left" class="w-5 h-5"></i>
          </button>
          <div class="text-center">
            <h3 class="text-lg font-black text-slate-900 leading-tight">Semana</h3>
            <p id="week-label" class="text-sm font-bold text-slate-700">${formatWeekRange(currentWeekStart)}</p>
          </div>
          <button id="next-week" class="p-2 hover:bg-orange-200/20 rounded-lg transition-colors text-orange-600" aria-label="Semana siguiente">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>
        </div>
        <div class="relative">
          <select id="week-select" class="appearance-none bg-white/70 border border-orange-200/60 rounded-xl px-5 py-2.5 pr-10 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-900/30">
            <option value="current">Semana actual</option>
            <option value="next">Próxima semana</option>
            <option value="custom" selected>Otra semana</option>
          </select>
          <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600"></i>
        </div>
      </div>

      <div class="table-container overflow-auto flex-1 overscroll-x-contain">
        <table class="min-w-[900px] border-separate border-spacing-0">
          <thead>
            <tr class="bg-white/50">
              <th class="sticky left-0 z-20 bg-[#f5eedf] border-b border-r border-orange-200/30 p-4 text-xs uppercase tracking-widest text-slate-500 font-black">Horario</th>
              ${buildDayHeadersHTML()}
            </tr>
          </thead>
          <tbody id="calendar-body"></tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('prev-week').onclick = () => setWeek(addDays(currentWeekStart, -7));
  document.getElementById('next-week').onclick = () => setWeek(addDays(currentWeekStart, 7));
  document.getElementById('week-select').onchange = (e) => {
    const val = e.target.value;
    const monday = startOfWeekMonday(new Date());
    if (val === 'current') setWeek(monday);
    if (val === 'next') setWeek(addDays(monday, 7));
  };

  try {
    await refreshWeekData();
    fillCalendar();

    const asignados = slotsList.filter(s => s.status === 'titular_mio').length;
    const suplencias = slotsList.filter(s => s.status === 'suplente_mio').length;
    const cancelados = 0;

    document.getElementById('card-asignados').textContent = asignados;
    document.getElementById('card-cancelados').textContent = cancelados;
    document.getElementById('card-suplencias').textContent = suplencias;

    const clamp = (n) => Math.max(6, Math.min(100, n));
    document.getElementById('bar-asignados').style.width = clamp(asignados * 8) + '%';
    document.getElementById('bar-cancelados').style.width = clamp(cancelados * 12) + '%';
    document.getElementById('bar-suplencias').style.width = clamp(suplencias * 10) + '%';

    // Cargar horas trabajadas y pendientes
    try {
      const horasData = await apiHorasTrabajadas();
      const horasTrabajadas = horasData.horas_trabajadas || 0;
      const horasPendientes = horasData.horas_pendientes || 0;

      document.getElementById('card-horas').textContent = horasTrabajadas;
      document.getElementById('bar-horas').style.width = clamp(horasTrabajadas * 2) + '%';

      // Actualizar sidebar con horas pendientes
      const sidebarHoras = document.getElementById('sidebar-horas-pendientes');
      if (sidebarHoras) {
        sidebarHoras.textContent = horasPendientes + 'h';
      }
    } catch (err) {
      console.error('Error cargando horas:', err);
      document.getElementById('card-horas').textContent = '0';
    }

  } catch (e) {
    toast("No se pudo cargar la semana (API).");
    console.error(e);
  }
}

// ========================================
// RENDER: SUPLENCIAS
// ========================================

async function renderSuplencias() {
  const main = document.getElementById('main-content');
  try {
    await refreshWeekData();
  } catch (e) {
    console.error(e);
  }

  const candidates = slotsList.filter(s => s.status === 'titular_otro').slice(0, 20);

  main.innerHTML = `
    <header class="mb-10">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Suplencias Disponibles</h2>
      <p class="text-slate-600 font-medium mt-1">Turnos ya ocupados donde puedes apuntarte como suplente.</p>
    </header>

    <div class="grid grid-cols-1 gap-4 overflow-y-auto pr-2">
      ${candidates.length === 0 ? `
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p class="font-bold text-slate-800">No hay suplencias disponibles esta semana.</p>
          <p class="text-slate-600 text-sm mt-1">Cambia de semana en "Mis Turnos".</p>
        </div>
      ` : candidates.map(s => {
        const hora = `${s.hora_inicio}-${s.hora_fin}`;
        return `
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
                <i data-lucide="clock" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-slate-900">Turno ocupado - opción suplente</h4>
                <p class="text-sm text-slate-600">${s.fecha} - ${hora}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="px-4 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-100">Disponible</span>
              <button onclick="postularme('${s.fecha}','${hora}')" class="btn-primary text-white px-6 py-2 rounded-xl font-bold transition-all">Postularme</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  lucide.createIcons();
}

async function postularme(fecha, horaRango) {
  try {
    await apiGuardarTurno({ fecha, horaRango, accion: 'suplente' }, refreshWeekData);
    toast("Te has apuntado como suplente");
    renderSuplencias();
  } catch (e) {
    toast(e.message || "No se pudo postular");
    console.error(e);
  }
}

// ========================================
// RENDER: DISPONIBILIDAD
// ========================================

async function renderDisponibilidad() {
  const main = document.getElementById('main-content');
  try {
    await refreshWeekData();
  } catch (e) {
    console.error(e);
  }

  const disponibles = slotsList.filter(s => s.status === 'disponible');

  main.innerHTML = `
    <header class="mb-10">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Disponibilidad</h2>
      <p class="text-slate-600 font-medium mt-1">Slots disponibles en la semana actual.</p>
    </header>

    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <p class="text-sm font-bold text-slate-900">Filtros</p>
          <p class="text-slate-600 text-sm mt-1">Filtra por día y franja horaria.</p>
        </div>
        <button onclick="openFilters()" class="btn-primary text-white px-6 py-2 rounded-xl font-bold transition-all">Configurar filtros</button>
      </div>

      <div class="mt-6" id="disp-list">
        ${renderDisponibilidadList(disponibles)}
      </div>
    </div>
  `;
  lucide.createIcons();
}

function renderDisponibilidadList(items) {
  if (!items || items.length === 0) {
    return `
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <p class="font-bold text-slate-800">No hay slots disponibles con ese filtro.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      ${items.slice(0, 40).map(s => {
        const hora = `${s.hora_inicio}-${s.hora_fin}`;
        return `
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <p class="font-extrabold text-slate-900">${s.fecha} - ${hora}</p>
              <p class="text-sm text-slate-600">Disponible</p>
            </div>
            <button onclick="reservarDesdeDisponibilidad('${s.fecha}','${hora}')" class="btn-primary text-white px-5 py-2 rounded-xl font-bold transition-all">Tomar</button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

async function reservarDesdeDisponibilidad(fecha, horaRango) {
  try {
    await apiGuardarTurno({ fecha, horaRango, accion: 'titular' }, refreshWeekData);
    toast("Turno tomado como titular");
    renderDisponibilidad();
  } catch (e) {
    toast(e.message || "No se pudo tomar el turno");
    console.error(e);
  }
}

function openFilters() {
  document.getElementById('filters-modal').classList.remove('hidden');
}

function closeFilters() {
  document.getElementById('filters-modal').classList.add('hidden');
}

function applyFilters() {
  const day = document.getElementById('filter-day').value;
  const hour = document.getElementById('filter-hour').value;

  let list = slotsList.filter(s => s.status === 'disponible');

  if (day !== 'all') {
    const idx = Number(day);
    const d = addDays(currentWeekStart, idx);
    const iso = isoDate(d);
    list = list.filter(s => s.fecha === iso);
  }

  if (hour !== 'all') {
    list = list.filter(s => `${s.hora_inicio}-${s.hora_fin}` === hour);
  }

  const target = document.getElementById('disp-list');
  if (target) target.innerHTML = renderDisponibilidadList(list);

  closeFilters();
  toast("Filtro aplicado");
}

// ========================================
// RENDER: HISTORIAL
// ========================================

function renderHistorial() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <header class="mb-10">
      <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Historial</h2>
      <p class="text-slate-600 font-medium mt-1">Pendiente de conectar a eventos reales.</p>
    </header>

    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i data-lucide="activity" class="w-6 h-6 text-slate-700"></i>
        </div>
        <div>
          <p class="font-extrabold text-slate-900">Actividad reciente</p>
          <p class="text-slate-600 text-sm">Más adelante se puede cargar desde BD.</p>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// CALENDAR
// ========================================

function fillCalendar() {
  const tbody = document.getElementById('calendar-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  HORAS.forEach(hora => {
    const row = document.createElement('tr');

    const tdHora = document.createElement('td');
    tdHora.className = 'sticky left-0 z-10 bg-[#f5eedf] border-b border-r border-orange-200/30 p-4 font-bold text-slate-600 text-center text-xs';
    tdHora.textContent = hora;
    row.appendChild(tdHora);

    for (let i = 0; i < 7; i++) {
      const dateObj = addDays(currentWeekStart, i);
      const dateKey = isoDate(dateObj);
      const key = `${dateKey}|${hora}`;

      const status = slotsMap.get(key) || 'disponible';
      const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.disponible;

      const cell = document.createElement('td');
      cell.className = 'border-b border-orange-200/20 p-2 text-center align-middle';

      const content = document.createElement('div');
      content.className = `status-pill mx-auto px-3 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer shadow-sm ${cfg.bg}`;
      content.innerHTML = `<span>${cfg.emoji}</span><span>${cfg.texto}</span>`;

      content.dataset.hora = hora;
      content.dataset.status = status;
      content.dataset.date = dateKey;
      content.onclick = () => abrirModal(content);

      cell.appendChild(content);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  });
}

// ========================================
// MODAL
// ========================================

function abrirModal(cell) {
  celdaSeleccionada = cell;

  const dateObj = new Date(cell.dataset.date + 'T00:00:00');
  const prettyDate = fmtLong.format(dateObj);
  const hora = cell.dataset.hora;

  const select = document.getElementById('tipo-turno');
  const status = cell.dataset.status;

  if (status === 'titular_otro') select.value = 'suplente';
  else if (status === 'suplente_mio') select.value = 'cancelar';
  else if (status === 'titular_mio') select.value = 'cancelar';
  else select.value = 'titular';

  document.getElementById('modal-details').textContent = `${prettyDate} - ${hora}`;
  document.getElementById('modal-error').classList.add('hidden');
  document.getElementById('modal').classList.remove('hidden');

  lucide.createIcons();
}

function cerrarModal() {
  document.getElementById('modal').classList.add('hidden');
}

async function guardarTurno() {
  const accion = document.getElementById('tipo-turno').value;
  const err = document.getElementById('modal-error');

  if (!celdaSeleccionada) return;

  try {
    await apiGuardarTurno(
      { fecha: celdaSeleccionada.dataset.date, horaRango: celdaSeleccionada.dataset.hora, accion },
      async () => {
        await refreshWeekData();
        fillCalendar();
      }
    );
    cerrarModal();
    toast("Guardado");
    await refreshWeekData();
    fillCalendar();
  } catch (e) {
    err.textContent = e.message || "No se pudo guardar";
    err.classList.remove('hidden');
    toast(e.message || "No se pudo guardar");
    console.error(e);
  }
}

// ========================================
// EXPORT TO EXCEL
// ========================================

function exportToExcel() {
  const wb = XLSX.utils.book_new();

  const headers = ["Horario"];
  for (let i = 0; i < 7; i++) {
    const d = addDays(currentWeekStart, i);
    const name = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i];
    headers.push(`${name} ${fmtShort.format(d).replace('.', '')}`);
  }
  const wsData = [headers];

  HORAS.forEach(hora => {
    const row = [hora];
    for (let i = 0; i < 7; i++) {
      const d = addDays(currentWeekStart, i);
      const dateKey = isoDate(d);
      const key = `${dateKey}|${hora}`;
      const st = slotsMap.get(key) || 'disponible';
      row.push(STATUS_CONFIG[st]?.texto || 'Disponible');
    }
    wsData.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
  XLSX.writeFile(wb, 'turnos_mamaplus.xlsx');
}

// ========================================
// AUTHENTICATION
// ========================================

async function initAuth() {
  panelToken = getTokenFromUrl() || localStorage.getItem('panel_token');

  if (!panelToken) {
    showLogin(true);
    return;
  }

  try {
    currentUser = await apiMe(panelToken);
    localStorage.setItem('panel_token', panelToken);

    document.getElementById('user-name').textContent = currentUser.nombre || 'Cuidadora';

    showLogin(false);
    showTab('dashboard');
  } catch (e) {
    showLogin(true, e.message || "Token inválido");
  }
}

function initLoginHandlers() {
  document.getElementById('login-submit').addEventListener('click', async () => {
    const val = document.getElementById('token-input').value.trim();
    if (!val) return showLogin(true, "Pega un token para entrar.");

    try {
      currentUser = await apiMe(val);
      panelToken = val;
      localStorage.setItem('panel_token', panelToken);

      document.getElementById('user-name').textContent = currentUser.nombre || 'Cuidadora';

      showLogin(false);
      toast("Bienvenida");
      showTab('dashboard');
    } catch (e) {
      showLogin(true, e.message || "Token inválido");
    }
  });

  document.getElementById('login-clear').addEventListener('click', () => {
    document.getElementById('token-input').value = '';
    showLogin(true);
  });
}

// ========================================
// INITIALIZATION
// ========================================

function initApp() {
  initSidebar();
  initLoginHandlers();
  initAuth();
  lucide.createIcons();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);