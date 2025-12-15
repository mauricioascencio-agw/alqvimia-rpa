# BASE DE DATOS - Alqvimia RPA

> Documento consolidado de almacenamiento, persistencia y conexiones a bases de datos.
> **Ultima actualizacion**: 2024-12-12

---

## Tabla de Contenidos

1. [Almacenamiento Local](#almacenamiento-local)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Conexiones a Bases de Datos](#conexiones-a-bases-de-datos)
4. [Schemas y Modelos](#schemas-y-modelos)
5. [Historial de Cambios](#historial-de-cambios)

---

## Almacenamiento Local

### LocalStorage (Navegador)

El sistema utiliza `localStorage` para almacenar configuraciones del usuario.

#### Claves Utilizadas

| Clave | Descripcion | Estructura |
|-------|-------------|------------|
| `app_settings` | Configuraciones generales | JSON |
| `workflows` | Workflows guardados | JSON Array |
| `recent_files` | Archivos recientes | JSON Array |

#### Estructura de app_settings

```javascript
{
    "language": "es",
    "theme": "dark",
    "notifications": {
        "showSystem": true,
        "playSound": true
    },
    "progressBar": {
        "barColor": "#2563eb",
        "backgroundColor": "rgba(15, 23, 42, 0.85)",
        "textColor": "#ffffff",
        "height": "60px",
        "position": "top",
        "showPercentage": true,
        "showCurrentAction": true
    },
    "videoConference": {
        "smtp": {
            "enabled": false,
            "host": "",
            "port": 587,
            "secure": false,
            "user": "",
            "password": "",
            "fromName": "Alqvimia Videoconferencia",
            "fromEmail": ""
        },
        "defaultProjectFolder": "workflows",
        "autoRecord": false,
        "autoTranscription": true,
        "videoQuality": "high",
        "audioQuality": "high",
        "maxDuration": 120,
        "enableChat": true,
        "enableScreenShare": true,
        "enableEmojis": true,
        "enableFilters": true,
        "defaultFilter": "none"
    }
}
```

#### Funciones de Acceso

```javascript
// Guardar
localStorage.setItem('app_settings', JSON.stringify(settings));

// Cargar
const settings = JSON.parse(localStorage.getItem('app_settings'));

// En SettingsManager
SettingsManager.saveSettings();
SettingsManager.loadSettings();
```

---

## Estructura de Archivos

### Carpeta workflows/

```
workflows/
├── [proyecto-1]/
│   ├── workflow.json           # Definicion del workflow
│   ├── Video/
│   │   └── [session-id]/
│   │       ├── recording.webm  # Grabacion de video
│   │       ├── transcription.txt
│   │       └── chat.json
│   ├── Minutas/
│   │   └── [session-id].json
│   └── Archivos/
│       └── [uploads]
├── [proyecto-2]/
│   └── ...
└── general/
    └── ...
```

### Formato de Workflow (workflow.json)

```json
{
    "id": "workflow-123",
    "name": "Mi Workflow",
    "description": "Descripcion del workflow",
    "version": "1.0",
    "created": "2024-12-12T10:00:00Z",
    "modified": "2024-12-12T15:30:00Z",
    "nodes": [
        {
            "id": "node-1",
            "type": "click",
            "position": { "x": 100, "y": 200 },
            "data": {
                "selector": "#btn-submit",
                "xpath": "//button[@id='btn-submit']"
            }
        }
    ],
    "connections": [
        {
            "from": "node-1",
            "to": "node-2"
        }
    ],
    "variables": {
        "username": "",
        "password": ""
    }
}
```

### Formato de Sesion de Videoconferencia

```json
{
    "sessionId": "vc-2024-12-12-abc123",
    "workflowId": "proyecto-1",
    "title": "Reunion de Equipo",
    "startTime": "2024-12-12T10:00:00Z",
    "endTime": "2024-12-12T11:30:00Z",
    "participants": [
        {
            "id": "user-1",
            "name": "Juan Perez",
            "email": "juan@example.com",
            "role": "host"
        }
    ],
    "messages": [
        {
            "id": 1702378800000,
            "user": "Juan",
            "message": "Hola a todos",
            "timestamp": "2024-12-12T10:00:00Z"
        }
    ],
    "notes": [
        {
            "id": 1702378800001,
            "content": "Punto importante",
            "timestamp": "2024-12-12T10:05:00Z"
        }
    ],
    "recordings": [
        {
            "filename": "recording-1702378800000.webm",
            "duration": 3600,
            "size": 52428800
        }
    ],
    "saveConfig": {
        "videoFormat": "webm",
        "saveLocation": "default",
        "customPath": "",
        "saveTranscription": true,
        "saveChat": true,
        "saveNotes": true
    }
}
```

### Formato de Minutas

```json
{
    "sessionId": "vc-2024-12-12-abc123",
    "generatedAt": "2024-12-12T11:35:00Z",
    "asIs": {
        "title": "Situacion Actual",
        "items": [
            "Proceso manual de 30 pasos",
            "Tiempo promedio: 2 horas",
            "Errores frecuentes en paso 15"
        ]
    },
    "toBe": {
        "title": "Situacion Deseada",
        "items": [
            "Proceso automatizado de 5 pasos",
            "Tiempo estimado: 10 minutos",
            "Validaciones automaticas"
        ]
    },
    "summary": "Resumen ejecutivo de la reunion...",
    "actionItems": [
        {
            "task": "Documentar proceso actual",
            "assignee": "Juan",
            "dueDate": "2024-12-15"
        }
    ],
    "transcription": "Transcripcion completa..."
}
```

---

## Conexiones a Bases de Datos

### Database Manager

**Archivo**: `public/js/database-manager.js`

#### Tipos de Conexion Soportados

| Tipo | Driver | Puerto Default |
|------|--------|----------------|
| MySQL | mysql2 | 3306 |
| PostgreSQL | pg | 5432 |
| SQL Server | mssql | 1433 |
| Oracle | oracledb | 1521 |
| SQLite | sqlite3 | N/A |
| MongoDB | mongodb | 27017 |

#### Estructura de Conexion

```javascript
{
    "id": "conn-123",
    "name": "Mi Base de Datos",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": "mi_db",
    "username": "root",
    "password": "********",
    "options": {
        "ssl": false,
        "connectionTimeout": 30000
    }
}
```

#### Uso en Workflows

```javascript
// Componente: Database Query
{
    "type": "database-query",
    "data": {
        "connectionId": "conn-123",
        "query": "SELECT * FROM users WHERE active = 1",
        "outputVariable": "usuarios"
    }
}

// Componente: Database Insert
{
    "type": "database-insert",
    "data": {
        "connectionId": "conn-123",
        "table": "logs",
        "data": {
            "action": "{{action}}",
            "timestamp": "{{now}}"
        }
    }
}
```

---

## Schemas y Modelos

### Variables del Sistema

```javascript
// Variables globales disponibles en workflows
{
    "{{now}}": "Fecha/hora actual",
    "{{date}}": "Fecha actual (YYYY-MM-DD)",
    "{{time}}": "Hora actual (HH:mm:ss)",
    "{{random}}": "Numero aleatorio",
    "{{uuid}}": "UUID unico",
    "{{user}}": "Usuario actual"
}
```

### Tipos de Datos en Componentes

| Tipo | Descripcion | Ejemplo |
|------|-------------|---------|
| `string` | Texto | "Hola Mundo" |
| `number` | Numero | 42 |
| `boolean` | Verdadero/Falso | true |
| `array` | Lista | ["a", "b", "c"] |
| `object` | Objeto | { "key": "value" } |
| `selector` | Selector CSS | "#btn-submit" |
| `xpath` | XPath | "//button[@id='submit']" |
| `variable` | Referencia | "{{miVariable}}" |

---

## Historial de Cambios

### 2024-12-12

#### Configuraciones
- [x] Agregada estructura `videoConference.smtp` en app_settings
- [x] Agregada estructura `saveConfig` en sesiones de VC
- [x] Nuevos campos: videoFormat, saveLocation, customPath

#### Archivos de Sesion
- [x] Nuevo campo `saveConfig` para configuracion de guardado
- [x] Soporte para rutas personalizadas de guardado

---

## Notas para Desarrolladores

### Agregar Nueva Configuracion

1. Agregar campo en `settings-manager.js` objeto `settings`
2. Agregar UI en `renderVideoConferenceSettings()`
3. Agregar handler en `updateVideoConferenceSetting()`
4. Documentar en este archivo

### Migracion de Datos

```javascript
// Si necesitas migrar estructura de datos antigua
const oldSettings = localStorage.getItem('app_settings');
const settings = JSON.parse(oldSettings);

// Agregar nuevos campos con valores por defecto
if (!settings.videoConference) {
    settings.videoConference = {
        smtp: { enabled: false, ... }
    };
}

localStorage.setItem('app_settings', JSON.stringify(settings));
```

### Backup de Configuraciones

```javascript
// Exportar
const backup = JSON.stringify(SettingsManager.settings, null, 2);
downloadFile(backup, 'alqvimia-settings-backup.json');

// Importar
const imported = JSON.parse(fileContent);
SettingsManager.settings = { ...SettingsManager.settings, ...imported };
SettingsManager.saveSettings();
```

---

> **Importante**: Este documento debe actualizarse cada vez que se modifiquen estructuras de datos. No crear nuevos archivos MD, modificar este.
