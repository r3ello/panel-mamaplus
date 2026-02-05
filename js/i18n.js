/**
 * MamaPlus - Internationalization (i18n)
 * Language support for Spanish and German
 */

// ========================================
// TRANSLATIONS
// ========================================

const translations = {
  es: {
    // General
    administration: "Administración",
    shiftPanel: "Panel de turnos",
    caregiver: "Cuidadora",
    logout: "Cerrar sesión",
    close: "Cerrar",
    confirm: "Confirmar",
    filter: "Filtrar",
    apply: "Aplicar",
    clear: "Limpiar",
    enter: "Entrar",
    save: "Guardar",
    cancel: "Cancelar",
    loading: "Cargando...",

    // Login
    accessToMamaPlus: "Acceso a MamaPlus",
    tokenInstructions: "Introduce tu token (lo recibes por Telegram) o abre el enlace con",
    token: "Token",
    pasteToken: "Pega aquí tu token",
    pasteTokenToEnter: "Pega un token para entrar.",
    invalidToken: "Token inválido",
    sessionClosed: "Has cerrado sesión. Introduce tu token para entrar.",
    welcome: "Bienvenida",

    // Navigation
    myShifts: "Mis Turnos",
    substitutions: "Suplencias",
    availability: "Disponibilidad",
    history: "Historial",

    // Dashboard
    controlPanel: "Panel de Control",
    helloManageShifts: "Hola {name}, administra tus turnos por semana.",
    exportShifts: "Exportar Turnos",
    assigned: "Asignados",
    cancelled: "Cancelados",
    substitutionsCount: "Suplencias",
    thisWeek: "esta semana",
    week: "Semana",
    currentWeek: "Semana actual",
    nextWeek: "Próxima semana",
    otherWeek: "Otra semana",
    schedule: "Horario",

    // Days
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",

    // Short days
    monShort: "Lun",
    tueShort: "Mar",
    wedShort: "Mié",
    thuShort: "Jue",
    friShort: "Vie",
    satShort: "Sáb",
    sunShort: "Dom",

    // Status
    titular: "Titular (tú)",
    occupied: "Ocupado",
    substituteYou: "Suplente (tú)",
    available: "Disponible",
    free: "Libre",

    // Modal - Shift management
    manageShift: "Gestionar Turno",
    actionType: "Tipo de Acción",
    takeAsTitular: "Tomar como Titular",
    signUpAsSubstitute: "Anotarme como Suplente",
    markAvailable: "Marcar Disponible",
    saved: "Guardado",
    couldNotSave: "No se pudo guardar",

    // Substitutions tab
    availableSubstitutions: "Suplencias Disponibles",
    substitutionsDescription: "Turnos ya ocupados donde puedes apuntarte como suplente.",
    noSubstitutionsAvailable: "No hay suplencias disponibles esta semana.",
    changeWeekInMyShifts: "Cambia de semana en \"Mis Turnos\".",
    occupiedShiftSubstituteOption: "Turno ocupado - opción suplente",
    applyForPosition: "Postularme",
    signedUpAsSubstitute: "Te has apuntado como suplente",
    couldNotApply: "No se pudo postular",

    // Availability tab
    availabilityTitle: "Disponibilidad",
    availabilityDescription: "Slots disponibles en la semana actual.",
    filters: "Filtros",
    filterByDayAndTime: "Filtra por día y franja horaria.",
    configureFilters: "Configurar filtros",
    noSlotsAvailable: "No hay slots disponibles con ese filtro.",
    take: "Tomar",
    shiftTakenAsTitular: "Turno tomado como titular",
    couldNotTakeShift: "No se pudo tomar el turno",
    filterApplied: "Filtro aplicado",
    day: "Día",
    all: "Todos",
    timeSlot: "Franja",
    allSlots: "Todas",

    // History tab
    historyTitle: "Historial",
    pendingConnection: "Pendiente de conectar a eventos reales.",
    recentActivity: "Actividad reciente",
    canLoadFromDB: "Más adelante se puede cargar desde BD.",

    // Filters modal
    filterAvailableSlots: "Filtra slots disponibles en la semana actual",

    // API errors
    couldNotLoadWeek: "No se pudo cargar la semana (API).",

    // Admin page
    internalManagement: "Gestión Interna",
    adminPanel: "Panel Admin",
    weeklyControlDescription: "Control semanal de turnos y disponibilidad de cuidadoras.",
    searchCaregiver: "Buscar Cuidadora (Titular o Suplente)",
    searchPlaceholder: "Ej: Claudia...",
    shiftStatus: "Estado del Turno",
    viewAllShifts: "Ver todos los turnos",
    onlyFree: "Solo Libres",
    onlyOccupied: "Solo Ocupados",
    withSubstitutes: "Con Suplentes asignados",
    loadingDates: "Cargando fechas...",
    shiftCard: "Ficha de Turno",
    scheduleDetail: "Detalle del horario",
    titularCaregiver: "Cuidadora Titular",
    mainResponsible: "Responsable principal",
    substituteBody: "Cuerpo de Suplentes",
    noAssignedCaregiver: "Sin cuidadora asignada",
    noEmailRegistered: "No hay correo registrado",
    noSubstitutesAssigned: "No hay suplentes asignados para este turno.",
    closeDetail: "Cerrar Detalle",
    empty: "Vacío",
    substitutesShort: "Supl.",
    noTitular: "— Sin titular",
    missingAdminToken: "Falta token admin. Usa el enlace proporcionado.",

    // Admin Actions
    adminActions: "Acciones de Admin",
    cancelShift: "Cancelar",
    changeCaregiver: "Cambiar",
    promoteSubstitute: "Promover",
    selectCaregiver: "Seleccionar Cuidadora",
    caregiverEmail: "Email de la cuidadora",
    assign: "Asignar",
    enterEmail: "Por favor ingresa un email",
    confirmCancelShift: "¿Cancelar este turno y dejarlo disponible?",
    confirmAssignCaregiver: "¿Asignar a",
    confirmPromoteSubstitute: "¿Promover la primera suplente a titular?",
    shiftReleasedSuccess: "✅ Turno liberado correctamente",
    caregiverAssignedSuccess: "✅ Cuidadora asignada correctamente",
    substitutePromotedSuccess: "✅ Suplente promovida a titular",

    // Language
    language: "Idioma",
    spanish: "Español",
    german: "Deutsch"
  },

  de: {
    // General
    administration: "Verwaltung",
    shiftPanel: "Schichtübersicht",
    caregiver: "Betreuerin",
    logout: "Abmelden",
    close: "Schließen",
    confirm: "Bestätigen",
    filter: "Filtern",
    apply: "Anwenden",
    clear: "Löschen",
    enter: "Eintreten",
    save: "Speichern",
    cancel: "Abbrechen",
    loading: "Laden...",

    // Login
    accessToMamaPlus: "Zugang zu MamaPlus",
    tokenInstructions: "Gib deinen Token ein (du erhältst ihn per Telegram) oder öffne den Link mit",
    token: "Token",
    pasteToken: "Token hier einfügen",
    pasteTokenToEnter: "Füge einen Token ein, um einzutreten.",
    invalidToken: "Ungültiger Token",
    sessionClosed: "Du wurdest abgemeldet. Gib deinen Token ein, um einzutreten.",
    welcome: "Willkommen",

    // Navigation
    myShifts: "Meine Schichten",
    substitutions: "Vertretungen",
    availability: "Verfügbarkeit",
    history: "Verlauf",

    // Dashboard
    controlPanel: "Übersicht",
    helloManageShifts: "Hallo {name}, verwalte deine Schichten pro Woche.",
    exportShifts: "Schichten exportieren",
    assigned: "Zugewiesen",
    cancelled: "Storniert",
    substitutionsCount: "Vertretungen",
    thisWeek: "diese Woche",
    week: "Woche",
    currentWeek: "Aktuelle Woche",
    nextWeek: "Nächste Woche",
    otherWeek: "Andere Woche",
    schedule: "Zeitplan",

    // Days
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",

    // Short days
    monShort: "Mo",
    tueShort: "Di",
    wedShort: "Mi",
    thuShort: "Do",
    friShort: "Fr",
    satShort: "Sa",
    sunShort: "So",

    // Status
    titular: "Titular (du)",
    occupied: "Besetzt",
    substituteYou: "Vertretung (du)",
    available: "Verfügbar",
    free: "Frei",

    // Modal - Shift management
    manageShift: "Schicht verwalten",
    actionType: "Aktionstyp",
    takeAsTitular: "Als Titular übernehmen",
    signUpAsSubstitute: "Als Vertretung eintragen",
    markAvailable: "Als verfügbar markieren",
    saved: "Gespeichert",
    couldNotSave: "Konnte nicht gespeichert werden",

    // Substitutions tab
    availableSubstitutions: "Verfügbare Vertretungen",
    substitutionsDescription: "Bereits besetzte Schichten, bei denen du dich als Vertretung eintragen kannst.",
    noSubstitutionsAvailable: "Diese Woche sind keine Vertretungen verfügbar.",
    changeWeekInMyShifts: "Wechsle die Woche unter \"Meine Schichten\".",
    occupiedShiftSubstituteOption: "Besetzte Schicht - Vertretungsoption",
    applyForPosition: "Bewerben",
    signedUpAsSubstitute: "Du hast dich als Vertretung eingetragen",
    couldNotApply: "Bewerbung fehlgeschlagen",

    // Availability tab
    availabilityTitle: "Verfügbarkeit",
    availabilityDescription: "Verfügbare Zeitfenster in der aktuellen Woche.",
    filters: "Filter",
    filterByDayAndTime: "Nach Tag und Zeitfenster filtern.",
    configureFilters: "Filter konfigurieren",
    noSlotsAvailable: "Keine Zeitfenster mit diesem Filter verfügbar.",
    take: "Übernehmen",
    shiftTakenAsTitular: "Schicht als Titular übernommen",
    couldNotTakeShift: "Schicht konnte nicht übernommen werden",
    filterApplied: "Filter angewendet",
    day: "Tag",
    all: "Alle",
    timeSlot: "Zeitfenster",
    allSlots: "Alle",

    // History tab
    historyTitle: "Verlauf",
    pendingConnection: "Verbindung zu echten Ereignissen ausstehend.",
    recentActivity: "Letzte Aktivität",
    canLoadFromDB: "Kann später aus der Datenbank geladen werden.",

    // Filters modal
    filterAvailableSlots: "Verfügbare Zeitfenster in der aktuellen Woche filtern",

    // API errors
    couldNotLoadWeek: "Woche konnte nicht geladen werden (API).",

    // Admin page
    internalManagement: "Interne Verwaltung",
    adminPanel: "Admin-Panel",
    weeklyControlDescription: "Wöchentliche Kontrolle von Schichten und Verfügbarkeit der Betreuerinnen.",
    searchCaregiver: "Betreuerin suchen (Titular oder Vertretung)",
    searchPlaceholder: "Z.B.: Claudia...",
    shiftStatus: "Schichtstatus",
    viewAllShifts: "Alle Schichten anzeigen",
    onlyFree: "Nur Freie",
    onlyOccupied: "Nur Besetzte",
    withSubstitutes: "Mit zugewiesenen Vertretungen",
    loadingDates: "Daten werden geladen...",
    shiftCard: "Schichtkarte",
    scheduleDetail: "Zeitplandetails",
    titularCaregiver: "Titular-Betreuerin",
    mainResponsible: "Hauptverantwortliche",
    substituteBody: "Vertretungsteam",
    noAssignedCaregiver: "Keine Betreuerin zugewiesen",
    noEmailRegistered: "Keine E-Mail registriert",
    noSubstitutesAssigned: "Keine Vertretungen für diese Schicht zugewiesen.",
    closeDetail: "Details schließen",
    empty: "Leer",
    substitutesShort: "Vertr.",
    noTitular: "— Kein Titular",
    missingAdminToken: "Admin-Token fehlt. Benutze den bereitgestellten Link.",

    // Admin Actions
    adminActions: "Admin-Aktionen",
    cancelShift: "Stornieren",
    changeCaregiver: "Ändern",
    promoteSubstitute: "Befördern",
    selectCaregiver: "Betreuerin auswählen",
    caregiverEmail: "E-Mail der Betreuerin",
    assign: "Zuweisen",
    enterEmail: "Bitte E-Mail eingeben",
    confirmCancelShift: "Diese Schicht stornieren und freigeben?",
    confirmAssignCaregiver: "Zuweisen an",
    confirmPromoteSubstitute: "Erste Vertretung zur Titularin befördern?",
    shiftReleasedSuccess: "✅ Schicht erfolgreich freigegeben",
    caregiverAssignedSuccess: "✅ Betreuerin erfolgreich zugewiesen",
    substitutePromotedSuccess: "✅ Vertretung zur Titularin befördert",

    // Language
    language: "Sprache",
    spanish: "Español",
    german: "Deutsch"
  }
};

// Days array for each language
const DIAS_I18N = {
  es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
  de: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
};

const DIAS_SHORT_I18N = {
  es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
};

// Status configurations for each language
const STATUS_CONFIG_I18N = {
  es: {
    titular_mio:  { texto: 'Titular (tú)',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', emoji: '✅' },
    titular_otro: { texto: 'Ocupado',        bg: 'bg-slate-100 text-slate-500 border-slate-200',       emoji: '🔒' },
    suplente_mio: { texto: 'Suplente (tú)',  bg: 'bg-amber-50 text-amber-700 border-amber-100',         emoji: '🙋‍♀️' },
    disponible:   { texto: 'Disponible',     bg: 'bg-white/60 text-slate-400 border-orange-100/50',     emoji: '🔄' }
  },
  de: {
    titular_mio:  { texto: 'Titular (du)',   bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', emoji: '✅' },
    titular_otro: { texto: 'Besetzt',        bg: 'bg-slate-100 text-slate-500 border-slate-200',       emoji: '🔒' },
    suplente_mio: { texto: 'Vertretung (du)',bg: 'bg-amber-50 text-amber-700 border-amber-100',         emoji: '🙋‍♀️' },
    disponible:   { texto: 'Verfügbar',      bg: 'bg-white/60 text-slate-400 border-orange-100/50',     emoji: '🔄' }
  }
};

// ========================================
// I18N FUNCTIONS
// ========================================

let currentLang = localStorage.getItem('mamaplus_lang') || 'es';

/**
 * Get translation for a key
 */
function t(key, replacements = {}) {
  let text = translations[currentLang]?.[key] || translations['es'][key] || key;

  // Replace placeholders like {name}
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, value);
  }

  return text;
}

/**
 * Get current language
 */
function getCurrentLang() {
  return currentLang;
}

/**
 * Set language and update UI
 */
function setLanguage(lang) {
  if (!translations[lang]) return;

  currentLang = lang;
  localStorage.setItem('mamaplus_lang', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update all elements with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });

  // Update language button text and visual indicators
  const langBtnText = document.getElementById('lang-btn-text');
  const langBtnTextAlt = document.getElementById('lang-btn-text-alt');
  const langFlag = document.getElementById('lang-flag');
  const langFlagAlt = document.getElementById('lang-flag-alt');
  const loginLangFlag = document.getElementById('login-lang-flag');
  const loginLangText = document.getElementById('login-lang-text');

  if (langBtnText) {
    langBtnText.textContent = lang === 'es' ? 'ES' : 'DE';
  }
  if (langBtnTextAlt) {
    langBtnTextAlt.textContent = lang === 'es' ? 'DE' : 'ES';
  }
  // Update CSS flag classes
  if (langFlag) {
    langFlag.classList.remove('flag-es', 'flag-de');
    langFlag.classList.add(lang === 'es' ? 'flag-es' : 'flag-de');
  }
  if (langFlagAlt) {
    langFlagAlt.classList.remove('flag-es', 'flag-de');
    langFlagAlt.classList.add(lang === 'es' ? 'flag-de' : 'flag-es');
  }
  if (loginLangFlag) {
    loginLangFlag.classList.remove('flag-es', 'flag-de');
    loginLangFlag.classList.add(lang === 'es' ? 'flag-es' : 'flag-de');
  }
  if (loginLangText) {
    loginLangText.textContent = lang === 'es' ? 'ES' : 'DE';
  }

  // Dispatch custom event for dynamic content updates
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Toggle between languages
 */
function toggleLanguage() {
  const newLang = currentLang === 'es' ? 'de' : 'es';
  setLanguage(newLang);
}

/**
 * Get localized days array
 */
function getLocalizedDays() {
  return DIAS_I18N[currentLang] || DIAS_I18N['es'];
}

/**
 * Get localized short days array
 */
function getLocalizedDaysShort() {
  return DIAS_SHORT_I18N[currentLang] || DIAS_SHORT_I18N['es'];
}

/**
 * Get localized status config
 */
function getLocalizedStatusConfig() {
  return STATUS_CONFIG_I18N[currentLang] || STATUS_CONFIG_I18N['es'];
}

/**
 * Initialize language on page load
 */
function initI18n() {
  // Set initial language from localStorage or default to Spanish
  const savedLang = localStorage.getItem('mamaplus_lang') || 'es';
  setLanguage(savedLang);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initI18n);
