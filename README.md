# MamaPlus - Panel de Gestión de Turnos

Sistema de gestión de turnos para cuidadoras de guardería. Permite visualizar, seleccionar, cancelar y gestionar turnos por franjas horarias semanales.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Reference](#api-reference)
- [Componentes](#componentes)
- [Configuración](#configuración)

---

## Descripción

MamaPlus es una aplicación web que permite a las cuidadoras de guardería gestionar sus turnos de trabajo de forma eficiente. El sistema cuenta con dos paneles principales:

- **Panel Cuidadoras** (`index.html`): Para que las cuidadoras gestionen sus propios turnos
- **Panel Admin** (`admin.html`): Para administradores que supervisan todos los turnos

---

## Características

### Panel Cuidadoras
- Visualización de calendario semanal con turnos
- Tomar turnos como titular
- Anotarse como suplente en turnos ocupados
- Cancelar turnos propios
- Filtrar slots disponibles por día y franja horaria
- Exportar turnos a Excel
- Navegación entre semanas
- Autenticación mediante token

### Panel Admin
- Vista general de todos los turnos de la semana
- Búsqueda de cuidadoras (titular o suplente)
- Filtros por estado (libre, ocupado, con suplentes)
- Detalle de cada turno con información de titular y suplentes
- Navegación entre semanas

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                    ┌──────────────┐           │
│  │  index.html  │                    │  admin.html  │           │
│  │  (Cuidadoras)│                    │    (Admin)   │           │
│  └──────┬───────┘                    └──────┬───────┘           │
│         │                                   │                    │
│         └───────────────┬───────────────────┘                    │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────┐                │
│  │              SHARED MODULES                  │                │
│  ├──────────────────────────────────────────────┤                │
│  │  constants.js  │  utils.js  │  api.js        │                │
│  └──────────────────────────────────────────────┘                │
│                         │                                        │
│  ┌──────────────────────┴──────────────────────┐                │
│  │           APPLICATION LOGIC                  │                │
│  ├──────────────────────────────────────────────┤                │
│  │      index.js       │       admin.js         │                │
│  └──────────────────────────────────────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
│              (n8n Webhooks - External Service)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /webhook/api/me          → Autenticación de usuario        │
│  GET  /webhook/api/turnos      → Obtener turnos de la semana     │
│  POST /webhook/api/turno       → Crear/modificar/cancelar turno  │
│  GET  /webhook/api/admin/slots → Obtener slots (admin)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → Token Auth → API /me → Validación → Dashboard
                                     │
                                     ▼
                            API /turnos (semana)
                                     │
                                     ▼
                              Renderizar UI
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
                Dashboard      Suplencias     Disponibilidad
                     │
                     ▼
              Acción Usuario
                     │
                     ▼
             API /turno (POST)
                     │
                     ▼
              Refresh Data
```

---

## Estructura del Proyecto

```
panel-mamaplus/
│
├── index.html              # Panel principal para cuidadoras
├── admin.html              # Panel de administración
├── README.md               # Documentación del proyecto
│
├── assets/
│   └── logo.png            # Logo de MamaPlus
│
├── css/
│   ├── common.css          # Estilos compartidos
│   ├── index.css           # Estilos del panel cuidadoras
│   └── admin.css           # Estilos del panel admin
│
└── js/
    ├── constants.js        # Constantes y configuración
    ├── utils.js            # Funciones utilitarias
    ├── api.js              # Comunicación con el backend
    ├── index.js            # Lógica del panel cuidadoras
    └── admin.js            # Lógica del panel admin
```

### Descripción de Archivos

#### HTML
| Archivo | Descripción |
|---------|-------------|
| `index.html` | Estructura del panel de cuidadoras con sidebar, modales y área de contenido principal |
| `admin.html` | Estructura del panel admin con filtros, tabla de turnos y modal de detalle |

#### CSS
| Archivo | Descripción |
|---------|-------------|
| `common.css` | Botones primarios, animaciones, scrollbar, glass cards |
| `index.css` | Sidebar, calendario, status pills, stat cards, navegación |
| `admin.css` | Transiciones de slots, columnas sticky de tabla |

#### JavaScript
| Archivo | Descripción |
|---------|-------------|
| `constants.js` | URLs de API, franjas horarias, días de la semana, configuración de estados |
| `utils.js` | Funciones de fecha, formateo, toast notifications |
| `api.js` | Funciones fetch para autenticación y gestión de turnos |
| `index.js` | Renderizado de dashboard, suplencias, disponibilidad, historial |
| `admin.js` | Renderizado de tabla admin, filtros, modal de detalle |

---

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **Tailwind CSS** (CDN) - Framework de utilidades CSS
- **JavaScript ES6+** - Lógica de aplicación (vanilla JS)

### Fuentes
- **Inter** - Panel de cuidadoras
- **Plus Jakarta Sans** - Panel admin

### Librerías Externas
- **Lucide Icons** - Iconografía (solo panel cuidadoras)
- **SheetJS (XLSX)** - Exportación a Excel (solo panel cuidadoras)

### Backend
- **n8n Webhooks** - API REST para gestión de turnos

---

## Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (opcional para desarrollo)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/panel-mamaplus.git
   cd panel-mamaplus
   ```

2. **Abrir en navegador**
   - Abrir `index.html` directamente en el navegador, o
   - Usar un servidor local:
     ```bash
     # Con Python
     python -m http.server 8080

     # Con Node.js (npx)
     npx serve .

     # Con VS Code Live Server
     # Click derecho → Open with Live Server
     ```

3. **Acceder a la aplicación**
   - Panel Cuidadoras: `http://localhost:8080/index.html?token=TU_TOKEN`
   - Panel Admin: `http://localhost:8080/admin.html?token=TU_TOKEN_ADMIN`

---

## Uso

### Autenticación

Ambos paneles requieren un token de autenticación que se puede proporcionar de dos formas:

1. **Por URL**: `?token=TU_TOKEN`
2. **Manual**: Introducir el token en el formulario de login

### Panel Cuidadoras

#### Navegación
- **Mis Turnos**: Calendario semanal con tus turnos asignados
- **Suplencias**: Lista de turnos donde puedes anotarte como suplente
- **Disponibilidad**: Slots disponibles para tomar como titular
- **Historial**: Registro de actividad (próximamente)

#### Estados de Turno
| Estado | Color | Descripción |
|--------|-------|-------------|
| Titular (tú) | Verde | Turno asignado a ti como titular |
| Suplente (tú) | Ámbar | Anotado como suplente |
| Ocupado | Gris | Turno de otra cuidadora |
| Disponible | Blanco | Slot libre para tomar |

#### Acciones
- **Tomar como Titular**: Reservar un slot disponible
- **Anotarme como Suplente**: En turnos ya ocupados
- **Cancelar**: Liberar un turno propio
- **Marcar Disponible**: Devolver turno al pool

### Panel Admin

#### Filtros
- **Buscar**: Por nombre de cuidadora (titular o suplente)
- **Estado**: Todos, Solo libres, Solo ocupados, Con suplentes

#### Vista de Tabla
- Filas: Franjas horarias (10:00 - 18:00)
- Columnas: Días de la semana (Lunes - Domingo)
- Click en celda: Ver detalle del turno

---

## API Reference

### Base URL
```
https://tinafactory-n8n.dmxwfe.easypanel.host
```

### Endpoints

#### Autenticación
```http
GET /webhook/api/me?token={token}
```
**Respuesta exitosa:**
```json
{
  "ok": true,
  "user": {
    "nombre": "María García",
    "email": "maria@example.com",
    "role": "cuidadora"
  }
}
```

#### Obtener Turnos (Cuidadora)
```http
GET /webhook/api/turnos?token={token}&week_start={YYYY-MM-DD}
```
**Respuesta:**
```json
{
  "ok": true,
  "slots": [
    {
      "fecha": "2026-01-26",
      "hora_inicio": "10:00",
      "hora_fin": "11:00",
      "status": "titular_mio"
    }
  ]
}
```

#### Guardar Turno
```http
POST /webhook/api/turno
Content-Type: application/json

{
  "token": "...",
  "fecha": "2026-01-26",
  "hora_inicio": "10:00",
  "hora_fin": "11:00",
  "accion": "titular"
}
```
**Acciones válidas:** `titular`, `suplente`, `cancelar`, `disponible`

#### Obtener Slots (Admin)
```http
GET /webhook/api/admin/slots?token={token}&week_start={YYYY-MM-DD}
```
**Respuesta:**
```json
{
  "ok": true,
  "slots": [
    {
      "fecha": "2026-01-26",
      "hora_inicio": "10:00",
      "hora_fin": "11:00",
      "estado_slot": "ocupado",
      "titular_nombre": "María García",
      "titular_email": "maria@example.com",
      "suplentes_count": 2,
      "suplentes_nombres": "Ana López, Carmen Ruiz"
    }
  ]
}
```

### Códigos de Error
| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 401 | Token inválido o expirado |
| 409 | Conflicto (turno ya tomado por otra persona) |
| 500 | Error interno del servidor |

---

## Componentes

### constants.js
```javascript
// Configuración de API
...
```

### utils.js
```javascript
// Funciones de fecha
startOfWeekMonday(date)  // Obtener lunes de la semana
addDays(date, n)         // Sumar días a una fecha
isoDate(date)            // Formatear como YYYY-MM-DD
formatWeekRange(monday)  // "25 ene — 31 ene"

// UI Helpers
toast(msg)               // Mostrar notificación
splitHora(horaRango)     // "10:00-11:00" → {ini, fin}
```

### api.js
```javascript
// Autenticación
apiMe(token)                        // Validar token
getTokenFromUrl()                   // Obtener token de URL
setToken(token) / getToken()        // Gestionar token

// Operaciones de turno
apiTurnos(weekStartISO)             // Obtener turnos semana
apiGuardarTurno({fecha, hora, accion})  // Guardar turno
apiAdminSlots(token, weekStartISO)  // Obtener slots admin
```

---

## Configuración

### Cambiar API Backend

Editar `js/constants.js`:
```javascript
const API_BASE = "https://tu-nuevo-backend.com";
```

### Modificar Franjas Horarias

Editar `js/constants.js`:
```javascript
const HORAS = [
  "08:00-09:00",
  "09:00-10:00",
  // Agregar o modificar según necesidad
];
```

### Personalizar Estados

Editar `js/constants.js`:
```javascript
const STATUS_CONFIG = {
  nuevo_estado: {
    texto: 'Mi Estado',
    bg: 'bg-blue-50 text-blue-700 border-blue-100',
    emoji: '🆕'
  }
};
```

### Cambiar Colores del Tema

Editar los archivos CSS correspondientes en `/css/`:
- Colores primarios: `common.css` → `.btn-primary`
- Sidebar: `index.css` → `.glass-sidebar`
- Cards admin: `admin.css` → `.glass-card`

---

## Licencia

Este proyecto es privado y de uso exclusivo para MamaPlus.

---

## Contacto

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.
